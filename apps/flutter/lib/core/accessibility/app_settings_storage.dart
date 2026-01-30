import 'package:shared_preferences/shared_preferences.dart';
import 'handedness.dart';

class AppSettingsStorage {
  static const _keyHandedness = 'handedness_mode';
  static const _keyA11yOverlay = 'a11y_overlay';
  static const _kNotificationsEnabled = 'notifications_enabled';

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

  Future<bool> loadA11yOverlay() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyA11yOverlay) ?? false;
  }

  Future<void> saveA11yOverlay(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyA11yOverlay, enabled);
  }

  Future<bool> loadNotificationsEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_kNotificationsEnabled) ?? true;
  }

  Future<void> saveNotificationsEnabled(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_kNotificationsEnabled, enabled);
  }
}
