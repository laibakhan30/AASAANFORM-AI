
import json
from backend.ai_service import SIR_FIELDS
from demo_sample import get_all_demo_document_text

document_text = get_all_demo_document_text()

prompt_template = f"""
FIELD SCHEMA:
{json.dumps(SIR_FIELDS, ensure_ascii=False)}

DOCUMENT TEXT:
{document_text}

Return every field with value, evidence, and status as JSON.
"""

print("Document characters:", len(document_text))
print("Schema fields:", sum(len(v) for v in SIR_FIELDS.values()))
print("Prompt characters:", len(prompt_template))
print("Local check only — no API request made.")
