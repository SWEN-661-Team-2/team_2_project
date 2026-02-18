// Path: src/screens/SettingsScreen.js
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HandednessToggleOverlay from '../components/HandednessToggleOverlay';
import { useAppSettings, useHandedness, useTheme } from '../contexts/AppProviders';

export default function SettingsScreen({ navigation }) {
  const { isLeftHanded, handednessMode, setHandednessMode } = useHandedness();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const {
  notificationsEnabled,
  setNotifications: setNotificationsEnabled,
  reminderFrequency,
  setReminder: setReminderFrequency,
  textSizeMode: textSize,
  setTextSize,
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        accessibilityRole="summary"
      >
        {/* Header */}
        <View style={styles.header} accessibilityRole="header">
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo/careconnect_logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
              accessibilityLabel="CareConnect Logo"
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
          accessibilityHint="Navigates to your profile editing screen"
        />
        <HandedListTile
          title="Change password"
          icon="›"
          isLeftAligned={isLeftHanded}
          onPress={() => navigation.navigate('ChangePassword')}
          accessibilityHint="Navigates to password update screen"
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
        <HandedListTile
          title="Reminder frequency"
          subtitle={getReminderLabel(reminderFrequency)}
          icon="›"
          isLeftAligned={isLeftHanded}
          onPress={() => setShowReminderPicker(true)}
          accessibilityHint="Opens a selection menu for reminder timing"
        />

        <Divider />

        {/* Display */}
        <SectionHeader title="Display" />
        <Text style={[styles.sectionSubtitle, styles.marginTop, { color: colors.text }]}>Text Size</Text>
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
            accessibilityLabel={`Current theme is ${isDarkMode ? 'Dark' : 'Light'}. Tap to change.`}
          />
        </View>

        <Divider />

        {/* Accessibility */}
        <SectionHeader title="Accessibility" />
        <AccessibilityModeTile
          title="Low Vision"
          subtitle="Larger text + improved contrast (UI only)"
          icon="👁️"
          enabled={lowVisionEnabled}
          isLeftAligned={isLeftHanded}
          onPress={() => navigation.navigate('AccessibilityDetail', {
            title: 'Low Vision',
            enabled: lowVisionEnabled,
            onToggle: setLowVisionEnabled,
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
            enabled: tremorSupportEnabled,
            onToggle: setTremorSupportEnabled,
          })}
        />

        <AccessibilityModeTile
          title="Cognitive Load (STML)"
          subtitle="Reduced complexity + clear flow (UI only)"
          icon="🧠"
          enabled={guidedModeEnabled}
          isLeftAligned={isLeftHanded}
          onPress={() => navigation.navigate('AccessibilityDetail', {
            title: 'Cognitive Load',
            enabled: guidedModeEnabled,
            onToggle: setGuidedModeEnabled,
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
            enabled: hearingImpairedEnabled,
            onToggle: setHearingImpairedEnabled,
          })}
        />

        <Divider />

        {/* Handedness */}
        <SectionHeader title="Handedness Layout Mode" />
        <HandednessRadioGroup
          selected={handednessMode}
          onSelect={setHandednessMode}
          isLeftAligned={isLeftHanded}
        />

        <Divider />

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          accessibilityRole="button"
          accessibilityLabel="Log out of application"
          onPress={() => {
            alert('Logged out');
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.logoutIcon} accessibilityElementsHidden={true}>{isLeftHanded ? '🚪' : ''}</Text>
          <Text style={styles.logoutText}>Logout</Text>
          <Text style={styles.logoutIcon} accessibilityElementsHidden={true}>{!isLeftHanded ? '🚪' : ''}</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

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
      <HandednessToggleOverlay />
    </View>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function SectionHeader({ title }) {
  const { colors } = useTheme();
  return <Text style={[styles.sectionHeader, { color: colors.text }]} accessibilityRole="header">{title}</Text>;
}

function Divider() { return <View style={styles.divider} />; }

function getReminderLabel(freq) {
  const labels = {
    daily: 'Daily',
    weekly: 'Weekly',
    custom: 'Custom',
  };
  return labels[freq] || 'Daily';
}

function HandedListTile({ title, subtitle, icon, isLeftAligned, onPress, accessibilityLabel, accessibilityHint }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={styles.listTile}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${title}, ${subtitle || ''}`}
      accessibilityHint={accessibilityHint}
    >
      {isLeftAligned && <Text style={styles.listIcon} accessibilityElementsHidden={true}>{icon}</Text>}
      <View style={styles.listContent}>
        <Text style={[styles.listTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.listSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {!isLeftAligned && <Text style={styles.listIcon} accessibilityElementsHidden={true}>{icon}</Text>}
    </TouchableOpacity>
  );
}

function HandedSwitchListTile({ title, subtitle, value, onValueChange, isLeftAligned }) {
  const { colors } = useTheme();

  return (
    <View style={styles.switchTile}>
      {isLeftAligned && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          accessibilityRole="switch"
          accessibilityLabel={title}
          accessibilityState={{ checked: value }}
        />
      )}

      <View style={styles.listContent} accessible={false}>
        <Text style={[styles.listTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.listSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {!isLeftAligned && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          accessibilityRole="switch"
          accessibilityLabel={title}
          accessibilityState={{ checked: value }}
        />
      )}
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
    <View style={[styles.textSizeContainer, isLeftAligned && styles.alignLeft]} accessibilityRole="radiogroup">
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.textSizeBox, selected === opt.value && styles.textSizeBoxSelected]}
          onPress={() => onSelect(opt.value)}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === opt.value }}
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
      accessibilityRole="button"
      accessibilityState={{ checked: enabled }}
      accessibilityLabel={`${title} mode. ${enabled ? 'Currently active' : 'Currently inactive'}.`}
    >
      {isLeftAligned && <View style={styles.accessibilityLeft} accessibilityElementsHidden={true}><View style={[styles.indicator, enabled && styles.indicatorEnabled]} /><Text style={styles.chevron}>›</Text></View>}
      {!isLeftAligned && <Text style={styles.accessibilityIcon} accessibilityElementsHidden={true}>{icon}</Text>}
      <View style={styles.accessibilityContent}>
        <Text style={styles.accessibilityTitle}>{title}</Text>
        <Text style={styles.accessibilitySubtitle}>{subtitle}</Text>
      </View>
      {isLeftAligned && <Text style={styles.accessibilityIcon} accessibilityElementsHidden={true}>{icon}</Text>}
      {!isLeftAligned && <View style={styles.accessibilityRight} accessibilityElementsHidden={true}><View style={[styles.indicator, enabled && styles.indicatorEnabled]} /><Text style={styles.chevron}>›</Text></View>}
    </TouchableOpacity>
  );
}

function HandednessRadioGroup({ selected, onSelect, isLeftAligned }) {
  const { colors } = useTheme();
  const options = [{ label: 'Left-handed', value: 'left' }, { label: 'Right-handed', value: 'right' }, { label: 'Toggle mode', value: 'toggle' }];
  return (
    <View style={styles.radioGroup}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioItem}
          onPress={() => onSelect(opt.value)}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === opt.value }}
        >
          {isLeftAligned && <View style={[styles.radio, selected === opt.value && styles.radioSelected]} />}
          <Text style={[styles.radioLabel, { color: colors.text }]}>{opt.label}</Text>
          {!isLeftAligned && <View style={[styles.radio, selected === opt.value && styles.radioSelected]} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ReminderFrequencyPicker({ selected, onSelect, onClose, isLeftAligned }) {
  const options = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Custom', value: 'custom' }
  ];
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle} accessibilityRole="header">Reminder frequency</Text>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={styles.modalOption}
            onPress={() => onSelect(opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: selected === opt.value }}
            accessibilityLabel={opt.label}
          >
            {isLeftAligned && <View style={[styles.radio, selected === opt.value && styles.radioSelected]} />}
            <Text style={styles.radioLabel}>{opt.label}</Text>
            {!isLeftAligned && <View style={[styles.radio, selected === opt.value && styles.radioSelected]} />}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.modalClose} onPress={onClose} accessibilityRole="button">
          <Text style={styles.modalCloseText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logoContainer: { width: 40, height: 40, marginRight: 12 },
  logoImage: { width: 40, height: 40 },
  headerTitle: { fontSize: 24, fontWeight: '700' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 8, marginBottom: 12 },
  sectionSubtitle: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  helperText: { fontSize: 14, marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 24 },
  listTile: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  listContent: { flex: 1, marginHorizontal: 12 },
  listTitle: { fontSize: 16 },
  listSubtitle: { fontSize: 14, marginTop: 2 },
  listIcon: { fontSize: 20 },
  switchTile: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  card: { borderRadius: 12, padding: 4, marginBottom: 8 },
  textSizeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  alignLeft: { justifyContent: 'flex-start' },
  textSizeBox: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, borderWidth: 2, borderColor: '#CED8DC', backgroundColor: '#ffffff' },
  textSizeBoxSelected: { borderColor: '#0A7A8A', backgroundColor: '#E6F7F5' },
  textSizeLabel: { fontSize: 14, fontWeight: '800' },
  marginTop: { marginTop: 16 },
  accessibilityTile: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1.5, borderColor: '#CED8DC', padding: 16, marginBottom: 12 },
  accessibilityTileEnabled: { backgroundColor: '#E6F7F5', borderColor: '#0A7A8A' },
  accessibilityLeft: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  accessibilityRight: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  indicator: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#CED8DC', marginRight: 10 },
  indicatorEnabled: { backgroundColor: '#0A7A8A', borderColor: '#0A7A8A' },
  chevron: { fontSize: 24, color: '#6b7280' },
  accessibilityIcon: { fontSize: 24, marginHorizontal: 8 },
  accessibilityContent: { flex: 1 },
  accessibilityTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  accessibilitySubtitle: { fontSize: 13, color: '#6b7280' },
  radioGroup: { marginBottom: 8 },
  radioItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#9ca3af', marginHorizontal: 12 },
  radioSelected: { borderColor: '#0A7A8A', backgroundColor: '#0A7A8A' },
  radioLabel: { fontSize: 16, flex: 1 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  logoutIcon: { fontSize: 20, marginHorizontal: 8 },
  logoutText: { flex: 1, fontSize: 16, color: '#ef4444', fontWeight: '700' },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  modalClose: { marginTop: 16, padding: 12, alignItems: 'center' },
  modalCloseText: { fontSize: 16, color: '#0A7A8A', fontWeight: '600' },
});