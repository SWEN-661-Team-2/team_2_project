# CareConnect Web Application

> Supporting Care, Connecting Hearts

A responsive Progressive Web App (PWA) for healthcare professionals built with React 19, TypeScript, Vite, and Tailwind CSS.

-----

## Team

**Course:** SWEN-661 — User Interface Implementation  
**Institution:** University of Maryland Global Campus  
**Team:** Erin Ashford-Aleka, Eduardo Estrada, James Stevens

-----

## Live Deployment

**Production URL:** https://careconnect-web-pi.vercel.app

-----

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v3
- **Routing:** React Router v6
- **State Management:** Context API
- **Forms:** react-hook-form
- **Database:** Dexie (IndexedDB)
- **Icons:** lucide-react
- **PWA:** Custom service worker + Web App Manifest
- **Testing:** Jest, React Testing Library, Playwright
- **Deployment:** Vercel

-----

## Prerequisites

- Node.js 18+
- npm 9+

-----

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SWEN-661-Team-2/team_2_project.git
cd team_2_project
```

### 2. Navigate to the React app

```bash
cd apps/react
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

-----

## Available Scripts

|Command                |Description                     |
|-----------------------|--------------------------------|
|`npm run dev`          |Start development server        |
|`npm run build`        |Build for production            |
|`npm run preview`      |Preview production build locally|
|`npm run lint`         |Run ESLint                      |
|`npm test`             |Run unit and integration tests  |
|`npm run test:coverage`|Run tests with coverage report  |
|`npm run test:e2e`     |Run Playwright E2E tests        |

-----

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

-----

## Testing

### Unit & Integration Tests (Jest + React Testing Library)

```bash
npm test
```

### With Coverage Report

```bash
npm run test:coverage
```

Coverage report will be generated at `coverage/lcov-report/index.html`

Open the report in your browser:

```bash
open coverage/lcov-report/index.html
```

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

-----

## Test Coverage

|Metric    |Coverage        |
|----------|----------------|
|Statements|91.68% (342/373)|
|Branches  |90.04% (199/221)|
|Functions |84.86% (129/152)|
|Lines     |92.71% (318/343)|

All 13 test suites pass with 181 unit/integration tests and 21 Playwright E2E tests across Chrome, Firefox, and Safari. All metrics exceed the 75% minimum requirement.

-----

## Deployment

### Vercel (Recommended)

#### Option 1 — Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

#### Option 2 — GitHub Integration

1. Go to https://vercel.com
1. Click “Add New Project”
1. Import `SWEN-661-Team-2/team_2_project`
1. Set root directory to `apps/react`
1. Click Deploy

The application deploys automatically on each push to the `main` branch via Vercel’s GitHub integration.

### Netlify

