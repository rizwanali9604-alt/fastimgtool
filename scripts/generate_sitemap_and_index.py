#!/usr/bin/env python3
"""Generate sitemap.xml (Part 7) and guides/index.html (Part 6) with actual tool slugs."""
from pathlib import Path
import importlib.util

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://fastimgtool.com"
LASTMOD = "2026-06-08"

TOOLS = [
    "image-compressor", "image-resizer", "jpg-to-png", "png-to-jpg", "image-to-webp",
    "webp-to-jpg", "image-blur", "image-sharpen", "image-brightness", "image-contrast",
    "image-grayscale", "image-sepia", "image-invert", "image-saturation", "image-crop",
    "rotate-image", "flip-image", "image-to-base64", "base64-to-image", "heic-to-jpg",
    "bmp-to-jpg", "gif-to-png", "png-to-webp", "tiff-to-jpg",
]

TOOL_SECTIONS = [
    ("Image Compressor", "image-compressor", [
        "image-compressor-how-to", "image-compressor-best-practices", "image-compressor-vs-alternatives",
        "image-compressor-use-cases", "image-compressor-for-sellers",
    ]),
    ("Image Resizer", "image-resizer", [
        "image-resizer-how-to", "image-resizer-best-practices", "image-resizer-vs-alternatives",
        "image-resizer-use-cases", "image-resizer-for-sellers",
    ]),
    ("JPG to PNG", "jpg-to-png", [
        "jpg-to-png-how-to", "jpg-to-png-when-to-use", "jpg-to-png-vs-alternatives",
        "jpg-to-png-use-cases", "jpg-to-png-for-sellers",
    ]),
    ("PNG to JPG", "png-to-jpg", [
        "png-to-jpg-how-to", "png-to-jpg-best-practices", "png-to-jpg-when-to-use",
        "png-to-jpg-use-cases", "png-to-jpg-for-sellers",
    ]),
    ("Image to WebP", "image-to-webp", [
        "image-to-webp-how-to", "webp-seo-benefits", "webp-vs-jpg-vs-png",
        "webp-use-cases", "webp-for-shopify-sellers",
    ]),
    ("WebP to PNG", "webp-to-png", [
        "webp-to-png-how-to", "webp-compatibility-guide", "webp-to-png-vs-alternatives",
        "webp-to-png-use-cases", "webp-to-png-for-designers",
    ]),
    ("Blur Image", "blur-image", [
        "blur-image-how-to", "background-blur-guide", "blur-vs-alternatives",
        "blur-image-use-cases", "blur-image-for-privacy",
    ]),
    ("Sharpen Image", "sharpen-image", [
        "sharpen-image-how-to", "sharpen-product-photos", "sharpen-vs-alternatives",
        "sharpen-image-use-cases", "sharpen-image-for-sellers",
    ]),
    ("Brightness & Contrast", "brightness-contrast", [
        "brightness-contrast-how-to", "product-photo-lighting-fix", "brightness-vs-alternatives",
        "brightness-contrast-use-cases", "brightness-for-sellers",
    ]),
    ("Grayscale", "grayscale", [
        "grayscale-how-to", "grayscale-photography-guide", "grayscale-vs-alternatives",
        "grayscale-use-cases", "grayscale-for-instagram",
    ]),
    ("Sepia Effect", "sepia", [
        "sepia-effect-how-to", "vintage-photo-guide", "sepia-vs-grayscale",
        "sepia-use-cases", "sepia-for-social-media",
    ]),
    ("Invert Colors", "invert-colors", [
        "invert-colors-how-to", "negative-effect-guide", "invert-colors-use-cases",
        "invert-colors-for-dark-mode", "invert-colors-creative",
    ]),
    ("Saturation", "saturation", [
        "saturation-how-to", "color-enhancement-guide", "saturation-vs-alternatives",
        "saturation-use-cases", "saturation-for-sellers",
    ]),
    ("Crop Image", "crop-image", [
        "crop-image-how-to", "crop-ratios-guide", "crop-vs-alternatives",
        "crop-image-use-cases", "crop-for-social-media",
    ]),
    ("Rotate Image", "rotate-image", [
        "rotate-image-how-to", "fix-photo-orientation", "rotate-vs-alternatives",
        "rotate-image-use-cases", "rotate-for-sellers",
    ]),
    ("Flip Image", "flip-image", [
        "flip-image-how-to", "mirror-image-guide", "flip-vs-rotate",
        "flip-image-use-cases", "flip-for-product-photos",
    ]),
    ("Watermark Image", "watermark", [
        "watermark-how-to", "watermark-best-practices", "watermark-vs-alternatives",
        "watermark-use-cases", "watermark-for-sellers",
    ]),
    ("Image to Base64", "image-to-base64", [
        "image-to-base64-how-to", "base64-explained", "base64-use-cases",
        "base64-in-html-css", "base64-for-beginners",
    ]),
    ("Base64 to Image", "base64-to-image", [
        "base64-to-image-how-to", "decode-base64-guide", "base64-decode-use-cases",
        "base64-to-image-debugging", "base64-download-guide",
    ]),
    ("HEIC to JPG", "heic-to-jpg", [
        "heic-to-jpg-how-to", "heic-format-explained", "heic-compatibility-guide",
        "heic-vs-jpg", "heic-for-sellers",
    ]),
    ("Image to BMP", "image-to-bmp", [
        "image-to-bmp-how-to", "bmp-format-explained", "bmp-vs-jpg-vs-png",
        "bmp-use-cases", "bmp-for-windows-developers",
    ]),
    ("Image to GIF", "image-to-gif", [
        "image-to-gif-how-to", "gif-format-guide", "gif-vs-png-vs-webp",
        "gif-use-cases", "gif-for-social-media",
    ]),
    ("Hue Rotate", "hue-rotate", [
        "hue-rotate-how-to", "color-theory-for-images", "hue-rotate-use-cases",
        "hue-rotate-for-branding", "hue-rotate-creative",
    ]),
    ("Image to TIFF", "image-to-tiff", [
        "image-to-tiff-how-to", "tiff-format-explained", "tiff-vs-jpg-vs-png",
        "tiff-use-cases", "tiff-for-printing",
    ]),
]

