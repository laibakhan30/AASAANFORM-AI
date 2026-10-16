
from io import BytesIO

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel, Field
from PIL import Image, UnidentifiedImageError

from backend.ocr_service import extract_text_from_image
from backend.pdf_service import extract_text_from_pdf
from backend.ai_service import match_sir_fields


# --------------------------------------------------
# 1. Application configuration
# --------------------------------------------------

app = FastAPI(
    title="AasaanForm AI",
    description="AI-assisted form understanding and document processing",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 5 * 1024 * 1024
MAX_DOCUMENT_TEXT = 30_000

ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


# --------------------------------------------------
# 2. AI request schema
# --------------------------------------------------

class AIMatchRequest(BaseModel):
    document_text: str = Field(
        min_length=1,
        max_length=MAX_DOCUMENT_TEXT,
        description="Extracted text from the uploaded documents",
    )


# --------------------------------------------------
# 3. Health check
# --------------------------------------------------

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "project": "AasaanForm AI",
        "message": "Backend is running",
    }


# --------------------------------------------------
# 4. OCR for images
# --------------------------------------------------

@app.post("/api/ocr/image")
async def ocr_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail="Upload a JPG, PNG, or WebP image.",
        )

    content = await file.read(MAX_FILE_SIZE + 1)

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image exceeds the 5 MB limit.",
        )

    if not content:
        raise HTTPException(
            status_code=400,
            detail="The file is empty.",
        )

    try:
        with Image.open(BytesIO(content)) as source_image:
            image = source_image.copy()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid image.",
        )

    try:
        extracted_text = extract_text_from_image(image)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="OCR processing failed. Please try another image.",
        )

    return {
        "filename": file.filename,
        "languages": ["eng", "hin"],
        "extracted_text": extracted_text,
        "needs_review": True,
        "message": "Please review the extracted text for mistakes.",
    }


# --------------------------------------------------
# 5. OCR and text extraction for PDFs
# --------------------------------------------------

@app.post("/api/ocr/pdf")
async def ocr_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=415,
            detail="Upload a PDF file.",
        )

    content = await file.read(MAX_FILE_SIZE + 1)

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="PDF exceeds the 5 MB limit.",
        )

    if not content:
        raise HTTPException(
            status_code=400,
            detail="The file is empty.",
        )

    try:
        extracted_text = extract_text_from_pdf(content)
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not read this PDF. Please try another file.",
        )

    return {
        "filename": file.filename,
        "extracted_text": extracted_text,
        "needs_review": True,
        "message": (
            "PDF text extraction completed. "
            "Scanned pages are processed using OCR when necessary. "
            "Please review the extracted text."
        ),
    }


# --------------------------------------------------
# 6. Gemma AI field matching
# --------------------------------------------------

@app.post("/api/ai/match")
def ai_match_fields(request: AIMatchRequest):
    """Match extracted document text to the SIR field schema."""

    if not request.document_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No document text was provided.",
        )

    try:
        result = match_sir_fields(request.document_text)

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except RuntimeError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc

    except Exception:
        raise HTTPException(
            status_code=502,
            detail=(
                "AI matching failed. Check the model/API status "
                "before attempting another request."
            ),
        )

    return {
        **result,
        "needs_review": True,
        "message": (
            "AI field matching completed. Review every value and its "
            "evidence before using the generated form."
        ),
    }


# --------------------------------------------------
# 7. Shared document extraction helper
# --------------------------------------------------

async def extract_uploaded_document(file: UploadFile) -> dict:
    """Extract text from a supported image or PDF."""

    content_type = (file.content_type or "").lower()

    if (
        content_type not in ALLOWED_TYPES
        and content_type != "application/pdf"
    ):
        raise HTTPException(
            status_code=415,
            detail=(
                f"Unsupported file type for {file.filename}. "
                "Upload JPG, PNG, WebP, or PDF."
            ),
        )

    content = await file.read(MAX_FILE_SIZE + 1)

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"{file.filename} exceeds the 5 MB limit.",
        )

    if not content:
        raise HTTPException(
            status_code=400,
            detail=f"{file.filename} is empty.",
        )

    if content_type == "application/pdf":
        try:
            text = extract_text_from_pdf(content)
        except ValueError as exc:
            raise HTTPException(
                status_code=422,
                detail=f"{file.filename}: {exc}",
            ) from exc
        except Exception:
            raise HTTPException(
                status_code=400,
                detail=f"Could not read {file.filename}.",
            )

        method = (
            "pdf_text_or_ocr"
        )

    else:
        try:
            with Image.open(BytesIO(content)) as source_image:
                image = source_image.copy()
        except (UnidentifiedImageError, OSError):
            raise HTTPException(
                status_code=400,
                detail=f"{file.filename} is not a valid image.",
            )

        try:
            text = extract_text_from_image(image)
        except Exception:
            raise HTTPException(
                status_code=422,
                detail=f"OCR failed for {file.filename}.",
            )

        method = "image_ocr"

    if not text or not text.strip():
        raise HTTPException(
            status_code=422,
            detail=f"No readable text was extracted from {file.filename}.",
        )

    return {
        "filename": file.filename or "uploaded_document",
        "method": method,
        "extracted_text": text.strip(),
    }


