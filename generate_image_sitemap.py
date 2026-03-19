import json
import xml.etree.ElementTree as ET
from xml.dom import minidom

def generate_image_sitemap(json_path, output_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    urlset = ET.Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    urlset.set("xmlns:image", "http://www.google.com/schemas/sitemap-image/1.1")
    
    for guide in data['guides']:
        page_url = f"https://fastimgtool.com/guides/{guide['slug']}.html"
        url_element = ET.SubElement(urlset, "url")
        loc = ET.SubElement(url_element, "loc")
        loc.text = page_url
        
        for img in guide['images']:
            image_element = ET.SubElement(url_element, "image:image")
            image_loc = ET.SubElement(image_element, "image:loc")
            image_loc.text = f"https://fastimgtool.com/images/guides/{img['filename']}"
            
            if 'caption' in img:
                caption = ET.SubElement(image_element, "image:caption")
                caption.text = img['caption']
            
            if 'title' in img:
                title = ET.SubElement(image_element, "image:title")
                title.text = img['title']
    
    xml_str = ET.tostring(urlset, encoding='unicode')
    pretty_xml = minidom.parseString(xml_str).toprettyxml(indent="  ")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(pretty_xml)
    
    print(f"✅ Image sitemap generated: {output_path}")

if __name__ == "__main__":
    generate_image_sitemap("image-data/image-data.json", "image-sitemap.xml")