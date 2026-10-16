
from io import BytesIO

import pymupdf
from PIL import Image
from pypdf import PdfReader

from backend.ocr_service import extract_text_from_image


# --------------------------------------------------
# PDF processing configuration
# --------------------------------------------------

MAX_PDF_PAGES = 10
OCR_DPI = 180


# --------------------------------------------------
# PDF text extraction + scanned PDF OCR
# --------------------------------------------------

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract selectable text from a PDF.

    If no selectable text is available, render the PDF pages
    and use the existing Tesseract OCR service.
    """

    if not pdf_bytes:
        raise ValueError("The PDF is empty.")

    # Step 1: Try extracting selectable PDF text.
    try:
        reader = PdfReader(BytesIO(pdf_bytes))

        if reader.is_encrypted:
            raise ValueError(
                "Password-protected PDFs are not supported."
            )

        if len(reader.pages) == 0:
            raise ValueError("The PDF contains no pages.")

        if len(reader.pages) > MAX_PDF_PAGES:
            raise ValueError(
                f"PDF has too many pages. Maximum: {MAX_PDF_PAGES}."
            )

        pages = [
            (page.extract_text() or "").strip()
            for page in reader.pages
        ]

        # Return selectable text if at least one page has text.
        if any(pages):
            return "\n\n".join(
                f"--- Page {index + 1} ---\n{text}"
                for index, text in enumerate(pages)
                if text
            ).strip()

    except ValueError:
        raise

    except Exception:
        # If normal text extraction fails, attempt scanned-PDF OCR.
        pass

    # Step 2: Render scanned PDF pages and perform OCR.
    ocr_pages = []

    try:
        with pymupdf.open(
            stream=pdf_bytes,
            filetype="pdf",
        ) as document:

            if document.needs_pass:
                raise ValueError(
                    "Password-protected PDFs are not supported."
                )

            if len(document) == 0:
                raise ValueError("The PDF contains no pages.")

            if len(document) > MAX_PDF_PAGES:
                raise ValueError(
                    f"PDF has too many pages. Maximum: {MAX_PDF_PAGES}."
                )

            scale = OCR_DPI / 72

            for index, page in enumerate(document):
                # Render the page at 180 DPI for OCR.
                pixmap = page.get_pixmap(
                    matrix=pymupdf.Matrix(scale, scale),
                    colorspace=pymupdf.csRGB,
                    alpha=False,
                )

                image_bytes = pixmap.tobytes("png")

                with Image.open(BytesIO(image_bytes)) as image:
                    image.load()
                    extracted_text = extract_text_from_image(image)

                extracted_text = (extracted_text or "").strip()

                if extracted_text:
                    ocr_pages.append(
                        f"--- Page {index + 1} (OCR) ---\n"
                        f"{extracted_text}"
                    )

    except ValueError:
        raise

    except Exception as exc:
        raise ValueError(
            "Could not read or OCR this PDF. Please try a clearer PDF."
        ) from exc

    # Step 3: Ensure OCR actually found readable text.
    if not ocr_pages:
        raise ValueError(
            "No readable text was found in this PDF."
        )

    return "\n\n".join(ocr_pages)
