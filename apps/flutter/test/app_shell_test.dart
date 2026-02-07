// File: test/app_shell_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:nested/nested.dart';

import 'package:flutter_app/app/routes.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/features/patients/patients_list_screen.dart';
import 'package:flutter_app/features/messages/messages_list_screen.dart';

import 'test_harness.dart';

Finder _navBarFinder() {
  final bottom = find.byType(BottomNavigationBar);
  final m3 = find.byType(NavigationBar);
  if (bottom.evaluate().isNotEmpty) return bottom;
  return m3;
}

Future<void> _tapIfPresent(WidgetTester tester, Finder finder) async {
  if (finder.evaluate().isEmpty) return;
  await tester.tap(finder.first);
  await tester.pumpAndSettle();
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  List<SingleChildWidget> baseProviders() => <SingleChildWidget>[
        ChangeNotifierProvider<AppSettingsController>(
          create: (_) => AppSettingsController(),
        ),
      ];

  testWidgets('AppShell builds with bottom navigation', (tester) async {
    await pumpAppWithRoutes(
      tester,
      initialRoute: Routes.app,
      providers: baseProviders(),
    );

    expect(_navBarFinder(), findsOneWidget);
  });

  testWidgets('Tapping Patients tab shows PatientsListScreen', (tester) async {
    await pumpAppWithRoutes(
      tester,
      initialRoute: Routes.app,
      providers: baseProviders(),
    );

    await _tapIfPresent(tester, find.byKey(const Key('bn_people')));
    await _tapIfPresent(tester, find.byIcon(Icons.people));

    expect(find.byType(PatientsListScreen), findsWidgets);
  });

  testWidgets('Tapping Messages tab shows MessagesListScreen', (tester) async {
    await pumpAppWithRoutes(
      tester,
      initialRoute: Routes.app,
      providers: baseProviders(),
    );

    await _tapIfPresent(tester, find.byKey(const Key('bn_messages')));
    await _tapIfPresent(tester, find.byIcon(Icons.chat_bubble_outline));
    await _tapIfPresent(tester, find.byIcon(Icons.message));
    await _tapIfPresent(tester, find.byIcon(Icons.mail_outline));

    expect(find.byType(MessagesListScreen), findsWidgets);
  });
}
