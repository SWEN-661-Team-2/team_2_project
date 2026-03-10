# CareConnect Desktop — Build and Accessibility Testing Guide

This document provides the steps required to build, run, and perform accessibility testing on the CareConnect Desktop Electron application. These steps reproduce the testing environment used during Week 9 Accessibility Testing and Refinement.

---

# 1. Prerequisites

Ensure the following software is installed:

- Node.js (v18 or newer recommended)
- npm (comes with Node)
- Git
- Electron-compatible operating system (macOS, Windows, or Linux)

Accessibility testing tools used:

- axe DevTools (browser extension)
- VoiceOver (macOS built-in screen reader) or NVDA (Windows)

---

# 2. Clone the Repository

Clone the project repository:

```bash
git clone https://github.com/SWEN-661-Team-2/team_2_project.git
```

Navigate to the Electron application directory:

```bash
cd team_2_project/apps/electron
```

---

# 3. Install Dependencies

Install all required Node dependencies:

```bash
npm install
```

This installs:

- Electron
- React dependencies
- Jest testing framework
- Development utilities

---

# 4. Run the Desktop Application

To launch the full Electron desktop application:

```bash
npm run dev
```

This starts the Vite development server on http://localhost:5173 and opens the CareConnect desktop window in Electron simultaneously.

To start only the Vite development server without opening Electron (required for axe DevTools — see Section 6):

```bash
npm run vite
```

This serves the app at http://localhost:5173 in a browser-accessible format without launching the Electron window.

---

# 5. Run Automated Tests and Coverage

Execute the Jest test suite:

```bash
npm test
```

To generate the coverage report:

```bash
npm test -- --coverage
```

The coverage report will display in the terminal and will also be generated in:

```
coverage/
```

To open the HTML coverage report:

```bash
open coverage/lcov-report/index.html
```

The project maintains **greater than 60% test coverage**, exceeding the assignment requirement.

---

# 6. Run Accessibility Scans (axe DevTools)

axe DevTools is a Chrome browser extension and cannot attach to the Electron window directly. To run axe DevTools scans, use the Vite-only dev server:

1. Start the Vite server (without Electron):

```bash
npm run vite
```

2. Open **Google Chrome** and navigate to:

```
http://localhost:5173
```

3. Open **Developer Tools** (Cmd+Option+I on macOS)
4. Navigate to the **axe DevTools** tab
5. Click **Analyze**

> **Note:** For all other testing — keyboard navigation, VoiceOver screen reader testing, and general app usage — use `npm run dev` to launch the full Electron application instead.

Run scans on the following screens:

- Login
- Dashboard
- Tasks
- Schedule
- Patients
- Settings

All screens should report:

```
0 accessibility violations
```

---

# 7. Keyboard Navigation Testing

To test keyboard-only navigation:

1. Launch the full application using `npm run dev`
2. Avoid using the mouse.
3. Navigate the application using the keyboard.

Keys used for testing:

| Key | Function |
|----|----|
| Tab | Move forward between elements |
| Shift + Tab | Move backward between elements |
| Enter | Activate buttons |
| Space | Toggle checkboxes |
| Escape | Close modal dialogs |
| Arrow Keys | Navigate calendar and dropdowns |

Verify that:

- All elements are reachable
- Focus indicators remain visible
- No keyboard traps occur
- Modal dialogs close with Escape

---

# 8. Screen Reader Testing

Screen reader testing was conducted using **VoiceOver on macOS**.

Launch the full application using `npm run dev` before starting screen reader testing.

To enable VoiceOver:

```
Command + F5
```

Recommended VoiceOver commands used during testing:

| Command | Function |
|----|----|
| VO + Right Arrow | Move to next element |
| VO + Left Arrow | Move to previous element |
| VO + Space | Activate control |
| VO + U | Open Rotor (landmarks, headings, links) |
| VO + Shift + M | Open menu |

Verify that:

- Form fields are announced with labels
- Buttons announce their purpose
- Modal dialogs announce their titles
- Checkbox states are announced
- Navigation landmarks are detected

---

# 9. Accessibility Standards

The CareConnect Desktop application was tested against:

**WCAG 2.1 Level AA**

Key criteria validated include:

- 1.1.1 Non-text Content
- 1.3.1 Info and Relationships
- 1.4.3 Contrast Minimum
- 2.1.1 Keyboard
- 2.1.2 No Keyboard Trap
- 2.4.7 Focus Visible
- 3.3.1 Error Identification
- 4.1.2 Name, Role, Value

---

# 10. Accessibility Testing Evidence

Evidence of accessibility testing includes:

- axe DevTools scan screenshots showing **zero violations**
- keyboard navigation testing checklist
- screen reader testing documentation
- accessibility remediation changes
- automated test coverage reports

These artifacts are included in the Week 9 accessibility report.

---

# 11. AI Usage Disclosure

AI tools (including ChatGPT and GitHub Copilot) were used to assist with accessibility research, WCAG interpretation, and debugging guidance. All suggestions were reviewed, validated, and implemented by the development team.

---

# Maintainers

Team 2
SWEN-661 – User Interface Implementation
University of Maryland Global Campus

---
