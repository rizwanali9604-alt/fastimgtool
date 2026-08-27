import os
from bs4 import BeautifulSoup

GUIDES_DIR = r"E:\Projects\fastimgtool\guides"
BASE_URL = "https://fastimgtool.com"
ADSENSE_CLIENT = "ca-pub-8332278519903196"
AFFILIATE_TAG = "fastimgtool78-21"

def hard_reset(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    changed = False

    # 1. Ensure navbar and footer
    for nav in soup.find_all('nav', class_='navbar'):
        nav.decompose()
    for foot in soup.find_all('footer', class_='footer'):
        foot.decompose()
    navbar = BeautifulSoup('''
<nav class="navbar">
    <div class="logo"><a href="/">⚡ FastImageTool</a></div>
    <div class="nav-links">
        <a href="/">Home</a>
        <a href="/tools/">Tools</a>
        <a href="/guides/">Guides</a>
        <a href="/blog/">Blog</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
        <a href="/community.html">Community</a>
    </div>
</nav>''', 'html.parser')
    soup.body.insert(0, navbar)
    footer = BeautifulSoup('''
<footer class="footer">
    <div class="footer-container">
        <div class="footer-col">
            <h4>Product</h4>
            <ul>
                <li><a href="/tools/">All Tools</a></li>
                <li><a href="/guides/">All Guides</a></li>
                <li><a href="/blog/">Blog</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4>Legal</h4>
            <ul>
                <li><a href="/privacy.html">Privacy policy</a></li>
                <li><a href="/terms.html">Terms & conditions</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4>Company</h4>
            <ul>
                <li><a href="/about.html">About us</a></li>
                <li><a href="/contact.html">Contact us</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        <p>© 2026 FastImgTool – All rights reserved.</p>
    </div>
</footer>''', 'html.parser')
    soup.body.append(footer)
    changed = True

    # 2. Wrap main content in .content div
    for div in soup.find_all('div', class_='content'):
        div.unwrap()
    body = soup.body
    content_elements = []
    for child in body.children:
        if child == navbar or child == footer:
            continue
        content_elements.append(child)
    content_div = soup.new_tag('div', **{'class': 'content'})
    for elem in content_elements:
        content_div.append(elem.extract())
    body.insert(1, content_div)
    changed = True

    # 3. Add canonical
    if not soup.find('link', rel='canonical'):
        rel_path = os.path.relpath(filepath, GUIDES_DIR)
        canonical_url = BASE_URL + '/guides/' + rel_path
        link = soup.new_tag('link', rel='canonical', href=canonical_url)
        head = soup.find('head')
        if head:
            head.append(link)
        changed = True

    # 4. Add meta description if missing
    if not soup.find('meta', attrs={'name': 'description'}):
        meta = soup.new_tag('meta', attrs={'name': 'description', 'content': 'Free online image tools to resize, compress, convert, and edit images. No uploads, completely private.'})
        head = soup.find('head')
        if head:
            head.append(meta)
        changed = True

    # 5. Add AdSense if missing
    scripts = soup.find_all('script', src=lambda x: x and 'pagead2.googlesyndication.com' in x)
    if not any(ADSENSE_CLIENT in s.get('src', '') for s in scripts):
        script = soup.new_tag('script', async_=True, src=f"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={ADSENSE_CLIENT}", crossorigin="anonymous")
        head = soup.find('head')
        if head:
            head.append(script)
        changed = True

    # 6. Add affiliate/resource block if missing
    if not soup.find('div', class_='recommended-tools'):
        block = BeautifulSoup(f'''
<div class="recommended-tools">
    <h3>Related Tools & Resources</h3>
    <p>🛒 Recommended product:</p>
    <ul>
        <li><a href="https://www.amazon.in/s?k=image+editing+software&tag={AFFILIATE_TAG}" target="_blank">Amazon Image Tools</a> (affiliate link)</li>
    </ul>
</div>
''', 'html.parser')
        footer_tag = soup.find('footer')
        if footer_tag:
            footer_tag.insert_before(block)
        else:
            soup.body.append(block)
        changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
    return changed

def main():
    files = [f for f in os.listdir(GUIDES_DIR) if f.endswith('.html') and f != 'index.html']
    for idx, f in enumerate(files, 1):
        filepath = os.path.join(GUIDES_DIR, f)
        print(f"[{idx}/{len(files)}] Processing {f}")
        try:
            if hard_reset(filepath):
                print("  Updated")
            else:
                print("  No changes")
        except Exception as e:
            print(f"  ERROR: {e}")

if __name__ == "__main__":
    main()