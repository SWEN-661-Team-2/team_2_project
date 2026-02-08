import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = 'careconnect:settings_v1:';

const KEYS = {
  handedness: STORAGE_PREFIX + 'handedness',
  currentToggleHandedness: STORAGE_PREFIX + 'current_toggle_handedness',
  a11yOverlay: STORAGE_PREFIX + 'a11y_overlay',
  notifications: STORAGE_PREFIX + 'notifications',
  textSize: STORAGE_PREFIX + 'text_size',
  highContrast: STORAGE_PREFIX + 'high_contrast',
  reminderFrequency: STORAGE_PREFIX + 'reminder_frequency',
};

export const HandednessMode = {
  left: 'left',
  right: 'right',
  toggle: 'toggle',
};

export const TextSizeMode = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

export const ReminderFrequency = {
  daily: 'daily',
  weekly: 'weekly',
  custom: 'custom',
};

const AppSettingsContext = createContext();

/**
 * Provider for app-wide settings (handedness, accessibility, notifications, etc.)
 * Persists to AsyncStorage and provides memoized context value.
 */
export const AppSettingsProvider = ({ children }) => {
  const [handednessMode, setHandednessMode] = useState(HandednessMode.left);
  const [currentToggleHandedness, setCurrentToggleHandedness] = useState(HandednessMode.left);
  const [a11yOverlay, setA11yOverlay] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [textSizeMode, setTextSizeMode] = useState(TextSizeMode.medium);
  const [highContrastEnabled, setHighContrastEnabled] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState(ReminderFrequency.daily);

  // UI-only accessibility toggles (not persisted yet)
  const [lowVisionEnabled, setLowVisionEnabled] = useState(false);
  const [tremorSupportEnabled, setTremorSupportEnabled] = useState(false);
  const [hearingImpairedEnabled, setHearingImpairedEnabled] = useState(false);
  const [guidedModeEnabled, setGuidedModeEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const h = await AsyncStorage.getItem(KEYS.handedness);
        if (h) setHandednessMode(h);
        const ct = await AsyncStorage.getItem(KEYS.currentToggleHandedness);
        if (ct) setCurrentToggleHandedness(ct);
        const a = await AsyncStorage.getItem(KEYS.a11yOverlay);
        if (a !== null) setA11yOverlay(a === 'true');
        const n = await AsyncStorage.getItem(KEYS.notifications);
        if (n !== null) setNotificationsEnabled(n === 'true');
        const t = await AsyncStorage.getItem(KEYS.textSize);
        if (t) setTextSizeMode(t);
        const hc = await AsyncStorage.getItem(KEYS.highContrast);
        if (hc !== null) setHighContrastEnabled(hc === 'true');
        const r = await AsyncStorage.getItem(KEYS.reminderFrequency);
        if (r) setReminderFrequency(r);
      } catch (e) {
        console.warn('Failed to load app settings', e);
      }
    })();
  }, []);

  const persist = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch (e) {
      console.warn('Failed to persist app setting', key, e);
    }
  };

  const setHandedness = async (mode) => {
    setHandednessMode(mode);
    await persist(KEYS.handedness, mode);
  };

  const setCurrentToggle = async (mode) => {
    setCurrentToggleHandedness(mode);
    await persist(KEYS.currentToggleHandedness, mode);
  };

  const setA11yOverlayEnabled = async (v) => {
    setA11yOverlay(v);
    await persist(KEYS.a11yOverlay, v);
  };

  const setNotifications = async (v) => {
    setNotificationsEnabled(v);
    await persist(KEYS.notifications, v);
  };

  const setTextSize = async (mode) => {
    setTextSizeMode(mode);
    await persist(KEYS.textSize, mode);
  };

  const setHighContrast = async (v) => {
    setHighContrastEnabled(v);
    await persist(KEYS.highContrast, v);
  };

  const setReminder = async (freq) => {
    setReminderFrequency(freq);
    await persist(KEYS.reminderFrequency, freq);
  };

  const value = {
    handednessMode,
    currentToggleHandedness,
    a11yOverlay,
    notificationsEnabled,
    textSizeMode,
    highContrastEnabled,
    reminderFrequency,

    lowVisionEnabled,
    tremorSupportEnabled,
    hearingImpairedEnabled,
    guidedModeEnabled,

    setHandedness,
    setCurrentToggle,
    setA11yOverlayEnabled,
    setNotifications,
    setTextSize,
    setHighContrast,
    setReminder,

    setLowVisionEnabled,
    setTremorSupportEnabled,
    setHearingImpairedEnabled,
    setGuidedModeEnabled,
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
};
