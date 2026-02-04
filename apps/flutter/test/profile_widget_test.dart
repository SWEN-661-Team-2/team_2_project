import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:flutter_app/features/profile/profile_screen.dart';
import 'test_harness.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues(<String, Object>{});
  });

  testWidgets('Tapping Edit shows edit fields and Save/Cancel', (tester) async {
    SharedPreferences.setMockInitialValues({});

    await pumpWidgetWithApp(tester, const ProfileScreen());
    await tester.pumpAndSettle();

    // Enter edit mode via AppBar action
    await tester.tap(find.text('Edit'));
    await tester.pumpAndSettle();

    // Ensure form is visible (Save is at bottom of ListView)
    await tester.ensureVisible(find.byType(TextField).last);
    await tester.pumpAndSettle();

    // Assert edit controls
    expect(find.byType(TextField), findsWidgets);
    expect(find.widgetWithText(FilledButton, 'Save'), findsOneWidget);
    expect(find.widgetWithText(OutlinedButton, 'Cancel'), findsOneWidget);
  });

  testWidgets('Edit → Save updates profile and exits edit mode', (tester) async {
    SharedPreferences.setMockInitialValues({});

    await pumpWidgetWithApp(tester, const ProfileScreen());
    await tester.pumpAndSettle();

    // Enter edit mode via AppBar button
    await tester.tap(find.text('Edit'));
    await tester.pumpAndSettle();

    // Update first field (Name)
    await tester.enterText(find.byType(TextField).first, 'New Name');
    await tester.pumpAndSettle();

    // Bring Save into view and tap it
    await tester.drag(find.byType(ListView), const Offset(0, -600));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Save'));
    await tester.pumpAndSettle();

    // Assert we exited edit mode by verifying the AppBar "Edit" button is back
    expect(find.text('Edit'), findsOneWidget);

    // And the saved value is visible somewhere in read-only view
    expect(find.text('New Name'), findsOneWidget);

    // Flush pending SnackBar/Timer-based animations before test teardown.
    await tester.pump(const Duration(seconds: 6));
    await tester.pumpAndSettle();
  });
}