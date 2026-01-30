import 'package:flutter/material.dart';
import '../../app/app_scope.dart';
import '../../core/accessibility/handedness.dart';
import '../../core/tokens/spacing.dart';
import '../../widgets/app_logo.dart';
import '../../widgets/reach_scaffold.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = AppScope.of(context);
    final text = Theme.of(context).textTheme;

    return ReachScaffold(
      title: 'Settings',
      child: ListView(
        children: [
          Row(
            children: [
              const AppLogo(size: 40),
              const SizedBox(width: AppSpacing.md),
              Text('CareConnect', style: text.headlineSmall),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          Text('Handedness Layout Mode', style: text.titleMedium),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Choose how the UI aligns for reach. Toggle Mode shows an on-screen switch.',
            style: text.bodySmall,
          ),
          const SizedBox(height: AppSpacing.sm),

          RadioGroup<HandednessMode>(
            groupValue: controller.handednessMode,
            onChanged: (mode) {
              if (mode != null) controller.setHandednessMode(mode);
            },
            child: Column(
              children: HandednessMode.values.map((mode) {
                return RadioListTile<HandednessMode>(
                  value: mode,
                  title: Text(mode.label),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: AppSpacing.lg),
          const Divider(),
          const SizedBox(height: AppSpacing.lg),

          Text('Accessibility & Display', style: text.titleMedium),
          const SizedBox(height: AppSpacing.sm),

          SwitchListTile(
            value: controller.a11yOverlayEnabled,
            onChanged: (v) => controller.setA11yOverlay(v),
            title: const Text('Accessibility Overlay (Debug)'),
            subtitle: const Text('Shows annotations for review'),
          ),
        ],
      ),
    );
  }
}
