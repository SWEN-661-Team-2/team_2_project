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
      HandednessMode.left; // NEW: tracks toggle state
  bool _a11yOverlayEnabled = false;
  bool _notificationsEnabled = true;

  TextSizeMode _textSizeMode = TextSizeMode.medium;
  bool _highContrastEnabled = false;

  ReminderFrequency _reminderFrequency = ReminderFrequency.daily;

  HandednessMode get handednessMode => _handednessMode;
  HandednessMode get currentToggleHandedness => _currentToggleHandedness; // NEW
  bool get a11yOverlayEnabled => _a11yOverlayEnabled;
  bool get notificationsEnabled => _notificationsEnabled;

  TextSizeMode get textSizeMode => _textSizeMode;
  bool get highContrastEnabled => _highContrastEnabled;

  ReminderFrequency get reminderFrequency => _reminderFrequency;

  // NEW: Helper to get effective handedness (considers toggle mode)
  bool get isLeftAligned {
    if (_handednessMode == HandednessMode.toggle) {
      return _currentToggleHandedness == HandednessMode.left;
    }
    return _handednessMode == HandednessMode.left;
  }

  // =========================
  // Accessibility "modes" (UI-only for now)
  // NOTE: Not persisted yet (per your instruction: buttons active only).
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
    _currentToggleHandedness = await _storage
        .loadCurrentToggleHandedness(); // NEW
    _a11yOverlayEnabled = await _storage.loadA11yOverlay();
    _notificationsEnabled = await _storage.loadNotificationsEnabled();

    _textSizeMode = await _storage.loadTextSizeMode();
    _highContrastEnabled = await _storage.loadHighContrastEnabled();

    _reminderFrequency = await _storage.loadReminderFrequency();

    // Accessibility modes intentionally default to false for now (UI-only).
    // TODO(implement/persist): load these from storage once mitigations are implemented.

    notifyListeners();
  }

  Future<void> setHandednessMode(HandednessMode mode) async {
    _handednessMode = mode;
    notifyListeners();
    await _storage.saveHandednessMode(mode);
  }

  // NEW: Set the current toggle handedness (used by toggle button)
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

  Future<void> setHighContrastEnabled(bool enabled) async {
    _highContrastEnabled = enabled;

    // Rebuild UI immediately (fixes widget test + real UX)
    notifyListeners();

    // Persist after UI updates
    await _storage.saveHighContrastEnabled(enabled);

    // TODO(implement): Apply high contrast theme globally:
    // - switch ThemeData / ColorScheme
    // - increase contrast ratios and borders
    // - ensure tags/badges remain readable
  }

  Future<void> setReminderFrequency(ReminderFrequency frequency) async {
    _reminderFrequency = frequency;
    notifyListeners();
    await _storage.saveReminderFrequency(frequency);

    // TODO(implement): When backend/notifications exist, wire this to scheduling logic:
    // - daily / weekly / custom triggers
    // - if custom: store time + days-of-week selection
  }

  // =========================
  // UI-only toggles
  // =========================

  Future<void> setLowVisionEnabled(bool enabled) async {
    _lowVisionEnabled = enabled;
    notifyListeners();

    // TODO(implement): Apply low-vision mitigations globally:
    // - higher contrast theme
    // - larger touch targets
    // - bolder borders / clearer focus states
    // - optional text scaling rules
  }

  Future<void> setTremorSupportEnabled(bool enabled) async {
    _tremorSupportEnabled = enabled;
    notifyListeners();

    // TODO(implement): Apply tremor mitigations:
    // - increased spacing
    // - larger buttons
    // - gesture tolerance / debounce
  }

  Future<void> setHearingImpairedEnabled(bool enabled) async {
    _hearingImpairedEnabled = enabled;
    notifyListeners();

    // TODO(implement): Apply hearing mitigations:
    // - visual alerts in addition to audio
    // - haptic confirmations (where supported)
    // - captions / text reinforcement for icons
  }

  Future<void> setGuidedModeEnabled(bool enabled) async {
    _guidedModeEnabled = enabled;
    notifyListeners();

    // TODO(implement): Apply guided mode:
    // - step-by-step confirmations
    // - simplified navigation
    // - reduced cognitive load UI
  }
}
