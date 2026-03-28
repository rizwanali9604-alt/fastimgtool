import os
import re
from bs4 import BeautifulSoup

# Mapping of keywords to relevant internal tools (URL path)
TOOL_MAP = {
    'resize': '/tools/image-resizer',
    'compress': '/tools/image-compressor',
    'convert': '/tools/png-to-jpg',
    'crop': '/tools/crop-image',
    'rotate': '/tools/rotate-image',
    'flip': '/tools/flip-image',
    'blur': '/tools/image-blur',
    'sharpen': '/tools/image-sharpen',
    'brightness': '/tools/image-brightness',
    'contrast': '/tools/image-contrast',
    'saturation': '/tools/image-saturation',
    'grayscale': '/tools/image-grayscale',
    'sepia': '/tools/image-sepia',
    'invert': '/tools/image-invert',
    'webp': '/tools/image-to-webp',
    'base64': '/tools/image-to-base64',
    'heic': '/tools/heic-to-jpg',
    'tiff': '/tools/tiff-to-jpg',
    'gif': '/tools/gif-to-png',
    'bmp': '/tools/bmp-to-jpg',
    'batch': '/tools/batch-convert',
    'png to jpg': '/tools/png-to-jpg',
    'jpg to png': '/tools/jpg-to-png',
    'webp to jpg': '/tools/webp-to-jpg',
}

# Related guides (keyword -> list of related guide filenames or URLs)
RELATED_GUIDES = {
    'resize': ['how-to-resize-image-online.html', 'resize-image-for-instagram.html'],
    'compress': ['how-to-compress-image-online.html', 'compress-image-for-email.html'],
    'convert': ['how-to-convert-jpg-to-png.html', 'how-to-convert-png-to-jpg.html'],
    'crop': ['how-to-crop-image-online.html', 'crop-image-for-passport.html'],
    'blur': ['how-to-blur-image-online.html', 'blur-image-background.html'],
    'sharpen': ['how-to-sharpen-image-online.html', 'sharpen-blurry-photos.html'],
    'rotate': ['how-to-rotate-image-online.html', 'rotate-image-90-degrees.html'],
    'flip': ['how-to-flip-image-online.html', 'flip-image-horizontally.html'],
    'grayscale': ['how-to-convert-image-to-grayscale.html', 'why-use-grayscale-images.html'],
    # add more as needed
}

# Default links for any guide not matching above
DEFAULT_TOOLS = [
    '/tools/image-resizer',
    '/tools/image-compressor',
    '/tools/png-to-jpg',
]
DEFAULT_GUIDES = [
    'how-to-resize-image-online.html',
    'how-to-compress-image-online.html',
]

def get_tool_links(text):
    """Return a set of tool URLs based on keywords in the text."""
    tools = set()
    text_lower = text.lower()
    for keyword, url in TOOL_MAP.items():
        if keyword in text_lower:
            tools.add(url)
    if not tools:
        tools = set(DEFAULT_TOOLS)
    return tools

def get_guide_links(text):
    """Return a set of related guide URLs based on keywords."""
    guides = set()
    text_lower = text.lower()
    for keyword, urls in RELATED_GUIDES.items():
        if keyword in text_lower:
            for g in urls:
                guides.add(f"/guides/{g}")
    if not guides:
        for g in DEFAULT_GUIDES:
            guides.add(f"/guides/{g}")
    return guides

def remove_old_sections(soup):
    """Remove all existing divs with class containing 'recommended-tools'."""
    for div in soup.find_all('div', class_=re.compile('recommended-tools')):
        div.decompose()
    return soup

def insert_new_resources(soup, text):
    """Insert a new 'Related Tools & Resources' section before the footer."""
    # Build HTML for new section
    tool_links = get_tool_links(text)
    guide_links = get_guide_links(text)

    resources_div = soup.new_tag('div', **{'class': 'recommended-tools'})
    h3 = soup.new_tag('h3')
    h3.string = "Related Tools & Resources"
    resources_div.append(h3)

    # Tools list
    if tool_links:
        p_tools = soup.new_tag('p')
        p_tools.string = "📌 Tools you might find useful:"
        resources_div.append(p_tools)
        ul = soup.new_tag('ul')
        for url in tool_links:
            li = soup.new_tag('li')
            a = soup.new_tag('a', href=url)
            a.string = url.split('/')[-1].replace('-', ' ').title()  # e.g., "Image Resizer"
            li.append(a)
            ul.append(li)
        resources_div.append(ul)

    # Guides list
    if guide_links:
        p_guides = soup.new_tag('p')
        p_guides.string = "📖 Related guides:"
        resources_div.append(p_guides)
        ul = soup.new_tag('ul')
        for url in guide_links:
            li = soup.new_tag('li')
            a = soup.new_tag('a', href=url)
            # Extract filename and make readable
            filename = url.split('/')[-1]
            title = filename.replace('.html', '').replace('-', ' ').title()
            a.string = title
            li.append(a)
            ul.append(li)
        resources_div.append(ul)

    # Affiliate links – we can keep a default set or reuse the previous ones
    # For simplicity, we'll add a small set of affiliate links (Amazon, etc.)
    # You can replace these with your actual affiliate links.
    aff_links = [
        ('Amazon Image Tools', 'https://www.amazon.in/s?k=image+editing+software&tag=fastimgtool78-21'),
        
        # add more
    ]
    p_aff = soup.new_tag('p')
    p_aff.string = "🛒 Recommended products:"
    resources_div.append(p_aff)
    ul_aff = soup.new_tag('ul')
    for name, url in aff_links:
        li = soup.new_tag('li')
        a = soup.new_tag('a', href=url, target="_blank")
        a.string = name
        li.append(a)
        li.append(" (affiliate link)")
        ul_aff.append(li)
    resources_div.append(ul_aff)

    # Find where to insert: before the footer
    footer = soup.find('footer')
    if footer:
        footer.insert_before(resources_div)
    else:
        # fallback: append to body
        soup.body.append(resources_div)
    return soup

def process_guide(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    # Remove old sections
    soup = remove_old_sections(soup)
    # Get page text for keyword matching
    text = soup.get_text()
    # Insert new combined section
    soup = insert_new_resources(soup, text)
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))

def main():
    guides_dir = r"E:\Projects\fastimgtool\guides"
    files = [f for f in os.listdir(guides_dir) if f.endswith('.html') and f != 'index.html']
    total = len(files)
    for idx, filename in enumerate(files, 1):
        filepath = os.path.join(guides_dir, filename)
        print(f"[{idx}/{total}] Processing {filename}")
        try:
            process_guide(filepath)
        except Exception as e:
            print(f"  ERROR: {e}")

if __name__ == "__main__":
    main()