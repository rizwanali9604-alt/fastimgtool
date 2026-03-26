import os
import sys
import re
from bs4 import BeautifulSoup

# Define your affiliate links. Replace the placeholders with actual links.
AFFILIATE_LINKS = {
    "Amazon": "https://www.amazon.in/s?k=image+editing+software&tag=fastimgtool78-21",
}

def insert_affiliate_links(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    # Find the body content
    body = soup.find('body')
    if not body:
        return False

    # Look for a section that might be the "Conclusion" or add a new "Recommended Tools" section
    # We'll add after the last H2 or before the conclusion
    conclusion = soup.find('h2', string=re.compile('Conclusion|FAQs', re.I))
    if conclusion:
        parent = conclusion.find_parent()
    else:
        # fallback: append to body
        parent = body

    # Build the affiliate block
    aff_block = soup.new_tag('div', **{'class': 'recommended-tools'})
    h3 = soup.new_tag('h3')
    h3.string = "Recommended Tools"
    aff_block.append(h3)

    for name, link in AFFILIATE_LINKS.items():
        p = soup.new_tag('p')
        a = soup.new_tag('a', href=link, target="_blank")
        a.string = f"Try {name}"
        p.append(a)
        p.append(" (affiliate link – we may earn a commission)")
        aff_block.append(p)

    # Insert before the conclusion or at the end
    if conclusion:
        conclusion.insert_before(aff_block)
    else:
        body.append(aff_block)

    # Write back
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    return True

def main():
    guides_dir = r"E:\Projects\fastimgtool\guides"
    files = [f for f in os.listdir(guides_dir) if f.endswith('.html') and f != 'index.html']
    total = len(files)
    print(f"Found {total} guides. Inserting affiliate links...")

    for idx, filename in enumerate(files, 1):
        filepath = os.path.join(guides_dir, filename)
        print(f"[{idx}/{total}] Processing {filename}...")
        try:
            if insert_affiliate_links(filepath):
                print("  Links added.")
            else:
                print("  Skipped (no body).")
        except Exception as e:
            print(f"  ERROR: {e}")

if __name__ == "__main__":
    main()