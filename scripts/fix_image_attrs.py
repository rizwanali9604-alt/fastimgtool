import os
from bs4 import BeautifulSoup

GUIDES_DIR = r"E:\Projects\fastimgtool\guides"

def fix_image_attrs(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    changed = False
    for img in soup.find_all('img'):
        # Add alt if missing
        if not img.get('alt'):
            img['alt'] = "Image guide illustration"
            changed = True
        # Add responsive style if missing
        style = img.get('style', '')
        if 'max-width: 100%' not in style and 'width:100%' not in style:
            new_style = style + '; max-width: 100%; height: auto;' if style else 'max-width: 100%; height: auto;'
            img['style'] = new_style
            changed = True
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
    return changed

def main():
    files = [f for f in os.listdir(GUIDES_DIR) if f.endswith('.html') and f != 'index.html']
    total = len(files)
    fixed = 0
    for f in files:
        filepath = os.path.join(GUIDES_DIR, f)
        if fix_image_attrs(filepath):
            print(f"Fixed images in {f}")
            fixed += 1
    print(f"Done. Fixed {fixed} files.")

if __name__ == "__main__":
    main()