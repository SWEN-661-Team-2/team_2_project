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

  Finder readOnlyView() => find.byKey(const Key('profile_readonly'));
  Finder editView() => find.byKey(const Key('profile_edit_view'));

  Finder editBtn() => find.byKey(const Key('profile_edit'));
  Finder saveBtn() => find.byKey(const Key('profile_save'));
  Finder cancelBtn() => find.byKey(const Key('profile_cancel'));

  Future<void> waitForReadOnlyLoaded(WidgetTester tester) async {
    for (var i = 0; i < 120; i++) {
      await tester.pump(const Duration(milliseconds: 50));
      if (readOnlyView().evaluate().isNotEmpty) return;
    }
    fail('profile_readonly not found');
  }

  Future<void> scrollUntilBuilt(
    WidgetTester tester,
    Finder target,
    Finder scrollable,
  ) async {
    expect(scrollable, findsOneWidget);

    for (var i = 0; i < 60; i++) {
      if (target.evaluate().isNotEmpty) {
        await tester.ensureVisible(target);
        await tester.pumpAndSettle();
        return;
      }
      await tester.drag(scrollable, const Offset(0, -300));
      await tester.pumpAndSettle();
    }

    fail('target not found after scrolling');
  }

  Future<void> tapEdit(WidgetTester tester) async {
    await scrollUntilBuilt(tester, editBtn(), readOnlyView());
    await tester.tap(editBtn());
    await tester.pumpAndSettle();
    expect(editView(), findsOneWidget);
  }

  Future<void> tapSave(WidgetTester tester) async {
    await scrollUntilBuilt(tester, saveBtn(), editView());
    await tester.tap(saveBtn());
    await tester.pumpAndSettle();
  }

  testWidgets('Tapping Edit shows edit fields and Save/Cancel', (tester) async {
    await pumpWidgetWithApp(tester, const ProfileScreen());
    await tester.pump();

    await waitForReadOnlyLoaded(tester);
    await tapEdit(tester);

    expect(find.byType(TextField), findsWidgets);
    await scrollUntilBuilt(tester, saveBtn(), editView());
    expect(saveBtn(), findsOneWidget);
    expect(cancelBtn(), findsOneWidget);
  });

  testWidgets('Edit → Save updates profile and exits edit mode', (
    tester,
  ) async {
    await pumpWidgetWithApp(tester, const ProfileScreen());
    await tester.pump();

    await waitForReadOnlyLoaded(tester);
    await tapEdit(tester);

    await tester.enterText(find.byType(TextField).first, 'New Name');
    await tester.pumpAndSettle();

    await tapSave(tester);

    expect(readOnlyView(), findsOneWidget);
    expect(find.text('New Name'), findsOneWidget);
  });
}
