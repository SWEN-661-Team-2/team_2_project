import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/core/accessibility/handedness.dart';
import 'package:flutter_app/core/accessibility/text_size_mode.dart';
import 'package:flutter_app/features/settings/settings_screen.dart';

void main() {
  Future<void> pumpSettings(
    WidgetTester tester,
    AppSettingsController controller,
  ) async {
    await tester.binding.setSurfaceSize(const Size(1200, 6000));

    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: controller,
        child: MaterialApp(
          home: const SettingsScreen(),
          routes: {
            // minimal route needed for logout navigation
            '/login': (_) => const Scaffold(body: Text('Login Screen')),
          },
        ),
      ),
    );

    // Never pumpAndSettle() on this screen.
    await tester.pump(const Duration(milliseconds: 80));
    await tester.pump(const Duration(milliseconds: 80));
    await tester.pump(const Duration(milliseconds: 80));
  }

  testWidgets('Settings screen renders key sections + tiles', (tester) async {
    final controller = AppSettingsController();

    await pumpSettings(tester, controller);

    expect(find.text('Settings'), findsWidgets);
    expect(find.text('Account & Profile'), findsOneWidget);
    expect(find.text('Notifications'), findsWidgets);
    expect(find.text('Display'), findsOneWidget);
    expect(find.text('Accessibility'), findsOneWidget);
    expect(find.text('Handedness Layout Mode'), findsOneWidget);
    expect(find.text('Privacy & Security'), findsOneWidget);
    expect(find.text('Help & About'), findsOneWidget);

    expect(find.text('Low Vision'), findsOneWidget);
    expect(find.text('Tremor / Motor'), findsOneWidget);
    expect(find.text('Cognitive Load (STML)'), findsOneWidget);
    expect(find.text('Hearing Impaired'), findsOneWidget);

    expect(find.text('Logout'), findsOneWidget);
  });

  testWidgets(
    'Text size boxes render and tapping changes controller.textSizeMode',
    (tester) async {
      final controller = AppSettingsController();

      await pumpSettings(tester, controller);

      expect(find.text('Small'), findsOneWidget);
      expect(find.text('Default'), findsOneWidget);
      expect(find.text('Large'), findsOneWidget);
      expect(find.text('XL'), findsOneWidget);

      expect(controller.textSizeMode, TextSizeMode.medium);

      await tester.tap(find.text('Large'));
      await tester.pump(const Duration(milliseconds: 120));
      expect(controller.textSizeMode, TextSizeMode.large);

      await tester.tap(find.text('XL'));
      await tester.pump(const Duration(milliseconds: 120));
      expect(controller.textSizeMode, TextSizeMode.extraLarge);
    },
  );

  testWidgets('Contrast tile toggles controller.highContrastEnabled', (tester) async {
    final controller = AppSettingsController();

    await pumpSettings(tester, controller);

    expect(controller.highContrastEnabled, false);
    expect(find.text('Day / Night'), findsOneWidget);

    final highContrastTile = find.widgetWithText(SwitchListTile, 'High contrast');
    expect(highContrastTile, findsOneWidget);

    await tester.tap(highContrastTile);
    await tester.pump(const Duration(milliseconds: 200));
    await tester.pump(const Duration(milliseconds: 200));

    expect(controller.highContrastEnabled, true);
    expect(find.widgetWithText(SwitchListTile, 'High contrast'), findsOneWidget);
  });

  testWidgets('Handedness radios change controller.handednessMode', (tester) async {
    final controller = AppSettingsController();

    await pumpSettings(tester, controller);

    expect(controller.handednessMode, HandednessMode.left);

    await tester.tap(find.text('Right-Handed View'));
    await tester.pump(const Duration(milliseconds: 120));
    expect(controller.handednessMode, HandednessMode.right);

    await tester.tap(find.text('Toggle Mode'));
    await tester.pump(const Duration(milliseconds: 120));
    expect(controller.handednessMode, HandednessMode.toggle);
  });

  testWidgets('Tap Cognitive Load tile opens detail screen', (tester) async {
    final controller = AppSettingsController();
    await pumpSettings(tester, controller);

    // Tap the tile by its visible label (your Settings list uses this exact title)
    await tester.tap(find.text('Cognitive Load (STML)'));
    await tester.pump(const Duration(milliseconds: 250));
    await tester.pump(const Duration(milliseconds: 250));

    // Detail screen should be present: it has a stable key on its SwitchListTile
    final toggleTile = find.byKey(const Key('a11y_mode_toggle'));
    expect(toggleTile, findsOneWidget);

    // The title is state-driven (Enabled/Disabled), so accept either
    final enabledTitle = find.descendant(
      of: toggleTile,
      matching: find.text('Enabled'),
    );
    final disabledTitle = find.descendant(
      of: toggleTile,
      matching: find.text('Disabled'),
    );

    expect(
      enabledTitle.evaluate().isNotEmpty || disabledTitle.evaluate().isNotEmpty,
      isTrue,
      reason: 'Expected the detail toggle tile title to be "Enabled" or "Disabled".',
    );

    final tileWidget = tester.widget<SwitchListTile>(toggleTile);
    expect(tileWidget.value, controller.guidedModeEnabled);
  });

  testWidgets('Detail screen switch toggles controller.guidedModeEnabled', (tester) async {
    final controller = AppSettingsController();

    await pumpSettings(tester, controller);

    expect(controller.guidedModeEnabled, false);

    await tester.tap(find.text('Cognitive Load (STML)'));
    await tester.pump(const Duration(milliseconds: 250));
    await tester.pump(const Duration(milliseconds: 250));

    // Tap the switch tile directly by key (more stable than byType(Switch).last)
    final toggle = find.byKey(const Key('a11y_mode_toggle'));
    expect(toggle, findsOneWidget);

    await tester.tap(toggle);
    await tester.pump(const Duration(milliseconds: 200));

    expect(controller.guidedModeEnabled, true);
  });

  testWidgets('Logout shows snack bar', (tester) async {
    final controller = AppSettingsController();

    await pumpSettings(tester, controller);

    await tester.tap(find.byKey(const Key('settings_logout_tile')));
    await tester.pump(const Duration(milliseconds: 200));

    expect(find.text('Logout?'), findsOneWidget);

    await tester.tap(find.byKey(const Key('logout_confirm')));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 250));
    await tester.pump(const Duration(milliseconds: 250));

    final snackbar = find.text('Logged out');
    final loginScreen = find.text('Login Screen');

    expect(
      snackbar.evaluate().isNotEmpty || loginScreen.evaluate().isNotEmpty,
      isTrue,
    );
  });
}