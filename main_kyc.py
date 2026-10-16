from io import BytesIO
from pathlib import Path
import tempfile

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import Response
from pydantic import BaseModel, Field
from PIL import Image, UnidentifiedImageError

from backend.ocr_service import extract_text_from_image
from backend.pdf_service import extract_text_from_pdf
from backend.ai_service import match_kyc_fields

app = FastAPI(
    title="AasaanForm AI",
    description="AI-assisted KYC document extraction and form preparation",
    version="0.4.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 5 * 1024 * 1024
MAX_DOCUMENT_TEXT = 30_000
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_STATUSES = {
    "matched", "missing", "conflict", "needs_review",
    "customer_confirmation_required",
}
CUSTOMER_CONTROLLED_KEYS = {
    "correspondence_same_as_current",
    "non_india_tax_resident_declaration",
    "politically_exposed_person",
    "relative_of_pep",
    "tax_to_be_deducted",
    "interest_in_other_hdfc_products",
    "declaration_acceptance",
    "signature",
    "passport_photo",
    "place",
    "date",
}


class AIMatchRequest(BaseModel):
    document_text: str = Field(
        min_length=1,
        max_length=MAX_DOCUMENT_TEXT,
        description="OCR text extracted from supporting KYC documents",
    )


class AnalyzeRequest(BaseModel):
    fields: dict


class GeneratePDFRequest(BaseModel):
    fields: dict


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "project": "AasaanForm AI",
        "message": "Backend is running",
        "workflow": "KYC",
    }


@app.post("/api/ocr/image")
async def ocr_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Upload a JPG, PNG, or WebP image.")
    content = await file.read(MAX_FILE_SIZE + 1)
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Image exceeds the 5 MB limit.")
    if not content:
        raise HTTPException(status_code=400, detail="The file is empty.")
    try:
        with Image.open(BytesIO(content)) as source_image:
            image = source_image.copy()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.")
    try:
        extracted_text = extract_text_from_image(image)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="OCR processing failed. Please try another image.") from exc
    return {
        "filename": file.filename,
        "languages": ["eng", "hin"],
        "extracted_text": extracted_text,
        "needs_review": True,
        "message": "Review the extracted text for OCR mistakes before matching.",
    }


@app.post("/api/ocr/pdf")
async def ocr_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=415, detail="Upload a PDF file.")
    content = await file.read(MAX_FILE_SIZE + 1)
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="PDF exceeds the 5 MB limit.")
    if not content:
        raise HTTPException(status_code=400, detail="The file is empty.")
    try:
        extracted_text = extract_text_from_pdf(content)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Could not read this PDF. Please try another file.") from exc
    return {
        "filename": file.filename,
        "extracted_text": extracted_text,
        "needs_review": True,
        "message": "Text extraction completed. Review the extracted text before matching.",
    }


@app.post("/api/ai/match")
def ai_match_fields(request: AIMatchRequest):
    """Match OCR text to the AasaanForm KYC schema."""
    if not request.document_text.strip():
        raise HTTPException(status_code=400, detail="No document text was provided.")
    try:
        result = match_kyc_fields(request.document_text)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="KYC AI matching failed. Check the model/API status before retrying.",
        ) from exc
    return {
        **result,
        "needs_review": True,
        "message": "KYC matching completed. Review all values, evidence, conflicts and missing fields.",
    }


async def extract_uploaded_document(file: UploadFile) -> dict:
    """Extract text from a supported image or PDF upload."""
    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_TYPES and content_type != "application/pdf":
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type for {file.filename}. Upload JPG, PNG, WebP, or PDF.",
        )
    content = await file.read(MAX_FILE_SIZE + 1)
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"{file.filename} exceeds the 5 MB limit.")
    if not content:
        raise HTTPException(status_code=400, detail=f"{file.filename} is empty.")

    if content_type == "application/pdf":
        try:
            text = extract_text_from_pdf(content)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=f"{file.filename}: {exc}") from exc
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Could not read {file.filename}.") from exc
        method = "pdf_text_or_ocr"
    else:
        try:
            with Image.open(BytesIO(content)) as source_image:
                image = source_image.copy()
        except (UnidentifiedImageError, OSError) as exc:
            raise HTTPException(status_code=400, detail=f"{file.filename} is not a valid image.") from exc
        try:
            text = extract_text_from_image(image)
        except Exception as exc:
            raise HTTPException(status_code=422, detail=f"OCR failed for {file.filename}.") from exc
        method = "image_ocr"

    if not text or not text.strip():
        raise HTTPException(status_code=422, detail=f"No readable text was extracted from {file.filename}.")
    return {
        "filename": file.filename or "uploaded_document",
        "method": method,
        "extracted_text": text.strip(),
    }


