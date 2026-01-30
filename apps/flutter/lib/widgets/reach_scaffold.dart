import 'package:flutter/material.dart';
import '../app/app_scope.dart';
import '../core/accessibility/handedness.dart';
import '../core/tokens/spacing.dart';
import 'a11y_overlay.dart';

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
    final controller = AppScope.of(context);
    final mode = controller.handednessMode;

    // Simple reach bias: shift content inward depending on mode.
    final EdgeInsets contentPadding = switch (mode) {
      HandednessMode.left =>
        const EdgeInsets.fromLTRB(AppSpacing.md, AppSpacing.md, AppSpacing.xl, AppSpacing.md),
      HandednessMode.right =>
        const EdgeInsets.fromLTRB(AppSpacing.xl, AppSpacing.md, AppSpacing.md, AppSpacing.md),
      HandednessMode.toggle => const EdgeInsets.all(AppSpacing.md),
    };

    return Scaffold(
      appBar: AppBar(title: Text(title)),
      floatingActionButton: mode == HandednessMode.toggle
          ? FloatingActionButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Toggle Mode: on-screen toggle pressed')),
                );
              },
              child: const Icon(Icons.swap_horiz),
            )
          : null,
      body: A11yOverlay(
        child: Padding(
          padding: contentPadding,
          child: child,
        ),
      ),
    );
  }
}
