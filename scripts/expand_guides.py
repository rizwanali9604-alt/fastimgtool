import os
import sys
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("DEEPSEEK_API_KEY")   # Expect this in .env
if not API_KEY:
    # Fallback: maybe it's stored as OPENROUTER_API_KEY (same key)
    API_KEY = os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    print("ERROR: DEEPSEEK_API_KEY or OPENROUTER_API_KEY not found in .env")
    sys.exit(1)

# DeepSeek API endpoint
URL = "https://api.deepseek.com/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def read_guide(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_guide(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def expand_with_ai(original_html):
    prompt = f"""
You are an expert SEO content writer. Rewrite and expand the following guide to be 1500–2000 words, using this structure:

1. Introduction (hook, what the reader will learn)
2. What is [topic]? (definition, why it matters)
3. Why you might need [topic] (use cases, bullet points)
4. Step-by-step instructions (detailed, with clear H3 subheadings for each step)
5. Alternative methods (other tools or manual ways)
6. Frequently Asked Questions (4–6 questions with answers)
7. Conclusion & Call to Action (try our tool, sign up for email updates)

Use H2 headings for each section. Add internal links to our tool pages where relevant. Use a friendly but authoritative tone. Include at least one image placeholder with alt text.

Here is the original guide:

{original_html}

Return ONLY the full HTML content, starting with <!DOCTYPE html> and ending with </html>. Do not include any extra explanation outside the HTML.
"""
    payload = {
        "model": "deepseek-chat",           # DeepSeek's chat model
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 4000
    }
    response = requests.post(URL, headers=HEADERS, json=payload)
    if response.status_code != 200:
        print(f"API error: {response.status_code}")
        print(response.text)
        sys.exit(1)
    data = response.json()
    return data['choices'][0]['message']['content']

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python expand_guide.py <guide_file_path>")
        sys.exit(1)
    guide_path = sys.argv[1]
    if not os.path.exists(guide_path):
        print(f"File not found: {guide_path}")
        sys.exit(1)

    print(f"Expanding {guide_path}...")
    original = read_guide(guide_path)
    new_html = expand_with_ai(original)
    # Backup original
    backup = guide_path + ".bak"
    write_guide(backup, original)
    print(f"Backup saved to {backup}")
    write_guide(guide_path, new_html)
    print("Done! Guide expanded.")