@app.post("/api/kyc/process")
async def process_kyc_documents(
    identity_document: UploadFile = File(...),
    supporting_documents: list[UploadFile] = File(...),
):
    """
    KYC-first endpoint. Upload one identity document and one or more
    supporting documents. Performs one application-level AI matching call.
    """
    if not supporting_documents:
        raise HTTPException(status_code=400, detail="Upload at least one supporting document.")
    documents = [await extract_uploaded_document(identity_document)]
    for supporting_file in supporting_documents:
        documents.append(await extract_uploaded_document(supporting_file))

    combined_text = "\n\n".join(
        f"=== SOURCE DOCUMENT {i + 1}: {doc['filename']} ===\n{doc['extracted_text']}"
        for i, doc in enumerate(documents)
    )
    if len(combined_text) > MAX_DOCUMENT_TEXT:
        raise HTTPException(
            status_code=413,
            detail="Combined extracted text exceeds the 30,000-character limit. Upload shorter documents.",
        )
    try:
        result = match_kyc_fields(combined_text)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {
        "success": True,
        "documents": [
            {"filename": doc["filename"], "extraction_method": doc["method"]}
            for doc in documents
        ],
        **result,
        "needs_review": True,
        "message": "Documents processed. Review every field before creating a final form.",
    }


# Compatibility route for a frontend that still submits the two old form keys.
# The second file is treated as a supporting document, NOT an electoral roll.
@app.post("/api/process")
async def process_documents(
    identity_file: UploadFile = File(...),
    electoral_roll_file: UploadFile = File(...),
):
    identity_doc = await extract_uploaded_document(identity_file)
    supporting_doc = await extract_uploaded_document(electoral_roll_file)
    combined_text = (
        f"=== IDENTITY DOCUMENT: {identity_doc['filename']} ===\n{identity_doc['extracted_text']}\n\n"
        f"=== SUPPORTING DOCUMENT: {supporting_doc['filename']} ===\n{supporting_doc['extracted_text']}"
    )
    if len(combined_text) > MAX_DOCUMENT_TEXT:
        raise HTTPException(status_code=413, detail="Combined extracted text exceeds the processing limit.")
    try:
        result = match_kyc_fields(combined_text)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {
        "success": True,
        "documents": {
            "identity": {"filename": identity_doc["filename"], "extraction_method": identity_doc["method"]},
            "supporting_document": {"filename": supporting_doc["filename"], "extraction_method": supporting_doc["method"]},
        },
        **result,
        "needs_review": True,
        "message": "Documents processed. Review all matched, missing and uncertain values.",
    }


# Legacy frontend route name retained to reduce frontend changes.
@app.post("/api/extract")
async def extract_documents(
    identity_document: UploadFile = File(...),
    electoral_roll: UploadFile = File(...),
):
    identity_doc = await extract_uploaded_document(identity_document)
    supporting_doc = await extract_uploaded_document(electoral_roll)
    combined_text = (
        f"=== IDENTITY DOCUMENT: {identity_doc['filename']} ===\n{identity_doc['extracted_text']}\n\n"
        f"=== SUPPORTING DOCUMENT: {supporting_doc['filename']} ===\n{supporting_doc['extracted_text']}"
    )
    try:
        result = match_kyc_fields(combined_text)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {
        "identity_document": {"filename": identity_doc["filename"], "extraction_method": identity_doc["method"]},
        "supporting_document": {"filename": supporting_doc["filename"], "extraction_method": supporting_doc["method"]},
        **result,
        "needs_review": True,
    }


@app.post("/api/analyze")
async def analyze_fields(request: AnalyzeRequest):
    """Create a review summary; this endpoint does not call the AI."""
    results = []
    for section_name, section in request.fields.items():
        if not isinstance(section, dict):
            raise HTTPException(status_code=422, detail=f"Section '{section_name}' must be an object.")
        for field_name, field in section.items():
            if not isinstance(field, dict):
                raise HTTPException(status_code=422, detail=f"Field '{field_name}' must be an object.")
            status = field.get("status", "needs_review")
            if status not in ALLOWED_STATUSES:
                status = "needs_review"
            value = field.get("value", "")
            evidence = field.get("evidence", "")
            if not isinstance(value, str):
                value = str(value) if value is not None else ""
            if not isinstance(evidence, str):
                evidence = ""
            if not value.strip() and status == "matched":
                status = "missing"
            if field_name in CUSTOMER_CONTROLLED_KEYS and value.strip():
                # Never expose customer-controlled declaration values as AI-filled.
                value = ""
                status = "customer_confirmation_required"
            results.append({
                "section": section_name,
                "field": field_name,
                "value": value,
                "evidence": evidence,
                "status": status,
            })
    return {
        "results": results,
        "total_fields": len(results),
        "needs_review": any(item["status"] != "matched" for item in results),
    }


@app.post("/api/generate-pdf")
async def generate_pdf(request: GeneratePDFRequest):
    """
    PDF generation is intentionally disabled until the official KYC PDF
    template and verified field coordinates are configured. This prevents
    accidentally returning the old SIR form as a KYC form.
    """
    raise HTTPException(
        status_code=501,
        detail=(
            "KYC PDF layout mapping is not configured yet. The current PDF generator "
            "is for the old SIR form; do not use it for KYC. Configure the official "
            "KYC PDF template and field coordinates before enabling this endpoint."
        ),
    )


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    schema["openapi"] = "3.0.3"
    for component in schema.get("components", {}).get("schemas", {}).values():
        for prop in component.get("properties", {}).values():
            if prop.get("contentMediaType") == "application/octet-stream":
                prop.pop("contentMediaType", None)
                prop["type"] = "string"
                prop["format"] = "binary"
    app.openapi_schema = schema
    return app.openapi_schema


app.openapi = custom_openapi
