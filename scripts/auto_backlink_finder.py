import os
import re
import csv
import time
import requests
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Try to load .env from current dir, then from marketing engine folder
load_dotenv()
if not os.getenv("DEEPSEEK_API_KEY") and not os.getenv("OPENROUTER_API_KEY"):
    env_path = r"E:\ToolForge\marketing_engine\.env"
    if os.path.exists(env_path):
        load_dotenv(env_path)

API_KEY = os.getenv("DEEPSEEK_API_KEY") or os.getenv("OPENROUTER_API_KEY")

# DeepSeek API endpoint (only used if key is valid)
URL = "https://api.deepseek.com/v1/chat/completions"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"} if API_KEY else None

# Fallback list of domains (design resource sites)
FALLBACK_DOMAINS = [
    "creativebloq.com",
    "designbeep.com",
    "speckyboy.com",
    "webdesignerdepot.com",
    "smashingmagazine.com",
    "designmodo.com",
    "tutsplus.com",
    "sitepoint.com",
    "photographyblog.com",
    "digitalcameraworld.com",
    "canva.com",
    "99designs.com/blog",
    "envato.com/blog",
    "graphicdesignjunction.com",
    "abduzeedo.com",
    "designhill.com/blog",
    "line25.com",
    "codrops.com",
    "webdesign.tutsplus.com"
]

def generate_target_domains():
    """Use DeepSeek to generate a list of websites (or fallback if API fails)."""
    if not API_KEY:
        print("No API key – using fallback domain list.")
        return FALLBACK_DOMAINS

    prompt = """
List 30 websites (just the domain names, one per line) that frequently publish resource lists, reviews, or articles about image editing tools, photo compressors, design tools, or online image converters. These should be blogs, design resource hubs, or directories that might link to useful tools. Include a mix of well-known and niche sites. Do not include social media platforms or forums. Output only the domain names (e.g., example.com) without any explanation.
"""
    payload = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 500
    }
    try:
        response = requests.post(URL, headers=HEADERS, json=payload, timeout=30)
        if response.status_code != 200:
            print(f"API error: {response.status_code} – using fallback.")
            return FALLBACK_DOMAINS
        data = response.json()
        content = data['choices'][0]['message']['content']
        domains = [line.strip() for line in content.split('\n') if line.strip() and not line.startswith('#')]
        if domains:
            print(f"DeepSeek generated {len(domains)} domains.")
            return domains
        else:
            print("No domains from API – using fallback.")
            return FALLBACK_DOMAINS
    except Exception as e:
        print(f"Error calling DeepSeek: {e} – using fallback.")
        return FALLBACK_DOMAINS

def find_contact_info(page, url):
    """Extract contact email or contact page URL from the page."""
    try:
        content = page.content()
        soup = BeautifulSoup(content, 'html.parser')
        emails = set(re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", soup.get_text()))
        contact_emails = [e for e in emails if 'contact' in e.lower() or 'info' in e.lower() or 'editor' in e.lower()]
        contact_link = soup.find('a', href=re.compile(r'contact', re.I))
        contact_page = urljoin(url, contact_link['href']) if contact_link else ''
        return contact_emails[0] if contact_emails else '', contact_page
    except Exception:
        return '', ''

def main():
    # Generate target domains
    print("Generating target domains...")
    domains = generate_target_domains()
    if not domains:
        print("No domains found. Exiting.")
        return

    print(f"Will process {len(domains)} domains.")
    # Construct URLs: home, /resources/, /tools/, /blog/
    urls = []
    for domain in domains:
        # Ensure domain starts with https
        if not domain.startswith('http'):
            domain_url = f"https://{domain}"
        else:
            domain_url = domain
        for path in ['', 'resources/', 'tools/', 'blog/']:
            urls.append(f"{domain_url}/{path}")
    # Remove duplicates
    urls = list(set(urls))
    print(f"Prepared {len(urls)} URLs to visit.")

    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # headless=False to see pages
        page = browser.new_page()
        for idx, url in enumerate(urls, 1):
            print(f"[{idx}/{len(urls)}] Visiting {url}")
            try:
                page.goto(url, wait_until="domcontentloaded", timeout=15000)
                time.sleep(2)
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
            time.sleep(1)
        browser.close()

    # Save to CSV
    with open('backlink_targets.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['url', 'email', 'contact_page'])
        writer.writeheader()
        writer.writerows(results)

    print(f"\nDone. Saved {len(results)} targets to backlink_targets.csv")

if __name__ == "__main__":
    main()