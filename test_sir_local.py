
from backend.ai_service import get_all_sir_fields
from demo_sample import get_all_demo_document_text


def main():
    fields = get_all_sir_fields()
    document_text = get_all_demo_document_text()

    print("=== AasaanForm AI: Local Preflight Test ===")

    # Check that every expected field group exists.
    expected_groups = {
        "elector_details",
        "family_details",
        "previous_sir_elector",
        "previous_sir_relative",
    }

    assert set(fields.keys()) == expected_groups
    print("PASS: All four SIR field groups are defined.")

    # Check that both sample documents were combined.
    assert "IDENTITY DOCUMENT TEXT:" in document_text
    assert "PREVIOUS ELECTORAL ROLL TEXT:" in document_text
    print("PASS: Both sample documents are combined.")

    # Check the fields and input without contacting Gemma.
    field_count = sum(len(group) for group in fields.values())
    assert field_count > 0
    print(f"PASS: {field_count} field entries are ready.")

    print("PASS: No API request was made.")
    print("Preflight test complete.")


if __name__ == "__main__":
    main()
