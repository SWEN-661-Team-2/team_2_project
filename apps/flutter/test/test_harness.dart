// FILE: test/test_harness.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:nested/nested.dart';

import 'package:flutter_app/features/welcome/welcome_screen.dart';
import 'package:flutter_app/features/auth/login_screen.dart';
import 'package:flutter_app/app/app_shell.dart';
import 'package:flutter_app/features/profile/profile_screen.dart';
import 'package:flutter_app/features/auth/change_password_screen.dart';
import 'package:flutter_app/app/providers.dart';

typedef TestWrapper = Widget Function(Widget child);

Widget _wrapAll(Widget child, List<TestWrapper> wrappers) {
  var current = child;
  for (final wrap in wrappers) {
    current = wrap(current);
  }
  return current;
}

/// Pump a widget as the app "home".
/// Guarantees MaterialApp has either `home` OR a non-empty `routes`.
Future<void> pumpWidgetWithApp(
  WidgetTester tester,
  Widget home, {
  Map<String, WidgetBuilder> routes = const {},
  List<TestWrapper> wrappers = const [],
  List<SingleChildWidget> providers = const [],
}) async {
  final hasRootRoute = routes.containsKey(Navigator.defaultRouteName);

  final effectiveHome = hasRootRoute ? null : home;

  final effectiveRoutes = (effectiveHome == null && routes.isEmpty)
      ? <String, WidgetBuilder>{
          Navigator.defaultRouteName: (_) => const SizedBox.shrink(),
        }
      : routes;

  // Use AppProviders.build() to get the same providers as the real app,
  // then add any additional test-specific providers
  final allProviders = <SingleChildWidget>[
    ...AppProviders.build(),
    ...providers,
  ];

  Widget app = MultiProvider(
    providers: allProviders,
    child: MaterialApp(
      debugShowCheckedModeBanner: false,
      home: effectiveHome,
      routes: effectiveRoutes,
    ),
  );

  await tester.pumpWidget(_wrapAll(app, wrappers));
  await tester.pumpAndSettle();
}

/// Default routes for tests (optional).
Map<String, WidgetBuilder> _defaultTestRoutes() => {
  Navigator.defaultRouteName: (_) => const WelcomeScreen(),
  '/login': (_) => const LoginScreen(),
  '/app': (_) => const AppShell(),
  '/profile': (_) => const ProfileScreen(),
  '/change-password': (_) => const ChangePasswordScreen(),
};

/// Pump a MaterialApp configured for navigation tests.
Future<void> pumpAppWithRoutes(
  WidgetTester tester, {
  String initialRoute = Navigator.defaultRouteName,
  Map<String, WidgetBuilder> routes = const {},
  List<TestWrapper> wrappers = const [],
  List<SingleChildWidget> providers = const [],
}) async {
  final mergedRoutes = <String, WidgetBuilder>{
    ..._defaultTestRoutes(),
    ...routes,
  };

  final effectiveRoutes = mergedRoutes.isEmpty
      ? <String, WidgetBuilder>{
          Navigator.defaultRouteName: (_) =>
              const Scaffold(body: SizedBox.shrink()),
        }
      : mergedRoutes;

  // Use AppProviders.build() to get the same providers as the real app,
  // then add any additional test-specific providers
  final allProviders = <SingleChildWidget>[
    ...AppProviders.build(),
    ...providers,
  ];

  Widget app = MultiProvider(
    providers: allProviders,
    child: MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: initialRoute,
      routes: effectiveRoutes,
    ),
  );

  await tester.pumpWidget(_wrapAll(app, wrappers));
  await tester.pumpAndSettle();
}
