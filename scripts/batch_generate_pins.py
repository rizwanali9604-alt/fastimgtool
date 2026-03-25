import os
import sys
import time
from generate_pin import extract_guide_info, generate_pin_data, append_to_csv

def main():
    guides_dir = r"E:\Projects\fastimgtool\guides"
    if not os.path.isdir(guides_dir):
        print(f"Guides directory not found: {guides_dir}")
        sys.exit(1)

    files = [f for f in os.listdir(guides_dir) if f.endswith('.html') and f != 'index.html']
    total = len(files)
    print(f"Found {total} guides. Generating pins...\n")

    for idx, filename in enumerate(files, 1):
        filepath = os.path.join(guides_dir, filename)
        print(f"[{idx}/{total}] Processing {filename}...")
        try:
            title, desc, intro = extract_guide_info(filepath)
            pin_title, pin_desc = generate_pin_data(title, desc, intro)
            append_to_csv(filepath, filename, pin_title, pin_desc)
        except Exception as e:
            print(f"  ERROR on {filename}: {e}")
            continue
        time.sleep(2)  # delay to avoid rate limits

    print("\nDone. All pins appended to pins_to_schedule.csv")

if __name__ == "__main__":
    main()