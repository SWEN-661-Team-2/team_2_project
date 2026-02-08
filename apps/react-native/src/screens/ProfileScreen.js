import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useHandedness, useTheme } from '../contexts/AppProviders';

export default function ProfileScreen({ navigation }) {
  const { isLeftHanded, toggleHandedness } = useHandedness();
  const { colors, isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Accessibility Settings
          </Text>

          <View style={styles.setting}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Handedness Mode
            </Text>
            <TouchableOpacity
              style={[styles.settingButton, { backgroundColor: colors.primary }]}
              onPress={toggleHandedness}
            >
              <Text style={styles.settingButtonText}>
                {isLeftHanded ? 'Left-Handed' : 'Right-Handed'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.setting}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Theme
            </Text>
            <TouchableOpacity
              style={[styles.settingButton, { backgroundColor: colors.primary }]}
              onPress={toggleTheme}
            >
              <Text style={styles.settingButtonText}>
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backIcon: { fontSize: 24, marginRight: 12 },
  title: { fontSize: 24, fontWeight: 'bold' },
  content: { padding: 20 },
  card: {
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  settingButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
