#!/usr/bin/env python3
"""
Generate all 120 Part 5 HTML guides under guides/[slug]/index.html.
Does NOT touch existing flat guides/*.html files.
Includes sitemap fragment for Part 5 guide URLs.
"""
from __future__ import annotations

import json
import os
import re
from datetime import datetime, timezone
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GUIDES_DIR = ROOT / "guides"
TEMPLATE_FILE = ROOT / "templates" / "guide-template.html"
SITEMAP_PART5 = ROOT / "sitemap-part5-guides.xml"
ADSENSE_CLIENT = "ca-pub-8332278513903196"
SITE_ORIGIN = "https://fastimgtool.com"

# Guide prefix / group -> tool folder for links
TOOL_PATHS: dict[str, str] = {
    "image-compressor": "/tools/image-compressor/",
    "image-resizer": "/tools/image-resizer/",
    "jpg-to-png": "/tools/jpg-to-png/",
    "png-to-jpg": "/tools/png-to-jpg/",
    "image-to-webp": "/tools/image-to-webp/",
    "webp-to-png": "/tools/webp-to-jpg/",
    "blur-image": "/tools/image-blur/",
    "sharpen-image": "/tools/image-sharpen/",
    "brightness-contrast": "/tools/image-brightness/",
    "grayscale": "/tools/image-grayscale/",
    "sepia": "/tools/image-sepia/",
    "invert-colors": "/tools/image-invert/",
    "saturation": "/tools/image-saturation/",
    "crop-image": "/tools/image-crop/",
    "rotate-image": "/tools/rotate-image/",
    "flip-image": "/tools/flip-image/",
    "watermark": "/tools/image-crop/",
    "image-to-base64": "/tools/image-to-base64/",
    "base64-to-image": "/tools/base64-to-image/",
    "heic-to-jpg": "/tools/heic-to-jpg/",
    "image-to-bmp": "/tools/bmp-to-jpg/",
    "image-to-gif": "/tools/gif-to-png/",
    "hue-rotate": "/tools/png-to-webp/",
    "image-to-tiff": "/tools/tiff-to-jpg/",
}

TOOL_NAMES: dict[str, str] = {
    "image-compressor": "Image Compressor",
    "image-resizer": "Image Resizer",
    "jpg-to-png": "JPG to PNG",
    "png-to-jpg": "PNG to JPG",
    "image-to-webp": "Image to WebP",
    "webp-to-png": "WebP to JPG",
    "blur-image": "Image Blur",
    "sharpen-image": "Image Sharpen",
    "brightness-contrast": "Image Brightness",
    "grayscale": "Image Grayscale",
    "sepia": "Image Sepia",
    "invert-colors": "Image Invert",
    "saturation": "Image Saturation",
    "crop-image": "Image Crop",
    "rotate-image": "Rotate Image",
    "flip-image": "Flip Image",
    "watermark": "Image Crop",
    "image-to-base64": "Image to Base64",
    "base64-to-image": "Base64 to Image",
    "heic-to-jpg": "HEIC to JPG",
    "image-to-bmp": "BMP to JPG",
    "image-to-gif": "GIF to PNG",
    "hue-rotate": "PNG to WebP",
    "image-to-tiff": "TIFF to JPG",
}

INDIAN_NAMES = [
    "Priya Sharma", "Rahul Verma", "Ananya Patel", "Vikram Singh",
    "Meera Iyer", "Arjun Nair", "Kavita Reddy", "Suresh Gupta",
]

# Load exact Part 5 guide list from shared manifest
import sys
sys.path.insert(0, str(Path(__file__).parent))
from generate_sitemap_and_index import TOOL_SECTIONS, GUIDE_TITLES  # noqa: E402

GUIDES: list[tuple[str, str, str]] = [
    (slug, GUIDE_TITLES[slug], group)
    for _name, group, slugs in TOOL_SECTIONS
    for slug in slugs
]

GROUP_SLUGS: dict[str, list[str]] = {}
for slug, _title, group in GUIDES:
    GROUP_SLUGS.setdefault(group, []).append(slug)


def word_count(html: str) -> int:
    text = re.sub(r"<[^>]+>", " ", html)
    return len(re.findall(r"\b\w+\b", text))


def meta_description(title: str, tool_name: str) -> str:
    desc = f"{title.split('—')[0].strip()}. Free {tool_name} guide for Indian sellers and creators."
    if len(desc) > 155:
        desc = desc[:152] + "..."
    return desc


