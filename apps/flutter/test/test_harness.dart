import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:provider/provider.dart';
import 'package:flutter_app/app/providers.dart';
import 'package:flutter_app/app/routes.dart';

Future<void> pumpWidgetWithApp(WidgetTester tester, Widget child) async {
  SharedPreferences.setMockInitialValues(<String, Object>{});

  final routesSansRoot = Map<String, WidgetBuilder>.from(Routes.map);
  routesSansRoot.remove('/');

  await tester.pumpWidget(
    MultiProvider(
      providers: AppProviders.build(),
      child: MaterialApp(
        home: child,
        routes: routesSansRoot,
      ),
    ),
  );

  await tester.pumpAndSettle();
}

/// Boots the real route table using initialRoute (Settings → Login, etc.)
Future<void> pumpAppAtRoute(
  WidgetTester tester, {
  required String initialRoute,
}) async {
  SharedPreferences.setMockInitialValues(<String, Object>{});

  await tester.pumpWidget(
    MultiProvider(
      providers: AppProviders.build(),
      child: MaterialApp(
        routes: Routes.map,
        initialRoute: initialRoute,
      ),
    ),
  );

  await tester.pumpAndSettle();
}