import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProviders } from './src/contexts/AppProviders';
import { useAuth } from './src/contexts/AuthContext';
import { DashboardProvider } from './src/contexts/DashboardContext';
import { MessagesProvider } from './src/contexts/MessagesContext';
import { PatientsProvider } from './src/contexts/PatientsContext';

// Auth Screens
import LoginScreen from './src/screens/LoginScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';

// App Screens
import CaregiverDashboardScreen from './src/screens/CaregiverDashboardScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import PatientsListScreen from './src/screens/PatientsListScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MessagesListScreen from './src/screens/MessagesListScreen';
import MessageDetailScreen from './src/screens/MessageDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

/**
 * Auth Stack Navigator
 * Displays login and auth-related screens
 */
function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
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
    <DashboardProvider>
      <MessagesProvider>
        <PatientsProvider>
          <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Dashboard" component={CaregiverDashboardScreen} />
            <Stack.Screen name="Home" component={WelcomeScreen} />
            <Stack.Screen name="Tasks" component={TasksScreen} />
            <Stack.Screen 
              name="Patients" 
              component={PatientsListScreen}
              options={{
                animationEnabled: true,
              }}
            />
            <Stack.Screen name="Schedule" component={ScheduleScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen 
              name="Messages" 
              component={MessagesListScreen}
              options={{
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="MessageDetail" 
              component={MessageDetailScreen}
              options={{
                animationEnabled: true,
              }}
            />
            <Stack.Screen 
              name="ChangePassword" 
              component={ChangePasswordScreen}
              options={{
                animationEnabled: true,
              }}
            />
          </Stack.Navigator>
        </PatientsProvider>
      </MessagesProvider>
    </DashboardProvider>
  );
}

/**
 * Root Navigator Component
 * Conditionally shows auth or app stack based on authentication state
 */
function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  console.log('[RootNavigator] AUTH STATE:', { isAuthenticated, loading });

  try {
    if (loading) {
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FAFB' }}>
          <Text style={{ fontSize: 16, color: '#333' }}>Loading...</Text>
        </SafeAreaView>
      );
    }

    console.log('[RootNavigator] Rendering:', isAuthenticated ? 'AppStack' : 'AuthStack');

    return (
      <NavigationContainer>
        {isAuthenticated ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    );
  } catch (error) {
    console.error('[RootNavigator] Error:', error);
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FAFB' }}>
        <Text style={{ fontSize: 16, color: '#d32f2f' }}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }
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
      <RootNavigator />
    </AppProviders>
  );
}
