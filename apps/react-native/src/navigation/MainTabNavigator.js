import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { messagesRepository } from '../repositories/MessagesRepository';

// Screens
import CaregiverDashboardScreen from '../screens/CaregiverDashboardScreen';
import PatientsScreen from '../screens/PatientsScreen';
import TasksScreen from '../screens/TasksScreen';
import MessagesListScreen from '../screens/MessagesListScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  // Moving this inside the component ensures it stays reactive if the screen re-renders
  const unreadCount = messagesRepository.unreadCount();

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
          tabBarIcon: ({ color }) => (
            <Text 
              style={{ fontSize: 24 }} 
              accessible={false} // Icon is decorative since label exists
            >🏠</Text>
          ),
          tabBarAccessibilityLabel: "Home Dashboard",
        }}
      />
      <Tab.Screen
        name="Patients"
        component={PatientsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }} accessible={false}>👥</Text>
          ),
          tabBarAccessibilityLabel: "Patients List",
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }} accessible={false}>✓</Text>
          ),
          tabBarAccessibilityLabel: "My Tasks",
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }} accessible={false}>💬</Text>
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          // Important: Announces "Messages, 3 unread items" instead of just "Messages"
          tabBarAccessibilityLabel: unreadCount > 0 
            ? `Messages, ${unreadCount} unread items` 
            : "Messages, no unread items",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24 }} accessible={false}>⚙️</Text>
          ),
          tabBarAccessibilityLabel: "App Settings",
        }}
      />
    </Tab.Navigator>
  );
}