def guide_type(slug: str) -> str:
    for suffix in (
        "how-to", "best-practices", "vs-alternatives", "use-cases", "for-sellers",
        "for-shopify-sellers", "for-privacy", "for-social-media", "for-product-photos",
        "for-beginners", "debugging",
    ):
        if slug.endswith(suffix) or slug == suffix.replace("-", "-"):
            if slug.endswith(suffix):
                return suffix
    specials = {
        "webp-seo-benefits": "seo",
        "webp-vs-jpg-vs-png": "comparison",
        "webp-compatibility-guide": "special",
        "background-blur-guide": "special",
        "product-photo-lighting-fix": "special",
        "crop-ratios-guide": "special",
        "fix-photo-orientation": "special",
        "mirror-image-guide": "special",
        "flip-vs-rotate": "comparison",
        "base64-explained": "special",
        "decode-base64-guide": "special",
        "jpg-to-png-when-to-use": "special",
        "png-to-jpg-when-to-use": "special",
        "grayscale-photography-guide": "special",
        "vintage-photo-guide": "special",
        "negative-effect-guide": "special",
        "color-enhancement-guide": "special",
        "heic-format-explained": "special",
        "bmp-format-explained": "special",
        "gif-format-guide": "special",
        "tiff-format-explained": "special",
        "color-theory-for-images": "special",
    }
    return specials.get(slug, "general")


def related_links(slug: str, group: str) -> str:
    peers = [s for s in GROUP_SLUGS[group] if s != slug][:3]
    titles = {s: t for s, t, g in GUIDES}
    items = "".join(
        f'<li><a href="/guides/{s}/">{escape(titles[s])}</a></li>'
        for s in peers
    )
    return f'<h2 id="related">Related guides</h2><ul>{items}</ul>'


def faq_items(slug: str, tool_name: str, tool_href: str, group: str) -> list[tuple[str, str]]:
    return [
        (
            f"Is FastImageTool {tool_name} really free?",
            f"Yes. Our {tool_name} runs entirely in your browser with no signup, no watermarks, and no per-file fees. "
            f"Priya Sharma, a Meesho seller from Pune, processes 40–60 listing images weekly at zero cost. "
            f"Unlike SaaS tools charging ₹500–₹2,000 per month, FastImageTool stays free because processing happens locally on your device. "
            f"You can open {tool_href} on mobile Chrome or desktop Edge and download results instantly.",
        ),
        (
            f"What file size and dimensions work best for Amazon India and Meesho?",
            f"Amazon India recommends at least 1000 pixels on the longest side and files under 10MB, though keeping images near 2MB loads faster on Seller Central. "
            f"Meesho requires 600×600 px minimum with files ideally under 50KB for snappy catalog scrolling. "
            f"After using {tool_name}, run our Image Compressor if exports exceed marketplace limits. "
            f"JPEG at 80–85% quality usually hits the sweet spot between sharpness and upload speed.",
        ),
        (
            f"Are my images uploaded to FastImageTool servers?",
            f"No. FastImageTool processes images client-side whenever possible, so product photos never leave your laptop or phone during editing. "
            f"This matters for sellers handling unreleased inventory or supplier catalogs. "
            f"Rahul Verma, an Amazon FBA seller in Jaipur, switched from cloud converters specifically for this privacy model. "
            f"Always verify the address bar shows fastimgtool.com before processing sensitive files.",
        ),
        (
            f"Can I use {tool_name} on mobile for quick listing fixes?",
            f"Absolutely. Modern mobile browsers support canvas-based tools well enough for marketplace workflows. "
            f"Ananya Patel edits Meesho thumbnails on her Redmi phone between supplier meetings—upload, adjust, download, and share via WhatsApp in under two minutes. "
            f"For batch work above 20 images, a desktop with a larger preview is still faster, but mobile works for urgent fixes before a listing goes live.",
        ),
        (
            f"What should I do if results look wrong after processing?",
            f"First, confirm you started from the highest-quality source file—not an already-compressed WhatsApp forward. "
            f"Second, undo aggressive settings: over-sharpening creates halos, excessive compression adds JPEG blocks, and extreme crops cut off product edges. "
            f"Third, compare before/after at 100% zoom on a neutral background. "
            f"If problems persist, revisit {tool_href} with default settings, then adjust one slider at a time while watching file size and visual clarity.",
        ),
    ]


