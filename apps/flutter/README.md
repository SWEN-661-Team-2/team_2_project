# CareConnect — Flutter Mobile

> Supporting Care, Connecting Hearts

The Flutter mobile application for CareConnect, a cross-platform healthcare management app for caregivers and clinical staff. Available on Android and iOS.

-----

## Team

**Course:** SWEN-661 — User Interface Implementation  
**Institution:** University of Maryland Global Campus  
**Team:** Erin Ashford-Aleka, Eduardo Estrada, James Stevens

-----

## Tech Stack

- **Framework:** Flutter (stable channel)
- **Language:** Dart
- **State Management:** Provider + ChangeNotifier
- **Local Storage:** SharedPreferences, custom repository layer
- **Navigation:** Go Router
- **Testing:** flutter_test, integration_test
- **CI/CD:** GitHub Actions

-----

## Prerequisites

- Flutter SDK (stable channel)
- Dart SDK (bundled with Flutter)
- Android Studio with AVD (Android Virtual Device)
- Xcode (for iOS, macOS only)
- CocoaPods (for iOS dependencies)

Verify your Flutter installation:

```bash
flutter doctor
```

All items should show a green checkmark before running the app.

-----

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SWEN-661-Team-2/team_2_project.git
cd team_2_project/apps/flutter
```

### 2. Install dependencies

```bash
flutter pub get
```

### 3. Run the app

**Android Emulator:**

```bash
flutter emulators --launch Pixel_9_Pro
flutter run -d emulator-5554
```

**iOS Simulator:**

```bash
flutter emulators --launch apple_ios_simulator
flutter run -d iPhone
```

**Physical device (USB or wireless):**

```bash
flutter devices
flutter run -d <device-id>
```

The app will build and launch on the selected device.

-----

## Available Commands

|Command                       |Description                                     |
|------------------------------|------------------------------------------------|
|`flutter run`                 |Run on connected device or emulator             |
|`flutter run -d emulator-5554`|Run on Android emulator                         |
|`flutter run -d iPhone`       |Run on iOS Simulator                            |
|`flutter build apk`           |Build Android APK                               |
|`flutter build appbundle`     |Build Android AAB for Play Store                |
|`flutter build ipa`           |Build iOS IPA (requires Apple Developer account)|
|`flutter test`                |Run all unit and widget tests                   |
|`flutter test --coverage`     |Run tests with coverage report                  |
|`flutter analyze`             |Run static analysis                             |

-----

## Building for Release

### Android APK (direct install)

```bash
flutter build apk --release
```

Output: `build/app/outputs/flutter-apk/app-release.apk`

### Android AAB (Google Play)

```bash
flutter build appbundle --release
```

Output: `build/app/outputs/bundle/release/app-release.aab`

### iOS IPA

```bash
flutter build ipa
```

> **Note:** iOS builds require a valid Apple Developer account and provisioning profile. Contact the project administrator for signing credentials.

-----

## Testing

### Unit and Widget Tests

```bash
flutter test
```

### With Coverage Report

```bash
flutter test --coverage
```

Coverage output: `coverage/lcov.info`

To generate an HTML report (requires lcov):

```bash
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html
```

### Static Analysis

```bash
flutter analyze
```

-----

## Project Structure

```
apps/flutter/
├── lib/
│   ├── app/
│   │   ├── app.dart               # Root app widget
│   │   ├── app_shell.dart         # Navigation shell
│   │   ├── app_scope.dart         # Dependency injection scope
│   │   ├── providers.dart         # Provider setup
│   │   └── routes.dart            # Go Router route definitions
│   ├── core/
│   │   ├── accessibility/         # Accessibility settings and profiles
│   │   ├── layout/                # Responsive breakpoints
│   │   ├── messages/              # Message model and repository
│   │   ├── patients/              # Patient model and repository
│   │   ├── profile/               # Caregiver profile model and storage
│   │   ├── tasks/                 # Task model and repository
│   │   ├── theme/                 # App theme (light/dark)
│   │   ├── tokens/                # Design tokens (colors, spacing, typography)
│   │   └── utils/                 # Shared utilities
│   ├── features/
│   │   ├── auth/                  # Login and change password screens
│   │   ├── caregiver_dashboard/   # Dashboard screen
│   │   ├── messages/              # Messages list screen
│   │   ├── patients/              # Patients list screen
│   │   ├── profile/               # Profile screen
│   │   ├── settings/              # Settings and accessibility screens
│   │   ├── tasks/                 # Tasks screen
│   │   ├── welcome/               # Welcome screen
│   │   ├── about/                 # About screen
│   │   ├── help/                  # Help and support screen
│   │   └── privacy/               # Privacy policy and terms screens
│   ├── widgets/
│   │   ├── a11y_overlay.dart      # Accessibility overlay widget
│   │   ├── app_logo.dart          # App logo widget
│   │   ├── handedness_toggle_button.dart  # Left/right hand toggle
│   │   └── reach_scaffold.dart    # Custom scaffold with handedness support
│   └── main.dart                  # App entry point
├── test/
├── android/
├── ios/
├── pubspec.yaml
└── README.md
```

-----

## Features

- **Dashboard** — active tasks, urgent tasks, appointments, and patients summary
- **Task Management** — view, filter, and complete care tasks
- **Patient List** — full patient roster with status indicators
- **Messages** — caregiver messaging and notifications
- **Settings** — account, notifications, display, and accessibility preferences
- **Left-Handed Navigation Mode** — moves navigation to the right side of the screen
- **Accessibility Profiles** — Low Vision, Tremor/Motor, Cognitive Load (STML), Hearing Impaired
- **High Contrast Mode** — increased contrast for visual accessibility
- **Text Size Adjustment** — configurable text scaling
- **Dark Mode** — system-aware dark theme support
- **Screen Reader Support** — compatible with TalkBack (Android) and VoiceOver (iOS)

-----

## Responsive Breakpoints

|Breakpoint|Width         |Layout                          |
|----------|--------------|--------------------------------|
|Mobile    |< 600px       |Single column, bottom navigation|
|Tablet    |600px – 1024px|Two column, side navigation     |
|Desktop   |1024px+       |Full sidebar navigation         |

-----

## Accessibility

CareConnect Flutter implements the following accessibility features:

- **Semantics** labels on all interactive elements for TalkBack and VoiceOver
- **Left-Handed Mode** — repositions navigation for left-handed users
- **Handedness Toggle** — floating toggle button for quick layout switching
- **Accessibility Profiles** — Low Vision, Tremor/Motor, Cognitive Load (STML), Hearing Impaired
- **High Contrast Mode** — meets WCAG 2.1 contrast requirements
- **Text Size Scaling** — respects system font size settings
- **Minimum touch targets** — all interactive elements meet 48×48dp minimum

-----

## Simulator Notes

### Android Emulator

- Mouse wheel scrolling works as expected
- Click-and-drag scrolling also works

### iOS Simulator (macOS)

- If mouse wheel or trackpad scrolling does not respond, use **click + drag** inside the simulator window
- This is a known iOS Simulator input behavior and not an application bug

-----

## Known Issues

- iOS builds require access to the professor’s Apple Developer account for signing
- Photo upload is limited to mobile platforms (Android/iOS)

-----

## Contributing

This app is part of the SWEN-661 Team 2 CareConnect project. See the root repository README for contribution guidelines and Git workflow.

-----

## AI Usage

AI tools including Claude, GitHub Copilot, and ChatGPT were used to assist with research, documentation, accessibility guidance, and code suggestions. All outputs were reviewed, validated, and understood by the team prior to inclusion in the final submission.