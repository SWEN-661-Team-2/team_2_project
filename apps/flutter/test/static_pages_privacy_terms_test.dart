// apps/flutter/test/static_pages_privacy_terms_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/core/accessibility/app_settings_controller.dart';

// ✅ These MUST match the exact paths in lib/
import 'package:flutter_app/features/privacy/privacy_policy_screen.dart';
import 'package:flutter_app/features/privacy/terms_of_service_screen.dart';

void main() {
  Widget _wrap(Widget child) {
    return MaterialApp(
      home: ChangeNotifierProvider<AppSettingsController>(
        create: (_) => AppSettingsController(),
        child: child,
      ),
    );
  }

  testWidgets('PrivacyPolicyScreen renders static content', (tester) async {
    await tester.pumpWidget(_wrap(const PrivacyPolicyScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Privacy Policy'), findsOneWidget);
    expect(find.text('1. Data Collection'), findsOneWidget);
    expect(find.text('2. Authentication'), findsOneWidget);
    expect(find.text('3. Storage'), findsOneWidget);
    expect(find.text('4. Third-Party Services'), findsOneWidget);
    expect(find.text('5. Changes'), findsOneWidget);
  });

  testWidgets('TermsOfServiceScreen renders static content', (tester) async {
    await tester.pumpWidget(_wrap(const TermsOfServiceScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Terms of Service'), findsOneWidget);
    expect(find.text('1. Prototype Use'), findsOneWidget);
    expect(find.text('2. No Medical Advice'), findsOneWidget);
    expect(find.text('3. Availability'), findsOneWidget);
    expect(find.text('4. Liability'), findsOneWidget);
    expect(find.text('5. Contact'), findsOneWidget);
  });
}