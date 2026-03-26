import os
import sys
import time
from playwright.sync_api import sync_playwright

# List of all 25 tools – adjust paths if needed
# They are located in /tools/ subfolder
TOOLS = [
    "png-to-jpg",
    "jpg-to-png",
    "webp-to-jpg",
    "image-resizer",
    "image-compressor",
    "image-converter",
    "image-cropper",
    "image-rotator",
    "image-flipper",
    "image-blur",
    "image-sharpen",
    "image-brightness",
    "image-contrast",
    "image-saturation",
    "image-grayscale",
    "image-sepia",
    "image-invert",
    "image-to-webp",
    "image-to-base64",
    "batch-convert",
    "base64-to-image",
    "heic-to-jpg",
    "tiff-to-jpg",
    "gif-to-png",
    "bmp-to-jpg"
]

# Use local filesystem for testing (faster, no network)
BASE_URL = "file:///E:/Projects/fastimgtool/tools/"

def test_tool(tool_name):
    """Test a single tool: load page, check basic elements, measure load time."""
    url = f"{BASE_URL}{tool_name}/index.html"
    print(f"Testing {tool_name}...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)  # headless = no UI
        page = browser.new_page()
        start_time = time.time()
        try:
            response = page.goto(url, wait_until="networkidle", timeout=10000)
            load_time = time.time() - start_time
            # Check if page loaded successfully
            if response.status != 200:
                print(f"  FAIL: HTTP {response.status}")
                return False, load_time
            # Check for presence of tool container (adjust selector as needed)
            # Common selectors: try to find upload area or main tool container
            tool_container = page.locator("input[type='file'], .upload-area, .dropzone, #upload").first
            if not tool_container.is_visible():
                print(f"  FAIL: tool container not visible")
                return False, load_time
            # Check for email capture form (optional)
            email_input = page.locator("input[type='email']")
            if not email_input.is_visible():
                print(f"  WARN: email capture not visible")
            print(f"  OK (load time: {load_time:.2f}s)")
            return True, load_time
        except Exception as e:
            print(f"  ERROR: {e}")
            return False, 0
        finally:
            browser.close()

def main():
    results = []
    for tool in TOOLS:
        success, load_time = test_tool(tool)
        results.append((tool, success, load_time))
        time.sleep(1)  # be gentle

    # Summary
    print("\n" + "="*50)
    print("SUMMARY")
    print("="*50)
    for tool, success, load_time in results:
        status = "✅" if success else "❌"
        print(f"{status} {tool}: {load_time:.2f}s" if load_time else f"{status} {tool}: failed")
    total = len(results)
    passed = sum(1 for _, s, _ in results if s)
    print(f"\nPassed: {passed}/{total}")

if __name__ == "__main__":
    main()