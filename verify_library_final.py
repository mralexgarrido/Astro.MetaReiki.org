import sys
from playwright.sync_api import sync_playwright

def run():
    print("Starting verification...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # 1. Visit Planet Sign Index (The one that was broken)
        print("Visiting Sol Signs page...")
        # Ensure we wait for navigation
        response = page.goto("http://localhost:4173/biblioteca/planetas/Sol")
        if not response.ok:
            print(f"Failed to load page: {response.status}")
            sys.exit(1)

        # Check if text "Aries" appears (it was missing before)
        try:
            page.wait_for_selector("text=Aries", timeout=10000)
        except Exception:
            print("Timeout waiting for 'Aries'. Page might be blank.")
            page.screenshot(path="sol_signs_failed.png")
            sys.exit(1)

        # Take screenshot to prove it renders now
        page.screenshot(path="sol_signs_fixed.png")
        print("Screenshot sol_signs_fixed.png taken.")

        # 2. Click Aries
        print("Clicking Aries...")
        page.click("text=Aries")

        # 3. Verify Interpretation Page
        print("Waiting for interpretation...")
        try:
            page.wait_for_selector("h1", timeout=5000)
        except:
             print("Timeout waiting for h1.")

        # Check title
        title = page.title()
        print(f"Page title: {title}")

        # Check content
        page.screenshot(path="interpretation_view.png")
        content = page.content()

        if "Sol en Aries" in content or "Sol en Aries" in title:
            print("SUCCESS: Interpretation loaded.")
        else:
            print("FAILURE: Interpretation content missing.")
            sys.exit(1)

        print("Verification Complete.")
        browser.close()

if __name__ == "__main__":
    try:
        run()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
