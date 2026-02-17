// apps/flutter/test/tasks_screen_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/features/tasks/tasks_screen.dart';

void main() {
  Widget _wrap(Widget child) {
    return MaterialApp(
      home: ChangeNotifierProvider<AppSettingsController>(
        create: (_) => AppSettingsController(),
        child: child,
      ),
    );
  }

  testWidgets('TasksScreen opens filter menu and switches to Overdue', (tester) async {
    // Give the bottom sheet enough vertical space so it won't overflow in tests.
    await tester.binding.setSurfaceSize(const Size(900, 1400));
    addTearDown(() async {
      await tester.binding.setSurfaceSize(null);
    });

    await tester.pumpWidget(_wrap(const TasksScreen()));
    await tester.pumpAndSettle();

    // Open filter menu
    await tester.tap(find.byIcon(Icons.filter_list));
    await tester.pumpAndSettle();

    // Switch to Overdue
    await tester.tap(find.text('Overdue'));
    await tester.pumpAndSettle();

    // Title should update
    expect(find.text('Overdue Tasks'), findsOneWidget);

    // List should exist (may be empty depending on repo state, so just assert scaffold content)
    expect(find.byKey(const Key('tasks_list')), findsOneWidget);
  });
}
