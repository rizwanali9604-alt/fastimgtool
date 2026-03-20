import os
import re

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        title_match = re.search(r'<!-- SEO Title:\s*(.*?)\s*-->', content)
        meta_match = re.search(r'<!-- Meta Description:\s*(.*?)\s*-->', content)
        title = title_match.group(1) if title_match else ""
        meta = meta_match.group(1) if meta_match else ""
        content = re.sub(r'<!-- SEO Title:.*?-->', '', content)
        content = re.sub(r'<!-- Meta Description:.*?-->', '', content)
        new_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
    <meta name="description" content="{meta}">
</head>
<body>
{content}
</body>
</html>"""
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
print("Done.")