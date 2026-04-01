# CareConnect Desktop (Electron)

> Supporting Care, Connecting Hearts

CareConnect Desktop is a macOS-targeted healthcare desktop application built with Electron and React. The application follows Electron best practices for process separation, security, testing, accessibility, and packaging.

**Platform Target:** macOS (.dmg installer generated via electron-builder)

-----

## Team

**Course:** SWEN-661 — User Interface Implementation  
**Institution:** University of Maryland Global Campus  
**Team:** Erin Ashford-Aleka, Eduardo Estrada, James Stevens

-----

## Tech Stack

- **Framework:** Electron
- **Renderer:** React + Vite
- **Language:** JavaScript/JSX
- **Styling:** Tailwind CSS
- **Testing:** Jest, React Testing Library
- **Packaging:** electron-builder
- **Accessibility:** axe DevTools, Lighthouse

-----

## Prerequisites

- Node.js 18+
- npm 9+
- macOS (for DMG packaging)

-----

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SWEN-661-Team-2/team_2_project.git
cd team_2_project/apps/electron
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run in development mode

```bash
npm run dev
```

The Vite dev server starts at `http://localhost:5173` and Electron launches automatically.

-----

## Available Commands

|Command        |Description                       |
|---------------|----------------------------------|
|`npm run dev`  |Start Electron in development mode|
|`npm run vite` |Start Vite dev server only        |
|`npm run build`|Build production renderer         |
|`npm run dist` |Build macOS DMG installer         |
|`npm test`     |Run tests with coverage report    |
|`npm run lint` |Run ESLint                        |

-----

## Building for Production

### macOS DMG Installer

```bash
npm run dist
```

Output: `dist/CareConnect-0.1.0.dmg`

Built using `electron-builder` targeting macOS.

### Installing on macOS

1. Open `CareConnect-0.1.0.dmg`
1. Drag CareConnect to your Applications folder
1. If prompted with a security warning, navigate to **System Settings → Privacy & Security** and click **Open Anyway**

-----

## Process Model

This application follows the official Electron process model:

- `main.js` — Main process (window lifecycle, IPC registration, native menus)
- `preload.js` — Secure API bridge using `contextBridge`
- `renderer/` — React application (no direct Electron access)

**Security configuration:**

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- Controlled API exposed via `window.careconnect`

The renderer does not directly import or access Electron APIs.

-----

## Native Desktop Features

### Native Menu Bar

Implemented using `Menu.buildFromTemplate` in `menus/mainMenu.js`.

Includes:

- File
- Edit
- View
- Help

### Keyboard Shortcuts

All shortcuts implemented using Electron accelerators with platform-aware handling.

### Window State Management

- Window size and position persisted using `electron-store`
- Bounds saved on close and restored on relaunch

-----

## Project Structure

```
apps/electron/
├── main.js                    # Main process entry point
├── preload.js                 # Secure contextBridge API
├── menus/
│   └── mainMenu.js            # Native menu bar definition
├── renderer/
│   ├── index.html             # HTML entry point
│   └── src/
│       ├── main.jsx           # React entry point
│       └── components/
│           ├── App.jsx        # Root component
│           ├── Login.jsx      # Login screen
│           ├── Dashboard.jsx  # Dashboard
│           ├── Tasks.jsx      # Task management
│           ├── Schedule.jsx   # Schedule and calendar
│           ├── Patients.jsx   # Patient list
│           ├── Settings.jsx   # Settings and accessibility
│           ├── Sidebar.jsx    # Navigation sidebar
│           ├── Shortcuts.jsx  # Keyboard shortcuts reference
│           ├── NewAppointmentModal.jsx
│           └── NewTaskModal.jsx
├── tests/                     # Jest test files
├── coverage/                  # Coverage HTML reports
├── dist/                      # Build output (gitignored)
└── package.json
```

-----

## Features

- **Dashboard** — active tasks, urgent tasks, appointments, and patients overview
- **Task Management** — filter tasks by All, Pending, In Progress, and Completed
- **Schedule** — calendar view with daily appointment list
- **Patient List** — patient roster with status indicators and care details
- **Settings — General** — layout preferences, left-handed mode, zoom level, user information
- **Settings — Accessibility** — enhanced keyboard navigation, persistent focus indicators, high contrast mode, reduce motion
- **Settings — Notifications** — task reminders, urgent task alerts, configurable reminder lead time
- **Left-Handed Mode** — moves the sidebar to the right side of the screen
- **Native Menu Bar** — full macOS menu bar with File, Edit, View, and Help menus
- **Keyboard Shortcuts** — platform-aware shortcuts via Electron accelerators

-----

## Testing

### Run Tests with Coverage

```bash
npm test
```

Coverage HTML report: `coverage/lcov-report/index.html`

### Test Coverage

Current coverage: **86%+ across all files** — exceeds the 60% minimum requirement.

Test suites cover:

- App
- Sidebar
- Dashboard
- Tasks
- Patients
- Schedule
- Settings
- Login
- Shortcuts
- IPC communication
- Window management logic

### Lint

```bash
npm run lint
```

ESLint configured and passing with zero warnings. No Electron security warnings at runtime.

-----

## Accessibility

CareConnect Desktop implements the following accessibility features:

- **Full keyboard navigation** — all interactive elements reachable via Tab
- **Visible focus indicators** — persistent focus rings on all controls
- **Enhanced Keyboard Navigation mode** — configurable in Settings → Accessibility
- **Left-Handed Mode** — sidebar repositions to the right for left-handed users
- **High Contrast Mode** — increased contrast for visual accessibility
- **Reduce Motion** — disables animations for users sensitive to motion
- **Semantic HTML** — proper heading hierarchy and ARIA labels throughout
- **Screen reader compatible** — tested with VoiceOver on macOS

Accessibility validated using axe DevTools and Lighthouse.

-----

## Known Issues

- Schedule screen requires appointment data to be present for full calendar rendering
- DMG build artifact is gitignored — submit separately as part of final submission package

-----

## Contributing

This app is part of the SWEN-661 Team 2 CareConnect project. See the root repository README for contribution guidelines and Git workflow.

-----

## AI Usage

AI tools including Claude, GitHub Copilot, and ChatGPT were used to assist with research, documentation, accessibility guidance, and code suggestions. All outputs were reviewed, validated, and understood by the team prior to inclusion in the final submission.