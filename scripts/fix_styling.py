import os
import re
from bs4 import BeautifulSoup

# Hardcoded navbar and footer (consistent with your site)
NAVBAR = '''
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
</nav>
'''

FOOTER = '''
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
</footer>
'''

def add_css_link(soup):
    """Ensure the CSS link is present in the head."""
    if not soup.find('link', href=re.compile(r'/assets/css/style\.css')):
        link = soup.new_tag('link', rel='stylesheet', href='/assets/css/style.css')
        head = soup.find('head')
        if head:
            head.append(link)
        else:
            # If no head, create one
            new_head = soup.new_tag('head')
            new_head.append(link)
            soup.html.insert(0, new_head)
        return True
    return False

def remove_canva_links(soup):
    """Remove any Canva affiliate links from the recommended tools section."""
    tools_div = soup.find('div', class_=re.compile('recommended-tools'))
    if tools_div:
        # Find all <a> with href containing 'canva' and remove their parent <li> or <p>
        for a in tools_div.find_all('a', href=re.compile('canva', re.I)):
            li = a.find_parent('li')
            if li:
                li.decompose()
            else:
                a.decompose()
        # Remove any leftover "(affiliate link)" text
        for text in tools_div.find_all(string=re.compile(r'\(affiliate link\)', re.I)):
            text.extract()
    return soup

def main():
    guides_dir = r"E:\Projects\fastimgtool\guides"
    files = [f for f in os.listdir(guides_dir) if f.endswith('.html') and f != 'index.html']
    total = len(files)
    changed_files = 0
    for idx, filename in enumerate(files, 1):
        filepath = os.path.join(guides_dir, filename)
        print(f"[{idx}/{total}] Processing {filename}")
        with open(filepath, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        # Add CSS if missing
        if add_css_link(soup):
            changed_files += 1
        # Remove Canva links
        remove_canva_links(soup)
        # Ensure navbar and footer are present
        body = soup.find('body')
        if body:
            if not soup.find('nav', class_='navbar'):
                nav_soup = BeautifulSoup(NAVBAR, 'html.parser')
                body.insert(0, nav_soup)
                changed_files += 1
            if not soup.find('footer', class_='footer'):
                footer_soup = BeautifulSoup(FOOTER, 'html.parser')
                body.append(footer_soup)
                changed_files += 1
        # Write back if changes were made
        if changed_files:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(str(soup))
    print(f"Done. Modified {changed_files} files.")

if __name__ == "__main__":
    main()