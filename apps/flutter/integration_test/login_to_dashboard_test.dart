// apps/flutter/integration_test/login_to_dashboard_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:flutter/widgets.dart';

import 'package:flutter_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('login -> dashboard smoke test', (tester) async {
    app.main();
    await tester.pumpAndSettle();

    // Welcome
    expect(find.text('CareConnect'), findsOneWidget);
    await tester.tap(find.text('Continue'));
    await tester.pumpAndSettle();

    // Login screen (use whatever text is actually on your screen)
    expect(find.text('Sign In'), findsWidgets);

    // Fill fields - these must match your actual widgets.
    // If your TextFields have labels/hints like "email address" and "password",
    // you can locate them by text, semantics, or keys.
    await tester.enterText(find.byType(EditableText).at(0), 'test@example.com');
    await tester.enterText(find.byType(EditableText).at(1), 'password123');
    await tester.pumpAndSettle();

    // Hide keyboard not needed here; just tap Sign In
    await tester.tap(find.text('Sign In').first);
    await tester.pumpAndSettle();

    // Dashboard proof - use something stable that is ALWAYS on dashboard
    // (Based on your Maestro selectors, tiles exist.)
    expect(find.textContaining('Active Patients'), findsOneWidget);
    expect(find.textContaining('Upcoming Visits'), findsOneWidget);
  });
}