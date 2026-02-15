import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from './src/contexts/AppProviders';
import { useAuth } from './src/contexts/AuthContext';
import { DashboardProvider } from './src/contexts/DashboardContext';
import { MessagesProvider } from './src/contexts/MessagesContext';
import { PatientsProvider } from './src/contexts/PatientsContext';
import MainTabNavigator from './src/navigation/MainTabNavigator';

// Auth Screens
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import LoginScreen from './src/screens/LoginScreen';

// App Screens
import AboutCareConnectScreen from './src/screens/AboutCareConnectScreen';
import AccessibilityDetailScreen from './src/screens/AccessibilityDetailScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import MessageDetailScreen from './src/screens/MessageDetailScreen';
import MessagesListScreen from './src/screens/MessagesListScreen';
import PatientsListScreen from './src/screens/PatientsListScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TasksScreen from './src/screens/TasksScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

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
            <Stack.Screen name="MainApp">
              {() => (
                <DashboardProvider>
                  <MessagesProvider>
                    <PatientsProvider>
                      <MainTabNavigator />
                    </PatientsProvider>
                  </MessagesProvider>
                </DashboardProvider>
              )}
            </Stack.Screen>
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
            <Stack.Screen name="AccessibilityDetail" component={AccessibilityDetailScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
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
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="AboutCareConnect" component={AboutCareConnectScreen} />
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FAFB' }}>
        <Text style={{ fontSize: 16, color: '#333' }}>Loading...</Text>
      </View>
    );
  }

  console.log('[RootNavigator] Rendering:', isAuthenticated ? 'AppStack' : 'AuthStack');

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

/**
 * Main App Component
 * Updated with full navigation flow:
 * Welcome → Login → Dashboard → (Patients/Tasks/Messages/Settings)
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <RootNavigator />
      </AppProviders>
    </SafeAreaProvider>
  );
}
