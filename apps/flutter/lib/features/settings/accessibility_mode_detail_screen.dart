import 'package:flutter/material.dart';
import 'package:flutter_app/core/tokens/spacing.dart';

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

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      appBar: AppBar(title: Text(title)),
      body: Padding(
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