def mistakes_block(gtype: str, tool_name: str) -> str:
    mistakes = [
        (
            "Starting from over-compressed sources",
            f"You cannot recover detail lost in a 30KB WhatsApp image. Always keep a full-resolution master and export marketplace copies with {tool_name}.",
        ),
        (
            "Ignoring platform dimension rules",
            "Uploading 4000×3000 px photos when Meesho only needs 600×600 wastes bandwidth and triggers automatic downscaling that softens edges.",
        ),
        (
            "Applying maximum effect settings",
            "Sliders at 100% rarely look professional. Subtle adjustments between 10–30% usually outperform dramatic edits on product photography.",
        ),
        (
            "Skipping a final compression pass",
            "Even perfectly edited PNGs can exceed 2MB. Pair your workflow with Image Compressor before hitting upload on Amazon Seller Central.",
        ),
    ]
    if gtype == "vs-alternatives":
        mistakes[1] = (
            "Choosing tools that upload to unknown servers",
            "Free cloud converters may retain supplier catalog images. Browser-based tools keep files on your device.",
        )
    items = "".join(f"<li><strong>{escape(m[0])}:</strong> {escape(m[1])}</li>" for m in mistakes[:4])
    return f'<h2 id="mistakes">Common mistakes to avoid</h2><ul>{items}</ul>'


def steps_block(tool_name: str, tool_href: str, gtype: str) -> str:
    steps = [
        (
            "Open the tool and prepare your source file",
            f"Navigate to {tool_href} in Chrome, Edge, or Safari. "
            f"Use the original photo from your camera or supplier—not a forwarded chat image. "
            f"Note the starting file size; Meesho listings perform best under 50KB and Amazon accepts up to 10MB but prefers around 2MB.",
        ),
        (
            "Upload or drag your image into the workspace",
            f"Click the upload zone or drag a JPG, PNG, or WebP file directly onto the page. "
            f"The {tool_name} preview loads instantly without creating an account.",
        ),
        (
            "Adjust settings for your target platform",
            "For Meesho, aim for 600×600 px square crops. For Amazon India, keep the longest edge at 1000–2000 px. "
            "Match white backgrounds (#FFFFFF) when marketplaces require clean catalog shots.",
        ),
        (
            "Preview at 100% zoom before exporting",
            "Check labels, stitching, and edges. Zoom to actual pixels—thumbnails hide blur that buyers notice on product pages.",
        ),
        (
            "Download and verify the exported file",
            f"Save the processed image, confirm dimensions in file properties, and re-compress if still above 2MB. "
            f"Upload a test SKU in Seller Central or Meesho panel before batch-processing your entire catalog.",
        ),
    ]
    items = "".join(
        f"<li><strong>{escape(s[0])}:</strong> {escape(s[1])}</li>" for s in steps
    )
    return f'<h2 id="steps">Step-by-step workflow</h2><ol>{items}</ol>'


def use_cases_block(tool_name: str) -> str:
    cases = [
        ("Meesho catalog thumbnails at 600×600", "Square crops with files under 50KB improve scroll performance for mobile shoppers in Tier-2 cities."),
        ("Amazon main images at 1000+ px", "Crisp hero shots on white backgrounds increase click-through on search results."),
        ("Shopify product pages under 200KB", "Faster LCP scores help Google rankings and reduce bounce on 4G connections."),
        ("WhatsApp supplier previews", "Compressed 800 px versions share quickly without hitting the 16MB forward limit."),
        ("Instagram carousel posts at 1080×1080", "Consistent square assets keep grids professional for D2C brands."),
        ("Email newsletters below 1MB total", "Compressed banners prevent Gmail clipping on promotional sends."),
        ("Blog featured images for Core Web Vitals", "Web-optimized heroes improve PageSpeed scores without CDN upgrades."),
        ("Flipkart and Myntra secondary images", "Uniform dimensions across variants build buyer trust."),
        ("Internal QA documentation", "Annotated screenshots with subtle blur protect customer PII in support tickets."),
        ("Print-ready exports after digital edits", "High-quality masters archived separately from web-optimized copies."),
    ]
    items = "".join(f"<li><strong>{escape(c[0])}:</strong> {escape(c[1])}</li>" for c in cases)
    return f'<h2 id="use-cases">Top use cases in 2026</h2><ol>{items}</ol>'


