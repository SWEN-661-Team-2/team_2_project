# CareConnect — Code Structure

## Repository Layout

CareConnect is organized as a monorepo with each platform in its own subdirectory under `apps/`. Documentation lives in `docs/`. Each platform is independently buildable and has its own `package.json` or `pubspec.yaml` and `.gitignore`.

```
team_2_project/
├── apps/
│   ├── flutter/          # Flutter mobile (Android & iOS)
│   ├── react-native/     # React Native mobile (Android & iOS)
│   ├── electron/         # Electron desktop (macOS)
│   └── react/            # React web PWA
├── docs/
│   ├── TEAM-CHARTER.md
│   ├── ARCHITECTURE.md
│   └── CODE_STRUCTURE.md
├── .gitignore
└── README.md
```

-----

## Flutter (`apps/flutter/`)

```
lib/
├── main.dart                          # App entry point
├── app/
│   ├── app.dart                       # Root MaterialApp widget
│   ├── app_shell.dart                 # Navigation shell with handedness support
│   ├── app_scope.dart                 # Dependency injection scope
│   ├── providers.dart                 # Provider registrations
│   └── routes.dart                    # Go Router route definitions
├── core/
│   ├── accessibility/
│   │   ├── app_settings_controller.dart   # Accessibility settings state
│   │   ├── app_settings_storage.dart      # Persists settings to SharedPreferences
│   │   ├── handedness.dart                # Handedness enum (left/right)
│   │   ├── reminder_frequency.dart        # Reminder frequency enum
│   │   └── text_size_mode.dart            # Text size mode enum
│   ├── layout/
│   │   └── breakpoints.dart               # Responsive breakpoint constants
│   ├── messages/
│   │   ├── caregiver_message.dart         # Message data model
│   │   ├── message.dart                   # Base message interface
│   │   └── messages_repository.dart       # Message data access
│   ├── patients/
│   │   ├── patient.dart                   # Patient data model
│   │   └── patients_repository.dart       # Patient data access
│   ├── profile/
│   │   ├── caregiver_profile.dart         # Profile data model
│   │   ├── caregiver_profile_controller.dart  # Profile state management
│   │   └── caregiver_profile_storage.dart     # Profile persistence
│   ├── tasks/
│   │   ├── caregiver_task.dart            # Task data model
│   │   └── tasks_repository.dart          # Task data access
│   ├── theme/
│   │   └── app_theme.dart                 # Light and dark theme definitions
│   ├── tokens/
│   │   ├── colors.dart                    # Design color tokens
│   │   ├── spacing.dart                   # Spacing scale
│   │   └── typography.dart                # Text style definitions
│   └── utils/
│       └── dt_format.dart                 # Date/time formatting helpers
├── features/
│   ├── auth/
│   │   ├── login_screen.dart              # Login screen
│   │   └── change_password_screen.dart    # Change password screen
│   ├── caregiver_dashboard/
│   │   └── caregiver_dashboard_screen.dart  # Main dashboard
│   ├── messages/
│   │   └── messages_list_screen.dart      # Messages list
│   ├── patients/
│   │   └── patients_list_screen.dart      # Patient roster
│   ├── profile/
│   │   └── profile_screen.dart            # Caregiver profile
│   ├── settings/
│   │   ├── settings_screen.dart           # Main settings screen
│   │   ├── accessibility_mode_detail_screen.dart  # Accessibility profile detail
│   │   └── frequency_screen.dart          # Reminder frequency picker
│   ├── tasks/
│   │   └── tasks_screen.dart              # Task list and management
│   ├── welcome/
│   │   └── welcome_screen.dart            # Welcome/onboarding screen
│   ├── about/
│   │   └── about_careconnect_screen.dart  # About screen
│   ├── help/
│   │   └── help_support_screen.dart       # Help and support
│   └── privacy/
│       ├── privacy_policy_screen.dart     # Privacy policy
│       └── terms_of_service_screen.dart   # Terms of service
└── widgets/
    ├── a11y_overlay.dart                  # Accessibility overlay
    ├── app_logo.dart                      # App logo widget
    ├── handedness_toggle_button.dart      # Floating handedness toggle
    └── reach_scaffold.dart               # Custom scaffold with sidebar support
```

