import json
import os

def verify_profections_files():
    base_path = "services/interpretations/data/profections"
    if not os.path.exists(base_path):
        print(f"Error: Directory {base_path} not found.")
        return

    expected_files = [f"profection_house_{i}.json" for i in range(1, 13)]

    for f in expected_files:
        path = os.path.join(base_path, f)
        if not os.path.exists(path):
            print(f"Error: File {f} missing.")
            continue

        try:
            with open(path, 'r') as file:
                data = json.load(file)
                # Check keys for signs (e.g. Aries_Day)
                if "Aries_Day" in data and "Aries_Night" in data:
                    print(f"Verified {f}: Contains Aries_Day/Night keys.")
                else:
                    print(f"Warning {f}: Missing expected keys.")
        except Exception as e:
            print(f"Error reading {f}: {e}")

if __name__ == "__main__":
    verify_profections_files()
