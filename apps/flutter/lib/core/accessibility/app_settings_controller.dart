// lib/core/accessibility/app_settings_controller.dart
import 'package:flutter/foundation.dart';

import 'app_settings_storage.dart';
import 'handedness.dart';
import 'text_size_mode.dart';
import 'reminder_frequency.dart';

class AppSettingsController extends ChangeNotifier {
  final AppSettingsStorage _storage = AppSettingsStorage();

  // =========================
  // Persisted settings
  // =========================
  HandednessMode _handednessMode = HandednessMode.left;
  HandednessMode _currentToggleHandedness =
      HandednessMode.left; // tracks toggle state
  bool _a11yOverlayEnabled = false;
  bool _notificationsEnabled = true;

  TextSizeMode _textSizeMode = TextSizeMode.medium;

  /// Day/Night toggle (drives MaterialApp.themeMode)
  bool _darkModeEnabled = false;

  /// High contrast (separate from day/night; can remain persisted)
  bool _highContrastEnabled = false;

  ReminderFrequency _reminderFrequency = ReminderFrequency.daily;

  HandednessMode get handednessMode => _handednessMode;
  HandednessMode get currentToggleHandedness => _currentToggleHandedness;
  bool get a11yOverlayEnabled => _a11yOverlayEnabled;
  bool get notificationsEnabled => _notificationsEnabled;

  TextSizeMode get textSizeMode => _textSizeMode;

  /// use this to drive MaterialApp.themeMode
  bool get darkModeEnabled => _darkModeEnabled;

  bool get highContrastEnabled => _highContrastEnabled;
  ReminderFrequency get reminderFrequency => _reminderFrequency;

  // Helper: effective handedness (considers toggle mode)
  bool get isLeftAligned {
    if (_handednessMode == HandednessMode.toggle) {
      return _currentToggleHandedness == HandednessMode.left;
    }
    return _handednessMode == HandednessMode.left;
  }

  // =========================
  // Accessibility "modes" (UI-only for now)
  // =========================
  bool _lowVisionEnabled = false;
  bool _tremorSupportEnabled = false;
  bool _hearingImpairedEnabled = false;
  bool _guidedModeEnabled = false;

  bool get lowVisionEnabled => _lowVisionEnabled;
  bool get tremorSupportEnabled => _tremorSupportEnabled;
  bool get hearingImpairedEnabled => _hearingImpairedEnabled;
  bool get guidedModeEnabled => _guidedModeEnabled;

  Future<void> load() async {
    _handednessMode = await _storage.loadHandednessMode();
    _currentToggleHandedness = await _storage.loadCurrentToggleHandedness();
    _a11yOverlayEnabled = await _storage.loadA11yOverlay();
    _notificationsEnabled = await _storage.loadNotificationsEnabled();

    _textSizeMode = await _storage.loadTextSizeMode();

    // If storage doesn't have these yet, add the methods there or
    // keep the try/catch so the app still runs.
    try {
      _darkModeEnabled = await _storage.loadDarkModeEnabled();
    } catch (_) {
      _darkModeEnabled = false;
    }

    _highContrastEnabled = await _storage.loadHighContrastEnabled();
    _reminderFrequency = await _storage.loadReminderFrequency();

    notifyListeners();
  }

  Future<void> setHandednessMode(HandednessMode mode) async {
    _handednessMode = mode;
    notifyListeners();
    await _storage.saveHandednessMode(mode);
  }

  Future<void> setCurrentToggleHandedness(HandednessMode mode) async {
    _currentToggleHandedness = mode;
    notifyListeners();
    await _storage.saveCurrentToggleHandedness(mode);
  }

  Future<void> setA11yOverlay(bool enabled) async {
    _a11yOverlayEnabled = enabled;
    notifyListeners();
    await _storage.saveA11yOverlay(enabled);
  }

  Future<void> setNotificationsEnabled(bool enabled) async {
    _notificationsEnabled = enabled;
    notifyListeners();
    await _storage.saveNotificationsEnabled(enabled);
  }

  Future<void> setTextSizeMode(TextSizeMode mode) async {
    _textSizeMode = mode;
    notifyListeners();
    await _storage.saveTextSizeMode(mode);
  }

  /// Day/Night toggle should call this
  Future<void> setDarkModeEnabled(bool enabled) async {
    _darkModeEnabled = enabled;
    notifyListeners();

    // Persist (recommended so it doesn't revert on restart)
    await _storage.saveDarkModeEnabled(enabled);
  }

  Future<void> setHighContrastEnabled(bool enabled) async {
    _highContrastEnabled = enabled;
    notifyListeners();
    await _storage.saveHighContrastEnabled(enabled);

    // TODO(implement): Apply high contrast theme variants globally (if desired)
  }

  Future<void> setReminderFrequency(ReminderFrequency frequency) async {
    _reminderFrequency = frequency;
    notifyListeners();
    await _storage.saveReminderFrequency(frequency);
  }

  // =========================
  // UI-only toggles (instant repaint)
  // =========================
  void setLowVisionEnabled(bool enabled) {
    _lowVisionEnabled = enabled;
    notifyListeners();
  }

  void setTremorSupportEnabled(bool enabled) {
    _tremorSupportEnabled = enabled;
    notifyListeners();
  }

  void setHearingImpairedEnabled(bool enabled) {
    _hearingImpairedEnabled = enabled;
    notifyListeners();
  }

  void setGuidedModeEnabled(bool enabled) {
    _guidedModeEnabled = enabled;
    notifyListeners();
  }
}