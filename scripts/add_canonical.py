import os
import re
from bs4 import BeautifulSoup

GUIDES_DIR = r"E:\Projects\fastimgtool\guides"
TOOLS_DIR = r"E:\Projects\fastimgtool\tools"
BASE_URL = "https://fastimgtool.com"

def add_canonical_to_file(filepath, base_url):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    # If canonical already exists, skip
    if soup.find('link', rel='canonical'):
        return False
    # Build canonical URL
    # For guides: /guides/filename.html
    # For tools: /tools/tool-name/index.html
    rel_path = os.path.relpath(filepath, os.path.dirname(GUIDES_DIR) if 'guides' in filepath else os.path.dirname(TOOLS_DIR))
    rel_path = rel_path.replace('\\', '/')
    canonical_url = base_url + '/' + rel_path
    # Create new link tag
    link = soup.new_tag('link', rel='canonical', href=canonical_url)
    head = soup.find('head')
    if head:
        head.append(link)
    else:
        # If no head, create one
        new_head = soup.new_tag('head')
        new_head.append(link)
        soup.html.insert(0, new_head)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    return True

def main():
    # Process guides
    for root, dirs, files in os.walk(GUIDES_DIR):
        for f in files:
            if f.endswith('.html'):
                filepath = os.path.join(root, f)
                if add_canonical_to_file(filepath, BASE_URL):
                    print(f"Added canonical to {filepath}")
    # Process tools
    for root, dirs, files in os.walk(TOOLS_DIR):
        for f in files:
            if f.endswith('.html'):
                filepath = os.path.join(root, f)
                if add_canonical_to_file(filepath, BASE_URL):
                    print(f"Added canonical to {filepath}")

if __name__ == "__main__":
    main()