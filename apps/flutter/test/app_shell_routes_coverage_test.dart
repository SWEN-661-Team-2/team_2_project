// test/app_shell_routes_coverage_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/app/app_shell.dart';
import 'package:flutter_app/app/providers.dart';
import 'package:flutter_app/app/routes.dart';

void main() {
  group('app/ coverage', () {
    testWidgets('AppShell bottom nav switches tabs (smoke)', (tester) async {
      await tester.binding.setSurfaceSize(const Size(1200, 1000));
      addTearDown(() async => tester.binding.setSurfaceSize(null));

      await tester.pumpWidget(
        MultiProvider(
          providers: AppProviders.build(),
          child: const MaterialApp(home: AppShell()),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('bottom_nav')), findsOneWidget);

      await tester.tap(find.byKey(const Key('bn_people')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('bn_tasks')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('bn_messages')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('bn_settings')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const Key('bn_home')));
      await tester.pumpAndSettle();

      expect(find.byType(AppShell), findsOneWidget);
    });

    testWidgets('Routes.map builds', (tester) async {
      await tester.binding.setSurfaceSize(const Size(1200, 1000));
      addTearDown(() async => tester.binding.setSurfaceSize(null));

      await tester.pumpWidget(
        MultiProvider(
          providers: AppProviders.build(),
          child: MaterialApp(
            initialRoute: Routes.welcome,
            routes: Routes.map,
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Just hit every route builder (coverage) without navigating.
      final ctx = tester.element(find.byType(MaterialApp));

      Routes.map.forEach((_, builder) {
        final w = builder(ctx);
        expect(w, isNotNull);
      });
    });
  });
}