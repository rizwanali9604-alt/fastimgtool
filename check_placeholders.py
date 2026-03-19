import os
import re
from pathlib import Path

def scan_for_placeholders(root_dir, extensions=['.html']):
    placeholder_pattern = re.compile(r'\{\{.*?\}\}')
    files_with_placeholders = []

    for root, dirs, files in os.walk(root_dir):
        # Skip node_modules, .git, etc.
        if 'node_modules' in root or '.git' in root:
            continue
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        matches = placeholder_pattern.findall(content)
                        if matches:
                            files_with_placeholders.append({
                                'file': filepath,
                                'placeholders': matches
                            })
                except Exception as e:
                    print(f"Could not read {filepath}: {e}")

    return files_with_placeholders

if __name__ == '__main__':
    project_root = os.path.dirname(os.path.abspath(__file__))
    print(f"Scanning {project_root} for {{...}} placeholders...")
    results = scan_for_placeholders(project_root)

    if results:
        print(f"\n⚠️ Found {len(results)} files with placeholders:\n")
        for r in results:
            print(f"File: {r['file']}")
            print(f"Placeholders: {', '.join(set(r['placeholders']))}\n")
    else:
        print("✅ No placeholder patterns found in any HTML file.")