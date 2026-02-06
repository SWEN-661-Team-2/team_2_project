import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/core/theme/app_theme.dart';

void main() {
  test('AppTheme.light builds ThemeData', () {
    final t = AppTheme.light();
    expect(t.useMaterial3, isTrue);
    expect(t.brightness, Brightness.light);
    expect(t.colorScheme.primary, isNotNull);
  });

  test('AppTheme.dark builds ThemeData', () {
    final t = AppTheme.dark();
    expect(t.useMaterial3, isTrue);
    expect(t.brightness, Brightness.dark);
    expect(t.colorScheme.primary, isNotNull);
  });

  test('SwitchTheme exists for light/dark', () {
    final light = AppTheme.light();
    final dark = AppTheme.dark();

    expect(light.switchTheme, isNotNull);
    expect(dark.switchTheme, isNotNull);
  });
}