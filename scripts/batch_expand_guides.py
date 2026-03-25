import os
import sys
import time
import requests
import subprocess
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("DEEPSEEK_API_KEY") or os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    print("ERROR: No API key found. Set DEEPSEEK_API_KEY or OPENROUTER_API_KEY in .env")
    sys.exit(1)

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
        "model": "deepseek-chat",
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

def git_commit(filepath, message):
    repo_dir = os.path.dirname(os.path.dirname(filepath))  # assumes file is inside repo
    try:
        subprocess.run(["git", "add", filepath], cwd=repo_dir, check=True, capture_output=True)
        subprocess.run(["git", "commit", "-m", message], cwd=repo_dir, check=True, capture_output=True)
        print(f"  Committed: {os.path.basename(filepath)}")
    except subprocess.CalledProcessError as e:
        # If nothing to commit (no changes), that's fine
        if "nothing to commit" not in str(e.stderr):
            print(f"  Git error: {e}")

def main():
    guides_dir = r"E:\Projects\fastimgtool\guides"
    if not os.path.isdir(guides_dir):
        print(f"Guides directory not found: {guides_dir}")
        sys.exit(1)

    # Get all HTML files except index.html
    files = [f for f in os.listdir(guides_dir) if f.endswith('.html') and f != 'index.html']
    total = len(files)
    print(f"Found {total} guides to expand.\n")

    for idx, filename in enumerate(files, 1):
        filepath = os.path.join(guides_dir, filename)
        print(f"[{idx}/{total}] Expanding {filename}...")
        try:
            original = read_guide(filepath)
            new_html = expand_with_ai(original)
            # Backup
            backup = filepath + ".bak"
            write_guide(backup, original)
            write_guide(filepath, new_html)
            # Git commit
            git_commit(filepath, f"Expanded guide: {filename}")
            # Optional: push after each? Better to push at end.
        except Exception as e:
            print(f"  ERROR on {filename}: {e}")
            # Continue with next file
            continue
        # Small delay to avoid rate limits
        time.sleep(5)  # 5 seconds between requests
        print()

    # After all done, push all commits at once
    repo_dir = r"E:\Projects\fastimgtool"
    try:
        print("Pushing all commits to GitHub...")
        subprocess.run(["git", "push"], cwd=repo_dir, check=True)
        print("Push completed.")
    except subprocess.CalledProcessError as e:
        print(f"Push failed: {e}")

if __name__ == "__main__":
    main()