**Naming conventions:** Files use `snake_case`. Classes use `PascalCase`. All screens are suffixed `_screen.dart`. All repositories are suffixed `_repository.dart`.

-----

## React Native (`apps/react-native/`)

```
src/
├── contexts/
│   ├── AppProviders.js          # Root provider wrapper — wraps all contexts
│   ├── AppSettingsContext.js    # Accessibility, theme, handedness settings
│   ├── AuthContext.js           # Authentication state and login logic
│   ├── DashboardContext.js      # Dashboard summary data
│   ├── MessagesContext.js       # Messages list state
│   ├── PatientsContext.js       # Patients list state
│   └── ProfileContext.js        # Caregiver profile state
├── models/
│   ├── CaregiverMessage.js      # Message data shape
│   ├── CaregiverProfile.js      # Profile data shape
│   ├── CaregiverTask.js         # Task data shape
│   └── Patient.js               # Patient data shape
├── navigation/
│   └── MainTabNavigator.js      # Tab and stack navigator definitions
├── repositories/
│   ├── MessagesRepository.js    # Message data access (AsyncStorage)
│   ├── PatientsRepository.js    # Patient data access (AsyncStorage)
│   └── TasksRepository.js       # Task data access (AsyncStorage)
├── screens/
│   ├── components/
│   │   ├── FilterMenu.js        # Reusable filter menu component
│   │   ├── MessageCard.js       # Message list card
│   │   ├── PatientCardComponents.js  # Patient card sub-components
│   │   ├── PatientFilterMenu.js # Patient-specific filter menu
│   │   ├── PatientRow.js        # Patient list row
│   │   ├── SectionHeader.js     # Section header component
│   │   └── StatCard.js          # Dashboard stat card
│   ├── AccessibilityDetailScreen.js    # Accessibility profile detail
│   ├── CaregiverDashboardScreen.js     # Main dashboard
│   ├── ChangePasswordScreen.js         # Change password
│   ├── LoginScreen.js                  # Login
│   ├── MessageDetailScreen.js          # Message detail view
│   ├── MessagesListScreen.js           # Messages list
│   ├── PatientsListScreen.js           # Full patient list
│   ├── PatientsScreen.js               # Patients tab screen
│   ├── ProfileScreen.js                # Caregiver profile
│   ├── ScheduleScreen.js               # Schedule view
│   ├── SettingsScreen.js               # Settings and accessibility
│   ├── TasksScreen.js                  # Task list and management
│   └── WelcomeScreen.js                # Welcome/onboarding
├── services/
│   └── notificationService.js   # Expo push notification setup
└── utils/
    └── dtFormat.js              # Date/time formatting helpers
```

**Naming conventions:** Files use `PascalCase` for screens and components, `camelCase` for utilities and services. Contexts are suffixed `Context.js`. Repositories are suffixed `Repository.js`.

-----

## Electron (`apps/electron/`)

```
├── main.js                        # Main process — window lifecycle, IPC, menus
├── preload.js                     # contextBridge API bridge
├── menus/
│   └── mainMenu.js                # Native macOS menu bar definition
├── renderer/
│   ├── index.html                 # HTML entry point
│   └── src/
│       ├── main.jsx               # React entry point
│       └── components/
│           ├── App.jsx            # Root component — routing and layout
│           ├── Login.jsx          # Login screen
│           ├── Dashboard.jsx      # Main dashboard
│           ├── Tasks.jsx          # Task management
│           ├── Schedule.jsx       # Schedule and calendar
│           ├── Patients.jsx       # Patient list
│           ├── Settings.jsx       # Settings — general, accessibility, notifications
│           ├── Sidebar.jsx        # Navigation sidebar
│           ├── Shortcuts.jsx      # Keyboard shortcuts reference
│           ├── NewAppointmentModal.jsx  # New appointment dialog
│           └── NewTaskModal.jsx         # New task dialog
└── tests/                         # Jest test files
```

