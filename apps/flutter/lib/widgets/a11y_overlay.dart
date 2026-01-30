import 'package:flutter/material.dart';
import '../app/app_scope.dart';

class A11yOverlay extends StatelessWidget {
  final Widget child;
  const A11yOverlay({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final controller = AppScope.of(context);

    return Stack(
      children: [
        child,
        if (controller.a11yOverlayEnabled)
          Positioned(
            left: 0,
            right: 0,
            top: 0,
            child: SafeArea(
              child: Container(
                padding: const EdgeInsets.all(8),
                color: Colors.black87,
                child: const Text(
                  'Accessibility Overlay: ON (debug)',
                  style: TextStyle(color: Colors.white),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ),
      ],
    );
  }
}
