import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useHandedness, useTheme } from '../contexts/AppProviders';

/**
 * Settings Screen
 * App settings and preferences
 */
export default function SettingsScreen({ navigation }) {
  const { isLeftHanded, toggleHandedness } = useHandedness();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Accessibility Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Handedness Mode</Text>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={toggleHandedness}
            >
              <Text style={styles.settingButtonText}>
                {isLeftHanded ? 'Left-Handed' : 'Right-Handed'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Theme</Text>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={toggleTheme}
            >
              <Text style={styles.settingButtonText}>
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingLabel}>Change Password</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => navigation.navigate('Welcome')}
          >
            <Text style={[styles.settingLabel, styles.logoutText]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CareConnect</Text>
            <Text style={styles.infoValue}>SWEN 661 Team 2</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#374151',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLabel: {
    fontSize: 16,
    color: '#374151',
  },
  settingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0A7A8A',
    borderRadius: 8,
  },
  settingButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  settingArrow: {
    fontSize: 24,
    color: '#9ca3af',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
});
