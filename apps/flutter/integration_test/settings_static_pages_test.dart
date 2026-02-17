// apps/flutter/integration_test/settings_static_pages_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:flutter_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  Future<void> loginToDashboard(WidgetTester tester) async {
    app.main();
    await tester.pumpAndSettle();

    // Welcome -> Login
    expect(find.text('CareConnect'), findsOneWidget);
    await tester.tap(find.text('Continue'));
    await tester.pumpAndSettle();

    // Login
    expect(find.text('Sign In'), findsWidgets);

    await tester.enterText(find.byKey(const Key('login_email')), 'test@example.com');
    await tester.enterText(find.byKey(const Key('login_password')), 'password123');
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const Key('login_submit')));
    await tester.pumpAndSettle();

    // Dashboard sanity
    expect(find.text('CareConnect'), findsWidgets);
  }

  Future<void> openSettingsTab(WidgetTester tester) async {
    await tester.tap(find.text('Settings'));
    await tester.pumpAndSettle();

    expect(find.text('Settings'), findsWidgets);
  }

  Future<void> openStaticPage(
    WidgetTester tester, {
    required String tapText,
    required String expectedTitle,
  }) async {
    // Settings is scrollable, so scroll if needed
    await tester.scrollUntilVisible(find.text(tapText), 300);
    await tester.tap(find.text(tapText));
    await tester.pumpAndSettle();

    // Only assert title (stable)
    expect(find.text(expectedTitle), findsWidgets);

    // Back
    await tester.pageBack();
    await tester.pumpAndSettle();

    // Back on Settings
    expect(find.text('Settings'), findsWidgets);
  }

  testWidgets('settings -> static pages open (privacy/about/terms/help)', (tester) async {
    await loginToDashboard(tester);
    await openSettingsTab(tester);

    await openStaticPage(
      tester,
      tapText: 'Privacy policy',
      expectedTitle: 'Privacy Policy',
    );

    await openStaticPage(
      tester,
      tapText: 'About CareConnect',
      expectedTitle: 'About CareConnect',
    );

    await openStaticPage(
      tester,
      tapText: 'Terms of service',
      expectedTitle: 'Terms of Service',
    );

    await openStaticPage(
      tester,
      tapText: 'Help / Support',
      expectedTitle: 'Help / Support',
    );
  });
}

