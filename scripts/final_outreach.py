import os
import csv
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

def get_page_title(url):
    """Fetch a URL and return the page title, or empty string on failure."""
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(url, wait_until="domcontentloaded", timeout=10000)
            title = page.title()
            browser.close()
            return title.strip() if title else ""
    except Exception:
        return ""

def generate_email(target_url, contact_page, site_name, page_title):
    """Create a friendly outreach email using the template."""
    # Clean up site_name from URL if not provided
    if not site_name:
        site_name = urlparse(target_url).netloc.replace('www.', '').split('.')[0]
    if not page_title:
        page_title = "your page"

    email = f"""Hi there,

I came across your site **{site_name}** – specifically the page "{page_title}" – and I really appreciate the useful content you share with designers and photographers.

I run **FastImgTool** (fastimgtool.com), a free online image editor that works entirely in the browser. Users can resize, compress, convert, and edit images without any uploads – it's fast, private, and easy to use. We also have 180+ detailed guides covering various image editing topics.

I thought our tool might be a valuable addition to your page. If you agree, would you consider adding a link? I'd be happy to reciprocate or provide a guest post on a related topic.

Let me know what you think.

Best regards,
Rizwan
Founder, FastImgTool
"""
    return email

def main():
    # Read backlink_targets.csv
    with open('backlink_targets.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        targets = list(reader)

    # Filter to those with a contact page
    targets_with_contact = [t for t in targets if t['contact_page']]
    print(f"Found {len(targets_with_contact)} targets with a contact page.")

    results = []
    # Process first 20
    for idx, t in enumerate(targets_with_contact[:20], 1):
        target_url = t['url']
        contact_page = t['contact_page']
        print(f"[{idx}/20] Processing {target_url}...")

        # Fetch page title from the contact page (or fallback to target URL)
        page_title = get_page_title(contact_page)
        if not page_title:
            # Try the original URL
            page_title = get_page_title(target_url)
        site_name = urlparse(target_url).netloc.replace('www.', '').split('.')[0]

        email_body = generate_email(target_url, contact_page, site_name, page_title)
        results.append({
            'target_url': target_url,
            'contact_page': contact_page,
            'site_name': site_name,
            'page_title': page_title,
            'email_body': email_body
        })
        time.sleep(1)  # be polite

    # Save to CSV
    with open('outreach_emails.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['target_url', 'contact_page', 'site_name', 'page_title', 'email_body'])
        writer.writeheader()
        writer.writerows(results)

    print(f"\nSaved {len(results)} emails to outreach_emails.csv")
    print("Now open that CSV, visit each contact_page, and paste the email_body into the contact form.")

if __name__ == "__main__":
    main()