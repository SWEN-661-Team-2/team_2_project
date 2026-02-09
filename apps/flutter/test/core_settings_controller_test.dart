import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/core/accessibility/handedness.dart';
import 'package:flutter_app/core/accessibility/text_size_mode.dart';
import 'package:flutter_app/core/accessibility/reminder_frequency.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues(<String, Object>{});
  });

  test(
    'load() does not throw and controller has default-safe values',
    () async {
      final c = AppSettingsController();
      await c.load();

      expect(c.handednessMode, isA<HandednessMode>());
      expect(c.a11yOverlayEnabled, isA<bool>());
      expect(c.notificationsEnabled, isA<bool>());
      expect(c.textSizeMode, isA<TextSizeMode>());
      expect(c.highContrastEnabled, isA<bool>());
      expect(c.reminderFrequency, isA<ReminderFrequency>());

      // UI-only toggles (not persisted yet)
      expect(c.lowVisionEnabled, isFalse);
      expect(c.tremorSupportEnabled, isFalse);
      expect(c.hearingImpairedEnabled, isFalse);
      expect(c.guidedModeEnabled, isFalse);
    },
  );

  test('setHandednessMode persists + notifies', () async {
    final c = AppSettingsController();
    await c.load();

    var notified = 0;
    c.addListener(() => notified++);

    await c.setHandednessMode(HandednessMode.right);

    expect(c.handednessMode, HandednessMode.right);
    expect(notified, greaterThan(0));
  });

  test('setA11yOverlay persists + notifies', () async {
    final c = AppSettingsController();
    await c.load();

    var notified = 0;
    c.addListener(() => notified++);

    await c.setA11yOverlay(true);

    expect(c.a11yOverlayEnabled, isTrue);
    expect(notified, greaterThan(0));
  });

  test('setNotificationsEnabled persists + notifies', () async {
    final c = AppSettingsController();
    await c.load();

    var notified = 0;
    c.addListener(() => notified++);

    await c.setNotificationsEnabled(false);

    expect(c.notificationsEnabled, isFalse);
    expect(notified, greaterThan(0));
  });

  test('setTextSizeMode persists + notifies', () async {
    final c = AppSettingsController();
    await c.load();

    var notified = 0;
    c.addListener(() => notified++);

    await c.setTextSizeMode(TextSizeMode.large);

    expect(c.textSizeMode, TextSizeMode.large);
    expect(notified, greaterThan(0));
  });

  test('setHighContrastEnabled persists + notifies', () async {
    final c = AppSettingsController();
    await c.load();

    var notified = 0;
    c.addListener(() => notified++);

    await c.setHighContrastEnabled(true);

    expect(c.highContrastEnabled, isTrue);
    expect(notified, greaterThan(0));
  });

  test('setReminderFrequency persists + notifies', () async {
    final c = AppSettingsController();
    await c.load();

    var notified = 0;
    c.addListener(() => notified++);

    await c.setReminderFrequency(ReminderFrequency.weekly);

    expect(c.reminderFrequency, ReminderFrequency.weekly);
    expect(notified, greaterThan(0));
  });

  test('UI-only toggles update + notify (no persistence required)', () async {
    final c = AppSettingsController();
    await c.load();

    var notified = 0;
    c.addListener(() => notified++);

    await c.setLowVisionEnabled(true);
    expect(c.lowVisionEnabled, isTrue);

    await c.setTremorSupportEnabled(true);
    expect(c.tremorSupportEnabled, isTrue);

    await c.setHearingImpairedEnabled(true);
    expect(c.hearingImpairedEnabled, isTrue);

    await c.setGuidedModeEnabled(true);
    expect(c.guidedModeEnabled, isTrue);

    expect(notified, greaterThanOrEqualTo(4));
  });
}
