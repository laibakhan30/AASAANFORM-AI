
from backend.ai_service import match_sir_fields
from demo_sample import get_all_demo_document_text


def main():
    print("Sending one request to Gemma using fictional demo data...")

    result = match_sir_fields(get_all_demo_document_text())

    print("\n=== AI Field Matching Results ===")

    for group, fields in result["fields"].items():
        print(f"\n{group.upper()}")

        for field_name, item in fields.items():
            print(f"  {field_name}: {item['status']}")

    print("\nAI request completed successfully.")


if __name__ == "__main__":
    main()
