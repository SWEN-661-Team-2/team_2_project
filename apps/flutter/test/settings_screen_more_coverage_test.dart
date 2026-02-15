import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/core/accessibility/reminder_frequency.dart';
import 'package:flutter_app/features/settings/settings_screen.dart';
import 'package:flutter_app/app/routes.dart';

class TestNavObserver extends NavigatorObserver {
  final pushed = <Route<dynamic>>[];

  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    pushed.add(route);
    super.didPush(route, previousRoute);
  }
}

Future<void> pumpSettingsWithRoutes(
  WidgetTester tester,
  AppSettingsController controller, {
  NavigatorObserver? observer,
}) async {
  await tester.binding.setSurfaceSize(const Size(1200, 6000));

  await tester.pumpWidget(
    ChangeNotifierProvider.value(
      value: controller,
      child: MaterialApp(
        home: const SettingsScreen(),
        routes: {
          Routes.profile: (_) => const Scaffold(body: Text('Profile Route')),
          Routes.changePassword: (_) => const Scaffold(body: Text('Change Password Route')),
          Routes.login: (_) => const Scaffold(body: Text('Login Route')),

          // ✅ ADD THESE ROUTES (these are what your SettingsScreen is navigating to now)
          Routes.privacyPolicy: (_) => const Scaffold(body: Text('Privacy Policy Route')),
          Routes.termsOfService: (_) => const Scaffold(body: Text('Terms of Service Route')),
          Routes.helpSupport: (_) => const Scaffold(body: Text('Help / Support Route')),
          Routes.aboutCareConnect: (_) => const Scaffold(body: Text('About CareConnect Route')),
        },
        navigatorObservers: observer != null ? [observer] : const <NavigatorObserver>[],
      ),
    ),
  );

  await tester.pumpAndSettle();
}

Finder findTextCI(String text) {
  final target = text.toLowerCase();
  return find.byWidgetPredicate(
    (w) => w is Text && (w.data ?? '').toLowerCase() == target,
    description: 'Text("$text") (case-insensitive)',
  );
}

Finder firstMatchTextCI(List<String> options) {
  for (final s in options) {
    final f = findTextCI(s);
    if (f.evaluate().isNotEmpty) return f;
  }
  return findTextCI(options.first);
}

Future<void> tapEnsuringVisibleTextCI(
  WidgetTester tester,
  List<String> textOptions,
) async {
  final target = firstMatchTextCI(textOptions);

  if (target.evaluate().isEmpty) {
    final scrollable = find.byType(Scrollable);
    if (scrollable.evaluate().isNotEmpty) {
      for (var i = 0; i < 25 && target.evaluate().isEmpty; i++) {
        await tester.drag(scrollable.first, const Offset(0, -320));
        await tester.pump(const Duration(milliseconds: 60));
      }
    }
  }

  expect(
    target,
    findsOneWidget,
    reason: 'Could not find any of: ${textOptions.join(" | ")}',
  );

  final element = tester.element(target);
  await Scrollable.ensureVisible(
    element,
    duration: const Duration(milliseconds: 1),
    alignment: 0.1,
  );
  await tester.pumpAndSettle();

  await tester.tap(target);
  await tester.pump();
}

void main() {
  testWidgets('Account tiles navigate to routes', (tester) async {
    final controller = AppSettingsController();

    // Test Profile navigation
    {
      final nav = TestNavObserver();
      await pumpSettingsWithRoutes(tester, controller, observer: nav);

      final beforeProfile = nav.pushed.length;
      await tapEnsuringVisibleTextCI(tester, const ['Profile information']);
      await tester.pumpAndSettle();
      expect(nav.pushed.length, greaterThan(beforeProfile));
      expect(find.text('Profile Route'), findsOneWidget);
    }

    // Test Change Password navigation - fresh start
    {
      final nav = TestNavObserver();
      await tester.pumpWidget(Container());
      await tester.pumpAndSettle();

      await pumpSettingsWithRoutes(tester, controller, observer: nav);

      final beforeChange = nav.pushed.length;
      await tapEnsuringVisibleTextCI(tester, const ['Change password', 'Change Password']);
      await tester.pumpAndSettle();
      expect(nav.pushed.length, greaterThan(beforeChange));
      expect(find.text('Change Password Route'), findsOneWidget);
    }
  });

  testWidgets(
    'Reminder frequency opens bottom sheet and selecting updates controller',
    (tester) async {
      final controller = AppSettingsController();
      await pumpSettingsWithRoutes(tester, controller);

      expect(controller.reminderFrequency, ReminderFrequency.daily);

      await tapEnsuringVisibleTextCI(tester, const ['Reminder frequency', 'Reminder Frequency']);
      await tester.pumpAndSettle();

      expect(find.text('Weekly'), findsOneWidget);

      await tester.tap(find.text('Weekly'));
      await tester.pumpAndSettle();

      expect(controller.reminderFrequency, ReminderFrequency.weekly);
    },
  );

  testWidgets('Privacy policy + Terms navigate to routes', (tester) async {
    final controller = AppSettingsController();
    await pumpSettingsWithRoutes(tester, controller);

    // ---- Privacy Policy ----
    await tapEnsuringVisibleTextCI(tester, const ['Privacy policy', 'Privacy Policy']);
    await tester.pumpAndSettle();
    expect(find.text('Privacy Policy Route'), findsOneWidget);

    final nav = tester.state<NavigatorState>(find.byType(Navigator));
    nav.pop();
    await tester.pumpAndSettle();

    await tapEnsuringVisibleTextCI(tester, const ['Terms of service', 'Terms of Service']);
    await tester.pumpAndSettle();
    expect(find.text('Terms of Service Route'), findsOneWidget);
  });

  testWidgets('Help / Support navigates to route', (tester) async {
    final controller = AppSettingsController();
    await pumpSettingsWithRoutes(tester, controller);

    await tapEnsuringVisibleTextCI(tester, const ['Help / Support', 'Help & Support']);
    await tester.pumpAndSettle();

    expect(find.text('Help / Support Route'), findsOneWidget);
  });

  testWidgets('About CareConnect navigates to route', (tester) async {
    final controller = AppSettingsController();
    await pumpSettingsWithRoutes(tester, controller);

    await tapEnsuringVisibleTextCI(tester, const ['About CareConnect', 'About']);
    await tester.pumpAndSettle();

    expect(find.text('About CareConnect Route'), findsOneWidget);
  });
}
