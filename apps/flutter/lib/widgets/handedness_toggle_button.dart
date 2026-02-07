import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/accessibility/app_settings_controller.dart';
import '../core/accessibility/handedness.dart';

class HandednessToggleButton extends StatelessWidget {
  const HandednessToggleButton({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppSettingsController>();

    // Only show when Toggle Mode is active
    if (controller.handednessMode != HandednessMode.toggle) {
      return const SizedBox.shrink();
    }

    // Determine current effective handedness (starts with left by default in toggle mode)
    final isLeftActive = controller.currentToggleHandedness == HandednessMode.left;  // Changed

    return Positioned(
      bottom: 80, // Above bottom navigation bar
      left: 0,
      right: 0,
      child: Center(
        child: Material(
          elevation: 8,
          borderRadius: BorderRadius.circular(30),
          child: InkWell(
            borderRadius: BorderRadius.circular(30),
            onTap: () {
              // Toggle between left and right
              final newMode = isLeftActive 
                  ? HandednessMode.right   // Changed
                  : HandednessMode.left;   // Changed
              controller.setCurrentToggleHandedness(newMode);
            },
            child: Container(
              height: 56,
              width: 120,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(30),
              ),
              child: Row(
                children: [
                  // Left side
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: isLeftActive 
                            ? const Color(0xFF4CAF50) // Green when active
                            : const Color(0xFF9E9E9E), // Gray when inactive
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(30),
                          bottomLeft: Radius.circular(30),
                        ),
                      ),
                      alignment: Alignment.center,
                      child: const Text(
                        '<<',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  // Right side
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: isLeftActive 
                            ? const Color(0xFF9E9E9E) // Gray when inactive
                            : const Color(0xFF4CAF50), // Green when active
                        borderRadius: const BorderRadius.only(
                          topRight: Radius.circular(30),
                          bottomRight: Radius.circular(30),
                        ),
                      ),
                      alignment: Alignment.center,
                      child: const Text(
                        '>>',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
