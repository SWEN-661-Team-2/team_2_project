import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Screens
import CaregiverDashboardScreen from '../screens/CaregiverDashboardScreen';
import PatientsScreen from '../screens/PatientsScreen';
import TasksScreen from '../screens/TasksScreen';
import MessagesListScreen from '../screens/MessagesListScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

/**
 * Main Tab Navigator
 * Bottom navigation: Home | Patients | Tasks | Messages | Settings
 */
export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0A7A8A',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={CaregiverDashboardScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Patients"
        component={PatientsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👥</Text>,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>✓</Text>,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesListScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💬</Text>,
          tabBarBadge: 3, // TODO: Make dynamic based on unread count
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
