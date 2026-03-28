import os
from bs4 import BeautifulSoup

def add_placeholder_image(soup):
    # Find the first H1
    h1 = soup.find('h1')
    if not h1:
        return False
    # Create the image HTML
    img_html = '''
<div class="guide-image">
    <img src="https://placehold.co/800x400/111a30/4da3ff?text=Image+Guide" 
         alt="Illustration for the guide" 
         style="width:100%; border-radius:12px; margin-bottom:20px;">
</div>
'''
    img_soup = BeautifulSoup(img_html, 'html.parser')
    h1.insert_before(img_soup)
    return True

def main():
    guides_dir = r"E:\Projects\fastimgtool\guides"
    files = [f for f in os.listdir(guides_dir) if f.endswith('.html') and f != 'index.html']
    total = len(files)
    for idx, filename in enumerate(files, 1):
        filepath = os.path.join(guides_dir, filename)
        print(f"[{idx}/{total}] Processing {filename}")
        with open(filepath, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        # Skip if image already exists (to avoid duplicates)
        if soup.find('div', class_='guide-image'):
            continue
        if add_placeholder_image(soup):
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(str(soup))
        else:
            print(f"  Skipped – no H1 found")

if __name__ == "__main__":
    main()