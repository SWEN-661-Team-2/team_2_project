
# CareConnect Desktop (Electron)

CareConnect Desktop is a macOS-targeted healthcare desktop application built with **Electron + React**.  
The application follows Electron best practices for process separation, security, testing, accessibility, and packaging.

Platform Target: **macOS (.dmg installer generated via electron-builder)**

---

# Part 1 – Electron Application (50%)

## Process Model (Main vs Renderer)

This application follows the official Electron process model:

- `main.js` – Main process (window lifecycle, IPC registration, native menus)
- `preload.js` – Secure API bridge using `contextBridge`
- `renderer/` – React application (no direct Electron access)

Security configuration:

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- Controlled API exposed via `window.careconnect`

The renderer does not directly import or access Electron APIs.

---

## Native Desktop Features

### Native Menu Bar
Implemented using `Menu.buildFromTemplate` in:

```
menus/mainMenu.js
```

Includes required menus:
- File
- Edit
- View
- Help

### Keyboard Shortcuts
All shortcuts from the design are implemented using Electron accelerators with platform-aware handling.

### Desktop Navigation
Navigation is handled via IPC (`nav:go`) and renderer route state.

### Window State Management
- Window size and position persisted using `electron-store`
- Bounds saved on close
- Restored on application relaunch

### File System / System Tray
(Not applicable to this project design.)

---

## Code Quality (10%)

- Organized folder structure (main, preload, renderer, tests)
- ESLint configured and passing with zero warnings:

```bash
npm run lint
```

- No Electron security warnings at runtime

---

# Part 2 – Testing & Coverage (30%)

## Unit Tests

Implemented using:

- Jest
- React Testing Library

Component test files located in:

```
tests/
```

Includes coverage for:
- App
- Sidebar
- Dashboard
- Tasks
- Patients
- Schedule
- Settings
- Login
- Shortcuts

---

## Integration Tests

### IPC Communication

File:

```
tests/ipc.integration.test.js
```

Validates:

- `ipcMain.handle` registration
- Main-process IPC channel availability
- Layout mode handling logic

### Window Management Logic

Tests validate:

- Window bounds persistence behavior
- Default bounds fallback logic

---

## Test Coverage

Run tests and generate coverage:

```bash
npm test
```

Coverage HTML report:

```
coverage/lcov-report/index.html
```

Minimum required coverage: **60%**  
Current coverage: **86%+ across all files**

All test suites passing.

---

# Part 3 – Desktop Accessibility (10%)

Accessibility features implemented:

- Full keyboard navigation
- Visible focus indicators
- Semantic HTML for screen reader compatibility
- Layout toggle for left- and right-handed workflows

(Screen reader and keyboard demonstration video submitted separately.)

---

# Part 4 – Build and Package (10%)

Build production installer:

```bash
npm run dist
```

Generated installer:

```
dist/CareConnect-0.1.0.dmg
```

Built using `electron-builder` targeting macOS.

---

# Installation & Usage

## Install Dependencies

```bash
cd apps/electron
npm ci
```

## Run Development Mode

```bash
npm run dev
```

## Run Tests + Coverage

```bash
npm test
```

## Lint

```bash
npm run lint
```

## Build Installer

```bash
npm run dist
```

---

# Project Structure

```
apps/electron
├── main.js
├── preload.js
├── menus/
├── renderer/
├── tests/
├── coverage/
└── dist/
```

---

# Submission Artifacts

- GitHub repository with build and testing instructions
- macOS DMG installer
- Coverage screenshot (≥60%)
- Coverage HTML report
- Accessibility demonstration video
- README (this document)

---