from playwright.sync_api import sync_playwright

def verify_chiron_sweph():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            page.goto("http://localhost:5173", timeout=10000)
        except Exception:
            page.goto("http://localhost:5173")

        # Wait for the form
        page.wait_for_selector('form')

        # Name
        page.get_by_placeholder("Ej. Juan Pérez").fill("Chiron Sweph Test")

        # Date
        page.locator('input[type="date"]').fill("2024-01-01")

        # Time
        page.locator('input[type="time"]').fill("12:00")

        # City Search
        city_input = page.get_by_placeholder("Busca tu ciudad de nacimiento...")
        city_input.fill("Madrid")

        result_button = page.locator('button:has-text("Madrid")').first
        result_button.wait_for(state="visible", timeout=5000)
        result_button.click()

        # Submit
        submit_btn = page.get_by_role("button", name="Revelar Carta")
        submit_btn.click()

        # Wait for chart calculation (might take longer due to WASM/ephe load)
        page.wait_for_timeout(5000)

        # Check for Chiron text "Quirón"
        chiron_locator = page.get_by_text("Quirón", exact=False).first
        if chiron_locator.is_visible():
             print("Found Chiron on the page.")
             # Try to get the text context nearby to see degrees?
             # Assuming standard layout: Name ... Degrees/Sign
             print(chiron_locator.text_content())
        else:
             print("Chiron not found.")

        # Take screenshot
        page.screenshot(path="verification/chiron_sweph_verification.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    verify_chiron_sweph()
