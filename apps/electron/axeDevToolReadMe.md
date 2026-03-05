## 🛠️ Team Guide: Setting Up axe DevTools

This guide covers the installation and basic usage of the **axe DevTools** browser extension to satisfy the **SWEN661 Accessibility Test Requirement**.

### 1. Installation

The axe DevTools extension is available for Chrome, Firefox, and Edge.

* **Chrome:** Visit the [Chrome Web Store](https://www.google.com/search?q=https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefnckghaoi) and click **Add to Chrome**.
* **Firefox:** Visit [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/) and click **Add to Firefox**.
* **Edge:** Search for "axe DevTools" in the Microsoft Edge Add-ons store.

### 2. Opening the Tool

Once installed, the tool lives inside your browser's **Web Developer Tools**.

1. Open your CareConnect application in the browser.
2. **Right-click** anywhere on the page and select **Inspect**, or press `F12`.
3. In the top tabs of the Inspector window (Elements, Console, Sources, etc.), look for **axe DevTools**.
* *Note: If you don't see it, click the ">>" double arrows to show hidden tabs.*

### 3. Running a Scan

To generate the data needed for the assignment:

1. Click **Scan ALL of my page**.
2. Wait a few seconds for the engine to analyze the DOM.
3. The tool will return a list of "Total issues" categorized by severity (**Critical, Serious, Moderate, Minor**).

### 4. Required Evidence for README/Assignment

When documenting results for the team, ensure the following are captured in your screenshots:

* **Issue Description:** What the error is (e.g., "Buttons must have discernible text").
* **Element Location:** The specific HTML code or CSS selector being flagged.
* **WCAG Mapping:** The specific Success Criterion (e.g., WCAG 2.1 AA) the element is failing.
* **The "Inspect" Highlight:** Use the "Inspect" button within axe to highlight the exact component on the Dashboard that needs fixing.

---

