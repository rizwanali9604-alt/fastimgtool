import os
import re
from bs4 import BeautifulSoup

GUIDES_DIR = r"E:\Projects\fastimgtool\guides"

def fix_links_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    changed = False
    for a in soup.find_all('a', href=True):
        href = a['href']
        # Remove repetitive /tools/tools/tools/... -> /tools/
        new_href = re.sub(r'(/tools/)+', '/tools/', href)
        # Remove repetitive /newsletter.html.html... -> /newsletter.html
        new_href = re.sub(r'(/newsletter\.html)+', '/newsletter.html', new_href)
        # Remove repetitive /privacy-policy.html.html... -> /privacy-policy.html
        new_href = re.sub(r'(/privacy-policy\.html)+', '/privacy-policy.html', new_href)
        # Remove repetitive /contact.html.html... -> /contact.html
        new_href = re.sub(r'(/contact\.html)+', '/contact.html', new_href)
        # Remove repetitive /about.html.html... -> /about.html
        new_href = re.sub(r'(/about\.html)+', '/about.html', new_href)
        if new_href != href:
            a['href'] = new_href
            changed = True
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
    return changed

def main():
    files = [f for f in os.listdir(GUIDES_DIR) if f.endswith('.html') and f != 'index.html']
    for f in files:
        filepath = os.path.join(GUIDES_DIR, f)
        if fix_links_in_file(filepath):
            print(f"Fixed links in {f}")

if __name__ == "__main__":
    main()