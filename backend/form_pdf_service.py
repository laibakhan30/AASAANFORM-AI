
from pathlib import Path
import re

import pymupdf


ROOT = Path(__file__).resolve().parent.parent
FORM_IMAGE = (
    ROOT / "demo-materials" / "01-blank-form"
    / "Annexure-III Enumeration Form.png"
)
OUTPUT_DIR = ROOT / "generated"

# Coordinates are measured against the 1051 x 1496 background image.
IMG_W, IMG_H = 1051, 1496
PAGE_W, PAGE_H = 595.28, 841.89


def _field(fields, group, key):
    """Return a value only when the AI explicitly marked it matched."""
    item = fields.get(group, {}).get(key, {})
    if not isinstance(item, dict) or item.get("status") != "matched":
        return ""
    return str(item.get("value", "")).strip()


def generate_sir_pdf(
    result: dict,
    output_path: str | Path | None = None,
) -> str:
    """
    Generate a prototype Annexure-III PDF from the nested AI result.
    Unmatched fields remain blank.
    """

    if not FORM_IMAGE.exists():
        raise FileNotFoundError(f"Form template not found: {FORM_IMAGE}")

    fields = result.get("fields", {})
    if not isinstance(fields, dict):
        raise ValueError("Expected AI result with a 'fields' object.")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    if output_path is None:
        output_path = OUTPUT_DIR / "sir-enumeration-preview.pdf"

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    doc = pymupdf.open()
    page = doc.new_page(width=PAGE_W, height=PAGE_H)
    page.insert_image(page.rect, filename=str(FORM_IMAGE))

    sx, sy = PAGE_W / IMG_W, PAGE_H / IMG_H

    def put(group, key, x, y, width=250, fontsize=7):
        value = _field(fields, group, key)
        if not value:
            return

        # Avoid printing long values over table borders.
        value = re.sub(r"\s+", " ", value)
        value = value[:100]

        rect = pymupdf.Rect(
            x * sx,
            (y - 10) * sy,
            (x + width) * sx,
            (y + 7) * sy,
        )
        page.insert_textbox(
            rect,
            value,
            fontsize=fontsize,
            fontname="helv",
            color=(0, 0, 0),
            overlay=True,
        )

    # These coordinates refer to the original PNG.
    # Header boxes are pre-printed; do not put personal details there.

    # Personal and family details table.
    put("elector_details", "date_of_birth", 515, 323, 100)
    put("elector_details", "aadhaar_number_optional", 515, 361, 200)
    put("elector_details", "mobile_number", 515, 400, 200)
    put("family_details", "father_or_guardian_name", 515, 440, 200)
    put("family_details", "father_or_guardian_epic_optional", 515, 478, 200)
    put("family_details", "mother_name", 515, 517, 200)
    put("family_details", "mother_epic_optional", 515, 555, 200)
    put("family_details", "spouse_name_if_applicable", 515, 593, 200)
    put("family_details", "spouse_epic_optional", 515, 631, 200)

    # Previous SIR elector column.
    g = "previous_sir_elector"
    put(g, "elector_name", 170, 741, 290)
    put(g, "epic_number_optional", 170, 779, 290)
    put(g, "relative_name", 170, 817, 290)
    put(g, "relationship", 170, 855, 290)
    put(g, "district", 170, 893, 290)
    put(g, "state", 170, 931, 290)
    put(g, "assembly_constituency_name", 170, 969, 290)
    put(g, "assembly_constituency_number", 80, 1008, 80)
    put(g, "part_number", 195, 1008, 80)
    put(g, "serial_number", 310, 1008, 80)

    # Previous SIR relative column.
    g = "previous_sir_relative"
    put(g, "name", 550, 741, 290)
    put(g, "epic_number_optional", 550, 779, 290)
    put(g, "relative_name", 550, 817, 290)
    put(g, "relationship", 550, 855, 290)
    put(g, "district", 550, 893, 290)
    put(g, "state", 550, 931, 290)
    put(g, "assembly_constituency_name", 550, 969, 290)
    put(g, "assembly_constituency_number", 450, 1008, 80)
    put(g, "part_number", 565, 1008, 80)
    put(g, "serial_number", 680, 1008, 80)

    doc.save(str(output_path), garbage=4, deflate=True)
    doc.close()
    return str(output_path)
