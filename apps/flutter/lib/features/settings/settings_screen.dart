import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../app/routes.dart';
import '../../core/accessibility/app_settings_controller.dart';
import '../../core/accessibility/handedness.dart';
import '../../core/accessibility/text_size_mode.dart';
import '../../core/accessibility/reminder_frequency.dart';
import '../../core/tokens/spacing.dart';
import '../../widgets/app_logo.dart';
import '../../widgets/reach_scaffold.dart';
import 'accessibility_mode_detail_screen.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppSettingsController>();
    final text = Theme.of(context).textTheme;
    final isLeftAligned = controller.isLeftAligned;

    return ReachScaffold(
      title: 'Settings',
      child: ListView(
        children: [
          // =========================
          // Header
          // =========================
          Row(
            children: [
              const AppLogo(size: 40),
              const SizedBox(width: AppSpacing.md),
              Text('CareConnect', style: text.headlineSmall),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          // =========================
          // Account & Profile
          // =========================
          Text('Account & Profile', style: text.titleMedium),
          const SizedBox(height: AppSpacing.sm),

          _HandedListTile(
            title: const Text('Profile information'),
            icon: Icons.chevron_right,
            isLeftAligned: isLeftAligned,
            onTap: () => Navigator.of(context).pushNamed(Routes.profile),
          ),
          _HandedListTile(
            title: const Text('Change password'),
            icon: Icons.chevron_right,
            isLeftAligned: isLeftAligned,
            onTap: () => Navigator.of(context).pushNamed(Routes.changePassword),
          ),

          const SizedBox(height: AppSpacing.lg),
          const Divider(),
          const SizedBox(height: AppSpacing.lg),

          // =========================
          // Notifications
          // =========================
          Text('Notifications', style: text.titleMedium),
          const SizedBox(height: AppSpacing.sm),

          _HandedSwitchListTile(
            value: controller.notificationsEnabled,
            onChanged: (v) => controller.setNotificationsEnabled(v),
            title: const Text('Notifications'),
            subtitle: const Text('Enable reminders and alerts'),
            isLeftAligned: isLeftAligned,
          ),

          _HandedListTile(
            title: const Text('Reminder frequency'),
            subtitle: Text(
              _reminderFrequencyLabel(controller.reminderFrequency),
            ),
            icon: Icons.chevron_right,
            isLeftAligned: isLeftAligned,
            onTap: () => _showReminderFrequencyPicker(context, controller),
          ),

          const SizedBox(height: AppSpacing.lg),
          const Divider(),
          const SizedBox(height: AppSpacing.lg),

          // =========================
          // Display
          // =========================
          Text('Display', style: text.titleMedium),
          const SizedBox(height: AppSpacing.sm),

          _DisplaySection(controller: controller, isLeftAligned: isLeftAligned),

          const SizedBox(height: AppSpacing.lg),
          const Divider(),
          const SizedBox(height: AppSpacing.lg),

          // =========================
          // Accessibility
          // =========================
          Text('Accessibility', style: text.titleMedium),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Select a profile to review mitigation goals. Toggle is UI-only for now.',
            style: text.bodySmall,
          ),
          const SizedBox(height: AppSpacing.sm),

          _AccessibilityTiles(
            controller: controller,
            isLeftAligned: isLeftAligned,
          ),

          const SizedBox(height: AppSpacing.lg),
          const Divider(),
          const SizedBox(height: AppSpacing.lg),

          // =========================
          // Handedness
          // =========================
          Text('Handedness Layout Mode', style: text.titleMedium),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Choose how the UI aligns for reach. Toggle Mode shows an on-screen switch.',
            style: text.bodySmall,
          ),
          const SizedBox(height: AppSpacing.sm),

          _HandednessRadioGroup(
            controller: controller,
            isLeftAligned: isLeftAligned,
          ),

          const SizedBox(height: AppSpacing.lg),
          const Divider(),
          const SizedBox(height: AppSpacing.lg),

          // =========================
          // Privacy & Security
          // =========================
          Text('Privacy & Security', style: text.titleMedium),
          const SizedBox(height: AppSpacing.sm),

          _HandedListTile(
            title: const Text('Privacy policy'),
            icon: Icons.open_in_new,
            isLeftAligned: isLeftAligned,
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Privacy policy (coming soon)')),
              );
            },
          ),
          _HandedListTile(
            title: const Text('Terms of service'),
            icon: Icons.open_in_new,
            isLeftAligned: isLeftAligned,
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Terms of service (coming soon)')),
              );
            },
          ),

          const SizedBox(height: AppSpacing.lg),
          const Divider(),
          const SizedBox(height: AppSpacing.lg),

          // =========================
          // Help & About
          // =========================
          Text('Help & About', style: text.titleMedium),
          const SizedBox(height: AppSpacing.sm),

          _HandedListTile(
            title: const Text('Help / Support'),
            icon: Icons.chevron_right,
            isLeftAligned: isLeftAligned,
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Support (coming soon)')),
              );
            },
          ),
          _HandedListTile(
            title: const Text('About CareConnect'),
            subtitle: const Text('Version, credits, licensing'),
            icon: Icons.chevron_right,
            isLeftAligned: isLeftAligned,
            onTap: () {
              showAboutDialog(
                context: context,
                applicationName: 'CareConnect-LH',
                applicationVersion: '0.1.0',
              );
            },
          ),

          const SizedBox(height: AppSpacing.lg),
          const Divider(),
          const SizedBox(height: AppSpacing.lg),

          // =========================
          // Logout
          // =========================
          ListTile(
            title: const Text(
              'Logout',
              style: TextStyle(color: Colors.red, fontWeight: FontWeight.w700),
            ),
            leading: isLeftAligned
                ? const Icon(Icons.logout, color: Colors.red)
                : null,
            trailing: !isLeftAligned
                ? const Icon(Icons.logout, color: Colors.red)
                : null,
            onTap: () {
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(const SnackBar(content: Text('Logged out')));

              Navigator.of(
                context,
              ).pushNamedAndRemoveUntil(Routes.login, (route) => false);
            },
          ),

          const SizedBox(height: AppSpacing.lg),
        ],
      ),
    );
  }
}

