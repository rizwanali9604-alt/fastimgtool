import sys
import os
import re
import csv
import time
import requests
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from datetime import datetime

# ===== CONFIGURATION =====
GUIDES_DIR = r"E:\Projects\fastimgtool\guides"
TOOLS_DIR = r"E:\Projects\fastimgtool\tools"
BASE_URL = "https://fastimgtool.com"
AFFILIATE_TAG = "fastimgtool78-21"
ADSENSE_CLIENT = "ca-pub-8332278519903196"  # your AdSense client ID
MAX_LINKS_TO_CHECK = 3  # reduce to speed up

# Required H2 sections (in lowercase)
REQUIRED_SECTIONS = ['introduction', 'step-by-step', 'faq', 'conclusion']

# ===== HELPER FUNCTIONS =====
def count_words(text):
    return len(re.findall(r'\w+', text))

def readability_score(text):
    try:
        import textstat
        return textstat.flesch_reading_ease(text)
    except:
        return None

def check_sections(soup):
    h2_texts = [h2.get_text(strip=True).lower() for h2 in soup.find_all('h2')]
    found = [r for r in REQUIRED_SECTIONS if any(r in t for t in h2_texts)]
    missing = [r for r in REQUIRED_SECTIONS if r not in found]
    return found, missing

def check_style_consistency(soup):
    errors = []
    if not soup.find('nav', class_='navbar'):
        errors.append("missing navbar")
    if not soup.find('footer', class_='footer'):
        errors.append("missing footer")
    if not soup.find('div', class_='content'):
        errors.append("missing .content wrapper")
    if not soup.find('link', href=re.compile(r'/assets/css/style\.css')):
        errors.append("missing CSS link")
    return errors

def check_image_consistency(soup):
    issues = []
    for img in soup.find_all('img'):
        style = img.get('style', '')
        if 'max-width: 100%' not in style and 'width:100%' not in style:
            issues.append(f"{img.get('src', '')} lacks responsive style")
        if not img.get('alt'):
            issues.append(f"{img.get('src', '')} missing alt")
    return issues

def check_adsense(soup):
    scripts = soup.find_all('script', src=re.compile(r'pagead2\.googlesyndication\.com'))
    for s in scripts:
        if ADSENSE_CLIENT in s.get('src', ''):
            return True
    return False

def check_affiliate_links(soup):
    links = soup.find_all('a', href=re.compile(rf'tag={AFFILIATE_TAG}'))
    return len(links) > 0

def check_internal_links(soup, base):
    links = set()
    for a in soup.find_all('a', href=True):
        href = a['href'].strip()
        if href.startswith('http') and not href.startswith(base):
            continue
        if href.startswith('#') or href.startswith('mailto:'):
            continue
        absolute = urljoin(base, href)
        links.add(absolute)
    return links

def check_broken_links(links):
    broken = []
    for link in links:
        try:
            r = requests.head(link, allow_redirects=True, timeout=5)
            if r.status_code != 200:
                broken.append(link)
        except:
            broken.append(link)
        time.sleep(0.3)
    return broken

# NEW CHECKS
def check_canonical(soup):
    canonical = soup.find('link', rel='canonical')
    return canonical is not None

def check_meta_description(soup):
    meta = soup.find('meta', attrs={'name': 'description'})
    if meta and meta.get('content', '').strip():
        return True
    return False

def check_h1(soup):
    h1s = soup.find_all('h1')
    return len(h1s) == 1

