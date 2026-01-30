import 'package:flutter/foundation.dart';
import 'app_settings_storage.dart';
import 'handedness.dart';

class AppSettingsController extends ChangeNotifier {
  final AppSettingsStorage _storage = AppSettingsStorage();

  HandednessMode _handednessMode = HandednessMode.left;
  bool _a11yOverlayEnabled = false;

  bool _notificationsEnabled = true;

  HandednessMode get handednessMode => _handednessMode;
  bool get a11yOverlayEnabled => _a11yOverlayEnabled;

  bool get notificationsEnabled => _notificationsEnabled;

  Future<void> load() async {
    _handednessMode = await _storage.loadHandednessMode();
    _a11yOverlayEnabled = await _storage.loadA11yOverlay();

    _notificationsEnabled = await _storage.loadNotificationsEnabled();

    notifyListeners();
  }

  Future<void> setHandednessMode(HandednessMode mode) async {
    _handednessMode = mode;
    await _storage.saveHandednessMode(mode);
    notifyListeners();
  }

  Future<void> setA11yOverlay(bool enabled) async {
    _a11yOverlayEnabled = enabled;
    await _storage.saveA11yOverlay(enabled);
    notifyListeners();
  }

  Future<void> setNotificationsEnabled(bool enabled) async {
    _notificationsEnabled = enabled;
    await _storage.saveNotificationsEnabled(enabled);
    notifyListeners();
  }
}
