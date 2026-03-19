import asyncio
import csv
import sys
import os
from datetime import datetime
from playwright.async_api import async_playwright

async def crawl_and_check(start_url, output_file):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        results = []
        visited = set()
        to_visit = [start_url]
        issues_found = []

        print(f"Starting crawl from {start_url}")
        while to_visit and len(visited) < 500:  # safety limit
            url = to_visit.pop(0)
            if url in visited:
                continue
            try:
                await page.goto(url, wait_until='networkidle', timeout=10000)
                title = await page.title()
                results.append({'url': url, 'title': title})
                visited.add(url)
                print(f"Checked: {url} -> {title}")

                # Check for problematic titles
                if '{{' in title or not title.strip():
                    issues_found.append({'url': url, 'title': title})

                # Find all internal links to continue crawling
                links = await page.eval_on_selector_all('a', 'els => els.map(a => a.href)')
                for link in links:
                    # Only follow links within the same domain
                    if link.startswith(start_url) and link not in visited and link not in to_visit:
                        to_visit.append(link)
            except Exception as e:
                print(f"Error on {url}: {e}")

        await browser.close()

        # Save results to CSV
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['url', 'title'])
            writer.writeheader()
            writer.writerows(results)

        # Also save issues separately if any
        if issues_found:
            issues_file = output_file.replace('.csv', '_issues.csv')
            with open(issues_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.DictWriter(f, fieldnames=['url', 'title'])
                writer.writeheader()
                writer.writerows(issues_found)
            print(f"\n⚠️  Found {len(issues_found)} pages with issues. Saved to {issues_file}")
        else:
            print("\n✅ No issues found. All titles look good!")

        print(f"\nCrawl complete. Checked {len(results)} pages. Full report: {output_file}")
        return issues_found

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python check_titles.py <start_url> [output_file]")
        sys.exit(1)
    start_url = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else f'titles_{datetime.now().strftime("%Y%m%d")}.csv'
    asyncio.run(crawl_and_check(start_url, output_file))