// ============================================================================
// HANDED LIST TILE - Swaps leading/trailing based on handedness
// ============================================================================

class _HandedListTile extends StatelessWidget {
  final Widget title;
  final Widget? subtitle;
  final IconData icon;
  final bool isLeftAligned;
  final VoidCallback onTap;

  const _HandedListTile({
    required this.title,
    this.subtitle,
    required this.icon,
    required this.isLeftAligned,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    if (isLeftAligned) {
      // Left-handed: icon on the left
      return ListTile(
        leading: Icon(icon),
        title: title,
        subtitle: subtitle,
        onTap: onTap,
      );
    } else {
      // Right-handed: icon on the right
      return ListTile(
        title: title,
        subtitle: subtitle,
        trailing: Icon(icon),
        onTap: onTap,
      );
    }
  }
}

// ============================================================================
// HANDED SWITCH LIST TILE - Swaps switch position based on handedness
// ============================================================================

class _HandedSwitchListTile extends StatelessWidget {
  final bool value;
  final ValueChanged<bool> onChanged;
  final Widget title;
  final Widget? subtitle;
  final bool isLeftAligned;

  const _HandedSwitchListTile({
    required this.value,
    required this.onChanged,
    required this.title,
    this.subtitle,
    required this.isLeftAligned,
  });

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      value: value,
      onChanged: onChanged,
      title: title,
      subtitle: subtitle,
      controlAffinity: isLeftAligned
          ? ListTileControlAffinity.leading
          : ListTileControlAffinity.trailing,
    );
  }
}

// ============================================================================
// DISPLAY SECTION (Text Size boxes + Contrast button)
// ============================================================================

class _DisplaySection extends StatelessWidget {
  final AppSettingsController controller;
  final bool isLeftAligned;

  const _DisplaySection({
    required this.controller,
    required this.isLeftAligned,
  });

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;

    final options = <(String, TextSizeMode)>[
      ('Small', TextSizeMode.small),
      ('Default', TextSizeMode.medium),
      ('Large', TextSizeMode.large),
      ('XL', TextSizeMode.extraLarge),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text('Text size', style: text.titleSmall),
        const SizedBox(height: AppSpacing.sm),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          alignment: isLeftAligned ? WrapAlignment.start : WrapAlignment.end,
          children: options.map((opt) {
            final label = opt.$1;
            final value = opt.$2;
            final selected = controller.textSizeMode == value;

            return _ChoiceBox(
              label: label,
              selected: selected,
              onTap: () => controller.setTextSizeMode(value),
            );
          }).toList(),
        ),

        const SizedBox(height: AppSpacing.lg),

        Text('Contrast', style: text.titleSmall),
        const SizedBox(height: AppSpacing.sm),

