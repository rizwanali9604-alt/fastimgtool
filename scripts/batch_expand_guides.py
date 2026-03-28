import os
import sys
import time
import requests
import subprocess
from bs4 import BeautifulSoup

# HARDCODED API KEY (temporary fix)
API_KEY = "sk-a6adfb79b7054e47b531627dca9dc0f1"

URL = "https://api.deepseek.com/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def count_words_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
        text = soup.get_text()
        return len(text.split())

def read_guide(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_guide(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def expand_with_ai(original_html, max_retries=3):
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
    for attempt in range(max_retries):
        try:
            response = requests.post(URL, headers=HEADERS, json=payload, timeout=120)  # increased timeout
            if response.status_code != 200:
                print(f"  API error: {response.status_code}")
                print(response.text)
                raise Exception(f"API returned {response.status_code}")
            data = response.json()
            return data['choices'][0]['message']['content']
        except requests.exceptions.Timeout:
            print(f"  Timeout on attempt {attempt+1}/{max_retries}. Retrying in 10 seconds...")
            time.sleep(10)
            continue
        except Exception as e:
            print(f"  Exception: {e}")
            if attempt == max_retries - 1:
                raise
            time.sleep(5)
    raise Exception("Max retries exceeded")

def git_commit(filepath, message):
    repo_dir = os.path.dirname(os.path.dirname(filepath))
    try:
        subprocess.run(["git", "add", filepath], cwd=repo_dir, check=True, capture_output=True)
        subprocess.run(["git", "commit", "-m", message], cwd=repo_dir, check=True, capture_output=True)
        print(f"  Committed: {os.path.basename(filepath)}")
    except subprocess.CalledProcessError as e:
        if "nothing to commit" not in str(e.stderr):
            print(f"  Git error: {e}")

def main():
    guides_dir = r"E:\Projects\fastimgtool\guides"
    if not os.path.isdir(guides_dir):
        print(f"Guides directory not found: {guides_dir}")
        sys.exit(1)

    files = [f for f in os.listdir(guides_dir) if f.endswith('.html') and f != 'index.html']
    total = len(files)
    print(f"Found {total} guides. Checking word counts...\n")

    to_expand = []
    for f in files:
        filepath = os.path.join(guides_dir, f)
        wc = count_words_in_file(filepath)
        if wc < 1500:
            to_expand.append((f, wc))
            print(f"  {f}: {wc} words (needs expansion)")
        else:
            print(f"  {f}: {wc} words (already good)")

    print(f"\n{len(to_expand)} guides need expansion.\n")
    if not to_expand:
        print("No guides to expand. Exiting.")
        return

    for idx, (filename, wc) in enumerate(to_expand, 1):
        filepath = os.path.join(guides_dir, filename)
        print(f"[{idx}/{len(to_expand)}] Expanding {filename} (current words: {wc})...")
        try:
            original = read_guide(filepath)
            new_html = expand_with_ai(original)
            backup = filepath + ".bak"
            write_guide(backup, original)
            write_guide(filepath, new_html)
            git_commit(filepath, f"Expanded guide: {filename}")
        except Exception as e:
            print(f"  ERROR on {filename}: {e}")
            continue
        time.sleep(5)  # delay between guides
        print()

    repo_dir = r"E:\Projects\fastimgtool"
    try:
        print("Pushing all commits to GitHub...")
        subprocess.run(["git", "push"], cwd=repo_dir, check=True)
        print("Push completed.")
    except subprocess.CalledProcessError as e:
        print(f"Push failed: {e}")

if __name__ == "__main__":
    main()