from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        # Go to Guides Index
        page.goto("http://localhost:4173/biblioteca/guias")
        page.wait_for_selector("text=Guías de Uso")

        # Take Screenshot
        page.screenshot(path="verification/guides_index.png", full_page=True)
        print("Screenshot saved to verification/guides_index.png")

        browser.close()

if __name__ == "__main__":
    run()