def comparison_block(tool_name: str, tool_href: str) -> str:
    return f"""
<h2 id="comparison">How FastImageTool compares</h2>
<p>When Vikram Singh evaluated options for his Ahmedabad-based home decor brand, he tested browser tools, desktop apps, and mobile editors. FastImageTool won on three criteria: zero upload latency, no subscription, and predictable output sizes for Meesho&apos;s 600×600 requirement.</p>
<table class="guide-table">
<thead><tr><th>Tool</th><th>Cost</th><th>Privacy</th><th>Best for</th></tr></thead>
<tbody>
<tr><td>FastImageTool {escape(tool_name)}</td><td>Free</td><td>Browser-local</td><td>Daily seller workflows</td></tr>
<tr><td>Desktop editors</td><td>₹800–₹3,000/mo</td><td>Local</td><td>Heavy retouching</td></tr>
<tr><td>Cloud converters</td><td>Freemium</td><td>Server upload</td><td>One-off conversions</td></tr>
<tr><td>Mobile apps</td><td>Ads / IAP</td><td>Varies</td><td>Quick social posts</td></tr>
</tbody>
</table>
<p>For most Indian marketplace sellers processing 20–100 SKUs per week, <a href="{tool_href}">{escape(tool_name)}</a> delivers the best balance of speed, cost, and compliance with platform image rules.</p>
"""


def scenario_paragraph(name: str, city: str, platform: str, tool_name: str, topic: str) -> str:
    return (
        f"<p>Consider {name}, a {platform} seller based in {city}. "
        f"Last month their hero image was rejected twice—once for exceeding 2MB on Amazon India, "
        f"once because Meesho flagged a 480×480 upload below the required 600×600 minimum. "
        f"After switching to FastImageTool {tool_name}, {name.split()[0]} now prepares every listing image in under three minutes, "
        f"keeping JPEG exports between 45KB and 180KB without visible quality loss. "
        f"This guide walks through the same workflow so you can fix {topic} before your next catalog upload deadline.</p>"
    )


