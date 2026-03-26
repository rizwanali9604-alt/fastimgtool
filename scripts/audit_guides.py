import os
import re
import csv
from bs4 import BeautifulSoup

def count_words(text):
    return len(re.findall(r'\w+', text))

def check_sections(soup):
    h2_texts = [h2.get_text(strip=True).lower() for h2 in soup.find_all('h2')]
    required = ['introduction', 'step-by-step', 'faq', 'conclusion']
    found = [r for r in required if any(r in t for t in h2_texts)]
    missing = [r for r in required if r not in found]
    return found, missing

def check_affiliate_link(soup, affiliate_tag):
    links = soup.find_all('a', href=re.compile(rf'tag={affiliate_tag}'))
    return len(links) > 0

def main():
    guides_dir = r"E:\Projects\fastimgtool\guides"
    files = [f for f in os.listdir(guides_dir) if f.endswith('.html') and f != 'index.html']
    results = []
    for f in files:
        path = os.path.join(guides_dir, f)
        with open(path, 'r', encoding='utf-8') as fp:
            soup = BeautifulSoup(fp.read(), 'html.parser')
        text = soup.get_text()
        word_count = count_words(text)
        found, missing = check_sections(soup)
        has_affiliate = check_affiliate_link(soup, 'fastimgtool78-21')
        results.append([f, word_count, ','.join(found), ','.join(missing), has_affiliate])
    with open('audit_report.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['File', 'Word Count', 'Sections Found', 'Sections Missing', 'Has Affiliate'])
        writer.writerows(results)
    print(f"Audit complete. Report saved to audit_report.csv")

if __name__ == "__main__":
    main()