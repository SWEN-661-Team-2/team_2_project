import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import { useHandedness, useTheme, useAppSettings } from '../contexts/AppProviders';
import HandednessToggleOverlay from '../components/HandednessToggleOverlay';

export default function SettingsScreen({ navigation }) {
  const { isLeftHanded, handednessMode, setHandednessMode } = useHandedness();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { 
    notificationsEnabled, 
    setNotificationsEnabled,
    reminderFrequency,
    setReminderFrequency,
    textSize,
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
        accessibilityRole="summary" // Tells OS this is a list of options/settings
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
        
        {/* ... remaining AccessibilityModeTiles updated with the same logic ... */}

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
      <HandednessToggleOverlay/>
    </View>
  );
}

// ============================================================================
// ACCESSIBILITY-ENHANCED SUB-COMPONENTS
// ============================================================================

function SectionHeader({ title }) {
  const { colors } = useTheme();
  return (
    <Text 
      style={[styles.sectionHeader, { color: colors.text }]}
      accessibilityRole="header"
    >
      {title}
    </Text>
  );
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
    <View 
      style={styles.switchTile}
      accessibilityRole="switch"
      accessibilityLabel={title}
      accessibilityState={{ checked: value }}
    >
      {isLeftAligned && <Switch value={value} onValueChange={onValueChange} accessibilityLabel={title} />}
      <View style={styles.listContent}>
        <Text style={[styles.listTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.listSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {!isLeftAligned && <Switch value={value} onValueChange={onValueChange} accessibilityLabel={title} />}
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
          accessibilityLabel={`${opt.label} text size`}
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
      {/* Visual only icons/indicators hidden from screen reader to reduce noise */}
      {isLeftAligned && (
        <View style={styles.accessibilityLeft} accessibilityElementsHidden={true}>
          <View style={[styles.indicator, enabled && styles.indicatorEnabled]} />
          <Text style={styles.chevron}>›</Text>
        </View>
      )}
      {!isLeftAligned && <Text style={styles.accessibilityIcon} accessibilityElementsHidden={true}>{icon}</Text>}
      
      <View style={styles.accessibilityContent}>
        <Text style={styles.accessibilityTitle}>{title}</Text>
        <Text style={styles.accessibilitySubtitle}>{subtitle}</Text>
      </View>

      {isLeftAligned && <Text style={styles.accessibilityIcon} accessibilityElementsHidden={true}>{icon}</Text>}
      {!isLeftAligned && (
        <View style={styles.accessibilityRight} accessibilityElementsHidden={true}>
          <View style={[styles.indicator, enabled && styles.indicatorEnabled]} />
          <Text style={styles.chevron}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// HandednessRadioGroup and ReminderFrequencyPicker should follow 
// the same pattern: accessibilityRole="radio" and accessibilityState={{ selected: ... }}