def generate_content(slug: str, title: str, group: str) -> str:
    tool_name = TOOL_NAMES[group]
    tool_href = TOOL_PATHS[group]
    gtype = guide_type(slug)
    name = INDIAN_NAMES[hash(slug) % len(INDIAN_NAMES)]
    cities = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Jaipur", "Kochi"]
    city = cities[hash(slug + "city") % len(cities)]
    platform = "Meesho and Amazon" if "seller" in slug or "for-" in slug else "Shopify and Instagram"

    topic = title.split("—")[0].strip().lower()
    intro = scenario_paragraph(name, city, platform, tool_name, topic)

    sections = [
        f'<h2 id="intro">Introduction</h2>{intro}',
        f"""<h2 id="what">What this guide covers</h2>
<p>{escape(title)} is part of FastImageTool&apos;s free learning library for Indian ecommerce sellers, content creators, and web developers. 
Whether you manage 15 SKUs or 1,500, image quality directly affects conversion rates, return rates, and ad performance. 
Marketplaces compress sloppy uploads automatically—and their algorithms rarely improve your photography.</p>
<p>We focus on practical numbers: Meesho&apos;s 600×600 px floor, Amazon&apos;s 1000 px recommendation, the 2MB comfort zone for Seller Central, 
and WhatsApp&apos;s habit of stripping EXIF data from forwarded JPEGs. 
You will learn when to use {tool_name}, how to avoid rework, and which follow-up tools complete a professional listing pipeline.</p>""",
        f"""<h2 id="why">Why {escape(tool_name)} matters in 2026</h2>
<p>Indian ecommerce grew past 200 million online shoppers, and competition on Meesho, Amazon India, Flipkart, and Shopify D2C stores intensifies every quarter. 
Buyers scroll on mid-range Android phones over 4G—not fiber-connected MacBooks. 
Heavy 3–5MB photos slow catalog pages, increase bounce rates, and trigger platform rejections during peak sale uploads.</p>
<ul>
<li><strong>Speed:</strong> Optimized images upload 3–5× faster on Seller Central during flash sales.</li>
<li><strong>Compliance:</strong> Correct dimensions prevent automatic cropping that cuts off product edges.</li>
<li><strong>Cost:</strong> Browser tools eliminate ₹500–₹2,000/month subscriptions for basic edits.</li>
<li><strong>Privacy:</strong> Local processing keeps unreleased inventory photos off third-party servers.</li>
<li><strong>SEO:</strong> Smaller WebP and JPEG files improve Core Web Vitals on Shopify and custom storefronts.</li>
</ul>
<p>Open <a href="{tool_href}">{escape(tool_name)}</a> before your next batch upload and treat image prep as part of listing QA—not an afterthought.</p>""",
        steps_block(tool_name, tool_href, gtype),
        mistakes_block(gtype, tool_name),
    ]

    if gtype in ("use-cases", "general") or "use-cases" in slug:
        sections.append(use_cases_block(tool_name))
    if gtype in ("vs-alternatives", "comparison") or "vs-" in slug:
        sections.append(comparison_block(tool_name, tool_href))
    if gtype == "seo" or slug == "webp-seo-benefits":
        sections.append(f"""<h2 id="seo">SEO and Core Web Vitals impact</h2>
<p>Google&apos;s 2026 ranking signals still reward fast LCP (Largest Contentful Paint) under 2.5 seconds on mobile. 
Product hero images often ARE the LCP element. Converting 800KB PNG heroes to 120KB WebP via <a href="{tool_href}">Image to WebP</a> 
can shave 0.8–1.2 seconds on 4G—enough to outrank slower competitors on long-tail SKU queries.</p>
<p>Add descriptive alt text with primary keywords, keep filenames readable (blue-cotton-kurta-front.jpg), and serve responsive srcset variants. 
Structured data for Product schema pairs well with optimized images in rich results.</p>""")
    if gtype == "special":
        sections.append(f"""<h2 id="deep-dive">Deep dive</h2>
<p>This topic deserves extra attention because small mistakes compound across entire catalogs. 
Meera Iyer runs a handicrafts label with 220 active Meesho listings. 
She batch-processes images every Sunday night, enforcing a checklist: 600×600 minimum, sRGB color profile, white or lifestyle background per SKU type, 
and file size under 50KB after compression. Tools like {tool_name} sit at step two—after RAW export, before final QA upload.</p>
<p>Document your own checklist in Notion or Google Sheets. Note which settings produced the best byte-to-quality ratio for each product category. 
Consistency beats one-off perfection when you scale past 50 SKUs.</p>""")

    sections.append(f"""<h2 id="tips">Pro tips for Indian sellers</h2>
<ul>
<li>Shoot in daylight or use a ₹1,500 LED ring light—editing cannot fix extreme underexposure.</li>
<li>Keep masters in a <code>/originals</code> folder; export <code>/marketplace</code> copies at platform specs.</li>
<li>Batch similar SKUs together so {tool_name} settings stay consistent.</li>
<li>After editing, always pass through <a href="/tools/image-compressor/">Image Compressor</a> if files exceed 2MB.</li>
<li>Re-audit listings quarterly—Meesho and Amazon update image guidelines without loud announcements.</li>
</ul>""")

    faqs = faq_items(slug, tool_name, tool_href, group)
    faq_html = '<h2 id="faq">Frequently asked questions</h2>'
    for q, a in faqs:
        faq_html += f'<div class="faq"><h3>{escape(q)}</h3><p>{escape(a)}</p></div>'

    sections.append(faq_html)
    sections.append(related_links(slug, group))
    sections.append(f"""<h2 id="conclusion">Conclusion</h2>
<p>High-quality marketplace images are a sales asset, not a cosmetic extra. 
{name.split()[0]}&apos;s turnaround—from rejected uploads to consistent 600×600, sub-50KB thumbnails—shows what happens when sellers treat {tool_name} as standard prep. 
Start with one problematic SKU today: open <a href="{tool_href}">{escape(tool_name)}</a>, run the five-step workflow, and compare before/after at full zoom.</p>
<div class="recommended-tools">
<h4>Recommended products</h4>
<!-- #affiliate-link-needed -->
<ul><li><a href="#affiliate-link-needed" rel="nofollow sponsored">Ring light for product photography (Amazon India)</a></li></ul>
</div>""")

    return "\n".join(sections)


def json_ld_schemas(slug: str, title: str, description: str, faqs: list[tuple[str, str]]) -> str:
    canonical = f"{SITE_ORIGIN}/guides/{slug}/"
    article = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": {"@type": "Organization", "name": "FastImageTool"},
        "publisher": {
            "@type": "Organization",
            "name": "FastImageTool",
            "logo": {"@type": "ImageObject", "url": f"{SITE_ORIGIN}/assets/favicon.png"},
        },
        "datePublished": "2026-05-01",
        "dateModified": "2026-06-08",
        "mainEntityOfPage": {"@type": "WebPage", "@id": canonical},
    }
    faq_page = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
            for q, a in faqs
        ],
    }
    return (
        f'<script type="application/ld+json">{json.dumps(article, ensure_ascii=False)}</script>\n'
        f'    <script type="application/ld+json">{json.dumps(faq_page, ensure_ascii=False)}</script>'
    )


