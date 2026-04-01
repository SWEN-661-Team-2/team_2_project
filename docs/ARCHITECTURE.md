# CareConnect — Architecture Overview

## System Overview

CareConnect is a cross-platform healthcare management application delivered across four independent platform implementations sharing a common design language, feature set, and data model. The four platforms are Flutter mobile (Android and iOS), React Native mobile (Android and iOS), Electron desktop (macOS), and React web (PWA). Each platform is independently deployable and operates as a standalone application with no shared runtime dependencies between platforms.

-----

## Platform Architecture

### Flutter Mobile

The Flutter application follows a layered architecture with a clear separation between the UI layer, business logic, and data layer.

- **Presentation Layer** — Feature screens and reusable widgets in `lib/features/` and `lib/widgets/`
- **Business Logic Layer** — Controllers and context providers in `lib/core/`
- **Data Layer** — Repository classes in `lib/core/*/` that abstract local storage via SharedPreferences
- **Navigation** — Go Router handles declarative route definitions in `lib/app/routes.dart`
- **Dependency Injection** — Provider pattern via `lib/app/providers.dart` and `lib/app/app_scope.dart`
- **Theme** — Centralized design tokens in `lib/core/tokens/` and theme configuration in `lib/core/theme/`

### React Native Mobile

The React Native application follows a context-driven architecture with a repository pattern for data access.

- **Presentation Layer** — Screen components in `src/screens/` and reusable components in `src/screens/components/`
- **State Management** — React Context API via multiple context providers in `src/contexts/`
- **Data Layer** — Repository classes in `src/repositories/` wrapping AsyncStorage
- **Models** — Plain JavaScript data models in `src/models/`
- **Navigation** — React Navigation v6 with Stack and Tab navigators in `src/navigation/`
- **Services** — Expo Notifications via `src/services/notificationService.js`

### Electron Desktop

The Electron application follows the official Electron process separation model with a React renderer.

- **Main Process** — `main.js` manages the application lifecycle, window management, IPC registration, and native menu bar
- **Preload Script** — `preload.js` exposes a secure `contextBridge` API (`window.careconnect`) to the renderer
- **Renderer Process** — React application in `renderer/src/` with no direct access to Node.js or Electron APIs
- **IPC Communication** — All renderer-to-main communication flows through the preload bridge
- **Native Menus** — Defined in `menus/mainMenu.js` using `Menu.buildFromTemplate`
- **Window State** — Persisted using `electron-store` across sessions

### React Web (PWA)

The React web application follows a component-driven architecture with centralized state management and client-side persistence.

- **Presentation Layer** — Page components and modal components in `src/app/components/`
- **State Management** — React Context API via `src/app/context/AppContext.tsx`
- **Routing** — React Router v6 with URL-based navigation in `src/App.tsx`
- **Data Layer** — Dexie (IndexedDB wrapper) defined in `src/db.ts` for persistent client-side storage
- **PWA** — Service worker (`public/sw.js`) implementing cache-first for static assets and network-first for API requests; Web App Manifest at `public/manifest.json`
- **Deployment** — Vercel with automatic deployment on push to `main`

-----

## Shared Design Principles

All four platforms share the following architectural principles:

**Left-Handed Navigation Mode** — Each platform implements a mechanism to reposition the primary navigation to the right side of the screen. On Flutter and React Native this is controlled via an accessibility settings controller. On Electron it is a settings toggle. On React web it is managed via the global AppContext and persisted to localStorage.

**Accessibility-First** — All platforms implement screen reader support, minimum touch targets, semantic markup or widget labeling, and configurable accessibility profiles.

**Offline Capability** — Flutter and React Native use local repositories backed by device storage. The React web PWA uses IndexedDB via Dexie and a service worker cache. Electron uses local in-memory state with electron-store for settings persistence.

**Repository Pattern** — Flutter, React Native, and React web all use a repository abstraction layer that decouples the presentation layer from the underlying storage mechanism, making it straightforward to swap storage implementations without affecting UI components.

**Component Isolation** — All four platforms follow a philosophy of small, focused components or widgets with clearly defined responsibilities. Modals, navigation, and page-level components are separated into distinct files.

-----

## Data Flow

### Flutter and React Native

```
Screen → Context Provider → Repository → Local Storage (SharedPreferences / AsyncStorage)
                ↑                                ↓
           State Update ←────────────────── Data Read
```

### Electron

```
Renderer (React) → contextBridge (preload.js) → IPC → Main Process
                                                          ↓
                                                   electron-store
```

### React Web

```
Component → AppContext → Dexie (IndexedDB)
               ↑               ↓
          State Update ← Live Query (useLiveQuery)
```

-----

## Deployment Architecture

|Platform    |Target       |Deployment Method                    |
|------------|-------------|-------------------------------------|
|Flutter     |Android / iOS|APK/AAB direct install or app store  |
|React Native|Android / iOS|APK/AAB direct install or app store  |
|Electron    |macOS        |DMG installer via electron-builder   |
|React Web   |Browser / PWA|Vercel (auto-deploy from main branch)|

-----

## Security Considerations

- The Electron renderer operates with `contextIsolation: true`, `nodeIntegration: false`, and `sandbox: true`
- No sensitive patient data is stored in browser localStorage on the web platform — all data is in IndexedDB
- The React web application is served exclusively over HTTPS via Vercel
- No authentication tokens or credentials are stored in version control
- All platforms validate user input at the form level before processing

-----

## Testing Architecture

|Platform    |Unit/Integration            |E2E             |
|------------|----------------------------|----------------|
|Flutter     |flutter_test                |integration_test|
|React Native|Jest + React Testing Library|Detox           |
|Electron    |Jest + React Testing Library|—               |
|React Web   |Jest + React Testing Library|Playwright      |

The React web platform achieves 91.68% statement coverage across 181 unit and integration tests, with 21 Playwright E2E tests passing across Chrome, Firefox, and Safari.