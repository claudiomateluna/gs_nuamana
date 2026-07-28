# -*- coding: utf-8 -*-
import json
import os
import sys

SCRATCH_DIR = r"C:\Users\claud\Documents\PWA\NuaMana\scratch"
GAMES_DATA_PATH = r"C:\Users\claud\Documents\PWA\NuaMana\supabase\scripts\games_data.py"

def main():
    print("Checking for batch output files...")
    all_exist = True
    batches = []
    
    for i in range(6):
        batch_path = os.path.join(SCRATCH_DIR, f"batch_output_{i}.json")
        if not os.path.exists(batch_path):
            print(f"[-] Missing: {batch_path}")
            all_exist = False
        else:
            print(f"[+] Found: {batch_path}")
            batches.append(batch_path)
            
    if not all_exist:
        print("\nError: Not all batch output files are ready yet. Please wait for all subagents to finish.")
        sys.exit(1)
        
    print("\nAll batches found! Merging...")
    merged_games = []
    
    for b_path in batches:
        with open(b_path, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
                merged_games.extend(data)
                print(f"   Loaded {len(data)} games from {os.path.basename(b_path)}")
            except Exception as e:
                print(f"   Error parsing {os.path.basename(b_path)}: {e}")
                sys.exit(1)
                
    if len(merged_games) != 30:
        print(f"Warning: Expected 30 games, but found {len(merged_games)}.")
        
    # Write as a pretty python module to games_data.py
    print(f"\nWriting to {GAMES_DATA_PATH}...")
    with open(GAMES_DATA_PATH, "w", encoding="utf-8") as f_py:
        f_py.write("# -*- coding: utf-8 -*-\n\n")
        f_py.write("GAMES_DATA = ")
        # Pretty print the list of dicts
        json.dump(merged_games, f_py, indent=2, ensure_ascii=False)
        f_py.write("\n")
        
    print("[OK] games_data.py successfully rebuilt and written!")

if __name__ == "__main__":
    main()
