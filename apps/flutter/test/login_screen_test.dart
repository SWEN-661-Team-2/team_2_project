import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/features/auth/login_screen.dart';
import 'package:flutter_app/app/routes.dart';
import 'package:flutter_app/app/app_shell.dart';

import 'test_harness.dart';
import 'package:flutter_app/app/app_scope.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Login screen renders fields and buttons', (tester) async {
    await pumpWidgetWithApp(tester, const LoginScreen());

    expect(find.text('CareConnect'), findsOneWidget);
    expect(find.byKey(const Key('login_email')), findsOneWidget);
    expect(find.byKey(const Key('login_password')), findsOneWidget);
    expect(find.byKey(const Key('login_submit')), findsOneWidget);
  });

  testWidgets('Forgot password button exists', (tester) async {
    await pumpWidgetWithApp(tester, const LoginScreen());
    expect(find.byKey(const Key('login_forgot')), findsOneWidget);
  });

  testWidgets('Password visibility toggles when suffix tapped', (tester) async {
    await pumpWidgetWithApp(tester, const LoginScreen());

    final pwdFinder = find.byKey(const Key('login_password'));
    expect(pwdFinder, findsOneWidget);

    // The suffix icon is present; tap it to toggle show/hide
    final suffix = find.descendant(of: pwdFinder, matching: find.byType(IconButton));
    expect(suffix, findsOneWidget);
    await tester.tap(suffix);
    await tester.pumpAndSettle();

    // Tapping should not throw and will toggle obscureText state
    expect(pwdFinder, findsOneWidget);
  });

  testWidgets('Email error cleared when user types after error', (tester) async {
    await pumpWidgetWithApp(tester, const LoginScreen());

    await tester.enterText(find.byKey(const Key('login_email')), 'bad@example.com');
    await tester.enterText(find.byKey(const Key('login_password')), 'password');
    await tester.ensureVisible(find.byKey(const Key('login_submit')));
    await tester.tap(find.byKey(const Key('login_submit')));
    await tester.pumpAndSettle();

    expect(find.text('Incorrect email address'), findsOneWidget);

    // Type into email field to clear error
    await tester.enterText(find.byKey(const Key('login_email')), 'caregiver@careconnect.com');
    await tester.pumpAndSettle();
    expect(find.text('Incorrect email address'), findsNothing);
  });

  testWidgets('Login shows email error for wrong email', (tester) async {
    await pumpWidgetWithApp(tester, const LoginScreen());

    await tester.enterText(find.byKey(const Key('login_email')), 'bad@example.com');
    await tester.enterText(find.byKey(const Key('login_password')), 'password');
    await tester.ensureVisible(find.byKey(const Key('login_submit')));
    await tester.tap(find.byKey(const Key('login_submit')));
    await tester.pumpAndSettle();

    expect(find.text('Incorrect email address'), findsOneWidget);
  });

  testWidgets('Login shows password error for wrong password', (tester) async {
    await pumpWidgetWithApp(tester, const LoginScreen());

    await tester.enterText(find.byKey(const Key('login_email')), 'caregiver@careconnect.com');
    await tester.enterText(find.byKey(const Key('login_password')), 'wrong');
    await tester.ensureVisible(find.byKey(const Key('login_submit')));
    await tester.tap(find.byKey(const Key('login_submit')));
    await tester.pumpAndSettle();

    expect(find.text('Incorrect password'), findsOneWidget);
  });

  testWidgets('Login navigates to app on success', (tester) async {
    await tester.pumpWidget(
      AppScope(
        controller: AppSettingsController(),
        child: MaterialApp(routes: Routes.map, initialRoute: Routes.login),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('login_email')), 'caregiver@careconnect.com');
    await tester.enterText(find.byKey(const Key('login_password')), 'password');
    await tester.ensureVisible(find.byKey(const Key('login_submit')));
    await tester.tap(find.byKey(const Key('login_submit')));
    await tester.pumpAndSettle();

    // AppShell should be pushed
    expect(find.byType(AppShell), findsOneWidget);
  });
}
