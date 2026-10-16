"""demo_sample.py - Realistic mock data for AasaanForm AI live demonstration."""


def get_demo_document_text() -> str:
  return """
==================================================
           ELECTION COMMISSION OF INDIA
               IDENTITY CARD / EPIC
==================================================
Elector Name      : Ayaan Sharma
Father's Name     : Imran Sharma
Mother's Name     : Sana Sharma
Date of Birth     : 12/03/2000
Sex / Gender      : Male
EPIC Number       : ABC1234567
Aadhaar Number    : XXXX-XXXX-4321
Mobile Number     : +91 98765 43210

Address:
H.No. 42, Mg Road, Near Shivaji Park,
Pune, Maharashtra - 411001
==================================================
  """.strip()


def get_demo_electoral_roll_text() -> str:
  return """
==================================================
        ELECTORAL ROLL EXTRACT - 2026
==================================================
State                    : Maharashtra
District                 : Pune
Assembly Constituency    : 208 - Shivajinagar
Part Number              : 104
Serial Number            : 052

Elector Name             : Ayaan Sharma
Relative Name            : Imran Sharma
Relationship             : Father
EPIC Number              : ABC1234567
==================================================
  """.strip()


if __name__ == "__main__":
  print("--- DEMO DOCUMENT TEXT ---")
  print(get_demo_document_text())
  print("\n--- DEMO ELECTORAL ROLL EXTRACT ---")
  print(get_demo_electoral_roll_text())

  
def get_all_demo_document_text() -> str:
    return (
        "IDENTITY DOCUMENT TEXT:\n"
        + get_demo_document_text()
        + "\n\nPREVIOUS ELECTORAL ROLL TEXT:\n"
        + get_demo_electoral_roll_text()
    )
