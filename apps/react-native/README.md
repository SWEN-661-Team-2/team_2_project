# CareConnect - React Native

React Native (mobile) version of the CareConnect Flutter application for iOS and Android.

## 🚀 Features

- ✅ **Cross-Platform**: Runs on iOS and Android
- ✅ **Handedness Toggle**: Left/right-handed UI layouts
- ✅ **Welcome Screen**: Landing page with quick navigation
- ✅ **Tasks Screen**: Filterable task list
- ✅ **Patients Screen**: Patient directory
- ✅ **Navigation**: Stack navigation with back buttons
- ✅ **Dark Mode**: Theme switching support

## 📱 Screenshots

Works on iOS and Android devices and emulators.

## 📂 Project Structure

```
careconnect-react-native/
├── App.js                    # Main app entry (NavigationContainer)
├── app.json                  # Expo configuration
├── babel.config.js           # Babel configuration
├── package.json              # Dependencies
├── src/
│   ├── screens/              # Screen components
│   │   ├── WelcomeScreen.js
│   │   ├── TasksScreen.js
│   │   ├── PatientsScreen.js
│   │   ├── ScheduleScreen.js
│   │   └── ProfileScreen.js
│   ├── contexts/             # React Context providers
│   │   └── AppProviders.js
│   └── components/           # Reusable components (future)
└── assets/                   # Images, fonts, etc.
```

## 🎯 Flutter → React Native Mapping

| Flutter | React Native |
|---------|--------------|
| `main()` | `App.js` with `NavigationContainer` |
| `MaterialApp` | `NavigationContainer` + `Stack.Navigator` |
| `Navigator.pushNamed()` | `navigation.navigate()` |
| `Navigator.pop()` | `navigation.goBack()` |
| `Provider` | React Context API |
| `StatelessWidget` | Functional component |
| `StatefulWidget` | `useState` hook |
| `Container` | `View` |
| `Text` | `Text` |
| `ElevatedButton` | `TouchableOpacity` |
| `Column` | `View` with `flexDirection: 'column'` |
| `Row` | `View` with `flexDirection: 'row'` |

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app (for testing on physical devices)

### Install Dependencies

```bash
cd careconnect-react-native
npm install
```

### Run the App

```bash
# Start Expo dev server
npm start

# Run on iOS simulator (Mac only)
npm run ios

# Run on Android emulator
npm run android

# Run in web browser (for testing)
npm run web
```

### Using Expo Go on Physical Device

1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Run `npm start`
3. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## 🔧 Tech Stack

- **React Native 0.73** - Mobile framework
- **Expo 50** - Development platform
- **React Navigation 6** - Navigation library
- **React Context API** - State management
- **StyleSheet API** - Styling

## 🎨 Key Components

### Navigation
Uses React Navigation with Stack Navigator:
- Welcome → Tasks, Patients, Schedule, Profile
- Back button on all screens except Welcome

### Context Providers

**HandednessContext**
```javascript
const { isLeftHanded, toggleHandedness } = useHandedness();
```

**ThemeContext**
```javascript
const { colors, isDarkMode, toggleTheme } = useTheme();
```

### Screens

**WelcomeScreen** - Landing page
- Handedness toggle
- Carousel placeholder
- Quick navigation buttons

**TasksScreen** - Task management
- Filter buttons (All, Pending, Completed, High Priority)
- Task cards with status and priority badges
- Back button navigation

**PatientsScreen** - Patient list
- Patient cards with photo emoji
- Name, age, and condition
- Touch-enabled cards

**ProfileScreen** - Settings
- Handedness toggle
- Dark mode toggle

## 📝 Development Notes

### Styling
- Uses `StyleSheet.create()` for performance
- Follows React Native best practices
- Responsive to device dimensions
- Supports dark mode via theme colors

### State Management
- Context API for global state
- No external libraries needed
- Custom hooks for easy access

### Navigation
- Stack Navigator for screen hierarchy
- Programmatic navigation with `navigation.navigate()`
- Back button with `navigation.goBack()`

## 🚧 Differences from Flutter

| Feature | Flutter | React Native |
|---------|---------|--------------|
| Layout | Widget tree | JSX with View components |
| Styling | Widget properties | StyleSheet objects |
| Navigation | Named routes | React Navigation |
| State | Provider package | Context API |
| Lists | ListView/GridView | FlatList |
| Gestures | GestureDetector | TouchableOpacity |

## 📦 Building for Production

### iOS (Mac required)

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
# Run Coverage Report
npm test -- --coverage
# Target Specific Modules
npm test __tests__/navigation/MainTabNavigator.test.js
```

### 📊 Project Test Coverage Report

Target Coverage: 75% Global Coverage.

| Directory / File | % Statements | % Branches | % Functions | % Lines |
| :--- | :--- | :--- | :--- | :--- |
| **All Files** | **84.45%** | **81.03%** | **78.30%** | **86.80%** |
| `components` | 100% | 83.33% | 100% | 100% |
| `contexts` | 78.66% | 69.84% | 63.26% | 81.25% |
| `models` | 100% | 98.36% | 100% | 100% |
| `navigation` | 100% | 100% | 100% | 100% |
| `repositories` | 95.77% | 87.09% | 93.75% | 95.16% |
| `screens` | 81.57% | 78.28% | 74.50% | 84.39% |
| `screens/components` | 95.83% | 85.33% | 100% | 100% |
| `utils` | 100% | 100% | 100% | 100% |



## 🆚 React vs React Native

**React (Web)**
- Runs in browser
- HTML elements (`<div>`, `<span>`)
- CSS styling
- DOM manipulation

**React Native (Mobile)**
- Runs on iOS/Android
- Native components (`<View>`, `<Text>`)
- StyleSheet API
- Native APIs (Camera, GPS, etc.)

## 🔄 Migration from Flutter

1. **Widgets → Components**: Flutter widgets become React Native components
2. **setState → useState**: State management uses React hooks
3. **Navigator → React Navigation**: Route-based navigation
4. **Material → Native**: Material widgets become native components

## 📄 License

Academic use only - SWEN 661 Team 2 Project

## 👥 Team

- Corey Bayliss
- James Stevens
- Tako Wiliss

---

**Note**: This is the mobile (iOS/Android) version using React Native, not the web version using React.
