// lib/features/settings/accessibility_mode_detail_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/core/tokens/spacing.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/widgets/reach_scaffold.dart';

class AccessibilityModeDetailScreen extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final bool enabled;
  final ValueChanged<bool> onChanged;

  const AccessibilityModeDetailScreen({
    super.key,
    required this.title,
    required this.description,
    required this.icon,
    required this.enabled,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;

    final settingsController = context.read<AppSettingsController>();

    final isLeftAligned = settingsController.isLeftAligned;

    return ReachScaffold(
      title: title,
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(icon, size: 28),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: text.titleLarge?.copyWith(fontWeight: FontWeight.w800),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          Text(description, style: text.bodyMedium),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            Card(
              child: SwitchListTile(
                key: const Key('a11y_mode_toggle'),
                value: enabled,
                onChanged: onChanged,
                title: Text(enabled ? 'Enabled' : 'Disabled', style: text.titleMedium),
                subtitle: const Text('Toggle on to activate (UI only for now).'),
                controlAffinity: isLeftAligned
                    ? ListTileControlAffinity.leading
                    : ListTileControlAffinity.trailing,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            const Text(
              'Note: This mode currently updates UI state only. Functional mitigations are not implemented yet.',
            ),
          ],
        ),
      ),
    );
  }
}

