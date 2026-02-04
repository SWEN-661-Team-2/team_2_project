import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/accessibility/app_settings_controller.dart';

class ReachScaffold extends StatelessWidget {
  final String title;
  final Widget child;

  const ReachScaffold({
    super.key,
    required this.title,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    context.watch<AppSettingsController>();

    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: SafeArea(child: child),
    );
  }
}