// test/static_pages_about_help_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/features/about/about_careconnect_screen.dart';
import 'package:flutter_app/features/help/help_support_screen.dart';

void main() {
  Widget _wrap(Widget child) {
    return MaterialApp(
      home: ChangeNotifierProvider<AppSettingsController>(
        create: (_) => AppSettingsController(),
        child: child,
      ),
    );
  }

  testWidgets('AboutCareConnectScreen renders static content', (tester) async {
    await tester.pumpWidget(_wrap(const AboutCareConnectScreen()));
    await tester.pumpAndSettle();

    expect(find.text('About CareConnect'), findsOneWidget);
    expect(find.text('CareConnect-LH'), findsOneWidget);
    expect(find.text('Purpose'), findsOneWidget);
    expect(find.text('Credits'), findsOneWidget);
    expect(find.text('Licensing'), findsOneWidget);
  });

  testWidgets('HelpSupportScreen renders static content', (tester) async {
    await tester.pumpWidget(_wrap(const HelpSupportScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Help / Support'), findsOneWidget);
    expect(find.text('Common Topics'), findsOneWidget);
    expect(find.text('Accessibility'), findsOneWidget);
    expect(find.text('Contact'), findsOneWidget);
  });
}