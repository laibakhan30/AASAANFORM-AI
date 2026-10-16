# AasaanForm AI — KYC field matching service
# Uses the project-root aasaanform_kyc_schema.json.
# Use fictional/sample documents during development. Never invent values.

import json
import os
import re
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from google import genai
from google.genai import types

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")

MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemma-4-26b-a4b-it")
MAX_DOCUMENT_CHARS = 30_000
SCHEMA_PATH = PROJECT_ROOT / "aasaanform_kyc_schema.json"

ALLOWED_STATUSES = {
    "matched",
    "missing",
    "conflict",
    "needs_review",
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
NEVER_AI_FILL_KEYS = {"signature", "passport_photo", "declaration_acceptance"}


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip().casefold()


def load_kyc_schema() -> dict:
    """Load the field inventory JSON from the project root."""
    if not SCHEMA_PATH.exists():
        raise RuntimeError(
            f"KYC schema not found at {SCHEMA_PATH}. "
            "Place aasaanform_kyc_schema.json in the project root."
        )
    data = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    if not isinstance(data.get("fields"), list):
        raise RuntimeError("KYC schema must contain a fields list.")
    return data


def get_all_kyc_fields() -> dict:
    """Return all schema fields grouped by section as key -> metadata."""
    schema = load_kyc_schema()
    grouped: dict[str, dict[str, dict[str, Any]]] = {}
    for field in schema["fields"]:
        grouped.setdefault(field["section"], {})[field["key"]] = {
            "label": field["label"],
            "type": field["type"],
            "source": field["source"],
            "handling": field["handling"],
        }
    return grouped


def _expected_keys() -> dict[str, set[str]]:
    schema = load_kyc_schema()
    return {
        section: {
            field["key"]
            for field in schema["fields"]
            if field["section"] == section
        }
        for section in schema["sections"]
    }


def validate_kyc_result(
    result: dict,
    document_text: str | None = None,
) -> dict:
    """
    Validate shape, statuses and quoted evidence locally.
    This function makes no AI request. Invalid/uncertain values are not
    silently accepted or used to fill the final PDF.
    """