import os
import sys
import requests
import csv
from dotenv import load_dotenv
from bs4 import BeautifulSoup

load_dotenv()
API_KEY = os.getenv("DEEPSEEK_API_KEY") or os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    print("ERROR: No API key found.")
    sys.exit(1)

URL = "https://api.deepseek.com/v1/chat/completions"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

def extract_guide_info(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    title = soup.find('h1')
    title_text = title.get_text(strip=True) if title else "Image Tool Guide"
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    desc_text = meta_desc.get('content', "") if meta_desc else ""
    first_p = soup.find('p')
    intro_text = first_p.get_text(strip=True) if first_p else ""
    return title_text, desc_text, intro_text

def generate_pin_data(title, description, intro):
    prompt = f"""
You are a Pinterest marketing expert. Create a pin for the following guide:

Guide Title: {title}
Meta Description: {description}
Introduction: {intro}

Generate:
1. Pin Title (max 100 characters, catchy, include keyword)
2. Pin Description (2-3 sentences, include 5-7 relevant hashtags)

Return exactly in this format:
TITLE: <pin title>
DESCRIPTION: <pin description>
"""
    payload = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 300
    }
    response = requests.post(URL, headers=HEADERS, json=payload)
    if response.status_code != 200:
        print(f"API error: {response.status_code}")
        print(response.text)
        sys.exit(1)
    data = response.json()
    content = data['choices'][0]['message']['content']
    pin_title = ""
    pin_desc = ""
    for line in content.split('\n'):
        if line.startswith("TITLE:"):
            pin_title = line.replace("TITLE:", "").strip()
        elif line.startswith("DESCRIPTION:"):
            pin_desc = line.replace("DESCRIPTION:", "").strip()
    return pin_title, pin_desc

def append_to_csv(filepath, guide_name, pin_title, pin_desc):
    csv_file = "pins_to_schedule.csv"
    file_exists = os.path.isfile(csv_file)
    with open(csv_file, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["Guide File", "Pin Title", "Pin Description", "Image URL Placeholder"])
        writer.writerow([guide_name, pin_title, pin_desc, "https://fastimgtool.com/og-image.png"])

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate_pin.py <guide_file_path>")
        sys.exit(1)
    guide_path = sys.argv[1]
    if not os.path.exists(guide_path):
        print(f"File not found: {guide_path}")
        sys.exit(1)
    print(f"Generating pin for {guide_path}...")
    title, desc, intro = extract_guide_info(guide_path)
    pin_title, pin_desc = generate_pin_data(title, desc, intro)
    append_to_csv(guide_path, os.path.basename(guide_path), pin_title, pin_desc)
    print("Pin data appended to pins_to_schedule.csv")