# CareConnect — React Native Mobile

> Supporting Care, Connecting Hearts

The React Native mobile application for CareConnect, a cross-platform healthcare management app for caregivers and clinical staff. Available on Android and iOS.

-----

## Team

**Course:** SWEN-661 — User Interface Implementation  
**Institution:** University of Maryland Global Campus  
**Team:** Erin Ashford-Aleka, Eduardo Estrada, James Stevens

-----

## Tech Stack

- **Framework:** React Native
- **Platform:** Expo (managed workflow)
- **Language:** JavaScript
- **Navigation:** React Navigation v6 (Stack + Tab)
- **State Management:** React Context API
- **Local Storage:** AsyncStorage, custom repository layer
- **Testing:** Jest, React Testing Library, Detox (E2E)
- **Notifications:** Expo Notifications

-----

## Prerequisites

- Node.js 18+
- npm 9+
- Android Studio with AVD (for Android)
- Xcode (for iOS, macOS only)
- Java 17 (Temurin recommended)
- Expo CLI: `npm install -g expo-cli`

-----

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SWEN-661-Team-2/team_2_project.git
cd team_2_project/apps/react-native
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set required environment variable

```bash
export NODE_ENV=development
```

### 4. Run the app

**Android Emulator:**

```bash
npx react-native run-android
```

**iOS Simulator (macOS only):**

```bash
npx react-native run-ios
```

**Using Expo Go on a physical device:**

1. Install Expo Go from the App Store (iOS) or Play Store (Android)
1. Run `npm start`
1. Scan the QR code with the Camera app (iOS) or Expo Go app (Android)

-----

## Available Commands

|Command                       |Description                      |
|------------------------------|---------------------------------|
|`npm start`                   |Start the Metro bundler          |
|`npx react-native run-android`|Run on Android emulator or device|
|`npx react-native run-ios`    |Run on iOS Simulator (macOS only)|
|`npm test`                    |Run Jest unit tests              |
|`npm test -- --coverage`      |Run tests with coverage report   |
|`npm run test:e2e`            |Run Detox E2E tests              |

-----

## Building for Production

### Android APK (direct install)

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Android AAB (Google Play)

```bash
cd android
./gradlew bundleRelease
```

### iOS IPA

```bash
npx react-native build-ios --mode Release
```

> **Note:** iOS builds require a valid Apple Developer account and provisioning profile.

-----

## Gradle Troubleshooting

If the Android build fails with Gradle cache corruption errors:

```bash
rm -rf ~/.gradle/caches/8.14.3
export NODE_ENV=development
npx react-native run-android
```

If issues persist, also clear the project-level build cache:

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

-----

## Project Structure

```
apps/react-native/
├── App.js                          # Main app entry (NavigationContainer)
├── app.json                        # Expo configuration
├── babel.config.js                 # Babel configuration
├── src/
│   ├── contexts/                   # React Context providers
│   │   ├── AppProviders.js         # Root provider wrapper
│   │   ├── AppSettingsContext.js   # Accessibility and theme settings
│   │   ├── AuthContext.js          # Authentication state
│   │   ├── DashboardContext.js     # Dashboard data
│   │   ├── MessagesContext.js      # Messages data
│   │   ├── PatientsContext.js      # Patients data
│   │   └── ProfileContext.js       # Caregiver profile
│   ├── models/                     # Data models
│   │   ├── CaregiverMessage.js
│   │   ├── CaregiverProfile.js
│   │   ├── CaregiverTask.js
│   │   └── Patient.js
│   ├── navigation/
│   │   └── MainTabNavigator.js     # Tab and stack navigation
│   ├── repositories/               # Data access layer
│   │   ├── MessagesRepository.js
│   │   ├── PatientsRepository.js
│   │   └── TasksRepository.js
│   ├── screens/                    # Screen components
│   │   ├── components/             # Screen-level reusable components
│   │   ├── AccessibilityDetailScreen.js
│   │   ├── CaregiverDashboardScreen.js
│   │   ├── ChangePasswordScreen.js
│   │   ├── LoginScreen.js
│   │   ├── MessageDetailScreen.js
│   │   ├── MessagesListScreen.js
│   │   ├── PatientsListScreen.js
│   │   ├── PatientsScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── ScheduleScreen.js
│   │   ├── SettingsScreen.js
│   │   ├── TasksScreen.js
│   │   └── WelcomeScreen.js
│   ├── services/
│   │   └── notificationService.js  # Expo notifications
│   └── utils/
│       └── dtFormat.js             # Date/time formatting utilities
├── __tests__/                      # Jest test files
├── e2e/                            # Detox E2E tests
├── android/                        # Android native project
├── ios/                            # iOS native project
└── package.json
```

