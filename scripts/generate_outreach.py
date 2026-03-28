import csv

def generate_email(site_name, contact_page, title):
    # Use a friendly, professional template
    email = f"""Hi there,

I came across your site **{site_name}** – specifically the page: {title} – and it’s a great resource for designers and photographers.

I run **FastImgTool** (fastimgtool.com), a free, client‑side image editor that lets users resize, compress, convert, and edit images directly in the browser. No uploads, no privacy concerns. We also have 180+ in‑depth guides covering everything from basic resizing to advanced techniques.

I think our tool would be a valuable addition to your page. If you agree, would you consider adding a link? I’m happy to reciprocate or provide a guest post on a related topic.

Let me know what you think.

Best regards,
Rizwan
Founder, FastImgTool
"""
    return email

def main():
    # Read the backlink targets CSV
    with open('backlink_targets.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        targets = list(reader)

    # Filter to those with a contact page
    targets_with_contact = [t for t in targets if t['contact_page']]
    print(f"Found {len(targets_with_contact)} targets with contact page.")

    results = []
    for t in targets_with_contact[:20]:
        url = t['url']
        contact_page = t['contact_page']
        # Extract a simple site name from the URL
        site_name = url.split('/')[2] if '//' in url else url.split('/')[0]
        title = f"the page at {url}"  # you could enhance with actual title, but we have it from previous scrape
        # In the previous run, we didn't store the title. For this fallback, we'll just use the URL.
        email_body = generate_email(site_name, contact_page, title)
        results.append({
            'target_url': url,
            'contact_page': contact_page,
            'email_body': email_body
        })

    # Save to CSV
    with open('outreach_emails.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['target_url', 'contact_page', 'email_body'])
        writer.writeheader()
        writer.writerows(results)

    print(f"Saved {len(results)} emails to outreach_emails.csv")

if __name__ == "__main__":
    main()