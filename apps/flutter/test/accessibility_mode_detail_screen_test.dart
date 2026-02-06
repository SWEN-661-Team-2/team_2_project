import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/features/settings/accessibility_mode_detail_screen.dart';

void main() {
  testWidgets('Switch toggles and calls onChanged', (tester) async {
    var changedTo = false;

    await tester.pumpWidget(
      MaterialApp(
        home: AccessibilityModeDetailScreen(
          title: 'Low Vision',
          description: 'UI-only toggle',
          icon: Icons.visibility,
          enabled: false,
          onChanged: (v) => changedTo = v,
        ),
      ),
    );

    expect(find.byKey(const Key('a11y_mode_toggle')), findsOneWidget);
    expect(find.text('Disabled'), findsOneWidget);

    await tester.tap(find.byType(Switch));
    await tester.pumpAndSettle();

    expect(changedTo, isTrue);
  });
}