import csv
import time
import requests

API_KEY = "sk-a6adfb79b7054e47b531627dca9dc0f1"  # your key
URL = "https://api.deepseek.com/v1/chat/completions"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

def generate_image_prompt(title, description):
    prompt = f"""
You are a creative image prompt writer. Given the following pin title and description, write a concise, detailed prompt (max 50 words) for generating an image that would work well for Pinterest. The image should be eye‑catching, relevant, and suitable for a design‑related or technology‑related audience.

Title: {title}
Description: {description}

Output only the prompt, no extra text.
"""
    payload = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 100
    }
    try:
        response = requests.post(URL, headers=HEADERS, json=payload, timeout=30)
        if response.status_code != 200:
            print(f"  API error: {response.status_code}")
            return ""
        data = response.json()
        return data['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"  Exception: {e}")
        return ""

def main():
    input_csv = "pins_with_link.csv"
    output_txt = "pins_manual_with_prompts.txt"
    
    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        pins = list(reader)

    with open(output_txt, 'w', encoding='utf-8') as f:
        for idx, pin in enumerate(pins, 1):
            print(f"[{idx}/{len(pins)}] {pin['Pin Title'][:60]}...")
            img_prompt = generate_image_prompt(pin['Pin Title'], pin['Pin Description'])
            if not img_prompt:
                # fallback generic prompt
                img_prompt = f"Clean, modern visual showing {pin['Pin Title']} with bright colors and clear text."
            f.write(f"\n=== PIN {idx} ===\n")
            f.write(f"Title: {pin['Pin Title']}\n")
            f.write(f"Description: {pin['Pin Description']}\n")
            f.write(f"Link: {pin['Link']}\n")
            f.write(f"Image URL: {pin['Image URL Placeholder']}\n")
            f.write(f"Image Prompt: {img_prompt}\n")
            time.sleep(2)

    print(f"\n✅ Done. Saved to {output_txt}")

if __name__ == "__main__":
    main()