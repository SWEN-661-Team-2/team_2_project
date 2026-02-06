// File: test/settings_screen_more_coverage_test.dart

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
          Routes.changePassword: (_) =>
              const Scaffold(body: Text('Change Password Route')),
          Routes.login: (_) => const Scaffold(body: Text('Login Route')),
        },
        // Dart 3+: null-aware element avoids the lint.
        navigatorObservers: observer != null ? [observer] : const <NavigatorObserver>[],
      ),
    ),
  );

  await tester.pumpAndSettle();
}

Finder findTextCI(String text) {
  final target = text.toLowerCase();
  return find.byWidgetPredicate(
    (w) =>
        w is Text &&
        (w.data ?? '').toLowerCase() == target,
    description: 'Text("$text") (case-insensitive)',
  );
}

Finder firstMatchTextCI(List<String> options) {
  for (final s in options) {
    final f = findTextCI(s);
    if (f.evaluate().isNotEmpty) return f;
  }
  // Return the first option finder for a clean error message later.
  return findTextCI(options.first);
}

/// If your Settings UI uses a collapsible group header (ExpansionTile), call this
/// before looking for tiles inside it. Safe no-op if header not present.
Future<void> expandIfPresent(WidgetTester tester, List<String> headerOptions) async {
  final header = firstMatchTextCI(headerOptions);
  if (header.evaluate().isEmpty) return;

  // If it's an ExpansionTile title, tapping expands it.
  await tester.tap(header);
  await tester.pumpAndSettle();
}

Future<void> tapEnsuringVisibleTextCI(
  WidgetTester tester,
  List<String> textOptions,
) async {
  final target = firstMatchTextCI(textOptions);

  // If not built yet, try to bring it into existence by scrolling the nearest scroll view.
  if (target.evaluate().isEmpty) {
    // Scroll a few times to trigger lazy-build lists.
    // (Scrollable.ensureVisible requires an element, so we scroll the primary scrollable.)
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

  // Now it exists: use framework-level ensureVisible that doesn’t depend on your widget types.
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

Future<void> expectSnackBarTextOneOf(
  WidgetTester tester,
  List<String> options,
) async {
  await tester.pump(const Duration(milliseconds: 450));

  for (final s in options) {
    final f = find.text(s);
    if (f.evaluate().isNotEmpty) {
      expect(f, findsOneWidget);
      return;
    }
  }

  expect(find.byType(SnackBar), findsOneWidget);
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
  }

  // Test Change Password navigation - completely fresh start
  {
    final nav = TestNavObserver();
    await tester.pumpWidget(Container()); 
    await tester.pumpAndSettle();
    
    await pumpSettingsWithRoutes(tester, controller, observer: nav);

    final beforeChange = nav.pushed.length;
    await tapEnsuringVisibleTextCI(tester, const ['Change password', 'Change Password']);
    await tester.pumpAndSettle();
    expect(nav.pushed.length, greaterThan(beforeChange));
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

  testWidgets('Privacy policy + Terms show snackbars', (tester) async {
    final controller = AppSettingsController();
    await pumpSettingsWithRoutes(tester, controller);

    await tapEnsuringVisibleTextCI(tester, const ['Privacy policy', 'Privacy Policy']);
    await expectSnackBarTextOneOf(tester, const ['Privacy policy (coming soon)']);

    await tapEnsuringVisibleTextCI(tester, const ['Terms of service', 'Terms of Service']);
    await expectSnackBarTextOneOf(
      tester,
      const [
        'Terms of service (coming soon)',
        'Terms (coming soon)',
      ],
    );
  });

  testWidgets('Help / Support shows snackbar', (tester) async {
    final controller = AppSettingsController();
    await pumpSettingsWithRoutes(tester, controller);

    await tapEnsuringVisibleTextCI(tester, const ['Help / Support', 'Help & Support']);
    await expectSnackBarTextOneOf(tester, const ['Support (coming soon)']);
  });

  testWidgets('About dialog opens', (tester) async {
    final controller = AppSettingsController();
    await pumpSettingsWithRoutes(tester, controller);

    await tapEnsuringVisibleTextCI(tester, const ['About CareConnect', 'About']);
    await tester.pumpAndSettle();

    expect(find.byType(AboutDialog), findsOneWidget);
    expect(find.textContaining('CareConnect'), findsWidgets);
  });
}