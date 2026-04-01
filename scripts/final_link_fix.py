import os
import re
from pathlib import Path

ROOT = Path(r"E:\Projects\fastimgtool")

def fix_links_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    # Remove repetitive .html.html...
    content = re.sub(r'(\.html)+', '.html', content)
    # Fix /tools/tools/... -> /tools/
    content = re.sub(r'(/tools/)+', '/tools/', content)
    # Fix /guides/tools/... -> /tools/ (if it's a tool link)
    content = re.sub(r'/guides/tools/', '/tools/', content)
    # Fix /about.html.html.html -> /about.html
    content = re.sub(r'/about(\.html)+', '/about.html', content)
    # Fix /privacy-policy.html... -> /privacy-policy.html
    content = re.sub(r'/privacy-policy(\.html)+', '/privacy-policy.html', content)
    # Fix /contact.html... -> /contact.html
    content = re.sub(r'/contact(\.html)+', '/contact.html', content)
    # Fix any remaining double slashes
    content = re.sub(r'//+', '/', content)
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    for path in ROOT.rglob("*.html"):
        if fix_links_in_file(path):
            print(f"Fixed links in {path}")

if __name__ == "__main__":
    main()