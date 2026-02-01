import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/app/app_scope.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/app/routes.dart';

Future<void> pumpWidgetWithApp(WidgetTester tester, Widget child) async {
  final controller = AppSettingsController();

  await tester.pumpWidget(
    AppScope(
      controller: controller,
      child: MaterialApp(
        home: child,
      ),
    ),
  );

  await tester.pumpAndSettle();
}
