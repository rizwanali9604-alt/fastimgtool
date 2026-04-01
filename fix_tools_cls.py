import os
import re

# Base path to your tools folder
TOOLS_DIR = r"E:\Projects\fastimgtool\tools"

# List of tool subfolders (all except maybe index.html at root)
tool_folders = [f for f in os.listdir(TOOLS_DIR) if os.path.isdir(os.path.join(TOOLS_DIR, f))]

# Also include any standalone .html files? Your structure uses subfolders.
for folder in tool_folders:
    file_path = os.path.join(TOOLS_DIR, folder, "index.html")
    if not os.path.exists(file_path):
        print(f"Skipping {folder} – no index.html")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Wrap each ad container with min-height div
    # We'll look for patterns like: <div style="text-align:center; margin:20px 0;"> ... <ins class="adsbygoogle"...> ... </div>
    # and wrap the whole block.
    # A simple approach: find each such div and replace it with a wrapped version.
    # We'll use regex to find the div that contains an <ins class="adsbygoogle">.
    # This is a bit tricky but doable.
    # For safety, we'll assume the structure is consistent: the ad divs are exactly:
    # <div style="text-align:center; margin:20px 0;"> ... </div>
    # We'll wrap them with a parent div.
    
    # Find all ad divs (top, middle, bottom)
    ad_div_pattern = re.compile(r'(<div style="text-align:center; margin:20px 0;">.*?<ins class="adsbygoogle".*?</script>\s*</div>)', re.DOTALL)
    
    def wrap_ad(match):
        original = match.group(1)
        return f'<div style="min-height:250px;">\n{original}\n</div>'
    
    new_content = ad_div_pattern.sub(wrap_ad, content)
    
    # 2. Fix image dimensions in the screenshot block
    # Look for <picture> containing an <img> without width/height.
    # We'll add width="800" height="450" style="aspect-ratio:800/450;" if not present.
    # But careful not to double-add.
    img_pattern = re.compile(r'(<picture>.*?<source[^>]*>.*?<img\s+[^>]*?)(?=\s/?>)', re.DOTALL)
    def fix_img(match):
        img_tag = match.group(1)
        if 'width=' not in img_tag and 'height=' not in img_tag:
            # Insert width, height, style
            # Find the end of the <img tag (before >)
            img_tag = re.sub(r'(<img\s+)(.*?)(/?>)', r'\1\2 width="800" height="450" style="aspect-ratio:800/450;" \3', img_tag, count=1)
        return img_tag
    
    # Apply to the whole content (but only within picture tags to be safe)
    # We'll use a simpler approach: search for <img inside <picture> and add attributes.
    # Because the pattern is already matched, we can replace directly.
    new_content = img_pattern.sub(fix_img, new_content)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

print("Done.")