# --------------------------------------------------
# 8. Combined two-document processing
# --------------------------------------------------

@app.post("/api/process")
async def process_documents(
    identity_file: UploadFile = File(...),
    electoral_roll_file: UploadFile = File(...),
):
    """
    Extract both documents and match their text to SIR fields.

    This endpoint makes one application-level AI invocation.
    """

    identity_doc = await extract_uploaded_document(identity_file)
    electoral_doc = await extract_uploaded_document(electoral_roll_file)

    combined_text = (
        "=== IDENTITY DOCUMENT ===\n"
        f"Filename: {identity_doc['filename']}\n"
        f"{identity_doc['extracted_text']}\n\n"
        "=== PREVIOUS ELECTORAL ROLL DOCUMENT ===\n"
        f"Filename: {electoral_doc['filename']}\n"
        f"{electoral_doc['extracted_text']}"
    )

    if len(combined_text) > MAX_DOCUMENT_TEXT:
        raise HTTPException(
            status_code=413,
            detail=(
                "Combined extracted text exceeds the processing limit. "
                "Please upload shorter or clearer documents."
            ),
        )

    try:
        result = match_sir_fields(combined_text)

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except RuntimeError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc

    except Exception:
        raise HTTPException(
            status_code=502,
            detail=(
                "Document processing or AI matching failed. "
                "Check the service status before retrying."
            ),
        )

    return {
        "success": True,
        "documents": {
            "identity": {
                "filename": identity_doc["filename"],
                "extraction_method": identity_doc["method"],
            },
            "electoral_roll": {
                "filename": electoral_doc["filename"],
                "extraction_method": electoral_doc["method"],
            },
        },
        **result,
        "needs_review": True,
        "message": (
            "Both documents were processed. Review every field, "
            "supporting evidence, conflict, and missing value."
        ),
    }


# --------------------------------------------------
# 8. Frontend integration API routes
# --------------------------------------------------

from fastapi.responses import Response
from pathlib import Path
from uuid import uuid4


class AnalyzeRequest(BaseModel):
    fields: dict


class GeneratePDFRequest(BaseModel):
    fields: dict


@app.post("/api/extract")
async def extract_documents(
    identity_document: UploadFile = File(...),
    electoral_roll: UploadFile = File(...),
):
    """Extract both uploaded documents and match SIR fields."""
    identity_doc = await extract_uploaded_document(identity_document)
    electoral_doc = await extract_uploaded_document(electoral_roll)

    identity_text = identity_doc.get("extracted_text", "")
    electoral_text = electoral_doc.get("extracted_text", "")

    combined_text = (
        "IDENTITY DOCUMENT:\n"
        + identity_text
        + "\n\nELECTORAL ROLL:\n"
        + electoral_text
    )

    if not combined_text.strip():
        raise HTTPException(
            status_code=422,
            detail="No readable text was extracted from the documents.",
        )

    result = match_sir_fields(combined_text)

    return {
        "identity_document": {
            "filename": identity_doc.get("filename"),
            "extraction_method": identity_doc.get("method"),
        },
        "electoral_roll": {
            "filename": electoral_doc.get("filename"),
            "extraction_method": electoral_doc.get("method"),
        },
        **result,
        "needs_review": True,
    }


@app.post("/api/analyze")
async def analyze_fields(request: AnalyzeRequest):
    """Return a consistent review summary without another AI call."""
    allowed_statuses = {
        "matched",
        "missing",
        "conflict",
        "needs_review",
    }

    results = []

    for section_name, section in request.fields.items():
        if not isinstance(section, dict):
            raise HTTPException(
                status_code=422,
                detail=f"Section '{section_name}' must be an object.",
            )

        for field_name, field in section.items():
            if not isinstance(field, dict):
                raise HTTPException(
                    status_code=422,
                    detail=f"Field '{field_name}' must be an object.",
                )

            status = field.get("status", "needs_review")
            value = field.get("value", "")

            if status not in allowed_statuses:
                status = "needs_review"

            if not isinstance(value, str):
                value = str(value) if value is not None else ""

            if not value.strip() and status == "matched":
                status = "missing"

            results.append({
                "section": section_name,
                "field": field_name,
                "value": value,
                "evidence": field.get("evidence", ""),
                "status": status,
            })

    return {
        "results": results,
        "total_fields": len(results),
        "needs_review": any(
            item["status"] != "matched" for item in results
        ),
    }


@app.post("/api/generate-pdf")
async def generate_pdf(request: GeneratePDFRequest):
    """Generate a filled preview using the stored SIR template."""
    import tempfile

    from backend.form_pdf_service import generate_sir_pdf

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            suffix=".pdf",
            delete=False,
        ) as temp_file:
            temp_path = Path(temp_file.name)

        generate_sir_pdf(
            {"fields": request.fields},
            output_path=str(temp_path),
        )

        pdf_bytes = temp_path.read_bytes()

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition":
                    'attachment; filename="aasaanform-preview.pdf"'
            },
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"PDF generation failed: {exc}",
        ) from exc

    finally:
        if temp_path and temp_path.exists():
            temp_path.unlink(missing_ok=True)


# --------------------------------------------------
# 9. Swagger/OpenAPI upload compatibility
# --------------------------------------------------

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
