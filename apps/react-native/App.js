import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProviders } from './src/contexts/AppProviders';
import { useAuth } from './src/contexts/AuthContext';
import { DashboardProvider } from './src/contexts/DashboardContext';

// Auth Screens
import LoginScreen from './src/screens/LoginScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';

// App Screens
import CaregiverDashboardScreen from './src/screens/CaregiverDashboardScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import PatientsScreen from './src/screens/PatientsScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

/**
 * Auth Stack Navigator
 * Displays login and auth-related screens
 */
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

/**
 * App Stack Navigator
 * Displays main app screens when user is authenticated
 */
function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={CaregiverDashboardScreen} />
      <Stack.Screen name="Home" component={WelcomeScreen} />
      <Stack.Screen name="Tasks" component={TasksScreen} />
      <Stack.Screen name="Patients" component={PatientsScreen} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

/**
 * Root Navigator Component
 * Conditionally shows auth or app stack based on authentication state
 */
function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Could show a splash screen here
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

/**
 * Main App Component
 * React Native equivalent of Flutter's MyApp
 * 
 * Uses React Navigation (equivalent to Flutter's Navigator)
 */
export default function App() {
  return (
    <AppProviders>
      <DashboardProvider>
        <RootNavigator />
      </DashboardProvider>
    </AppProviders>
  );
}
