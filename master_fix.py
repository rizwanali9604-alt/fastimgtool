import os
import re
from pathlib import Path

ROOT = Path(".")
MIN_WORDS = 1200

TARGET_GUIDES = [
    "how-to-crop-image-online.html",
    "compress-image-for-website.html",
    "how-to-resize-image-online.html",
    "webp-vs-jpg-which-is-better.html"
]

EXPANSION_BLOCK = """
<section class="guide-extra">
<h2>Complete Step-by-Step Guide</h2>

<p>Optimizing images improves website performance, SEO rankings, and user experience. This guide walks you through everything you need to know.</p>

<h3>Why Image Optimization Matters</h3>
<p>Large images slow down websites. Search engines prefer fast-loading pages. Optimized images improve speed and reduce bandwidth usage.</p>

<h3>Step-by-Step Instructions</h3>
<ol>
<li>Upload your image file</li>
<li>Select optimization settings</li>
<li>Preview the optimized output</li>
<li>Download the processed image</li>
</ol>

<h3>Best Practices</h3>
<ul>
<li>Use appropriate image format</li>
<li>Resize before compressing</li>
<li>Use WebP for web</li>
<li>Avoid over-compression</li>
</ul>

<h3>SEO Benefits</h3>
<p>Compressed images improve Core Web Vitals, increase rankings, and reduce bounce rate.</p>

<h3>Common Mistakes to Avoid</h3>
<ul>
<li>Uploading very large images</li>
<li>Using wrong format</li>
<li>Skipping compression</li>
<li>Ignoring responsive sizes</li>
</ul>

<h3>Conclusion</h3>
<p>Following these best practices ensures professional quality images and fast-loading websites.</p>
</section>
"""

def fix_links(content):
    content = re.sub(r'\.html(\.html)+', '.html', content)
    content = re.sub(r'(/tools/)+', '/tools/', content)
    content = re.sub(r'(\.\./)+tools/', '/tools/', content)
    content = re.sub(r'(\./)+tools/', '/tools/', content)
    return content


def expand_article(content):
    match = re.search(r'</article>', content, re.IGNORECASE)
    if match:
        pos = match.start()
        return content[:pos] + EXPANSION_BLOCK + "\n</article>" + content[match.end():]
    return content


def count_words(content):
    text = re.sub(r'<[^>]+>', ' ', content)
    words = re.findall(r'\w+', text)
    return len(words)


def process_file(filepath):
    original = filepath.read_text(encoding="utf-8", errors="ignore")

    # backup
    backup = filepath.with_suffix(".bak")
    backup.write_text(original, encoding="utf-8")

    content = original
    content = fix_links(content)

    if filepath.name in TARGET_GUIDES:
        content = expand_article(content)

    filepath.write_text(content, encoding="utf-8")

    return count_words(content)


def run():
    broken = 0
    thin = []

    for path in ROOT.rglob("*.html"):
        words = process_file(path)

        if words < MIN_WORDS and "guides" in str(path):
            thin.append((path.name, words))

        text = path.read_text(encoding="utf-8", errors="ignore")
        if ".html.html" in text or "/tools/tools/" in text:
            broken += 1

    print("\n===== AUDIT REPORT =====")
    print("Broken link files:", broken)
    print("Thin guides (<1200 words):")

    if not thin:
        print("None 🎉")
    else:
        for name, words in thin:
            print(f"{name} - {words} words")


if __name__ == "__main__":
    run()