GUIDE_TITLES = {
    "image-compressor-how-to": "How to Compress Images Online for Free — Step by Step Guide",
    "image-compressor-best-practices": "Image Compression Best Practices for Ecommerce Sellers",
    "image-compressor-vs-alternatives": "FastImageTool vs TinyPNG vs Squoosh — Best Free Image Compressor?",
    "image-compressor-use-cases": "10 Best Uses for Image Compression in 2026",
    "image-compressor-for-sellers": "Image Compression for Meesho and Amazon Sellers — Complete Guide",
    "image-resizer-how-to": "How to Resize Images Online Free — Complete Tutorial",
    "image-resizer-best-practices": "Image Resizing Best Practices for Product Photography",
    "image-resizer-vs-alternatives": "Free Image Resizer Tools Compared — Which Is Best in 2026?",
    "image-resizer-use-cases": "10 Times You Need an Image Resizer (With Examples)",
    "image-resizer-for-sellers": "Image Resizing for Meesho Sellers — 600x600 and 500x500 Guide",
    "jpg-to-png-how-to": "How to Convert JPG to PNG Online — Free and Instant",
    "jpg-to-png-when-to-use": "When to Use PNG Instead of JPG — Complete Guide",
    "jpg-to-png-vs-alternatives": "Best Free JPG to PNG Converters Online in 2026",
    "jpg-to-png-use-cases": "10 Reasons to Convert JPG to PNG (With Examples)",
    "jpg-to-png-for-sellers": "JPG vs PNG for Product Images — Which Format for Sellers?",
    "png-to-jpg-how-to": "How to Convert PNG to JPG Online Free — Step by Step",
    "png-to-jpg-best-practices": "PNG to JPG Conversion Best Practices — Avoid Quality Loss",
    "png-to-jpg-when-to-use": "When to Convert PNG to JPG — Size vs Quality Guide",
    "png-to-jpg-use-cases": "10 Best Use Cases for PNG to JPG Conversion",
    "png-to-jpg-for-sellers": "Best Image Format for Amazon Listings — PNG or JPG?",
    "image-to-webp-how-to": "How to Convert Images to WebP Format Free — Tutorial",
    "webp-seo-benefits": "WebP Format SEO Benefits — How to Speed Up Your Website",
    "webp-vs-jpg-vs-png": "WebP vs JPG vs PNG — Which Format Is Best in 2026?",
    "webp-use-cases": "10 Reasons to Convert Images to WebP Format",
    "webp-for-shopify-sellers": "WebP Images for Shopify — Speed Up Your Store Guide",
    "webp-to-png-how-to": "How to Convert WebP to PNG Free Online",
    "webp-compatibility-guide": "WebP Compatibility Guide — When PNG Works Better",
    "webp-to-png-vs-alternatives": "Best Free WebP to PNG Converters Compared",
    "webp-to-png-use-cases": "When to Convert WebP Back to PNG — 5 Real Scenarios",
    "webp-to-png-for-designers": "WebP to PNG for Designers — Editing Workflow Guide",
    "blur-image-how-to": "How to Blur an Image Online Free — Complete Guide",
    "background-blur-guide": "How to Blur Background in Product Photos — Seller Guide",
    "blur-vs-alternatives": "Best Free Image Blur Tools Online in 2026 Compared",
    "blur-image-use-cases": "10 Creative Uses for Image Blur Effect",
    "blur-image-for-privacy": "How to Blur Sensitive Information in Images — Privacy Guide",
    "sharpen-image-how-to": "How to Sharpen Blurry Images Online Free",
    "sharpen-product-photos": "How to Sharpen Product Photos for Amazon and Meesho",
    "sharpen-vs-alternatives": "Best Free Image Sharpening Tools Compared 2026",
    "sharpen-image-use-cases": "When to Sharpen Images — 8 Real Use Cases Explained",
    "sharpen-image-for-sellers": "Sharpen Product Images to Increase Sales — Seller Guide",
    "brightness-contrast-how-to": "How to Adjust Image Brightness and Contrast Free Online",
    "product-photo-lighting-fix": "Fix Dark Product Photos — Brightness and Contrast Guide",
    "brightness-vs-alternatives": "Best Free Brightness Adjustment Tools Online Compared",
    "brightness-contrast-use-cases": "10 Ways to Use Brightness and Contrast Adjustment",
    "brightness-for-sellers": "Improve Product Photo Exposure for Better Conversions",
    "grayscale-how-to": "How to Convert Image to Black and White Free Online",
    "grayscale-photography-guide": "Black and White Photography — When and Why to Use Grayscale",
    "grayscale-vs-alternatives": "Best Free Grayscale Image Converters in 2026",
    "grayscale-use-cases": "10 Creative Uses for Grayscale Images in 2026",
    "grayscale-for-instagram": "Black and White Instagram Photos — Complete Creator Guide",
    "sepia-effect-how-to": "How to Add Sepia Effect to Photos Free Online",
    "vintage-photo-guide": "Create Vintage Photo Effect — Sepia and Film Look Guide",
    "sepia-vs-grayscale": "Sepia vs Grayscale — Which Vintage Effect Is Better?",
    "sepia-use-cases": "10 Creative Uses for Sepia Photo Effect",
    "sepia-for-social-media": "Vintage Filter for Instagram and Pinterest — Sepia Guide",
    "invert-colors-how-to": "How to Invert Image Colors Online Free",
    "negative-effect-guide": "Create Photo Negative Effect — Invert Colors Guide",
    "invert-colors-use-cases": "10 Uses for Inverted Colors in Design and Photography",
    "invert-colors-for-dark-mode": "Invert Images for Dark Mode Design — Developer Guide",
    "invert-colors-creative": "Creative Photography with Color Inversion — Tutorial",
    "saturation-how-to": "How to Adjust Image Saturation Online Free",
    "color-enhancement-guide": "Make Product Colors Pop — Saturation Enhancement Guide",
    "saturation-vs-alternatives": "Best Free Saturation Adjustment Tools Online 2026",
    "saturation-use-cases": "10 Ways to Use Saturation Adjustment for Better Photos",
    "saturation-for-sellers": "Enhance Product Colors for More Sales — Saturation Guide",
    "crop-image-how-to": "How to Crop Images Online Free — Step by Step",
    "crop-ratios-guide": "Image Crop Ratios Explained — 1:1, 16:9, 4:3 and More",
    "crop-vs-alternatives": "Best Free Online Image Cropping Tools Compared 2026",
    "crop-image-use-cases": "10 Essential Image Cropping Scenarios with Examples",
    "crop-for-social-media": "Crop Images for Every Social Platform — Size Guide 2026",
    "rotate-image-how-to": "How to Rotate Images Online Free — Any Angle",
    "fix-photo-orientation": "Fix Sideways Photos — Image Rotation Complete Guide",
    "rotate-vs-alternatives": "Best Free Image Rotation Tools Online Compared",
    "rotate-image-use-cases": "When to Rotate Images — 8 Common Scenarios Explained",
    "rotate-for-sellers": "Fix Product Photo Orientation for Amazon and Meesho",
    "flip-image-how-to": "How to Flip an Image Horizontally or Vertically Free",
    "mirror-image-guide": "Create Mirror Image Effect — Complete Flip Guide",
    "flip-vs-rotate": "Flip vs Rotate — What Is the Difference and When to Use",
    "flip-image-use-cases": "10 Creative Uses for Flipped and Mirrored Images",
    "flip-for-product-photos": "Flip Product Images for Better Presentation — Seller Guide",
    "watermark-how-to": "How to Add Watermark to Images Free Online",
    "watermark-best-practices": "Image Watermarking Best Practices — Protect Your Photos",
    "watermark-vs-alternatives": "Best Free Watermark Tools Online Compared 2026",
    "watermark-use-cases": "When to Watermark Images — 8 Important Use Cases",
    "watermark-for-sellers": "Watermark Product Images to Protect Your Brand Online",
    "image-to-base64-how-to": "How to Convert Image to Base64 String Free Online",
    "base64-explained": "What Is Base64 Encoding? Complete Developer Guide",
    "base64-use-cases": "10 Use Cases for Base64 Image Encoding in Web Dev",
    "base64-in-html-css": "How to Embed Images in HTML and CSS Using Base64",
    "base64-for-beginners": "Base64 Encoding for Beginners — Simple Explanation",
    "base64-to-image-how-to": "How to Convert Base64 to Image Free Online",
    "decode-base64-guide": "Decode Base64 Images — Step by Step Developer Guide",
    "base64-decode-use-cases": "When You Need to Decode Base64 Images — 6 Scenarios",
    "base64-to-image-debugging": "Debug Base64 Images in Your Web App — Guide",
    "base64-download-guide": "Download Base64 Encoded Images — Complete Tutorial",
    "heic-to-jpg-how-to": "How to Convert HEIC to JPG Free Online — iPhone Photos",
    "heic-format-explained": "What Is HEIC Format? iPhone Photo Format Explained",
    "heic-compatibility-guide": "HEIC Compatibility Issues — How to Fix on Windows and Android",
    "heic-vs-jpg": "HEIC vs JPG — Which Is Better for iPhone Photos?",
    "heic-for-sellers": "Convert iPhone Product Photos from HEIC to JPG — Guide",
    "image-to-bmp-how-to": "How to Convert Images to BMP Format Free Online",
    "bmp-format-explained": "What Is BMP Format? Complete Guide to Bitmap Images",
    "bmp-vs-jpg-vs-png": "BMP vs JPG vs PNG — Choosing the Right Image Format",
    "bmp-use-cases": "When to Use BMP Format — 6 Specific Use Cases",
    "bmp-for-windows-developers": "BMP Images for Windows Development — Complete Guide",
    "image-to-gif-how-to": "How to Convert Image to GIF Free Online",
    "gif-format-guide": "Complete Guide to GIF Format — Everything You Need to Know",
    "gif-vs-png-vs-webp": "GIF vs PNG vs WebP for Web Use — 2026 Guide",
    "gif-use-cases": "10 Best Uses for GIF Images in 2026",
    "gif-for-social-media": "GIF Images for Social Media — Creation and Optimization",
    "hue-rotate-how-to": "How to Change Image Colors with Hue Rotation Free",
    "color-theory-for-images": "Color Theory for Image Editing — Hue and Saturation Guide",
    "hue-rotate-use-cases": "10 Creative Uses for Hue Rotation in Design",
    "hue-rotate-for-branding": "Color Variants for Brand Images — Hue Rotation Guide",
    "hue-rotate-creative": "Create Color Variants of Product Images — Designer Guide",
    "image-to-tiff-how-to": "How to Convert Images to TIFF Format Free Online",
    "tiff-format-explained": "What Is TIFF Format? Complete Guide for Photographers",
    "tiff-vs-jpg-vs-png": "TIFF vs JPG vs PNG — Best Format for Print Quality",
    "tiff-use-cases": "When to Use TIFF Format — 6 Professional Use Cases",
    "tiff-for-printing": "TIFF Images for Professional Printing — Complete Guide",
}

