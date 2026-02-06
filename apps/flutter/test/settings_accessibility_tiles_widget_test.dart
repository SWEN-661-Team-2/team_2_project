import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/features/settings/settings_screen.dart';
import 'test_harness.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Future<void> scrollUntilTextVisible(
    WidgetTester tester,
    String text,
  ) async {
    final scrollable = find.byType(Scrollable).first;

    for (var i = 0; i < 30; i++) {
      if (find.text(text).evaluate().isNotEmpty) return;
      await tester.drag(scrollable, const Offset(0, -350));
      await tester.pumpAndSettle();
    }

    fail('Could not find "$text" after scrolling.');
  }

  testWidgets('Settings screen renders Accessibility tiles', (tester) async {
    await pumpWidgetWithApp(tester, const SettingsScreen());
    await tester.pumpAndSettle();

    // Accessibility section is lower on the page; scroll to it.
    await scrollUntilTextVisible(tester, 'Low Vision');

    expect(find.text('Low Vision'), findsOneWidget);
    expect(find.text('Tremor / Motor'), findsOneWidget);
    expect(find.text('Cognitive Load (STML)'), findsOneWidget);
    expect(find.text('Hearing Impaired'), findsOneWidget);
  });

  testWidgets('Tap Cognitive Load tile opens detail screen', (tester) async {
    await pumpWidgetWithApp(tester, const SettingsScreen());
    await tester.pumpAndSettle();

    await scrollUntilTextVisible(tester, 'Cognitive Load (STML)');

    await tester.tap(find.text('Cognitive Load (STML)'));
    await tester.pumpAndSettle();

    expect(find.text('Cognitive Load (STML)'), findsWidgets);
    expect(find.byKey(const Key('a11y_mode_toggle')), findsOneWidget);
  });
}