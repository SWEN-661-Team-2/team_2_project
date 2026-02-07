import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/features/settings/accessibility_mode_detail_screen.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Switch toggles and calls onChanged', (tester) async {
    var changedTo = false;

    await tester.pumpWidget(
      ChangeNotifierProvider<AppSettingsController>(
        create: (_) => AppSettingsController(),
        child: MaterialApp(
          home: AccessibilityModeDetailScreen(
            title: 'Test',
            description: 'Test',
            icon: Icons.settings,
            enabled: false,
            onChanged: (v) => changedTo = v,
          ),
        ),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.byKey(const Key('a11y_mode_toggle')), findsOneWidget);

    await tester.tap(find.byType(Switch));
    await tester.pumpAndSettle();

    expect(changedTo, isTrue);
  });
}

