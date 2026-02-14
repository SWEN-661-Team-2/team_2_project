import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/core/tokens/spacing.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/widgets/reach_scaffold.dart';

class AccessibilityModeDetailScreen extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;

  /// NOTE: kept for compatibility, but we won’t rely on these for state.
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

  bool _isEnabledForTitle(AppSettingsController c, String title) {
    final t = title.trim().toLowerCase();

    if (t == 'low vision') return c.lowVisionEnabled;
    if (t.startsWith('tremor')) return c.tremorSupportEnabled; // Tremor / Motor
    if (t.startsWith('cognitive')) return c.guidedModeEnabled; // Cognitive Load (STML)
    if (t == 'hearing impaired') return c.hearingImpairedEnabled;

    // Fallback
    return enabled;
  }

  Future<void> _setEnabledForTitle(
    AppSettingsController c,
    String title,
    bool value,
  ) async {
    final t = title.trim().toLowerCase();

    if (t == 'low vision') return c.setLowVisionEnabled(value);
    if (t.startsWith('tremor')) return c.setTremorSupportEnabled(value);
    if (t.startsWith('cognitive')) return c.setGuidedModeEnabled(value);
    if (t == 'hearing impaired') return c.setHearingImpairedEnabled(value);

    // Fallback
    onChanged(value);
  }

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;

    // watch() so UI rebuilds immediately after notifyListeners()
    final settingsController = context.watch<AppSettingsController>();
    final isLeftAligned = settingsController.isLeftAligned;

    final isEnabled = _isEnabledForTitle(settingsController, title);

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
                            style: text.titleLarge?.copyWith(
                              fontWeight: FontWeight.w800,
                            ),
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
                value: isEnabled,
                onChanged: (v) => _setEnabledForTitle(
                  settingsController,
                  title,
                  v,
                ),
                title: Text(
                  isEnabled ? 'Enabled' : 'Disabled',
                  style: text.titleMedium,
                ),
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