import os
import re
import csv
import time
from urllib.parse import urljoin, urlparse
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

# List of search queries to find potential backlink sources
QUERIES = [
    'intitle:"best image tools" "resources"',
    'intitle:"top image compressors"',
    'intitle:"free online photo editor"',
    'intitle:"image optimization tools"',
    'intitle:"useful image tools for designers"',
]

def google_search(page, query):
    """Perform a Google search and return result URLs."""
    search_url = f"https://www.google.com/search?q={query.replace(' ', '+')}"
    page.goto(search_url, wait_until="domcontentloaded")
    # Wait for results to appear
    page.wait_for_selector("div#search", timeout=10000)
    # Scroll to load all results (optional)
    # Extract links
    links = page.query_selector_all("div#search a")
    urls = []
    for link in links:
        href = link.get_attribute("href")
        if href and href.startswith("http") and not href.startswith("https://www.google"):
            # Clean up Google redirects
            if "/url?q=" in href:
                href = href.split("/url?q=")[1].split("&")[0]
            urls.append(href)
    return list(set(urls))  # deduplicate

def find_contact_email(soup, domain):
    """Look for contact email in page content."""
    # Simple regex for email
    emails = set(re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", soup.get_text()))
    # Filter by domain if possible
    contact_emails = [e for e in emails if 'contact' in e.lower() or 'info' in e.lower() or 'editor' in e.lower()]
    if contact_emails:
        return contact_emails[0]
    # Also check for "Contact" page link
    contact_link = soup.find('a', href=re.compile(r'contact', re.I))
    if contact_link:
        return "Contact page: " + urljoin(domain, contact_link['href'])
    return ""

def main():
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # set headless=False to see what's happening
        page = browser.new_page()
        for query in QUERIES:
            print(f"Searching for: {query}")
            urls = google_search(page, query)
            print(f"Found {len(urls)} result URLs")
            for url in urls[:20]:  # limit per query
                print(f"  Visiting {url}")
                try:
                    page.goto(url, wait_until="domcontentloaded", timeout=15000)
                    content = page.content()
                    soup = BeautifulSoup(content, 'html.parser')
                    # Get page title
                    title = soup.title.string.strip() if soup.title else ''
                    # Find contact email or contact page
                    contact = find_contact_email(soup, url)
                    results.append({
                        'query': query,
                        'url': url,
                        'title': title,
                        'contact': contact
                    })
                    time.sleep(2)
                except Exception as e:
                    print(f"    Error: {e}")
            time.sleep(5)  # be gentle between queries
        browser.close()

    # Save to CSV
    with open('backlink_targets.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['query', 'url', 'title', 'contact'])
        writer.writeheader()
        writer.writerows(results)
    print(f"Done. Found {len(results)} targets. Saved to backlink_targets.csv")

if __name__ == "__main__":
    main()