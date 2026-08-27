import os
import re
from bs4 import BeautifulSoup

GUIDES_DIR = r"E:\Projects\fastimgtool\guides"
TOOLS_DIR = r"E:\Projects\fastimgtool\tools"
ADSENSE_CLIENT = "ca-pub-8332278519903196"  # your AdSense client ID

def add_adsense(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    # Check if already has AdSense script with this client
    scripts = soup.find_all('script', src=re.compile(r'pagead2\.googlesyndication\.com'))
    for s in scripts:
        if ADSENSE_CLIENT in s.get('src', ''):
            return False
    # Build the script tag
    script = soup.new_tag('script', async_=True, src=f"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={ADSENSE_CLIENT}", crossorigin="anonymous")
    head = soup.find('head')
    if head:
        head.append(script)
    else:
        new_head = soup.new_tag('head')
        new_head.append(script)
        soup.html.insert(0, new_head)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    return True

def main():
    for root, dirs, files in os.walk(GUIDES_DIR):
        for f in files:
            if f.endswith('.html'):
                filepath = os.path.join(root, f)
                if add_adsense(filepath):
                    print(f"Added AdSense to {filepath}")
    for root, dirs, files in os.walk(TOOLS_DIR):
        for f in files:
            if f.endswith('.html'):
                filepath = os.path.join(root, f)
                if add_adsense(filepath):
                    print(f"Added AdSense to {filepath}")

if __name__ == "__main__":
    main()