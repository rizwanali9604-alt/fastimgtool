import csv
import time
import urllib.parse
import requests
from pathlib import Path

# Input and output files
INPUT_CSV = "pins_with_link.csv"
OUTPUT_CSV = "pins_with_generated_images.csv"

# Pollinations.ai base URL
BASE_URL = "https://image.pollinations.ai/prompt/"

# Delay between requests (seconds) to avoid rate limits
DELAY = 2

def build_prompt(title, description):
    """Create a concise image prompt from pin title and description."""
    # Use the title and a short part of the description
    # Limit length to avoid URL length issues
    prompt = f"{title} – {description[:100]}"
    # Remove any problematic characters
    prompt = prompt.replace('\n', ' ').strip()
    return prompt

def get_image_url(prompt):
    """Return the image URL from Pollinations.ai for the given prompt."""
    encoded = urllib.parse.quote(prompt)
    # Optionally add size parameters: ?width=800&height=600
    url = f"{BASE_URL}{encoded}?width=800&height=600"
    # No need to download the image; just return the URL
    return url

def main():
    # Read original CSV
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        pins = list(reader)

    # Prepare output CSV with same columns plus a new "Generated Image URL"
    fieldnames = list(reader.fieldnames) + ["Generated Image URL", "Image Prompt"]

    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for idx, pin in enumerate(pins, 1):
            print(f"[{idx}/{len(pins)}] Generating image for: {pin['Pin Title'][:50]}...")

            # Build prompt
            prompt = build_prompt(pin['Pin Title'], pin['Pin Description'])
            # Get image URL
            img_url = get_image_url(prompt)

            # Add new fields
            pin["Image Prompt"] = prompt
            pin["Generated Image URL"] = img_url

            # Write row
            writer.writerow(pin)

            # Wait to be polite
            time.sleep(DELAY)

    print(f"\n✅ Done. Saved to {OUTPUT_CSV}")

if __name__ == "__main__":
    main()