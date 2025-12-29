from playwright.sync_api import sync_playwright, expect
import time

def verify_legal_pages():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        print("Navigating to Home...")
        page.goto("http://localhost:5173/")

        # 1. Check Footer Links
        print("Checking Footer Links...")
        footer = page.locator("footer")
        privacy_link = footer.get_by_role("link", name="Política de Privacidad")
        terms_link = footer.get_by_role("link", name="Términos de Uso")

        expect(privacy_link).to_be_visible()
        expect(terms_link).to_be_visible()

        # 2. Verify Privacy Policy Page
        print("Navigating to Privacy Policy...")
        privacy_link.click()
        expect(page).to_have_url("http://localhost:5173/privacidad")
        expect(page.get_by_role("heading", name="Política de Privacidad", level=1)).to_be_visible()
        expect(page.get_by_text("Procesamiento Local")).to_be_visible()

        # Take Screenshot of Privacy Policy
        page.screenshot(path="verification/privacy_policy.png", full_page=True)
        print("Privacy Policy screenshot taken.")

        # 3. Verify Terms of Use Page
        print("Navigating to Terms of Use...")
        page.goto("http://localhost:5173/")

        # Re-locate footer after navigation
        footer = page.locator("footer")
        terms_link = footer.get_by_role("link", name="Términos de Uso")

        terms_link.click()
        expect(page).to_have_url("http://localhost:5173/terminos")
        expect(page.get_by_role("heading", name="Términos de Uso", level=1)).to_be_visible()
        expect(page.get_by_text("Descargo de Responsabilidad")).to_be_visible()

        # Take Screenshot of Terms of Use
        page.screenshot(path="verification/terms_of_use.png", full_page=True)
        print("Terms of Use screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_legal_pages()
