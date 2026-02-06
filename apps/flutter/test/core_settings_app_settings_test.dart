import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/core/settings/app_settings.dart';

void main() {
  group('AppSettings (basic)', () {
    test('can be constructed', () {
      final s = AppSettings();
      expect(s, isNotNull);
    });

    test('toString returns something', () {
      final s = AppSettings();
      expect(s.toString(), isNotEmpty);
    });

    test('defaults', () {
      final s = AppSettings();

      expect(s.textSize, TextSizeMode.medium);
      expect(s.highContrast, false);
      expect(s.activeMode, AccessibilityMode.standard);
    });
  });

  group('AccessibilityModeX', () {
    test('title + subtitle cover every enum value', () {
      for (final mode in AccessibilityMode.values) {
        expect(mode.title, isNotEmpty);
        expect(mode.subtitle, isNotEmpty);
      }
    });
  });

  group('AppSettings (mutators)', () {
    test('setTextSize updates + notifies', () {
      final s = AppSettings();
      var notified = 0;

      s.addListener(() => notified++);

      s.setTextSize(TextSizeMode.large);

      expect(s.textSize, TextSizeMode.large);
      expect(notified, 1);
    });

    test('setHighContrast updates + notifies', () {
      final s = AppSettings();
      var notified = 0;

      s.addListener(() => notified++);

      s.setHighContrast(true);

      expect(s.highContrast, true);
      expect(notified, 1);
    });

    test('setActiveMode updates + notifies', () {
      final s = AppSettings();
      var notified = 0;

      s.addListener(() => notified++);

      s.setActiveMode(AccessibilityMode.lowVision);

      expect(s.activeMode, AccessibilityMode.lowVision);
      expect(notified, 1);
    });
  });
}