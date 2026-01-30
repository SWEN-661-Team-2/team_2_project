import 'package:flutter/material.dart';
import 'app/app.dart';
import 'app/app_scope.dart';
import 'core/accessibility/app_settings_controller.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final controller = AppSettingsController();
  await controller.load();
  runApp(AppScope(controller: controller, child: const CareConnectApp()));
}