**Naming conventions:** Main process files use `camelCase`. React components use `PascalCase`. Modals are suffixed `Modal.jsx`.

-----

## React Web (`apps/react/`)

```
public/
├── icons/
│   ├── icon-192.png               # PWA icon (192×192)
│   └── icon-512.png               # PWA icon (512×512)
├── careconnect_logo.png           # App logo
├── manifest.json                  # PWA web manifest
└── sw.js                          # Service worker

src/
├── app/
│   ├── context/
│   │   └── AppContext.tsx         # Global state — auth, theme, sidebar position
│   └── components/
│       ├── Login.tsx              # Login page with form validation
│       ├── CareConnectNavigation.tsx  # Responsive sidebar + mobile nav + skip link
│       ├── CareConnectDashboard.tsx   # Dashboard with summary cards and panels
│       ├── TaskManagement.tsx     # Task list with filter tabs and search
│       ├── SchedulePage.tsx       # Calendar and daily schedule view
│       ├── PatientCare.tsx        # Patient list and care management
│       ├── SettingsPage.tsx       # Settings — general, accessibility, notifications
│       ├── NewAppointmentModal.tsx    # New appointment dialog with focus trap
│       ├── AddPatientModal.tsx        # Add patient dialog with focus trap
│       └── CreateTaskModal.tsx        # Create task dialog with focus trap
├── db.ts                          # Dexie IndexedDB schema and table definitions
├── App.tsx                        # Root component — routing and layout
├── main.tsx                       # Entry point — React mount and SW registration
└── index.css                      # Tailwind CSS directives

tests/
├── unit/                          # Jest + React Testing Library unit tests
└── e2e/                           # Playwright E2E test specs
```

**Naming conventions:** All files use `PascalCase` for components and `camelCase` for utilities. Modals are suffixed `Modal.tsx`. Pages are unsuffixed. The context file is suffixed `Context.tsx`.

-----

## Shared Conventions Across Platforms

|Convention      |Flutter           |React Native         |Electron              |React Web              |
|----------------|------------------|---------------------|----------------------|-----------------------|
|Component naming|PascalCase widgets|PascalCase components|PascalCase components |PascalCase components  |
|File naming     |snake_case        |PascalCase           |PascalCase / camelCase|PascalCase             |
|State management|Provider          |Context API          |React useState        |Context API            |
|Data access     |Repository pattern|Repository pattern   |Direct state          |Dexie (IndexedDB)      |
|Navigation      |Go Router         |React Navigation     |IPC + App state       |React Router v6        |
|Styling         |Theme tokens      |StyleSheet API       |Tailwind CSS          |Tailwind CSS           |
|Testing         |flutter_test      |Jest + RTL           |Jest + RTL            |Jest + RTL + Playwright|

-----

## Key Files Reference

|File                                                              |Platform    |Purpose                   |
|------------------------------------------------------------------|------------|--------------------------|
|`apps/flutter/lib/main.dart`                                      |Flutter     |App entry point           |
|`apps/flutter/lib/app/routes.dart`                                |Flutter     |All route definitions     |
|`apps/flutter/lib/core/accessibility/app_settings_controller.dart`|Flutter     |Accessibility state       |
|`apps/react-native/App.js`                                        |React Native|App entry point           |
|`apps/react-native/src/navigation/MainTabNavigator.js`            |React Native|Navigation structure      |
|`apps/react-native/src/contexts/AppProviders.js`                  |React Native|Root provider wrapper     |
|`apps/electron/main.js`                                           |Electron    |Main process entry        |
|`apps/electron/preload.js`                                        |Electron    |Secure API bridge         |
|`apps/electron/renderer/src/components/App.jsx`                   |Electron    |Renderer root             |
|`apps/react/src/App.tsx`                                          |React Web   |Root component and routing|
|`apps/react/src/db.ts`                                            |React Web   |IndexedDB schema          |
|`apps/react/src/app/context/AppContext.tsx`                       |React Web   |Global state              |
|`apps/react/public/sw.js`                                         |React Web   |Service worker            |
|`apps/react/public/manifest.json`                                 |React Web   |PWA manifest              |
