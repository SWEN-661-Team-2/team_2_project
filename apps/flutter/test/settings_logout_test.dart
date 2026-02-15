import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:provider/provider.dart';
import 'package:flutter_app/app/providers.dart';

import 'package:flutter_app/app/routes.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/features/auth/login_screen.dart';
import 'package:flutter_app/features/settings/settings_screen.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Logout navigates to login (and may show snackbar)', (tester) async {
    SharedPreferences.setMockInitialValues(<String, Object>{});

    final controller = AppSettingsController();
    await tester.runAsync(() async {
      await controller.load();
    });

    await tester.pumpWidget(
      MultiProvider(
        providers: AppProviders.build(),
        child: MaterialApp(
          home: const SettingsScreen(),
          onGenerateRoute: (settings) {
            if (settings.name == Routes.login) {
              return MaterialPageRoute(builder: (_) => const LoginScreen());
            }
            return null;
          },
        ),
      ),
    );

    await tester.pumpAndSettle();

    // Scroll until logout is visible
    final settingsScroll = find
        .descendant(
          of: find.byType(SettingsScreen),
          matching: find.byType(Scrollable),
        )
        .first;

    await tester.scrollUntilVisible(
      find.byKey(const Key('settings_logout_tile')),
      300,
      scrollable: settingsScroll,
    );

    // Tap logout tile (more stable than text)
    await tester.tap(find.byKey(const Key('settings_logout_tile')));
    await tester.pumpAndSettle();

    // Confirm dialog appears
    expect(find.text('Logout?'), findsOneWidget);

    // Confirm logout
    await tester.tap(find.byKey(const Key('logout_confirm')));
    await tester.pump(); // allow nav + snackbar enqueue
    await tester.pumpAndSettle();

    // Now we should be on LoginScreen
    expect(find.byKey(const Key('login_email')), findsOneWidget);
    expect(find.byKey(const Key('login_password')), findsOneWidget);
    expect(find.byKey(const Key('login_submit')), findsOneWidget);
  });
}
