import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/features/auth/login_screen.dart';
import 'package:flutter_app/app/routes.dart';
import 'package:flutter_app/app/app_shell.dart';
import 'package:provider/provider.dart';
import 'package:flutter_app/app/providers.dart';

import 'test_harness.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Future<void> setTestScreenSize(WidgetTester tester, Size size) async {
    await tester.binding.setSurfaceSize(size);
    addTearDown(() async {
      await tester.binding.setSurfaceSize(null); 
    });
  }

  testWidgets('Login screen renders fields and buttons', (tester) async {
    await setTestScreenSize(tester, const Size(800, 900));
    await pumpWidgetWithApp(tester, const LoginScreen());

    expect(find.text('CareConnect'), findsOneWidget);
    expect(find.byKey(const Key('login_email')), findsOneWidget);
    expect(find.byKey(const Key('login_password')), findsOneWidget);
    expect(find.byKey(const Key('login_submit')), findsOneWidget);
  });

  testWidgets('Forgot password button exists', (tester) async {
    await setTestScreenSize(tester, const Size(800, 900));
    await pumpWidgetWithApp(tester, const LoginScreen());

    expect(find.byKey(const Key('login_forgot')), findsOneWidget);
  });

  testWidgets('Password visibility toggles when suffix tapped', (tester) async {
    await setTestScreenSize(tester, const Size(800, 900));
    await pumpWidgetWithApp(tester, const LoginScreen());

    final pwdFinder = find.byKey(const Key('login_password'));
    expect(pwdFinder, findsOneWidget);

    final suffix = find.descendant(of: pwdFinder, matching: find.byType(IconButton));
    expect(suffix, findsOneWidget);

    await tester.tap(suffix);
    await tester.pumpAndSettle();

    expect(pwdFinder, findsOneWidget);
  });

  testWidgets('Login shows email error when email is empty', (tester) async {
    await setTestScreenSize(tester, const Size(800, 900));
    await pumpWidgetWithApp(tester, const LoginScreen());
    await tester.enterText(find.byKey(const Key('login_password')), 'password');

    final submit = find.byKey(const Key('login_submit'));
    await tester.ensureVisible(submit);
    await tester.tap(submit, warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(find.text('Email is required'), findsOneWidget);
    expect(find.byType(AppShell), findsNothing);
  });

  testWidgets('Email error clears when user types after error', (tester) async {
    await setTestScreenSize(tester, const Size(800, 900));
    await pumpWidgetWithApp(tester, const LoginScreen());
    await tester.enterText(find.byKey(const Key('login_password')), 'password');

    final submit = find.byKey(const Key('login_submit'));
    await tester.ensureVisible(submit);
    await tester.tap(submit, warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(find.text('Email is required'), findsOneWidget);

    await tester.enterText(find.byKey(const Key('login_email')), 'anything@anywhere.com');
    await tester.pumpAndSettle();

    expect(find.text('Email is required'), findsNothing);
    expect(find.byType(AppShell), findsNothing);
  });

  testWidgets('Login shows password error when password is empty', (tester) async {
    await setTestScreenSize(tester, const Size(800, 900));
    await pumpWidgetWithApp(tester, const LoginScreen());
    await tester.enterText(find.byKey(const Key('login_email')), 'anything@anywhere.com');

    final submit = find.byKey(const Key('login_submit'));
    await tester.ensureVisible(submit);
    await tester.tap(submit, warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(find.text('Password is required'), findsOneWidget);
    expect(find.byType(AppShell), findsNothing);
  });

  testWidgets('Login navigates to app on success (any non-empty credentials)', (tester) async {
    await setTestScreenSize(tester, const Size(800, 900));

    await tester.pumpWidget(
      MultiProvider(
        providers: AppProviders.build(),
        child: MaterialApp(
          routes: Routes.map,
          initialRoute: Routes.login,
        ),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('login_email')), 'anyone@anywhere.com');
    await tester.enterText(find.byKey(const Key('login_password')), 'anything');

    final submit = find.byKey(const Key('login_submit'));
    await tester.ensureVisible(submit);
    await tester.tap(submit, warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(find.byType(AppShell), findsOneWidget);
  });
}