import os
from bs4 import BeautifulSoup

GUIDES_DIR = r"E:\Projects\fastimgtool\guides"
REQUIRED_H2 = ['Introduction', 'Step-by-Step', 'FAQ', 'Conclusion']

def add_h2_sections(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    body = soup.find('body')
    if not body:
        return False
    existing_h2 = [h2.get_text(strip=True).lower() for h2 in soup.find_all('h2')]
    # Find the first element after H1 or first paragraph as insertion point
    h1 = soup.find('h1')
    if h1:
        insert_point = h1.find_next()
    else:
        insert_point = body.find('p')
        if not insert_point:
            insert_point = body
    changed = False
    for heading in REQUIRED_H2:
        if heading.lower() not in existing_h2:
            new_h2 = soup.new_tag('h2')
            new_h2.string = heading
            if insert_point:
                insert_point.insert_before(new_h2)
                insert_point = new_h2  # next heading goes after this one
            else:
                body.append(new_h2)
            changed = True
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
    return changed

def main():
    files = [f for f in os.listdir(GUIDES_DIR) if f.endswith('.html') and f != 'index.html']
    for f in files:
        filepath = os.path.join(GUIDES_DIR, f)
        print(f"Processing {f}")
        if add_h2_sections(filepath):
            print("  Added missing H2 sections")

if __name__ == "__main__":
    main()