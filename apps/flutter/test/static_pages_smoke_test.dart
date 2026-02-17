// apps/flutter/test/static_pages_smoke_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:flutter_app/core/accessibility/app_settings_controller.dart';

import 'package:flutter_app/features/about/about_careconnect_screen.dart';
import 'package:flutter_app/features/help/help_support_screen.dart';
import 'package:flutter_app/features/privacy/privacy_policy_screen.dart';
import 'package:flutter_app/features/privacy/terms_of_service_screen.dart';

void main() {
  setUpAll(() async {
    SharedPreferences.setMockInitialValues({});
  });

  Widget wrap(Widget child) {
    return MaterialApp(
      home: ChangeNotifierProvider<AppSettingsController>(
        create: (_) => AppSettingsController(),
        child: child,
      ),
    );
  }

  testWidgets('AboutCareConnectScreen renders', (tester) async {
    await tester.pumpWidget(wrap(const AboutCareConnectScreen()));
    await tester.pumpAndSettle();

    expect(find.text('About CareConnect'), findsOneWidget);
    expect(find.text('CareConnect-LH'), findsOneWidget);
    expect(find.text('Purpose'), findsOneWidget);
    expect(find.text('Credits'), findsOneWidget);
    expect(find.text('Licensing'), findsOneWidget);
  });

  testWidgets('HelpSupportScreen renders', (tester) async {
    await tester.pumpWidget(wrap(const HelpSupportScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Help / Support'), findsOneWidget);
    expect(find.text('Common Topics'), findsOneWidget);
    expect(find.text('Accessibility'), findsOneWidget);
    expect(find.text('Contact'), findsOneWidget);
  });

  testWidgets('PrivacyPolicyScreen renders', (tester) async {
    await tester.pumpWidget(wrap(const PrivacyPolicyScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Privacy Policy'), findsOneWidget);
    expect(find.text('1. Data Collection'), findsOneWidget);
    expect(find.text('2. Authentication'), findsOneWidget);
    expect(find.text('3. Storage'), findsOneWidget);
    expect(find.text('4. Third-Party Services'), findsOneWidget);
    expect(find.text('5. Changes'), findsOneWidget);
  });

  testWidgets('TermsOfServiceScreen renders', (tester) async {
    await tester.pumpWidget(wrap(const TermsOfServiceScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Terms of Service'), findsOneWidget);
    expect(find.text('1. Prototype Use'), findsOneWidget);
    expect(find.text('2. No Medical Advice'), findsOneWidget);
    expect(find.text('3. Availability'), findsOneWidget);
    expect(find.text('4. Liability'), findsOneWidget);
    expect(find.text('5. Contact'), findsOneWidget);
  });
}

