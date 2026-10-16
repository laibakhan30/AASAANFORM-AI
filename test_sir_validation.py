
from copy import deepcopy

from backend.ai_service import (
    SIR_FIELDS,
    validate_sir_result,
)


def make_valid_result():
    return {
        "fields": {
            group: {
                field: {
                    "value": "",
                    "evidence": "",
                    "status": "missing",
                }
                for field in field_names
            }
            for group, field_names in SIR_FIELDS.items()
        }
    }


result = make_valid_result()

# Valid structure should pass.
validate_sir_result(result)
print("PASS: Valid response accepted.")

# Every field must be present.
bad_result = deepcopy(result)
del bad_result["fields"]["elector_details"]["elector_name"]

try:
    validate_sir_result(bad_result)
    raise AssertionError("Incomplete response was incorrectly accepted.")
except ValueError:
    print("PASS: Missing field rejected.")

# A claimed match must include evidence.
bad_result = deepcopy(result)
bad_result["fields"]["elector_details"]["elector_name"] = {
    "value": "Ayaan Sharma",
    "evidence": "",
    "status": "matched",
}

try:
    validate_sir_result(bad_result)
    raise AssertionError("Unsupported match was incorrectly accepted.")
except ValueError:
    print("PASS: Match without evidence rejected.")

print("All local validation tests passed. No API request made.")
