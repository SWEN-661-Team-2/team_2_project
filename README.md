# CareConnect

**Cross-Platform Healthcare Management for Caregivers and Clinical Staff**

CareConnect is a cross-platform healthcare management application designed for caregivers and clinical staff. It enables healthcare professionals to manage patients, tasks, appointments, schedules, and care logs from any device. A core design principle of CareConnect is physical accessibility — the application features a Left-Handed Navigation Mode across all platforms, recognizing that clinical environments often require one-handed device operation.

-----

## Team Information

**Team Name:** Team 2  
**Course:** SWEN 661 — User Interface Implementation  
**Institution:** University of Maryland Global Campus  
**Project Type:** Academic (UI/UX, Cross-Platform Development)

-----

## Team Members & Roles

|Member            |Primary Role                           |
|------------------|---------------------------------------|
|Erin Ashford-Aleka|UX Design & React Native Lead          |
|Eduardo Estrada   |Electron Desktop Lead                  |
|James Stevens     |Project Lead / React Web & Flutter Lead|

**Shared Responsibilities:**  
All team members contributed to:

- Documentation & reporting
- Research activities
- Testing & evaluation
- Design feedback and collaboration
- Accessibility compliance
- Reviewing major decisions

-----

## Communication Protocol

**Primary Channel:** Microsoft Teams  
**Secondary Channel:** UMGC Email  
**Backup/Emergency:** Phone (shared privately), only if:

- Blocking issue < 24 hours before deadline
- Unresponsiveness > 48 hours
- Instructor-directed urgency

**Response Expectations:** Within 24 hours (Mon–Fri)

**Weekly Meetings:** 15–30 min synchronous check-ins, additional ad-hoc meetings as needed.

-----

## Project Goals

CareConnect aims to:

1. Design and build UI layouts that support left-handed ergonomics without excluding right-handed users.
1. Deliver a fully functional cross-platform application across Flutter, React Native, Electron, and React.
1. Achieve WCAG 2.1 Level AA accessibility compliance across all platforms.
1. Apply human-centered design processes including research, prototyping, and usability testing.
1. Produce comprehensive documentation detailing architecture, testing, and accessibility outcomes.

-----

## Repository Structure

```text
team_2_project/
├── apps/
│   ├── flutter/          # Flutter mobile app (Android & iOS)
│   │   ├── lib/
│   │   ├── test/
│   │   ├── pubspec.yaml
│   │   └── README.md
│   ├── react-native/     # React Native mobile app (Android & iOS)
│   │   ├── src/
│   │   ├── android/
│   │   ├── ios/
│   │   ├── __tests__/
│   │   └── README.md
│   ├── electron/         # Electron desktop app (macOS)
│   │   ├── renderer/
│   │   ├── main.js
│   │   ├── preload.js
│   │   └── README.md
│   └── react/            # React web PWA
│       ├── src/
│       ├── public/
│       ├── tests/
│       └── README.md
├── docs/
│   └── TEAM-CHARTER.md
├── .gitignore
└── README.md
```

-----

## Tech Stack

|Platform      |Framework      |Language      |Key Libraries                       |
|--------------|---------------|--------------|------------------------------------|
|Flutter Mobile|Flutter        |Dart          |Provider, Dexie, flutter_test       |
|React Native  |React Native   |JavaScript    |Expo, React Navigation, AsyncStorage|
|Electron      |Electron + Vite|JavaScript/JSX|React, Tailwind CSS                 |
|React Web     |React 19 + Vite|TypeScript/TSX|Tailwind CSS, React Router, Dexie   |

-----

## Git Workflow

**Branching Convention:**  
`<member>-<platform>-<feature>` (e.g., `james-week-12`, `eduardo-electron-settings`)

**Pull Requests:**

- Required for all merges into `main`
- At least one peer review required
- Must pass build and tests

**Merge Policy:**

- No direct commits to `main`
- `main` must remain demo-ready at all times

-----

## Setup Instructions

### Prerequisites (All Platforms)

- Node.js 18+
- Git
- A terminal (zsh or bash)

Clone the repository:

```bash
git clone https://github.com/SWEN-661-Team-2/team_2_project.git
cd team_2_project
```

-----

### Flutter Mobile

**Prerequisites:**

- Flutter SDK (stable channel)
- Dart SDK (bundled with Flutter)
- Android Studio with AVD or Xcode for iOS Simulator

Verify Flutter installation:

```bash
flutter doctor
```

Install dependencies and run:

```bash
cd apps/flutter
flutter pub get
flutter run
```

Supported targets:

- Android emulator (`flutter run -d emulator-5554`)
- iOS Simulator (`flutter run -d iPhone`)
- Physical device (connected via USB or wireless)

Run tests:

```bash
flutter test
```

Generate coverage:

```bash
flutter test --coverage
```

Build Android APK:

```bash
flutter build apk
```

Build Android AAB:

```bash
flutter build appbundle
```

-----

### React Native Mobile

**Prerequisites:**

- Node.js 18+
- Android Studio with AVD
- Xcode (for iOS, macOS only)
- Java 17 (Temurin recommended)

Install dependencies:

```bash
cd apps/react-native
npm install
```

Set required environment variable:

```bash
export NODE_ENV=development
```

Run on Android:

```bash
npx react-native run-android
```

Run on iOS:

```bash
npx react-native run-ios
```

Run tests:

```bash
npm test
```

Run E2E tests (Detox):

```bash
npm run test:e2e
```

> **Note:** If Gradle build fails with cache corruption errors, clear the Gradle cache:
> 
> ```bash
> rm -rf ~/.gradle/caches/8.14.3
> ```

-----

### Electron Desktop

**Prerequisites:**

- Node.js 18+

Install dependencies and run in development mode:

```bash
cd apps/electron
npm install
npm run dev
```

The app opens automatically. The Vite dev server runs at `http://localhost:5173`.

Build production installer (macOS DMG):

```bash
npm run build
```

Output: `apps/electron/dist/CareConnect-0.1.0.dmg`

Run tests:

```bash
npm test
```

-----

### React Web

**Prerequisites:**

- Node.js 18+

Install dependencies:

```bash
cd apps/react
npm install
```

Run development server:

```bash
npm run dev
```

Development server runs at `http://localhost:5173`.

Run production build:

```bash
npm run build
npm run preview
```

Run unit and integration tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Coverage report: `apps/react/coverage/lcov-report/index.html`

Run E2E tests (Playwright):

```bash
npm run test:e2e
```

**Live Deployment:** https://careconnect-web-pi.vercel.app

The application deploys automatically to Vercel on each push to `main`.

-----

## Test Coverage Summary

|Platform    |Statements|Branches|Functions|Lines |
|------------|----------|--------|---------|------|
|React Web   |91.68%    |90.04%  |84.86%   |92.71%|
|Flutter     |60%+      |—       |—        |—     |
|React Native|60%+      |—       |—        |—     |
|Electron    |60%+      |—       |—        |—     |

React Web: 181 Jest unit/integration tests + 21 Playwright E2E tests, all passing across Chrome, Firefox, and Safari.

-----

## Accessibility

CareConnect achieves WCAG 2.1 Level AA compliance on the React web platform, validated through:

- WAVE — zero errors post-remediation
- axe DevTools — zero violations across all pages
- Lighthouse — accessibility scores of 98–100 across all pages
- VoiceOver (macOS/iOS) and NVDA (Windows) screen reader testing
- Full keyboard navigation with focus trap implementation on all modals

All four platforms implement Left-Handed Navigation Mode and accessibility profiles supporting Low Vision, Tremor/Motor, Cognitive Load (STML), and Hearing Impaired users.

-----

## Build Artifacts

Build artifacts are excluded from version control per each platform’s `.gitignore`. Artifacts are submitted separately as part of the final project submission.

|Platform    |Artifact                  |Build Command                 |
|------------|--------------------------|------------------------------|
|Flutter     |`app-release.apk` / `.aab`|`flutter build apk`           |
|React Native|`app-debug.apk`           |`npx react-native run-android`|
|Electron    |`CareConnect-0.1.0.dmg`   |`npm run build`               |
|React Web   |Deployed to Vercel        |Auto-deploy on push to main   |

-----

## AI Usage Summary

The team utilized AI tools including Claude, GitHub Copilot, and ChatGPT throughout the development process to assist with research, documentation drafting, accessibility guidance, code suggestions, and implementation support. Approximately 40% of the work was AI-assisted, encompassing research, documentation, and code suggestions. The remaining 60% represents human-created implementation, testing, validation, architectural decisions, and final review. All AI-generated outputs were reviewed, validated, and understood by the team prior to inclusion in the final submission.

-----

## Known Issues / Limitations

- React Native Schedule screen is not implemented in this release
- Electron Schedule screen requires data to be present for full rendering
- iOS builds require access to the professor’s Apple Developer account for signing
- PWA icon assets must be present in `public/icons/` for Chrome install prompt

-----

## License / Notes

This repository is for academic use as part of **SWEN 661 — User Interface Implementation** at the University of Maryland Global Campus. No parts of this project are intended for real clinical deployment.

-----

**End of README**