// apps/flutter/integration_test/login_to_dashboard_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

import 'package:flutter_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('login -> dashboard smoke test', (tester) async {
    app.main();
    await tester.pumpAndSettle();

    // Welcome
    expect(find.text('CareConnect'), findsOneWidget);
    expect(find.byKey(const Key('welcome_continue')), findsOneWidget);

    await tester.tap(find.byKey(const Key('welcome_continue')));
    await tester.pumpAndSettle();

    // Login
    expect(find.text('Sign In'), findsWidgets);
    expect(find.byKey(const Key('login_email')), findsOneWidget);
    expect(find.byKey(const Key('login_password')), findsOneWidget);
    expect(find.byKey(const Key('login_submit')), findsOneWidget);

    await tester.enterText(find.byKey(const Key('login_email')), 'test@example.com');
    await tester.enterText(find.byKey(const Key('login_password')), 'password123');
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const Key('login_submit')));
    await tester.pumpAndSettle();

    // Dashboard proof (use Semantics labels on KPI tiles to avoid duplicates)
    expect(find.text('CareConnect'), findsOneWidget);
    expect(find.bySemanticsLabel('Active Patients'), findsOneWidget);
    expect(find.bySemanticsLabel('Upcoming Visits'), findsOneWidget);
  });
}