NAV = """  <nav class="nav">
    <div class="nav-inner">
      <a href="/" class="nav-logo">⚡ FastImageTool</a>
      <div class="nav-links">
        <a href="/tools/" class="nav-link">All Tools</a>
        <a href="/guides/" class="nav-link">Guides</a>
        <a href="/blog/" class="nav-link">Blog</a>
        <a href="/affiliate/" class="nav-link">Recommended</a>
        <a href="/tools/image-compressor/" class="nav-cta">
          Compress Free →
        </a>
      </div>
      <button class="nav-toggle" aria-label="Toggle menu">☰</button>
    </div>
  </nav>"""

ADSENSE = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8332278513903196" crossorigin="anonymous"></script>'


def all_guide_slugs():
    slugs = []
    for _name, _group, items in TOOL_SECTIONS:
        slugs.extend(items)
    return slugs


def write_sitemap():
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    entries = [
        (f"{SITE}/", "1.0", "weekly"),
        (f"{SITE}/tools/", "0.9", "weekly"),
        (f"{SITE}/guides/", "0.9", "weekly"),
    ]
    for slug in TOOLS:
        entries.append((f"{SITE}/tools/{slug}/", "0.8", "monthly"))
    for slug in all_guide_slugs():
        entries.append((f"{SITE}/guides/{slug}/", "0.7", "monthly"))
    for loc, priority, freq in entries:
        lines.append(f"  <url><loc>{loc}</loc><priority>{priority}</priority><changefreq>{freq}</changefreq><lastmod>{LASTMOD}</lastmod></url>")
    lines.append("</urlset>")
    out = ROOT / "sitemap.xml"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"sitemap.xml: {len(entries)} URLs")


