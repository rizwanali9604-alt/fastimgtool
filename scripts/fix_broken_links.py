import os
import re
import csv
from bs4 import BeautifulSoup

# Define corrections (broken -> fixed)
# You can add more entries based on your review
CORRECTIONS = {
    '/newsletter-signup': '/newsletter.html',
    '/signup': '/newsletter.html',
    '/newsletter-signup/': '/newsletter.html',
    '/signup/': '/newsletter.html',
    '/newsletter': '/newsletter.html',
    '/privacy-policy': '/privacy-policy.html',
    '/privacy-policy/': '/privacy-policy.html',
    '/contact': '/contact.html',
    '/contact/': '/contact.html',
    '/about': '/about.html',
    '/about/': '/about.html',
    '/support': '/contact.html',
    '/support/': '/contact.html',
    '/knowledge-base': '/guides/',
    '/knowledge-base/': '/guides/',
    '/community/forum': '/contact.html',
    '/community/forum/': '/contact.html',
    '/pricing': '/',
    '/pricing/': '/',
    '/tools/test-tool/docs/': '/tools/test-tool/',
    '/tools/test-tool/settings/': '/tools/test-tool/',
    '/tools/test-tool/dashboard': '/tools/test-tool/',
    '/tools/test-tool/signup/': '/tools/test-tool/',
    '/api/document-generation': '/',
    '/tools/html-to-pdf-converter': '/tools/',
    '/tools/pdf-to-word': '/tools/',
    '/tools/png-optimizer': '/tools/',
    '/tools/video-compressor': '/tools/',
    '/tools/video-resizer': '/tools/',
    '/tools/ai-image-resizer': '/tools/image-resizer',
    '/tools/ai-image-editor': '/tools/',
    '/tools/ai-image-sharpener': '/tools/image-sharpen',
    '/tools/batch-image-resizer': '/tools/batch-convert',
    '/tools/bulk-image-resizer': '/tools/batch-convert',
    '/tools/bulk-media-converter': '/tools/batch-convert',
    '/tools/bulk-compressor': '/tools/image-compressor',
    '/tools/batch-processor': '/tools/batch-convert',
    '/tools/canva-alternative': '/',
    '/tools/online-image-editor': '/tools/',
    '/tools/background-remover': '/tools/image-blur',  # placeholder
    '/tools/background-blur-tool': '/tools/image-blur',
    '/tools/product-photo-suite': '/tools/',
    '/tools/passport-photo-cropper': '/tools/crop-image',
    '/tools/photo-editor': '/tools/',
    '/tools/photo-to-grayscale': '/tools/image-grayscale',
    '/tools/page-speed-analyzer': '/',
    '/tools/black-white-converter': '/tools/image-grayscale',
    '/tools/image-optimizer': '/tools/image-compressor',
    '/tools/image-enlarger': '/tools/image-resizer',
    '/tools/image-upscaler': '/tools/image-resizer',
    '/tools/adjust-saturation': '/tools/image-saturation',
    '/tools/ecommerce-image-editor': '/tools/',
    '/tools/compress-image': '/tools/image-compressor',
    '/tools/color-converter': '/tools/',
    '/tools/ratio-calculator': '/tools/crop-image',
    '/tools/image-flipper': '/tools/flip-image',
    '/tools/image-rotator': '/tools/rotate-image',
    '/tools/image-cropper': '/tools/crop-image',
    '/tools/thumbnail-maker': '/tools/',
    '/tools/youtube-thumbnail-maker': '/tools/',
    '/tools/advanced-editor': '/tools/',
    '/tools/convert-image': '/tools/',
    '/tools/crop-image': '/tools/',
    '/tools/jpg-to-webp': '/tools/',
    '/tools/pixelate-image': '/tools/image-blur',
    '/tools/image-editor': '/tools/',
    '/tools/image-converter': '/tools/',
    '/tools/grayscale-converter': '/tools/image-grayscale',
    '/image-editor': '/tools/',
    '/image-tools': '/tools/',
    '/image-compressor': '/tools/image-compressor',
    '/batch-processor': '/tools/batch-convert',
    '/crop-image': '/tools/crop-image',
    '/flip-image-tool': '/tools/flip-image',
    '/rotate-image-tool': '/tools/rotate-image',
    '/square-crop-tool': '/tools/crop-image',
    '/image-cropper': '/tools/crop-image',
    '/image-rotator': '/tools/rotate-image',
    '/image-sharpener': '/tools/image-sharpen',
    '/grayscale-converter': '/tools/image-grayscale',
    '/resize-image': '/tools/image-resizer',
    '/batch-resize': '/tools/batch-convert',
    '/png-to-jpg': '/tools/png-to-jpg',
    '/image-converter': '/tools/',
    '/convert-png-to-jpg': '/tools/png-to-jpg',
    '/batch-conversion': '/tools/batch-convert',
    '/converter': '/tools/',
    '/features/cloud-storage': '/',
    '/tools/batch-converter': '/tools/batch-convert',
    '/tools/image-converter/': '/tools/',
}

def fix_links_in_file(filepath):
    """Read file, replace broken links with corrected ones, save back."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    soup = BeautifulSoup(content, 'html.parser')
    changed = False
    for a in soup.find_all('a', href=True):
        href = a['href'].strip()
        # Skip external links
        if href.startswith('http') and not href.startswith('https://fastimgtool.com'):
            continue
        # Remove anchor if it's a broken link we don't want to keep (e.g., forum)
        if any(bad in href for bad in ['/community/forum', '/knowledge-base', '/support', '/pricing']):
            # Replace with the link text (or remove entirely)
            a.replace_with(a.string or '')
            changed = True
            continue
        # For others, apply correction
        for broken, fixed in CORRECTIONS.items():
            if broken in href or href == broken:
                # Keep original path structure
                new_href = href.replace(broken, fixed)
                if new_href != href:
                    a['href'] = new_href
                    changed = True
                    break
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
    return changed

def main():
    guides_dir = r"E:\Projects\fastimgtool\guides"
    files = [f for f in os.listdir(guides_dir) if f.endswith('.html') and f != 'index.html']
    total = len(files)
    fixed_count = 0
    for idx, filename in enumerate(files, 1):
        filepath = os.path.join(guides_dir, filename)
        print(f"[{idx}/{total}] Processing {filename}")
        if fix_links_in_file(filepath):
            fixed_count += 1
    print(f"\nFixed links in {fixed_count} files.")

if __name__ == "__main__":
    main()