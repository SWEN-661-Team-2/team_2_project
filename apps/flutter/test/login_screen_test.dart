// FILE: test/login_screen_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/app/routes.dart';
import 'package:flutter_app/app/app_shell.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Login navigates to app on success (any non-empty credentials)', (tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => AppSettingsController(),
        child: MaterialApp(
          routes: Routes.map,
          initialRoute: Routes.login,
        ),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('login_email')), 'a@b.com');
    await tester.enterText(find.byKey(const Key('login_password')), 'pw');
    await tester.pump();

    final submit = find.byKey(const Key('login_submit'));
    await tester.ensureVisible(submit);
    await tester.tap(submit);
    await tester.pumpAndSettle();

    expect(find.byType(AppShell), findsOneWidget);
  });
}