def write_guides_index():
    sections_html = []
    for tool_name, _group, slugs in TOOL_SECTIONS:
        items = "\n".join(
            f'          <li><a href="/guides/{s}/">{GUIDE_TITLES[s]}</a></li>'
            for s in slugs
        )
        sections_html.append(f"""      <section class="guides-index-section">
        <h2>{tool_name}</h2>
        <ul>
{items}
        </ul>
      </section>""")
    body = "\n".join(sections_html)
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Image Optimization Guides — FastImageTool</title>
  <meta name="description" content="120 free image optimization guides for Meesho sellers, Amazon sellers, designers, and developers.">
  <link rel="canonical" href="{SITE}/guides/">
  <link rel="stylesheet" href="/assets/css/style.css">
  {ADSENSE}
</head>
<body>
{NAV}
  <header class="guide-header">
    <div class="container">
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <a href="/">Home</a> → <span>Guides</span>
      </nav>
      <h1>Free Image Optimization Guides</h1>
      <p class="guide-subtitle">120 guides for ecommerce sellers, designers, and developers</p>
    </div>
  </header>
  <main class="container" style="padding:32px 20px;">
{body}
  </main>
  <footer class="footer">
    <div class="container">
      <p>© 2026 FastImageTool — Free image tools for everyone</p>
      <nav>
        <a href="/about.html">About</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/tools/">All Tools</a>
        <a href="/guides/">Guides</a>
      </nav>
    </div>
  </footer>
</body>
</html>"""
    (ROOT / "guides" / "index.html").write_text(html, encoding="utf-8")
    print("guides/index.html written")


if __name__ == "__main__":
    write_sitemap()
    write_guides_index()
