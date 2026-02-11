import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useHandedness, useAppSettings } from '../contexts/AppProviders';

/**
 * Accessibility Mode Detail Screen
 * Shows details and toggle for individual accessibility modes
 */
export default function AccessibilityDetailScreen({ route, navigation }) {
  const { title, description, icon, enabled: initialEnabled, mode } = route.params;
  const { isLeftHanded } = useHandedness();
  const appSettings = useAppSettings();
  const [enabled, setEnabled] = useState(initialEnabled);

  const handleToggle = (value) => {
    setEnabled(value);
    // Update the corresponding setting based on mode
    switch(mode) {
      case 'lowVision':
        appSettings.setLowVisionEnabled(value);
        break;
      case 'tremor':
        appSettings.setTremorSupportEnabled(value);
        break;
      case 'cognitive':
        appSettings.setGuidedModeEnabled(value);
        break;
      case 'hearing':
        appSettings.setHearingImpairedEnabled(value);
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoIcon}>{icon}</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{title}</Text>
              <Text style={styles.infoDescription}>{description}</Text>
            </View>
          </View>
        </View>

        {/* Toggle Card */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            {isLeftHanded && <Switch value={enabled} onValueChange={handleToggle} />}
            <View style={styles.toggleContent}>
              <Text style={styles.toggleTitle}>
                {enabled ? 'Enabled' : 'Disabled'}
              </Text>
              <Text style={styles.toggleSubtitle}>
                Toggle on to activate (UI only for now).
              </Text>
            </View>
            {!isLeftHanded && <Switch value={enabled} onValueChange={handleToggle} />}
          </View>
        </View>

        {/* Note */}
        <Text style={styles.note}>
          Note: This mode currently updates UI state only. Functional mitigations are
          not implemented yet.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 32,
    color: '#0A7A8A',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoHeader: {
    flexDirection: 'row',
  },
  infoIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  toggleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleContent: {
    flex: 1,
    marginHorizontal: 16,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  note: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
