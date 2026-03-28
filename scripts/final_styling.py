import os
import re
from bs4 import BeautifulSoup

def fix_css_and_structure(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    changed = False

    # 1. Add CSS link if missing
    if not soup.find('link', href=re.compile(r'/assets/css/style\.css')):
        link = soup.new_tag('link', rel='stylesheet', href='/assets/css/style.css')
        head = soup.find('head')
        if head:
            head.append(link)
            changed = True
        else:
            # create head if missing
            new_head = soup.new_tag('head')
            new_head.append(link)
            soup.html.insert(0, new_head)
            changed = True

    # 2. Find navbar and footer
    nav = soup.find('nav', class_='navbar')
    footer = soup.find('footer', class_='footer')

    # 3. Extract content between navbar and footer (or whole body if no navbar)
    body = soup.find('body')
    if not body:
        return changed

    # If navbar and footer exist, gather all elements between them
    if nav and footer:
        # Collect siblings after nav until footer
        content_elements = []
        for sibling in nav.find_next_siblings():
            if sibling == footer:
                break
            content_elements.append(sibling)
        if content_elements:
            # Create a new div with class 'content'
            content_div = soup.new_tag('div', **{'class': 'content'})
            for elem in content_elements:
                content_div.append(elem.extract())
            # Insert the content_div right after nav
            nav.insert_after(content_div)
            changed = True
    else:
        # If no navbar/footer, wrap entire body in content div
        content_div = soup.new_tag('div', **{'class': 'content'})
        for child in list(body.children):
            content_div.append(child.extract())
        body.append(content_div)
        changed = True

    # 4. Ensure guide image is responsive
    img_div = soup.find('div', class_='guide-image')
    if img_div:
        img = img_div.find('img')
        if img:
            style = img.get('style', '')
            if 'max-width: 100%' not in style:
                img['style'] = style + '; max-width: 100%; height: auto;'
                changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
    return changed

def main():
    guides_dir = r"E:\Projects\fastimgtool\guides"
    files = [f for f in os.listdir(guides_dir) if f.endswith('.html') and f != 'index.html']
    total = len(files)
    fixed = 0
    for idx, filename in enumerate(files, 1):
        filepath = os.path.join(guides_dir, filename)
        print(f"[{idx}/{total}] Processing {filename}")
        if fix_css_and_structure(filepath):
            fixed += 1
    print(f"Done. Fixed {fixed} files.")

if __name__ == "__main__":
    main()