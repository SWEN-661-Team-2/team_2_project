import 'package:flutter/material.dart';
import '../core/accessibility/app_settings_controller.dart';

class AppScope extends InheritedNotifier<AppSettingsController> {
  const AppScope({
    super.key,
    required AppSettingsController controller,
    required Widget child,
  }) : super(notifier: controller, child: child);

  static AppSettingsController of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<AppScope>();
    assert(scope != null, 'AppScope not found in widget tree.');
    return scope!.notifier!;
  }
}