        Card(
          child: _HandedListTile(
            title: Text(
              controller.highContrastEnabled
                  ? 'Night / High Contrast'
                  : 'Day / Normal',
            ),
            subtitle: const Text('Toggle contrast mode (persisted).'),
            icon: controller.highContrastEnabled
                ? Icons.nights_stay
                : Icons.wb_sunny,
            isLeftAligned: isLeftAligned,
            onTap: () {
              controller.setHighContrastEnabled(
                !controller.highContrastEnabled,
              );
            },
          ),
        ),
      ],
    );
  }
}

class _ChoiceBox extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _ChoiceBox({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;

    final border = selected ? const Color(0xFF0A7A8A) : const Color(0xFFCED8DC);
    final fill = selected ? const Color(0xFFE6F7F5) : Colors.white;

    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: fill,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: border, width: 2),
        ),
        child: Text(
          label,
          style: text.titleSmall?.copyWith(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}

// ============================================================================
// ACCESSIBILITY TILES
// ============================================================================

class _AccessibilityTiles extends StatelessWidget {
  final AppSettingsController controller;
  final bool isLeftAligned;

  const _AccessibilityTiles({
    required this.controller,
    required this.isLeftAligned,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _AccessibilityModeTile(
          title: 'Low Vision',
          subtitle: 'Larger text + improved contrast (UI only)',
          icon: Icons.visibility,
          enabled: controller.lowVisionEnabled,
          isLeftAligned: isLeftAligned,
          onTap: () {
            Navigator.of(context, rootNavigator: true).push(
              MaterialPageRoute(
                builder: (_) => AccessibilityModeDetailScreen(
                  title: 'Low Vision',
                  description:
                      'UI-only toggle for now. Functional mitigations will be implemented later.',
                  icon: Icons.visibility,
                  enabled: controller.lowVisionEnabled,
                  onChanged: (v) {
                    controller.setLowVisionEnabled(v);
                  },
                ),
              ),
            );
          },
        ),
        const SizedBox(height: AppSpacing.sm),
        _AccessibilityModeTile(
          title: 'Tremor / Motor',
          subtitle: 'Larger targets + reduced precision (UI only)',
          icon: Icons.pan_tool_alt,
          enabled: controller.tremorSupportEnabled,
          isLeftAligned: isLeftAligned,
          onTap: () {
            Navigator.of(context, rootNavigator: true).push(
              MaterialPageRoute(
                builder: (_) => AccessibilityModeDetailScreen(
                  title: 'Tremor / Motor',
                  description:
                      'UI-only toggle for now. Functional mitigations will be implemented later.',
                  icon: Icons.pan_tool_alt,
                  enabled: controller.tremorSupportEnabled,
                  onChanged: (v) {
                    controller.setTremorSupportEnabled(v);
                  },
                ),
              ),
            );
          },
        ),
        const SizedBox(height: AppSpacing.sm),
        _AccessibilityModeTile(
          title: 'Cognitive Load (STML)',
          subtitle: 'Reduced complexity + clear flow (UI only)',
          icon: Icons.psychology,
          enabled: controller.guidedModeEnabled,
          isLeftAligned: isLeftAligned,
          onTap: () {
            Navigator.of(context, rootNavigator: true).push(
              MaterialPageRoute(
                builder: (_) => AccessibilityModeDetailScreen(
                  title: 'Cognitive Load (STML)',
                  description:
                      'UI-only toggle for now. Functional mitigations will be implemented later.',
                  icon: Icons.psychology,
                  enabled: controller.guidedModeEnabled,
                  onChanged: (v) {
                    controller.setGuidedModeEnabled(v);
                  },
                ),
              ),
            );
          },
        ),
        const SizedBox(height: AppSpacing.sm),
        _AccessibilityModeTile(
          title: 'Hearing Impaired',
          subtitle: 'Visual alerts + captions (UI only)',
          icon: Icons.hearing_disabled,
          enabled: controller.hearingImpairedEnabled,
          isLeftAligned: isLeftAligned,
          onTap: () {
            Navigator.of(context, rootNavigator: true).push(
              MaterialPageRoute(
                builder: (_) => AccessibilityModeDetailScreen(
                  title: 'Hearing Impaired',
                  description:
                      'UI-only toggle for now. Functional mitigations will be implemented later.',
                  icon: Icons.hearing_disabled,
                  enabled: controller.hearingImpairedEnabled,
                  onChanged: (v) {
                    controller.setHearingImpairedEnabled(v);
                  },
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}

class _AccessibilityModeTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final bool enabled;
  final bool isLeftAligned;
  final VoidCallback onTap;

  const _AccessibilityModeTile({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.enabled,
    required this.isLeftAligned,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;

    final bg = enabled ? const Color(0xFFE6F7F5) : Colors.white;
    final border = enabled ? const Color(0xFF0A7A8A) : const Color(0xFFCED8DC);

    final indicatorAndChevron = Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 18,
          height: 18,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: border, width: 2),
            color: enabled ? const Color(0xFF0A7A8A) : Colors.transparent,
          ),
        ),
        const SizedBox(width: 10),
        const Icon(Icons.chevron_right),
      ],
    );

    return Card(
      key: const Key('a11y_mode_toggle'),
      color: bg,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: border, width: 1.5),
      ),
      child: ListTile(
        onTap: onTap,
        leading: isLeftAligned
            ? indicatorAndChevron
            : Icon(icon, color: const Color(0xFF374151)),
        title: Text(
          title,
          style: text.titleMedium?.copyWith(fontWeight: FontWeight.w800),
        ),
        subtitle: Text(subtitle, style: text.bodySmall),
        trailing: isLeftAligned
            ? Icon(icon, color: const Color(0xFF374151))
            : indicatorAndChevron,
      ),
    );
  }
}

// ============================================================================
// HANDEDNESS RADIO GROUP
// ============================================================================

class _HandednessRadioGroup extends StatelessWidget {
  final AppSettingsController controller;
  final bool isLeftAligned;

  const _HandednessRadioGroup({
    required this.controller,
    required this.isLeftAligned,
  });

  @override
  Widget build(BuildContext context) {
    return RadioGroup<HandednessMode>(
      groupValue: controller.handednessMode,
      onChanged: (mode) {
        if (mode != null) controller.setHandednessMode(mode);
      },
      child: Column(
        children: HandednessMode.values.map((mode) {
          if (isLeftAligned) {
            return RadioListTile<HandednessMode>(
              value: mode,
              title: Text(mode.label),
            );
          } else {
            return RadioListTile<HandednessMode>(
              value: mode,
              title: Text(mode.label),
              controlAffinity: ListTileControlAffinity.trailing,
            );
          }
        }).toList(),
      ),
    );
  }
}

// ============================================================================
// Reminder Frequency Picker
// ============================================================================

String _reminderFrequencyLabel(ReminderFrequency f) {
  switch (f) {
    case ReminderFrequency.daily:
      return 'Daily';
    case ReminderFrequency.weekly:
      return 'Weekly';
    case ReminderFrequency.custom:
      return 'Custom';
  }
}

Future<void> _showReminderFrequencyPicker(
  BuildContext context,
  AppSettingsController controller,
) async {
  final isLeftAligned = controller.isLeftAligned;

  final selected = await showModalBottomSheet<ReminderFrequency>(
    context: context,
    showDragHandle: true,
    builder: (ctx) {
      final current = controller.reminderFrequency;

      return SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Reminder frequency',
                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18),
              ),
              const SizedBox(height: AppSpacing.md),

              RadioGroup<ReminderFrequency>(
                groupValue: current,
                onChanged: (v) {
                  if (v != null) Navigator.pop(ctx, v);
                },
                child: Column(
                  children: [
                    RadioListTile<ReminderFrequency>(
                      value: ReminderFrequency.daily,
                      title: const Text('Daily'),
                      controlAffinity: isLeftAligned
                          ? ListTileControlAffinity.leading
                          : ListTileControlAffinity.trailing,
                    ),
                    RadioListTile<ReminderFrequency>(
                      value: ReminderFrequency.weekly,
                      title: const Text('Weekly'),
                      controlAffinity: isLeftAligned
                          ? ListTileControlAffinity.leading
                          : ListTileControlAffinity.trailing,
                    ),
                    RadioListTile<ReminderFrequency>(
                      value: ReminderFrequency.custom,
                      title: const Text('Custom'),
                      subtitle: const Text('Setup screen (coming soon)'),
                      controlAffinity: isLeftAligned
                          ? ListTileControlAffinity.leading
                          : ListTileControlAffinity.trailing,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.sm),
            ],
          ),
        ),
      );
    },
  );

  if (selected == null) return;

  await controller.setReminderFrequency(selected);

  if (selected == ReminderFrequency.custom) {
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Custom reminders setup (coming soon)')),
      );
    }
  }
}
