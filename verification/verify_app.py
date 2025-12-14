from playwright.sync_api import sync_playwright

def verify_report_generation_and_tabs(page):
    print("Navigating to app...")
    page.goto("http://localhost:3000")

    # Fill in birth data
    print("Filling birth form...")
    page.fill("input[placeholder='Ej. Juan Pérez']", "Test User")
    page.fill("input[type='date']", "1990-05-15")
    page.fill("input[type='time']", "14:30")

    # Handle City Search
    print("Searching city...")
    page.fill("input[placeholder='Busca tu ciudad de nacimiento...']", "Madrid")

    # Wait for the results to appear in the dropdown
    print("Waiting for city results...")
    page.wait_for_selector("button:has-text('Madrid')", timeout=10000)

    # Click the first result
    page.click("button:has-text('Madrid')")

    # Submit
    print("Submitting form...")
    page.click("button:has-text('Revelar Carta')")

    # Wait for report to load (simulated delay is 800ms)
    print("Waiting for report...")
    # Checking for the visible header on screen
    page.wait_for_selector("text=Carta de Test User", timeout=15000)

    # Verify Tabs exist
    print("Verifying tabs...")
    page.wait_for_selector("button:has-text('Carta Natal')")
    page.wait_for_selector("button:has-text('Profecciones')")
    page.wait_for_selector("button:has-text('Partes Herméticas')")
    page.wait_for_selector("button:has-text('Reiki y Salud')")

    # Screenshot Natal
    print("Screenshot Natal...")
    page.screenshot(path="verification/1_natal.png")

    # Click Profections
    print("Switching to Profections...")
    page.click("button:has-text('Profecciones')")
    page.wait_for_selector("text=Profección Anual") # Check for content unique to ProfectionDisplay
    page.screenshot(path="verification/2_profections.png")

    # Click Lots
    print("Switching to Lots...")
    page.click("button:has-text('Partes Herméticas')")
    page.wait_for_selector("text=Las 7 Partes Herméticas")
    page.screenshot(path="verification/3_lots.png")

    # Click Reiki
    print("Switching to Reiki...")
    page.click("button:has-text('Reiki y Salud')")
    page.wait_for_selector("text=Reporte de Salud y Reiki")
    page.screenshot(path="verification/4_reiki.png")

    print("Verification complete.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_report_generation_and_tabs(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
