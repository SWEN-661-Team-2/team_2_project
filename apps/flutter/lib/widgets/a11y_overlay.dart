import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/accessibility/app_settings_controller.dart';

class A11yOverlay extends StatelessWidget {
  final Widget child;
  const A11yOverlay({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    context.watch<AppSettingsController>();
    return child;
  }
}
