# React Native Auth Feature

## Overview

This document describes the React Native implementation of the authentication feature from the Flutter app. The auth feature provides login, logout, and password management functionality.

## Architecture

### File Structure

```
src/
├── contexts/
│   ├── AuthContext.js           # Authentication state and logic
│   └── AppProviders.js          # Combines all context providers
├── screens/
│   ├── LoginScreen.js           # Login page
│   ├── ChangePasswordScreen.js  # Change password page
│   └── ... (other screens)
└── ...

App.js                          # Main navigation setup with auth flow
```

## Components

### 1. AuthContext (`src/contexts/AuthContext.js`)

**Purpose**: Manages all authentication state and logic

**Key Features**:
- User authentication state
- Current user data
- Loading and error states
- Login/logout operations
- Password change functionality

**Exported Functions**:
```javascript
useAuth()
// Returns: { isAuthenticated, currentUser, loading, error, login, logout, changePassword }
```

**Methods**:
- `login(email, password)` - Authenticates user with email/password
- `logout()` - Clears authentication state
- `changePassword(oldPassword, newPassword, confirmPassword)` - Updates user password

### 2. LoginScreen (`src/screens/LoginScreen.js`)

**Purpose**: Provides user login interface

**Features**:
- Email and password input fields
- Password visibility toggle
- Input validation with error messages
- Security information display
- Loading state handling
- Handedness/RTL support (left/right-aligned layouts)

**Test IDs**:
- `login_email` - Email input field
- `login_password` - Password input field
- `login_title` - Screen title
- `login_submit` - Sign in button
- `login_forgot` - Forgot password button

### 3. ChangePasswordScreen (`src/screens/ChangePasswordScreen.js`)

**Purpose**: Allows users to change their password

**Features**:
- Old password input
- New password input
- Confirm password input
- Password visibility toggles
- Validation (passwords must match)
- Error message display
- Handedness/RTL support

**Test IDs**:
- `change_old` - Old password input
- `change_new` - New password input
- `change_confirm` - Confirm password input
- `change_save` - Save button

### 4. App Navigation (`App.js`)

**Purpose**: Manages authentication-based navigation

**Navigation Flows**:
1. **Not Authenticated**: Shows `AuthStack` with LoginScreen
2. **Authenticated**: Shows `AppStack` with main app screens

**Screens in AppStack**:
- Home (WelcomeScreen)
- Tasks (TasksScreen)
- Patients (PatientsScreen)
- Schedule (ScheduleScreen)
- Profile (ProfileScreen)
- ChangePassword (ChangePasswordScreen)

## Usage

### Using Authentication

```javascript
import { useAuth } from './src/contexts/AuthContext';

export default function MyComponent() {
  const { isAuthenticated, login, logout, currentUser } = useAuth();

  const handleLogin = async () => {
    const success = await login('user@example.com', 'password123');
    if (success) {
      // User is now authenticated
    }
  };

  return (
    // Your component JSX
  );
}
```

### Checking Authentication Status

```javascript
const { isAuthenticated, currentUser } = useAuth();

if (isAuthenticated) {
  return <Text>Welcome, {currentUser.name}</Text>;
}
```

### Changing Password

```javascript
const { changePassword, error } = useAuth();

const handlePasswordChange = async () => {
  const success = await changePassword(oldPw, newPw, confirmPw);
  if (success) {
    console.log('Password updated');
  } else if (error) {
    console.log('Error:', error);
  }
};
```

## Validation Rules

### Login
- Email: Required, must contain '@'
- Password: Required

### Change Password
- All fields required
- New password and confirmation must match
- Password minimum length: 6 characters

## UI/UX Features

### Handedness Support
Both LoginScreen and ChangePasswordScreen support left-handed and right-handed layouts using the `useHandedness()` hook:
- Eye icon placement adjusts based on `isLeftHanded`
- Text alignment can be adjusted (RTL support)

### Accessibility
- Test IDs on interactive elements
- Semantic TextInput with appropriate keyboard types
- Screen reader support through React Native

### Security
- Password fields use `secureTextEntry` to hide characters
- Bank-level encryption messaging on login screen
- No password storage in this example (mock implementation)

## Styling

All screens use consistent styling:
- Primary color: `#0A7A8A` (teal)
- Background: `#F7FAFB` (light gray)
- Error color: `#E74C3C` (red)
- Border color: `#DDD` (light gray)

## State Management

The authentication state uses React Context API:
- Centralized auth state
- Easy to access from any component
- No extra dependencies (uses built-in React Context)

## Future Enhancements

1. **Real Backend Integration**
   - Replace mock authentication with actual API calls
   - Token management (JWT, OAuth, etc.)
   - Refresh token handling

2. **Biometric Authentication**
   - Fingerprint/Face ID support
   - Expo's `expo-local-authentication` package

3. **Session Management**
   - Auto-logout on inactivity
   - Persistent authentication (AsyncStorage)

4. **Error Handling**
   - Network error handling
   - More granular error types
   - User-friendly error messages

5. **Enhanced Security**
   - Password requirements validation
   - Failed login attempt tracking
   - Account lockout after X failed attempts

## Testing

Test IDs are provided for UI testing:

```javascript
// Using React Native Testing Library
import { render, fireEvent } from '@testing-library/react-native';

test('login with valid credentials', async () => {
  const { getByTestId } = render(<LoginScreen />);
  
  fireEvent.changeText(getByTestId('login_email'), 'test@example.com');
  fireEvent.changeText(getByTestId('login_password'), 'password123');
  fireEvent.press(getByTestId('login_submit'));
});
```

## Comparison with Flutter Implementation

| Feature | Flutter | React Native |
|---------|---------|--------------|
| Auth Context | Provider | React Context |
| Screens | StatefulWidget | Functional Component |
| Navigation | Navigator | React Navigation |
| State Management | Provider package | Context API |
| Password Toggle | IconButton | TouchableOpacity |
| Error Handling | setState | useState |
| Async Operations | Future | Promise |

## Notes

- The current implementation uses mock authentication (no real backend)
- All passwords are validated locally only
- User data is not persisted across app restarts
- For production, integrate with a real authentication service (Firebase, AWS Cognito, custom backend, etc.)