1. Build the project: `npm run build`
1. Drag and drop the `dist/` folder into [Netlify Drop](https://app.netlify.com/drop)

### GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
1. Add to `package.json` scripts: `"deploy": "gh-pages -d dist"`
1. Run: `npm run build && npm run deploy`

-----

## Project Structure

```
apps/react/
├── public/
│   ├── icons/
│   │   ├── icon-192.png       # PWA icon (192x192)
│   │   └── icon-512.png       # PWA icon (512x512)
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── careconnect_logo.png   # App logo
├── src/
│   ├── app/
│   │   ├── context/
│   │   │   └── AppContext.tsx  # Global state (Context API)
│   │   └── components/
│   │       ├── Login.tsx
│   │       ├── CareConnectNavigation.tsx
│   │       ├── CareConnectDashboard.tsx
│   │       ├── TaskManagement.tsx
│   │       ├── SchedulePage.tsx
│   │       ├── PatientCare.tsx
│   │       ├── SettingsPage.tsx
│   │       ├── NewAppointmentModal.tsx
│   │       ├── AddPatientModal.tsx
│   │       └── CreateTaskModal.tsx
│   ├── App.tsx                # Root component + routing
│   ├── db.ts                  # Dexie IndexedDB schema
│   ├── main.tsx               # Entry point + SW registration
│   └── index.css              # Tailwind directives
├── tests/
│   ├── unit/
│   └── e2e/
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

-----

## Features

- **Responsive design** — mobile (375px), tablet (768px), desktop (1440px)
- **Left-handed mode** — sidebar moves from left to right via toggle
- **PWA** — installable, offline-capable, 100 Lighthouse PWA score
- **React Router v6** — URL-based navigation with deep linking
- **Context API** — global state management for auth, theme, sidebar position
- **Dexie (IndexedDB)** — persistent client-side storage for tasks and patients
- **Authentication** — login with form validation via react-hook-form
- **Dashboard** — task summary, schedule, care log, activity feed
- **Task Management** — filter, search, create, and update tasks
- **Schedule** — calendar view with appointment timeline
- **Patient Care** — patient list with registration modal
- **Settings** — accessibility, notification, and layout preferences
- **Focus Trap** — all modals implement keyboard focus trapping using native `<dialog>` elements
- **Skip to Main Content** — keyboard bypass link at the top of every page

-----

## Responsive Breakpoints

|Breakpoint|Width         |Navigation                  |
|----------|--------------|----------------------------|
|Mobile    |< 768px       |Bottom tab bar              |
|Tablet    |768px – 1023px|Icon-only sidebar (80px)    |
|Desktop   |1024px+       |Full labeled sidebar (256px)|

-----

## PWA

The app is PWA-enabled and installable from the deployed URL.

**Requirements for install prompt:**

- PWA icons must be present at `public/icons/icon-192.png` and `public/icons/icon-512.png`
- App must be served over HTTPS
- Service worker must be active

**To install on desktop:**

1. Open https://careconnect-web-pi.vercel.app in Chrome
1. Click the install icon in the address bar
1. Click Install in the native dialog

**To install on mobile:**

1. Open the URL in Chrome or Safari
1. Tap Share → Add to Home Screen
1. Tap Add to confirm

Offline support: static assets and previously visited pages are cached via the service worker using a cache-first strategy for static assets and network-first for API requests.

**Regenerating PWA icons from the logo:**

```bash
magick public/careconnect_logo.png -resize 192x192 public/icons/icon-192.png
magick public/careconnect_logo.png -resize 512x512 public/icons/icon-512.png
```

-----

## Lighthouse Scores (Production)

|Category      |Score|
|--------------|-----|
|Performance   |100  |
|Accessibility |100  |
|Best Practices|100  |
|SEO           |100  |

Audited on deployed production URL: https://careconnect-web-pi.vercel.app

-----

## Accessibility

CareConnect achieves WCAG 2.1 Level AA compliance, validated through:

- **WAVE** — zero errors post-remediation
- **axe DevTools** — zero violations across Dashboard, Task Management, and Patient Care
- **Lighthouse** — accessibility scores of 98–100 across all pages
- **VoiceOver (macOS/iOS)** and **NVDA (Windows)** screen reader testing

**Implemented accessibility features:**

- Skip to Main Content link at the top of every page
- Full keyboard navigation — all interactive elements reachable via Tab
- Focus trap implemented in all three modals using native `<dialog>` elements
- Focus restored to triggering element on modal dismissal
- ARIA labels on all controls and inputs
- Semantic HTML5 lists (`<ul>/<li>`) for Urgent Tasks, Schedule, and Activity panels
- Native `<output>` elements for priority badges
- Visible focus indicators at all times
- Minimum 48px touch targets on mobile
- Screen reader compatible with NVDA and VoiceOver

-----

## Known Issues

- Authenticated routing branches in `App.tsx` are not fully covered by unit tests (covered by E2E)
- PWA install prompt requires icons to be present in `public/icons/` — see PWA section above

-----

## Contributing

This app is part of the SWEN-661 Team 2 CareConnect project. See the root repository README for contribution guidelines and Git workflow.

-----

## AI Usage

AI tools including Claude, GitHub Copilot, and ChatGPT were used to assist with research, documentation, accessibility guidance, and code suggestions. All outputs were reviewed, validated, and understood by the team prior to inclusion in the final submission.