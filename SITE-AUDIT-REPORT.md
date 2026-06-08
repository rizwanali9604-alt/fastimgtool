# FASTIMGTOOL AUDIT

**Audit date:** 2026-06-08  
**Project:** fastimgtool.com  
**Scope:** Full project scan (excluding `guides_backup/` from primary counts; noted separately)

---

```
FASTIMGTOOL AUDIT:
[x] Total HTML files found: 188 (see full list below)
    Note: guides_backup/ contains 180 additional HTML files (legacy/backup guides)
[x] Files where {{title}} appears literally: none
    Note: templates/ use other placeholders ({{description}}, {{slug}}, {{h1}}) but NOT {{title}}
[x] Files missing AdSense script tag: 1
    - googleb8199118b9c9cbcb.html (Google Search Console verification file — no <head> nav)
    CRITICAL: 185 files have AdSense script with WRONG publisher ID
    (ca-pub-8332278513903196 instead of ca-pub-8332278513903196)
    Only 2 files have the CORRECT ID: nav-tools.html, tools/image-resizer/index.html
[x] Files with canonical https:/ (single slash): none
[x] Files where nav differs from standard: 3
    - googleb8199118b9c9cbcb.html (verification file, no site nav)
    - nav-tools.html (partial nav fragment, not standard nav block)
    - scripts/pin_helper.html (internal helper, no standard nav)
    All other 185 pages with <nav> have structurally correct standard nav
    (nav-inner, All Tools, Guides, Blog, Recommended, Compress Free CTA)
[x] Tools with broken or missing upload interface: none detected in codebase
    tools/image-resizer/index.html has full upload + resize + download UI
    All 24 active tool pages have upload-area, file input, or tool.js
    tools/index.html is a listing page (no upload expected)
    tools/test-tool/ exists as extra test page
[x] Files in guides/ directory: 127 (.html files including guides/index.html)
    Format: flat .html files (e.g. guides/how-to-compress-image-online.html)
    NOT the 120 subdirectory guides specified in build prompt
    (e.g. guides/image-compressor-how-to/index.html does not exist)
[x] Does sitemap.xml exist? Y
    Current URL count: 169 (needs replacement per Part 7 spec: 148 URLs)
[x] Does guides/index.html exist? Y
    Lists 126 flat guide pages (not 120 new-format guides)
[x] Does tools/index.html exist? Y
[x] Does about/index.html or about.html exist? about.html Y / about/index.html N
[x] Does privacy/index.html or privacy.html exist? privacy.html Y / privacy/index.html N
```

---

## Additional Findings

### Tool slug mismatches (prompt spec vs current site)

**14 expected tool slugs missing from `/tools/`:**
webp-to-png, blur-image, sharpen-image, brightness-contrast, grayscale, sepia, invert-colors, saturation, crop-image, watermark-image, image-to-bmp, image-to-gif, hue-rotate, image-to-tiff

**15 extra/different tool slugs present:**
bmp-to-jpg, gif-to-png, image-blur, image-brightness, image-contrast, image-crop, image-grayscale, image-invert, image-saturation, image-sepia, image-sharpen, png-to-webp, test-tool, tiff-to-jpg, webp-to-jpg

### Homepage tool cards
- `index.html` has 24 static `tool-card` elements in `.tools-grid` (not JS-rendered)
- Slugs/names differ from Part 1D spec (e.g. `webp-to-jpg` vs `webp-to-png`, `image-blur` vs `blur-image`, `bmp-to-jpg` vs `image-to-bmp`, `gif-to-png` vs `image-to-gif`, `tiff-to-jpg` vs `image-to-tiff`)
- Missing from homepage cards: watermark-image, hue-rotate
- Extra on homepage: png-to-webp, brightness+contrast as separate tools

### Affiliate CTAs
- Present on all 25 tool pages under `/tools/*/index.html`

### Schema markup
- WebApplication schema on 24 tool pages
- Missing on: tools/test-tool/index.html

### AdSense publisher ID typo
185 files use `ca-pub-8332278513903196` (wrong — extra 9 in ID)  
Correct ID per spec: `ca-pub-8332278513903196`

---

## Complete HTML File List (188 files)