-----

## Features

- **Welcome Screen** — landing page with sign in and navigation
- **Dashboard** — active tasks, urgent tasks, appointments, and patients summary
- **Task Management** — filterable task list with priority and status badges
- **Patient Directory** — full patient roster with status indicators
- **Messages** — caregiver messaging list and detail view
- **Schedule** — daily schedule view
- **Profile** — caregiver profile management
- **Settings** — account, notifications, display, and accessibility preferences
- **Left-Handed Layout Mode** — moves navigation to the right side of the screen
- **Right-Handed Layout Mode** — default navigation layout
- **Toggle Mode** — floating handedness switch visible on every screen
- **Accessibility Profiles** — Low Vision, Tremor/Motor, Cognitive Load (STML), Hearing Impaired
- **High Contrast Mode** — increased contrast for visual accessibility
- **Dark Mode** — system-aware dark theme support
- **Screen Reader Support** — compatible with TalkBack (Android) and VoiceOver (iOS)

-----

## Testing

### Unit Tests

```bash
npm test
```

### With Coverage Report

```bash
npm test -- --coverage
```

### Target Specific Module

```bash
npm test __tests__/navigation/MainTabNavigator.test.js
```

### E2E Tests (Detox)

```bash
npm run test:e2e
```

-----

## Test Coverage

|Directory         |Statements|Branches  |Functions |Lines     |
|------------------|----------|----------|----------|----------|
|**All Files**     |**84.45%**|**81.03%**|**78.30%**|**86.80%**|
|components        |100%      |83.33%    |100%      |100%      |
|contexts          |78.66%    |69.84%    |63.26%    |81.25%    |
|models            |100%      |98.36%    |100%      |100%      |
|navigation        |100%      |100%      |100%      |100%      |
|repositories      |95.77%    |87.09%    |93.75%    |95.16%    |
|screens           |81.57%    |78.28%    |74.50%    |84.39%    |
|screens/components|95.83%    |85.33%    |100%      |100%      |
|utils             |100%      |100%      |100%      |100%      |

All metrics exceed the 60% minimum requirement.

-----

## Accessibility

CareConnect React Native implements the following accessibility features:

- **Left-Handed Layout Mode** — repositions navigation for left-handed users
- **Right-Handed Layout Mode** — default navigation layout
- **Toggle Mode** — floating handedness switch on every screen for quick switching
- **Accessibility Profiles** — Low Vision, Tremor/Motor, Cognitive Load (STML), Hearing Impaired
- **High Contrast Mode** — meets WCAG 2.1 contrast requirements
- **Text Size Scaling** — respects system font size settings
- **Minimum touch targets** — all interactive elements meet 44×44pt minimum
- **Screen Reader Support** — compatible with TalkBack (Android) and VoiceOver (iOS)
- **accessibilityLabel** on all interactive elements
- **accessibilityRole** defined on all buttons and controls

-----

## Known Issues

- Schedule screen is not fully implemented in this release
- iOS builds require a valid Apple Developer account for signing
- Build may fail with Gradle cache corruption — see Gradle Troubleshooting section above

-----

## Contributing

This app is part of the SWEN-661 Team 2 CareConnect project. See the root repository README for contribution guidelines and Git workflow.

-----

## AI Usage

AI tools including Claude, GitHub Copilot, and ChatGPT were used to assist with research, documentation, accessibility guidance, and code suggestions. All outputs were reviewed, validated, and understood by the team prior to inclusion in the final submission.