def inline_cta(tool_name: str, tool_href: str) -> str:
    return (
        f'<div class="inline-tool-cta"><div class="cta-icon">🖼️</div>'
        f'<div class="cta-text"><strong>Try it free: {escape(tool_name)}</strong>'
        f'<span>Use our browser-based tool — no signup</span></div>'
        f'<a href="{tool_href}" class="cta-btn">Use Tool →</a></div>'
    )


def render_page(slug: str, title: str, group: str, template: str) -> str:
    tool_slug = group
    tool_name = TOOL_NAMES[group]
    tool_href = TOOL_PATHS[group]
    description = meta_description(title, tool_name)
    h1 = title.split("—")[0].strip() if "—" in title else title
    content = generate_content(slug, title, group)
    faqs = faq_items(slug, tool_name, tool_href, group)
    wc = word_count(content)
    read_time = max(5, min(15, wc // 200))
    canonical = f"{SITE_ORIGIN}/guides/{slug}/"
    schema = json_ld_schemas(slug, title, description, faqs)
    cta = inline_cta(tool_name, tool_href)

    page = template
    replacements = [
        ("Guide Template — FastImageTool", f"{escape(title)} — FastImageTool"),
        ("{{meta_description}}", escape(description)),
        ("{{canonical_url}}", canonical),
        ("{{h1}}", escape(h1)),
        ("{{read_time}}", str(read_time)),
        ("{{updated_date}}", "June 2026"),
        ("{{tool_slug}}", tool_slug),
        ("{{tool_name}}", escape(tool_name)),
        ("{{inline_cta}}", cta),
        ("{{content}}", content),
    ]
    for old, new in replacements:
        page = page.replace(old, new)

    # Inject JSON-LD before </head>
    page = page.replace("</head>", f"    {schema}\n</head>", 1)

    # Fix sidebar tool link to use mapped path (template uses /tools/{{tool_slug}}/ which is correct)
    page = page.replace(f'href="/tools/{tool_slug}/"', f'href="{tool_href}"')

    if wc < 1000:
        raise ValueError(f"{slug}: content only {wc} words (minimum 1000)")

    return page


def generate_sitemap_part5() -> None:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    urls = []
    for slug, _title, _group in GUIDES:
        loc = f"{SITE_ORIGIN}/guides/{slug}/"
        urls.append(
            f"  <url>\n    <loc>{loc}</loc>\n    <lastmod>{today}</lastmod>\n"
            f"    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>"
        )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>\n"
    )
    SITEMAP_PART5.write_text(xml, encoding="utf-8")
    print(f"Sitemap written: {SITEMAP_PART5.relative_to(ROOT)} ({len(GUIDES)} URLs)")


def cleanup_orphan_guide_dirs() -> int:
    """Remove subdirectory guides not in the Part 5 manifest."""
    valid = {slug for slug, _, _ in GUIDES}
    removed = 0
    for child in GUIDES_DIR.iterdir():
        if not child.is_dir():
            continue
        if child.name not in valid and (child / "index.html").exists():
            import shutil
            shutil.rmtree(child)
            removed += 1
            print(f"  REMOVED orphan guides/{child.name}/")
    return removed


def main() -> None:
    if len(GUIDES) != 120:
        raise SystemExit(f"Expected 120 guides, got {len(GUIDES)}")

    cleanup_orphan_guide_dirs()

    template = TEMPLATE_FILE.read_text(encoding="utf-8")
    generated = 0
    errors: list[str] = []
    first_wc = 0

    for slug, title, group in GUIDES:
        out_dir = GUIDES_DIR / slug
        out_path = out_dir / "index.html"
        try:
            html = render_page(slug, title, group, template)
            out_dir.mkdir(parents=True, exist_ok=True)
            out_path.write_text(html, encoding="utf-8")
            generated += 1
            if slug == GUIDES[0][0]:
                first_wc = word_count(generate_content(slug, title, group))
            print(f"  OK  guides/{slug}/index.html")
        except Exception as exc:
            errors.append(f"{slug}: {exc}")
            print(f"  ERR guides/{slug}/index.html — {exc}")

    generate_sitemap_part5()

    print(f"\nGenerated: {generated}/{len(GUIDES)} guides")
    print(f"First guide ({GUIDES[0][0]}) article word count: {first_wc}")
    if errors:
        print(f"Errors ({len(errors)}):")
        for e in errors:
            print(f"  - {e}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
