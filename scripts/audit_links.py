import os
import re
import csv
import time
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup

def is_internal_link(href, base_domain="fastimgtool.com"):
    """Check if a link is internal to the site."""
    parsed = urlparse(href)
    if not parsed.netloc:
        return True  # relative link
    return parsed.netloc.endswith(base_domain)

def extract_links_from_file(filepath, base_url="https://fastimgtool.com"):
    """Extract all internal links from an HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    links = set()
    for a in soup.find_all('a', href=True):
        href = a['href'].strip()
        if not href or href.startswith('#') or href.startswith('mailto:'):
            continue
        # Build absolute URL
        absolute = urljoin(base_url, href)
        if is_internal_link(absolute):
            links.add(absolute)
    return links

def check_url_status(url):
    """Return status code (or error) for a URL."""
    try:
        # Use HEAD request to avoid downloading full content
        r = requests.head(url, allow_redirects=True, timeout=5)
        return r.status_code
    except requests.RequestException as e:
        return str(e)

def main():
    guides_dir = r"E:\Projects\fastimgtool\guides"
    files = [f for f in os.listdir(guides_dir) if f.endswith('.html') and f != 'index.html']
    all_broken = []
    total_files = len(files)

    print(f"Scanning {total_files} guide files...")
    for idx, filename in enumerate(files, 1):
        filepath = os.path.join(guides_dir, filename)
        print(f"[{idx}/{total_files}] Processing {filename}")
        internal_links = extract_links_from_file(filepath)
        for link in internal_links:
            status = check_url_status(link)
            if status != 200:
                all_broken.append({
                    'source_file': filename,
                    'broken_url': link,
                    'status': status
                })
        time.sleep(0.5)  # be polite

    # Save to CSV
    with open('broken_links.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['source_file', 'broken_url', 'status'])
        writer.writeheader()
        writer.writerows(all_broken)

    print(f"\nDone. Found {len(all_broken)} broken internal links. Saved to broken_links.csv")

if __name__ == "__main__":
    main()