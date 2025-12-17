import re
from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to app
        page.goto("http://localhost:5173")

        # Wait for form
        page.wait_for_selector("input[placeholder='Ej. Juan Pérez']")

        # Use a date where Venus and Mercury are Conjunct in Gemini.
        page.fill("input[placeholder='Ej. Juan Pérez']", "Host Logic Test")
        page.fill("input[type='date']", "2020-05-22")
        page.fill("input[type='time']", "02:00")

        # City Search Logic
        page.fill("input[placeholder='Busca tu ciudad de nacimiento...']", "New York")
        page.wait_for_selector("div.absolute button", timeout=5000)
        page.click("div.absolute button:first-child")

        # Submit
        page.click("button:has-text('Revelar Carta')")

        # Wait for calculation
        page.wait_for_selector("button:has-text('Positivo / Negativo')", timeout=15000)

        # Go to tab
        page.click("button:has-text('Positivo / Negativo')")

        # Wait for report
        page.wait_for_selector("h3:has-text('Planeta Más Positivo')", timeout=5000)

        # Take Screenshot
        page.screenshot(path="verification/host_logic_verified.png")
        print("Screenshot saved to verification/host_logic_verified.png")

        browser.close()

if __name__ == "__main__":
    run()
