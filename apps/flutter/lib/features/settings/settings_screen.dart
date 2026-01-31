import 'package:flutter/material.dart';
import '../../app/app_scope.dart';
import '../../core/accessibility/handedness.dart';
import '../../core/tokens/spacing.dart';
import '../../widgets/app_logo.dart';
import '../../widgets/reach_scaffold.dart';
import '../../app/routes.dart';

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

          // =========================
          // Account & Profile
          // =========================
          Text('Account & Profile', style: text.titleMedium),
          const SizedBox(height: AppSpacing.sm),

          ListTile(
            title: const Text('Profile information'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => Navigator.of(context).pushNamed(Routes.profile),
          ),
          ListTile(
            title: const Text('Change password'),
            trailing: const Icon(Icons.chevron_right),
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

          SwitchListTile(
            value: controller.notificationsEnabled,
            onChanged: (v) => controller.setNotificationsEnabled(v),
            title: const Text('Notifications'),
            subtitle: const Text('Enable reminders and alerts'),
          ),

          ListTile(
            title: const Text('Reminder frequency'),
            subtitle: const Text('Daily, weekly, or custom'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: add ReminderFrequencyScreen
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Reminder frequency (coming soon)')),
              );
            },
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

          // =========================
          // Accessibility & Display
          // =========================
          Text('Accessibility & Display', style: text.titleMedium),
          const SizedBox(height: AppSpacing.sm),

          SwitchListTile(
            value: controller.a11yOverlayEnabled,
            onChanged: (v) => controller.setA11yOverlay(v),
            title: const Text('Accessibility Overlay (Debug)'),
            subtitle: const Text('Shows annotations for review'),
          ),

          SwitchListTile(
            value: controller.notificationsEnabled,
            onChanged: (v) => controller.setNotificationsEnabled(v),
            title: const Text('Notifications'),
            subtitle: const Text('Enable reminders and alerts'),
          ),

          ListTile(
            title: const Text('Text size'),
            subtitle: const Text('Default'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: add TextSizeScreen
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Text size (coming soon)')),
              );
            },
          ),

          const SizedBox(height: AppSpacing.lg),
          const Divider(),
          const SizedBox(height: AppSpacing.lg),

          // =========================
          // Privacy & Security
          // =========================
          Text('Privacy & Security', style: text.titleMedium),
          const SizedBox(height: AppSpacing.sm),

          ListTile(
            title: const Text('Privacy policy'),
            trailing: const Icon(Icons.open_in_new),
            onTap: () {
              // TODO: open URL or show policy screen
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Privacy policy (coming soon)')),
              );
            },
          ),
          ListTile(
            title: const Text('Terms of service'),
            trailing: const Icon(Icons.open_in_new),
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

          ListTile(
            title: const Text('Help / Support'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: support screen
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Support (coming soon)')),
              );
            },
          ),
          ListTile(
            title: const Text('About CareConnect'),
            subtitle: const Text('Version, credits, licensing'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              // TODO: about screen
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
            leading: const Icon(Icons.logout, color: Colors.red),
            onTap: () {
              // Optional placeholder feedback
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Logged out')),
              );

              // Clear navigation stack and return to Login
              Navigator.of(context).pushNamedAndRemoveUntil(
                Routes.login,
                (route) => false,
              );
            },
          ),

          const SizedBox(height: AppSpacing.lg),
        ],
      ),
    );
  }
}