```
about.html
affiliate/index.html
blog/batch-image-processing-tips.html
blog/first-post.html
blog/how-to-compress-images-for-email.html
blog/how-to-create-a-favicon.html
blog/how-to-resize-images-for-social-media.html
blog/image-compression-best-practices.html
blog/image-file-formats-explained.html
blog/image-seo-guide.html
blog/index.html
blog/remove-background-from-image.html
blog/webp-vs-jpg-vs-png.html
community.html
compress-image-online-free.html
contact.html
convert-jpg-to-png-online-free.html
faq.html
googleb8199118b9c9cbcb.html
guides/amazon-india-product-image-requirements.html
guides/base64-to-image-common-mistakes.html
guides/base64-to-image-for-amazon-listings.html
guides/base64-to-image-for-meesho-sellers.html
guides/base64-to-image-for-social-media.html
guides/batch-convert-jpg-to-png.html
guides/batch-convert-png-to-jpg.html
guides/batch-convert-webp-to-jpg.html
guides/blur-face-in-image.html
guides/blur-image-background.html
guides/blur-image-for-privacy.html
guides/bmp-to-jpg-common-mistakes.html
guides/bmp-to-jpg-for-amazon-listings.html
guides/bmp-to-jpg-for-meesho-sellers.html
guides/bmp-to-jpg-for-social-media.html
guides/compress-image-for-email.html
guides/compress-image-for-website.html
guides/compress-image-for-whatsapp.html
guides/compress-image-without-losing-quality.html
guides/convert-image-to-black-and-white.html
guides/convert-jpg-to-png-for-printing.html
guides/convert-jpg-to-png-for-web.html
guides/convert-jpg-to-png-with-transparency.html
guides/convert-photo-to-black-and-white.html
guides/convert-png-to-jpg-for-email.html
guides/convert-png-to-jpg-for-website.html
guides/convert-png-to-jpg-with-white-background.html
guides/convert-webp-to-jpg.html
guides/convert-webp-to-jpg-for-email.html
guides/convert-webp-to-jpg-for-wordpress.html
guides/crop-image-aspect-ratio.html
guides/crop-image-for-passport.html
guides/crop-image-for-website.html
guides/crop-image-to-square.html
guides/flip-image-for-design.html
guides/flip-image-horizontally.html
guides/flip-image-vertically.html
guides/flip-vs-rotate.html
guides/gaussian-blur-vs-motion-blur.html
guides/gif-to-png-common-mistakes.html
guides/gif-to-png-for-amazon-listings.html
guides/gif-to-png-for-meesho-sellers.html
guides/gif-to-png-for-social-media.html
guides/grayscale-vs-sepia.html
guides/heic-to-jpg-common-mistakes.html
guides/heic-to-jpg-for-amazon-listings.html
guides/heic-to-jpg-for-meesho-sellers.html
guides/heic-to-jpg-for-social-media.html
guides/how-to-adjust-image-brightness-online.html
guides/how-to-adjust-image-contrast-online.html
guides/how-to-adjust-image-saturation-online.html
guides/how-to-apply-sepia-filter-online.html
guides/how-to-blur-image-online.html
guides/how-to-compress-image-online.html
guides/how-to-convert-image-to-base64.html
guides/how-to-convert-image-to-grayscale.html
guides/how-to-convert-image-to-webp.html
guides/how-to-convert-jpg-to-png.html
guides/how-to-convert-png-to-jpg.html
guides/how-to-convert-png-to-webp.html
guides/how-to-convert-webp-to-jpg.html
guides/how-to-crop-image-online.html
guides/how-to-flip-image-online.html
guides/how-to-invert-image-colors-online.html
guides/how-to-resize-image-online.html
guides/how-to-rotate-image-online.html
guides/how-to-sharpen-image-online.html
guides/how-to-use-base64-to-image.html
guides/how-to-use-bmp-to-jpg.html
guides/how-to-use-gif-to-png.html
guides/how-to-use-heic-to-jpg.html
guides/how-to-use-test-tool.html
guides/how-to-use-tiff-to-jpg.html
guides/image-brightness-common-mistakes.html
guides/image-brightness-for-amazon-listings.html
guides/image-brightness-for-meesho-sellers.html
guides/image-brightness-for-social-media.html
guides/image-contrast-common-mistakes.html
guides/image-contrast-for-amazon-listings.html
guides/image-contrast-for-meesho-sellers.html
guides/image-contrast-for-social-media.html
guides/image-invert-common-mistakes.html
guides/image-invert-for-amazon-listings.html
guides/image-invert-for-meesho-sellers.html
guides/image-invert-for-social-media.html
guides/image-saturation-common-mistakes.html
guides/image-saturation-for-amazon-listings.html
guides/image-saturation-for-meesho-sellers.html
guides/image-saturation-for-social-media.html
guides/image-sepia-common-mistakes.html
guides/image-sepia-for-amazon-listings.html
guides/image-sepia-for-meesho-sellers.html
guides/image-sepia-for-social-media.html
guides/image-to-base64-common-mistakes.html
guides/image-to-base64-for-amazon-listings.html
guides/image-to-base64-for-meesho-sellers.html
guides/image-to-base64-for-social-media.html
guides/image-to-webp-common-mistakes.html
guides/image-to-webp-for-amazon-listings.html
guides/image-to-webp-for-meesho-sellers.html
guides/image-to-webp-for-social-media.html
guides/index.html
guides/meesho-product-image-size-600x600-under-50kb.html
guides/png-to-webp-common-mistakes.html
guides/png-to-webp-for-amazon-listings.html
guides/png-to-webp-for-meesho-sellers.html
guides/png-to-webp-for-social-media.html
guides/resize-image-for-email.html
guides/resize-image-for-facebook-cover.html
guides/resize-image-for-instagram.html
guides/resize-image-for-youtube-thumbnail.html
guides/resize-image-online.html
guides/rotate-image-180-degrees.html
guides/rotate-image-90-degrees.html
guides/rotate-image-counterclockwise.html
guides/rotate-image-for-social-media.html
guides/sharpen-blurry-photos.html
guides/sharpen-image-for-print.html
guides/sharpen-image-for-social-media.html
guides/shopify-product-images-webp-compression.html
guides/tiff-to-jpg-common-mistakes.html
guides/tiff-to-jpg-for-amazon-listings.html
guides/tiff-to-jpg-for-meesho-sellers.html
guides/tiff-to-jpg-for-social-media.html
guides/unsharp-mask-explained.html
guides/webp-vs-jpg-which-is-better.html
guides/why-use-grayscale-images.html
how-to-convert-jpg-to-png-online-free.html
image-resizer.html
index.html
nav-tools.html
newsletter.html
png-to-jpg-converter.html
privacy.html
resize-image-online-free.html
scripts/pin_helper.html
templates/blog-template.html
templates/guides-listing-template.html
templates/guide-template.html
templates/tools-listing-template.html
templates/tool-template.html
terms.html
tools/base64-to-image/index.html
tools/bmp-to-jpg/index.html
tools/flip-image/index.html
tools/gif-to-png/index.html
tools/heic-to-jpg/index.html
tools/image-blur/index.html
tools/image-brightness/index.html
tools/image-compressor/index.html
tools/image-contrast/index.html
tools/image-crop/index.html
tools/image-grayscale/index.html
tools/image-invert/index.html
tools/image-resizer/index.html
tools/image-saturation/index.html
tools/image-sepia/index.html
tools/image-sharpen/index.html
tools/image-to-base64/index.html
tools/image-to-webp/index.html
tools/index.html
tools/jpg-to-png/index.html
tools/png-to-jpg/index.html
tools/png-to-webp/index.html
tools/rotate-image/index.html
tools/test-tool/index.html
tools/tiff-to-jpg/index.html
tools/webp-to-jpg/index.html
webp-to-jpg-converter.html
```

---

## Files with Wrong AdSense Publisher ID (185 files)

All files below have `ca-pub-8332278513903196` instead of correct `ca-pub-8332278513903196`:

about.html, affiliate/index.html, blog/* (11 files), community.html, compress-image-online-free.html, contact.html, convert-jpg-to-png-online-free.html, faq.html, how-to-convert-jpg-to-png-online-free.html, image-resizer.html, index.html, newsletter.html, png-to-jpg-converter.html, privacy.html, resize-image-online-free.html, scripts/pin_helper.html, templates/* (5 files), terms.html, webp-to-jpg-converter.html, guides/* (126 files), tools/* (24 files except image-resizer)

---

**END OF AUDIT — Awaiting PROCEED**
