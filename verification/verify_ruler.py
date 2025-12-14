
from playwright.sync_api import sync_playwright

def verify_ruler_interpretation():
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
        page.get_by_placeholder("Ej. Juan Pérez").fill("Test User")

        # Date: It's an input type=date.
        # Playwright .fill() on date inputs usually works with YYYY-MM-DD
        page.locator('input[type="date"]').fill("1990-01-01")

        # Time
        page.locator('input[type="time"]').fill("12:00")

        # City Search
        # The placeholder is "Busca tu ciudad de nacimiento..."
        city_input = page.get_by_placeholder("Busca tu ciudad de nacimiento...")
        city_input.fill("Madrid")

        # Wait for results to appear (button with text Madrid)
        # Using a broad selector for the button in the dropdown
        result_button = page.locator('button:has-text("Madrid")').first
        result_button.wait_for(state="visible", timeout=5000)
        result_button.click()

        # Submit the form
        submit_btn = page.get_by_role("button", name="Revelar Carta")
        submit_btn.click()

        # Wait for chart calculation
        page.wait_for_timeout(2000)

        # Detailed Report check
        page.wait_for_selector('h2:has-text("Reporte Detallado de Casas")', timeout=10000)

        # Verify generated text
        # "La energía de Casa"
        locator = page.get_by_text("La energía de Casa", exact=False).first

        if locator.is_visible():
            locator.scroll_into_view_if_needed()
            print("Found text.")
        else:
            print("Warning: Text not immediately visible.")

        page.screenshot(path="verification/ruler_verification.png", full_page=True)
        print("Screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_ruler_interpretation()
