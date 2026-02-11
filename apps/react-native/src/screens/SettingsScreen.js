import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { useHandedness, useTheme, useAppSettings } from '../contexts/AppProviders';
import HandednessToggleOverlay from '../components/HandednessToggleOverlay';

/**
 * Settings Screen - Enhanced to match Flutter version
 * Includes: Account, Notifications, Display, Accessibility, Handedness, Privacy, Help
 */
export default function SettingsScreen({ navigation }) {
  const { isLeftHanded, toggleHandedness, handednessMode, setHandednessMode } = useHandedness();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { 
    notificationsEnabled, 
    setNotificationsEnabled,
    reminderFrequency,
    setReminderFrequency,
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    lowVisionEnabled,
    setLowVisionEnabled,
    tremorSupportEnabled,
    setTremorSupportEnabled,
    guidedModeEnabled,
    setGuidedModeEnabled,
    hearingImpairedEnabled,
    setHearingImpairedEnabled,
  } = useAppSettings();

  const [showReminderPicker, setShowReminderPicker] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo/careconnect_logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>CareConnect</Text>
        </View>

        {/* Account & Profile */}
        <SectionHeader title="Account & Profile" />
        <HandedListTile
          title="Profile information"
          icon="›"
          isLeftAligned={isLeftHanded}
          onPress={() => navigation.navigate('Profile')}
        />
        <HandedListTile
          title="Change password"
          icon="›"
          isLeftAligned={isLeftHanded}
          onPress={() => navigation.navigate('ChangePassword')}
        />

        <Divider />

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <HandedSwitchListTile
          title="Notifications"
          subtitle="Enable reminders and alerts"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          isLeftAligned={isLeftHanded}
        />
        <TouchableOpacity onPress={() => setShowReminderPicker(true)}>
          <HandedListTile
            title="Reminder frequency"
            subtitle={getReminderLabel(reminderFrequency)}
            icon="›"
            isLeftAligned={isLeftHanded}
            onPress={() => setShowReminderPicker(true)}
          />
        </TouchableOpacity>

        <Divider />

        {/* Display */}
        <SectionHeader title="Display" />
        <Text style={[styles.sectionSubtitle, styles.marginTop, { color: colors.text }]}>Contrast</Text>
        <TextSizeSelector 
          selected={textSize} 
          onSelect={setTextSize}
          isLeftAligned={isLeftHanded}
        />

        <Text style={[styles.sectionSubtitle, styles.marginTop, { color: colors.text }]}>Contrast</Text>
        <View style={[styles.card, { backgroundColor: isDarkMode ? '#374151' : '#ffffff' }]}>
          <HandedListTile
            title={isDarkMode ? 'Night / High Contrast' : 'Day / Normal'}
            subtitle="Toggle contrast mode (persisted)"
            icon={isDarkMode ? '🌙' : '☀️'}
            isLeftAligned={isLeftHanded}
            onPress={toggleTheme}
          />
        </View>

        <Divider />

        {/* Accessibility */}
        <SectionHeader title="Accessibility" />
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          Select a profile to review mitigation goals. Toggle is UI-only for now.
        </Text>

        <AccessibilityModeTile
          title="Low Vision"
          subtitle="Larger text + improved contrast (UI only)"
          icon="👁️"
          enabled={lowVisionEnabled}
          isLeftAligned={isLeftHanded}
          onPress={() => navigation.navigate('AccessibilityDetail', {
            title: 'Low Vision',
            description: 'UI-only toggle for now. Functional mitigations will be implemented later.',
            icon: '👁️',
            enabled: lowVisionEnabled,
            mode: 'lowVision',
          })}
        />

        <AccessibilityModeTile
          title="Tremor / Motor"
          subtitle="Larger targets + reduced precision (UI only)"
          icon="✋"
          enabled={tremorSupportEnabled}
          isLeftAligned={isLeftHanded}
          onPress={() => navigation.navigate('AccessibilityDetail', {
            title: 'Tremor / Motor',
            description: 'UI-only toggle for now. Functional mitigations will be implemented later.',
            icon: '✋',
            enabled: tremorSupportEnabled,
            mode: 'tremor',
          })}
        />

        <AccessibilityModeTile
          title="Cognitive Load (STML)"
          subtitle="Reduced complexity + clear flow (UI only)"
          icon="🧠"
          enabled={guidedModeEnabled}
          isLeftAligned={isLeftHanded}
          onPress={() => navigation.navigate('AccessibilityDetail', {
            title: 'Cognitive Load (STML)',
            description: 'UI-only toggle for now. Functional mitigations will be implemented later.',
            icon: '🧠',
            enabled: guidedModeEnabled,
            mode: 'cognitive',
          })}
        />

        <AccessibilityModeTile
          title="Hearing Impaired"
          subtitle="Visual alerts + captions (UI only)"
          icon="🔇"
          enabled={hearingImpairedEnabled}
          isLeftAligned={isLeftHanded}
          onPress={() => navigation.navigate('AccessibilityDetail', {
            title: 'Hearing Impaired',
            description: 'UI-only toggle for now. Functional mitigations will be implemented later.',
            icon: '🔇',
            enabled: hearingImpairedEnabled,
            mode: 'hearing',
          })}
        />

        <Divider />

        {/* Handedness */}
        <SectionHeader title="Handedness Layout Mode" />
        <Text style={styles.helperText}>
          Choose how the UI aligns for reach. Toggle Mode shows an on-screen switch.
        </Text>

        <HandednessRadioGroup
          selected={handednessMode}
          onSelect={setHandednessMode}
          isLeftAligned={isLeftHanded}
        />

        <Divider />

        {/* Privacy & Security */}
        <SectionHeader title="Privacy & Security" />
        <HandedListTile
          title="Privacy policy"
          icon="🔗"
          isLeftAligned={isLeftHanded}
          onPress={() => alert('Privacy policy (coming soon)')}
        />
        <HandedListTile
          title="Terms of service"
          icon="🔗"
          isLeftAligned={isLeftHanded}
          onPress={() => alert('Terms of service (coming soon)')}
        />

        <Divider />

        {/* Help & About */}
        <SectionHeader title="Help & About" />
        <HandedListTile
          title="Help / Support"
          icon="›"
          isLeftAligned={isLeftHanded}
          onPress={() => alert('Support (coming soon)')}
        />
        <HandedListTile
          title="About CareConnect"
          subtitle="Version, credits, licensing"
          icon="›"
          isLeftAligned={isLeftHanded}
          onPress={() => alert('CareConnect-LH\nVersion 0.1.0')}
        />

        <Divider />

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert('Logged Out', 'You have been logged out successfully.');
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.logoutIcon}>{isLeftHanded ? '🚪' : ''}</Text>
          <Text style={styles.logoutText}>Logout</Text>
          <Text style={styles.logoutIcon}>{!isLeftHanded ? '🚪' : ''}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Reminder Frequency Picker Modal */}
      {showReminderPicker && (
        <ReminderFrequencyPicker
          selected={reminderFrequency}
          onSelect={(freq) => {
            setReminderFrequency(freq);
            setShowReminderPicker(false);
          }}
          onClose={() => setShowReminderPicker(false)}
          isLeftAligned={isLeftHanded}
        />
      )}
      <HandednessToggleOverlay/>
    </View>
  );
}

