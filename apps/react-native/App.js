import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProviders } from './src/contexts/AppProviders';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import PatientsScreen from './src/screens/PatientsScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

/**
 * Main App Component
 * React Native equivalent of Flutter's MyApp
 * 
 * Uses React Navigation (equivalent to Flutter's Navigator)
 */
export default function App() {
  return (
    <AppProviders>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
          <Stack.Screen name="Patients" component={PatientsScreen} />
          <Stack.Screen name="Schedule" component={ScheduleScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProviders>
  );
}