def audit_guides():
    results = []
    files = [f for f in os.listdir(GUIDES_DIR) if f.endswith('.html') and f != 'index.html']
    total = len(files)
    for idx, f in enumerate(files, 1):
        print(f"Processing {idx}/{total}: {f}")
        path = os.path.join(GUIDES_DIR, f)
        try:
            with open(path, 'r', encoding='utf-8') as fp:
                soup = BeautifulSoup(fp.read(), 'html.parser')
        except Exception as e:
            print(f"  Error reading {f}: {e}")
            continue

        text = soup.get_text()
        word_count = count_words(text)
        readability = readability_score(text) if 'textstat' in sys.modules else None
        found, missing = check_sections(soup)
        style_errors = check_style_consistency(soup)
        image_issues = check_image_consistency(soup)
        has_adsense = check_adsense(soup)
        has_affiliate = check_affiliate_links(soup)
        internal_links = check_internal_links(soup, BASE_URL)
        broken = check_broken_links(list(internal_links)[:MAX_LINKS_TO_CHECK])

        # New checks
        has_canonical = check_canonical(soup)
        has_meta_desc = check_meta_description(soup)
        has_h1 = check_h1(soup)

        results.append({
            'file': f,
            'word_count': word_count,
            'readability': readability,
            'missing_sections': ','.join(missing),
            'style_errors': ','.join(style_errors),
            'image_issues': ','.join(image_issues),
            'has_adsense': has_adsense,
            'has_affiliate': has_affiliate,
            'has_canonical': has_canonical,
            'has_meta_desc': has_meta_desc,
            'has_h1': has_h1,
            'broken_links': ','.join(broken)
        })
    return results

def strategic_metrics():
    # Placeholder – implement with APIs later
    return {
        'sessions_last_7d': None,
        'sessions_growth_pct': None,
        'indexed_pages': None,
        'new_backlinks': None,
        'email_subscribers': None,
        'affiliate_clicks': None,
    }

def main():
    print("=== Ultimate Site Audit v3 ===")
    print(f"Started at {datetime.now()}")
    print("\nAuditing guides...")
    guide_results = audit_guides()
    print("\nFetching strategic metrics...")
    metrics = strategic_metrics()

    report_file = f"audit_report_{datetime.now().strftime('%Y%m%d')}.csv"
    with open(report_file, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['file', 'word_count', 'readability', 'missing_sections',
                      'style_errors', 'image_issues', 'has_adsense', 'has_affiliate',
                      'has_canonical', 'has_meta_desc', 'has_h1', 'broken_links']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(guide_results)
    print(f"Report saved to {report_file}")

    # Summary statistics
    low_word = [g for g in guide_results if g['word_count'] < 1500]
    missing_section = [g for g in guide_results if g['missing_sections']]
    style_issues = [g for g in guide_results if g['style_errors']]
    image_issues = [g for g in guide_results if g['image_issues']]
    no_adsense = [g for g in guide_results if not g['has_adsense']]
    no_affiliate = [g for g in guide_results if not g['has_affiliate']]
    no_canonical = [g for g in guide_results if not g['has_canonical']]
    no_meta_desc = [g for g in guide_results if not g['has_meta_desc']]
    no_h1 = [g for g in guide_results if not g['has_h1']]
    broken = [g for g in guide_results if g['broken_links']]

    print("\n=== SUMMARY ===")
    print(f"Guides with <1500 words: {len(low_word)}")
    print(f"Guides missing required H2 sections: {len(missing_section)}")
    print(f"Guides with style errors (navbar/footer/CSS): {len(style_issues)}")
    print(f"Guides with image issues: {len(image_issues)}")
    print(f"Guides without AdSense: {len(no_adsense)}")
    print(f"Guides without affiliate links: {len(no_affiliate)}")
    print(f"Guides without canonical tag: {len(no_canonical)}")
    print(f"Guides without meta description: {len(no_meta_desc)}")
    print(f"Guides with wrong number of H1 tags: {len(no_h1)}")
    print(f"Guides with broken links: {len(broken)}")
    print("\n=== STRATEGIC METRICS ===")
    for k, v in metrics.items():
        print(f"{k}: {v if v is not None else 'N/A (API not configured)'}")
    print(f"Completed at {datetime.now()}")

if __name__ == "__main__":
    main()