import os
import time
import csv
import random
from playwright.sync_api import sync_playwright

CSV_FILE = "pins_with_link.csv"
USER_DATA_DIR = r"E:\Projects\fastimgtool\pinterest_data"

def ensure_logged_in(page):
    """Go to pin‑creator and handle login if needed."""
    page.goto("https://www.pinterest.com/pin-creator/", timeout=30000)
    # Wait a bit for the page to settle
    time.sleep(3)
    # Check if we're on a login/signup page
    if page.url.startswith("https://www.pinterest.com/login") or "login" in page.url.lower():
        print("🔐 Login required. Please log in manually in the browser window.")
        print("After logging in, press Enter to continue...")
        input()
        # After login, reload the pin‑creator page
        page.goto("https://www.pinterest.com/pin-creator/")
        time.sleep(3)
    else:
        print("✅ Already logged in.")

def create_pin(page, title, description, link, image_url, board_name):
    """Create one pin."""
    print(f"Creating pin: {title[:50]}...")
    # Ensure we're on the pin‑creator page
    if page.url != "https://www.pinterest.com/pin-creator/":
        page.goto("https://www.pinterest.com/pin-creator/")
        time.sleep(3)

    # Try the "From URL" method
    try:
        # Look for a button or tab that says "From URL"
        from_url_btn = page.locator("text=From URL").first
        if from_url_btn.is_visible():
            from_url_btn.click()
            time.sleep(1)
            url_input = page.locator("input[placeholder*='URL']")
            url_input.fill(image_url)
            page.locator("text=Upload").click()
            time.sleep(3)
        else:
            print("⚠️ 'From URL' button not found, trying default upload.")
            # If default upload, we might need to click an upload area
            # For now, we'll skip to title filling (pins without images won't work)
    except:
        print("⚠️ Could not use 'From URL', continuing anyway (pin may be incomplete).")

    # Fill title
    title_input = page.locator("input[aria-label='Title']")
    title_input.fill(title)

    # Fill description
    desc_input = page.locator("textarea[aria-label='Description']")
    desc_input.fill(description)

    # Fill destination link
    link_input = page.locator("input[aria-label='Destination link']")
    link_input.fill(link)

    # Select board
    board_selector = page.locator("button[aria-label*='Board']")
    board_selector.click()
    time.sleep(1)
    board_option = page.locator(f"div[role='option']:has-text('{board_name}')")
    board_option.click()

    # Publish
    publish_btn = page.locator("button:has-text('Publish')")
    publish_btn.click()
    time.sleep(5)  # Wait for completion

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            user_data_dir=USER_DATA_DIR,
            headless=False,
            args=["--start-maximized"]
        )
        page = browser.new_page()

        # First, check login on main page (optional)
        page.goto("https://www.pinterest.com")
        time.sleep(2)

        # Now go to pin‑creator and handle login if needed
        ensure_logged_in(page)

        # Read CSV
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            pins = list(reader)

        # Uncomment to test with first 2 pins
        # pins = pins[:2]

        for idx, pin in enumerate(pins, 1):
            print(f"[{idx}/{len(pins)}] Processing...")
            try:
                create_pin(
                    page,
                    pin['Pin Title'],
                    pin['Pin Description'],
                    pin['Link'],
                    pin['Image URL Placeholder'],
                    board_name="FastImgTool Pins"  # <-- CHANGE THIS!
                )
                time.sleep(random.uniform(15, 30))
            except Exception as e:
                print(f"❌ Error with pin {idx}: {e}")
                # Optionally, save progress and continue
                continue

        browser.close()
        print("✅ Done.")

if __name__ == "__main__":
    main()