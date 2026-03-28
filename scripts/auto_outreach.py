import os
import re
import csv
import time
import requests
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# ========== CONFIGURATION ==========
SEND_EMAILS = False  # Set to True to actually send emails (needs SMTP credentials below)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "your_email@gmail.com"
SMTP_PASSWORD = "your_app_password"

# DeepSeek API key (should be in .env)
load_dotenv()
API_KEY = os.getenv("DEEPSEEK_API_KEY") or os.getenv("OPENROUTER_API_KEY")
if not API_KEY:
    print("ERROR: No API key found. Set DEEPSEEK_API_KEY or OPENROUTER_API_KEY in .env")
    exit(1)

URL = "https://api.deepseek.com/v1/chat/completions"
HEADERS = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

def get_page_context(url):
    """Fetch the page and extract title, possible name, and a short description."""
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(url, wait_until="domcontentloaded", timeout=10000)
            content = page.content()
            soup = BeautifulSoup(content, 'html.parser')
            title = soup.title.string.strip() if soup.title else ""
            # Try to find an email address or contact person name
            name_candidate = None
            # Look for "Contact Name:" or similar
            text = soup.get_text()
            # Simple heuristic: find first capitalized name near "contact"
            match = re.search(r"contact\s+([A-Z][a-z]+\s+[A-Z][a-z]+)", text, re.I)
            if match:
                name_candidate = match.group(1)
            browser.close()
            return title, name_candidate
    except Exception as e:
        return f"Error: {e}", None

def generate_email(target_url, contact_page, title, name_candidate):
    """Use DeepSeek to generate a personalized outreach email."""
    if name_candidate:
        greeting = f"Hi {name_candidate},"
    else:
        greeting = "Hi there,"

    prompt = f"""
You are a friendly, professional outreach specialist. Write a short, personalized email to the owner/editor of the website at {target_url} (contact page: {contact_page}).

Website title: {title}

I am the founder of FastImgTool (fastimgtool.com), a free online image editor that lets users resize, compress, convert, and edit images directly in the browser – no uploads, completely private. We also have 180+ detailed guides covering various image editing topics.

The goal is to suggest adding a link to FastImgTool (or one of its guides) on their resource page, because it would be valuable to their audience.

Keep the email warm, concise, and personalized. Mention the website title. Sign off as "Rizwan, Founder of FastImgTool".

Return only the email body (without subject). Start with the greeting.
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
            return f"Error: API returned {response.status_code}\n{response.text}"
        data = response.json()
        email_body = data['choices'][0]['message']['content']
        return email_body
    except Exception as e:
        return f"Error generating email: {e}"

def send_via_smtp(to_email, subject, body):
    """Send an email using SMTP (if configured)."""
    import smtplib
    from email.mime.text import MIMEText
    try:
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = SMTP_USER
        msg["To"] = to_email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"SMTP error: {e}")
        return False

def main():
    # Read targets from CSV
    with open('backlink_targets.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        targets = list(reader)

    # Filter to those with a contact page
    targets_with_contact = [t for t in targets if t['contact_page']]
    print(f"Found {len(targets_with_contact)} targets with a contact page.")
    if not targets_with_contact:
        print("No targets with contact page. Exiting.")
        return

    results = []
    # Limit to 20 for now
    for idx, t in enumerate(targets_with_contact[:20], 1):
        url = t['url']
        contact_page = t['contact_page']
        print(f"[{idx}/20] Processing {url} ...")
        # Get page context
        title, name = get_page_context(contact_page)
        print(f"  Title: {title[:80]}")
        print(f"  Name candidate: {name}")
        # Generate email
        email_body = generate_email(url, contact_page, title, name)
        print(f"  Email length: {len(email_body)} chars")
        results.append({
            'target_url': url,
            'contact_page': contact_page,
            'email_body': email_body
        })
        time.sleep(2)  # be gentle

    # Save emails to CSV
    with open('outreach_emails.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['target_url', 'contact_page', 'email_body'])
        writer.writeheader()
        writer.writerows(results)
    print("Emails saved to outreach_emails.csv")

    # Optionally send them
    if SEND_EMAILS:
        print("Sending emails via SMTP...")
        for r in results:
            # We don't have an email address, only contact page. So we can't send directly.
            # This would require extracting email from contact page first.
            # For now, we just note.
            print(f"Would send to contact page: {r['contact_page']} (no email)")
        print("Email sending not implemented because we only have contact page URLs, not email addresses.")
    else:
        print("Email sending disabled. To send, set SEND_EMAILS=True and configure SMTP credentials.")

if __name__ == "__main__":
    main()