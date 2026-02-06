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

  testWidgets('Text size boxes render and tapping changes controller.textSizeMode',
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
  });

  testWidgets('Contrast tile toggles controller.highContrastEnabled', (tester) async {
    final controller = AppSettingsController();

    await pumpSettings(tester, controller);

    // Before
    expect(controller.highContrastEnabled, false);
    expect(find.text('Day / Normal'), findsOneWidget);

    // Tap the tile
    await tester.tap(find.text('Day / Normal'));

    // IMPORTANT: allow async + notifyListeners + rebuild
    await tester.pump(const Duration(milliseconds: 300));
    await tester.pump(const Duration(milliseconds: 300));

    // Controller changed
    expect(controller.highContrastEnabled, true);

    // UI changed
    expect(find.text('Night / High Contrast'), findsOneWidget);
  });

  testWidgets('Handedness radios change controller.handednessMode',
      (tester) async {
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

    await tester.tap(find.text('Cognitive Load (STML)'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 250));

    // Title should appear on detail screen
    expect(find.text('Cognitive Load (STML)'), findsWidgets);

    // There will be 2 switches in the widget tree:
    // - one still in SettingsScreen
    // - one in the detail screen
    expect(find.byType(Switch), findsNWidgets(2));
  });

  testWidgets('Detail screen switch toggles controller.guidedModeEnabled',
      (tester) async {
    final controller = AppSettingsController();

    await pumpSettings(tester, controller);

    expect(controller.guidedModeEnabled, false);

    await tester.tap(find.text('Cognitive Load (STML)'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 250));

    // Tap the LAST switch (detail screen)
    final sw = find.byType(Switch).last;
    await tester.tap(sw);
    await tester.pump(const Duration(milliseconds: 150));

    expect(controller.guidedModeEnabled, true);
  });

  testWidgets('Logout shows snack bar', (tester) async {
    final controller = AppSettingsController();

    await pumpSettings(tester, controller);

    await tester.tap(find.text('Logout'));
    await tester.pump(const Duration(milliseconds: 200));

    expect(find.text('Logged out'), findsOneWidget);

    // Verify navigation worked too
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.text('Login Screen'), findsOneWidget);
  });
}