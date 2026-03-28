import os
import re
import csv
import time
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def find_contact_info(page, url):
    """Extract contact email or contact page URL from the page."""
    try:
        content = page.content()
        soup = BeautifulSoup(content, 'html.parser')
        # Look for email addresses
        emails = set(re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", soup.get_text()))
        # Filter for likely contact emails
        contact_emails = [e for e in emails if 'contact' in e.lower() or 'info' in e.lower() or 'editor' in e.lower()]
        # Look for contact page link
        contact_link = soup.find('a', href=re.compile(r'contact', re.I))
        contact_page = urljoin(url, contact_link['href']) if contact_link else ''
        return contact_emails[0] if contact_emails else '', contact_page
    except Exception as e:
        print(f"  Error parsing page: {e}")
        return '', ''

def main():
    # Read URLs from file
    with open('backlink_urls.txt', 'r', encoding='utf-8') as f:
        urls = [line.strip() for line in f if line.strip()]

    if not urls:
        print("No URLs found in backlink_urls.txt")
        return

    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # headless=False to see the pages (helps with debugging)
        page = browser.new_page()
        for idx, url in enumerate(urls, 1):
            print(f"[{idx}/{len(urls)}] Visiting {url}")
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=15000)
                time.sleep(2)  # let page settle
                email, contact_page = find_contact_info(page, url)
                results.append({
                    'url': url,
                    'email': email,
                    'contact_page': contact_page
                })
                print(f"  Found email: {email}")
                print(f"  Contact page: {contact_page}")
            except Exception as e:
                print(f"  Error: {e}")
                results.append({'url': url, 'email': '', 'contact_page': ''})
            time.sleep(1)  # be polite
        browser.close()

    # Save to CSV
    with open('backlink_targets.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['url', 'email', 'contact_page'])
        writer.writeheader()
        writer.writerows(results)

    print(f"\nDone. Saved {len(results)} targets to backlink_targets.csv")

if __name__ == "__main__":
    main()