import json
import os
from pathlib import Path

def generate_guides():
    # Paths
    data_file = Path("data/guide-data.json")
    guides_dir = Path("guides")
    
    if not data_file.exists():
        print("❌ data/guide-data.json not found!")
        return
    
    # Load guide data
    with open(data_file, 'r', encoding='utf-8') as f:
        guides = json.load(f)
    
    print(f"📖 Loaded {len(guides)} guides from JSON.")
    
    # Create backup of existing guide files (optional but safe)
    backup_dir = Path("guides_backup")
    if not backup_dir.exists():
        backup_dir.mkdir()
        for html_file in guides_dir.glob("*.html"):
            # Copy to backup
            backup_path = backup_dir / html_file.name
            with open(html_file, 'r', encoding='utf-8') as src, open(backup_path, 'w', encoding='utf-8') as dst:
                dst.write(src.read())
        print(f"📦 Backed up original guide files to {backup_dir}/")
    
    # Generate each guide
    generated = 0
    for guide in guides:
        slug = guide.get('slug')
        content = guide.get('content')
        if not slug or not content:
            print(f"⚠️ Skipping guide with missing slug or content: {guide.get('title', 'unknown')}")
            continue
        
        # Filename: slug + .html (e.g., how-to-resize-image-online.html)
        filename = slug + '.html'
        filepath = guides_dir / filename
        
        # Write the content directly (overwrite)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Generated: {filepath}")
        generated += 1
    
    print(f"\n🎉 Done! Generated {generated} guide pages.")

if __name__ == "__main__":
    generate_guides()