// ============================================================================
// COMPONENTS
// ============================================================================

function SectionHeader({ title }) {
  const { colors } = useTheme();
  return <Text style={[styles.sectionHeader, { color: colors.text }]}>{title}</Text>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function HandedListTile({ title, subtitle, icon, isLeftAligned, onPress }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.listTile} onPress={onPress}>
      {isLeftAligned && <Text style={styles.listIcon}>{icon}</Text>}
      <View style={styles.listContent}>
        <Text style={[styles.listTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.listSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {!isLeftAligned && <Text style={styles.listIcon}>{icon}</Text>}
    </TouchableOpacity>
  );
}

function HandedSwitchListTile({ title, subtitle, value, onValueChange, isLeftAligned }) {
  const { colors } = useTheme();
  return (
    <View style={styles.switchTile}>
      {isLeftAligned && <Switch value={value} onValueChange={onValueChange} />}
      <View style={styles.listContent}>
        <Text style={[styles.listTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.listSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {!isLeftAligned && <Switch value={value} onValueChange={onValueChange} />}
    </View>
  );
}

function TextSizeSelector({ selected, onSelect, isLeftAligned }) {
  const options = [
    { label: 'Small', value: 'small' },
    { label: 'Default', value: 'medium' },
    { label: 'Large', value: 'large' },
    { label: 'XL', value: 'extraLarge' },
  ];

  return (
    <View style={[styles.textSizeContainer, isLeftAligned && styles.alignLeft]}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[
            styles.textSizeBox,
            selected === opt.value && styles.textSizeBoxSelected,
          ]}
          onPress={() => onSelect(opt.value)}
        >
          <Text style={styles.textSizeLabel}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function AccessibilityModeTile({ title, subtitle, icon, enabled, isLeftAligned, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.accessibilityTile, enabled && styles.accessibilityTileEnabled]}
      onPress={onPress}
    >
      {isLeftAligned && (
        <View style={styles.accessibilityLeft}>
          <View style={[styles.indicator, enabled && styles.indicatorEnabled]} />
          <Text style={styles.chevron}>›</Text>
        </View>
      )}
      {!isLeftAligned && <Text style={styles.accessibilityIcon}>{icon}</Text>}
      <View style={styles.accessibilityContent}>
        <Text style={styles.accessibilityTitle}>{title}</Text>
        <Text style={styles.accessibilitySubtitle}>{subtitle}</Text>
      </View>
      {isLeftAligned && <Text style={styles.accessibilityIcon}>{icon}</Text>}
      {!isLeftAligned && (
        <View style={styles.accessibilityRight}>
          <View style={[styles.indicator, enabled && styles.indicatorEnabled]} />
          <Text style={styles.chevron}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function HandednessRadioGroup({ selected, onSelect, isLeftAligned }) {
  const { colors } = useTheme();
  const options = [
    { label: 'Left-handed', value: 'left' },
    { label: 'Right-handed', value: 'right' },
    { label: 'Toggle mode', value: 'toggle' },
  ];

  return (
    <View style={styles.radioGroup}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioItem}
          onPress={() => onSelect(opt.value)}
        >
          {isLeftAligned && (
            <View style={[styles.radio, selected === opt.value && styles.radioSelected]} />
          )}
          <Text style={[styles.radioLabel, { color: colors.text }]}>{opt.label}</Text>
          {!isLeftAligned && (
            <View style={[styles.radio, selected === opt.value && styles.radioSelected]} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ReminderFrequencyPicker({ selected, onSelect, onClose, isLeftAligned }) {
  const options = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Custom', value: 'custom', subtitle: 'Setup screen (coming soon)' },
  ];

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Reminder frequency</Text>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={styles.modalOption}
            onPress={() => onSelect(opt.value)}
          >
            {isLeftAligned && (
              <View style={[styles.radio, selected === opt.value && styles.radioSelected]} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.radioLabel}>{opt.label}</Text>
              {opt.subtitle && <Text style={styles.listSubtitle}>{opt.subtitle}</Text>}
            </View>
            {!isLeftAligned && (
              <View style={[styles.radio, selected === opt.value && styles.radioSelected]} />
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.modalClose} onPress={onClose}>
          <Text style={styles.modalCloseText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getReminderLabel(freq) {
  switch (freq) {
    case 'daily': return 'Daily';
    case 'weekly': return 'Weekly';
    case 'custom': return 'Custom';
    default: return 'Daily';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
    color: '#374151',
  },
  sectionSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  helperText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 24,
  },
  listTile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  listContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  listTitle: {
    fontSize: 16,
    color: '#374151',
  },
  listSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  listIcon: {
    fontSize: 20,
  },
  switchTile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
  },
  textSizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  alignLeft: {
    justifyContent: 'flex-start',
  },
  textSizeBox: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#CED8DC',
    backgroundColor: '#ffffff',
  },
  textSizeBoxSelected: {
    borderColor: '#0A7A8A',
    backgroundColor: '#E6F7F5',
  },
  textSizeLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  marginTop: {
    marginTop: 16,
  },
  accessibilityTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CED8DC',
    padding: 16,
    marginBottom: 12,
  },
  accessibilityTileEnabled: {
    backgroundColor: '#E6F7F5',
    borderColor: '#0A7A8A',
  },
  accessibilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  accessibilityRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  indicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CED8DC',
    marginRight: 10,
  },
  indicatorEnabled: {
    backgroundColor: '#0A7A8A',
    borderColor: '#0A7A8A',
  },
  chevron: {
    fontSize: 24,
    color: '#6b7280',
  },
  accessibilityIcon: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  accessibilityContent: {
    flex: 1,
  },
  accessibilityTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  accessibilitySubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  radioGroup: {
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9ca3af',
    marginHorizontal: 12,
  },
  radioSelected: {
    borderColor: '#0A7A8A',
    backgroundColor: '#0A7A8A',
  },
  radioLabel: {
    fontSize: 16,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  logoutIcon: {
    fontSize: 20,
    marginHorizontal: 8,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '700',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalClose: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#0A7A8A',
    fontWeight: '600',
  },
});
