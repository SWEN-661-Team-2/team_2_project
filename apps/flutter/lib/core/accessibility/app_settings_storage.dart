import 'package:shared_preferences/shared_preferences.dart';

import 'handedness.dart';
import 'text_size_mode.dart';
import 'reminder_frequency.dart';

/// NOTE:
/// This storage class persists ONLY the settings we want saved across app restarts.
/// The “accessibility modes” (low vision, tremor, hearing, guided mode) are
/// intentionally NOT persisted yet.
///
/// Accessibility Overlay (Debug)
/// Purpose: Developer/reviewer-only tool that visually displays accessibility
/// annotations (Semantics labels, roles, hints, tap targets, etc.) so the team
/// can verify accessibility work during grading/testing.
/// NOTE: This should remain OFF by default for end users.
/// TODO(implement): Wire this to a real overlay layer that draws annotations
/// on top of UI widgets when enabled.
class AppSettingsStorage {
  // =========================
  // Keys (persisted)
  // =========================
  static const _keyHandedness = 'handedness_mode';
  static const _keyA11yOverlay = 'a11y_overlay';
  static const _keyNotificationsEnabled = 'notifications_enabled';

  static const _keyTextSizeMode = 'text_size_mode';
  static const _keyHighContrastEnabled = 'high_contrast_enabled';

  static const _keyReminderFrequency = 'reminder_frequency';

  // =========================
  // Handedness
  // =========================
  Future<HandednessMode> loadHandednessMode() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyHandedness);

    return HandednessMode.values.firstWhere(
      (m) => m.name == raw,
      orElse: () => HandednessMode.left,
    );
  }

  Future<void> saveHandednessMode(HandednessMode mode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyHandedness, mode.name);
  }

  // =========================
  // Accessibility overlay (debug)
  // =========================
  Future<bool> loadA11yOverlay() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyA11yOverlay) ?? false;
  }

  Future<void> saveA11yOverlay(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyA11yOverlay, enabled);
  }

  // =========================
  // Notifications
  // =========================
  Future<bool> loadNotificationsEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyNotificationsEnabled) ?? true;
  }

  Future<void> saveNotificationsEnabled(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyNotificationsEnabled, enabled);
  }

  // =========================
  // Text Size Mode (persisted)
  // =========================
  Future<TextSizeMode> loadTextSizeMode() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyTextSizeMode);

    return TextSizeMode.values.firstWhere(
      (m) => m.name == raw,
      orElse: () => TextSizeMode.medium,
    );
  }

  Future<void> saveTextSizeMode(TextSizeMode mode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyTextSizeMode, mode.name);
  }

  // =========================
  // High Contrast (persisted)
  // =========================
  Future<bool> loadHighContrastEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyHighContrastEnabled) ?? false;
  }

  Future<void> saveHighContrastEnabled(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyHighContrastEnabled, enabled);
  }

  // =========================
  // Reminder Frequency (persisted)
  // =========================
  Future<ReminderFrequency> loadReminderFrequency() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyReminderFrequency);

    return ReminderFrequency.values.firstWhere(
      (m) => m.name == raw,
      orElse: () => ReminderFrequency.daily,
    );
  }

  Future<void> saveReminderFrequency(ReminderFrequency frequency) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyReminderFrequency, frequency.name);
  }
}