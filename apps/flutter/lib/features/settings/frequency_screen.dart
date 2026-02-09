import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/accessibility/app_settings_controller.dart';
import '../../core/accessibility/reminder_frequency.dart';
import '../../core/tokens/spacing.dart';

class ReminderFrequencyScreen extends StatelessWidget {
  const ReminderFrequencyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppSettingsController>();
    final text = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      appBar: AppBar(title: const Text('Reminder frequency')),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Choose how often reminders should be scheduled.',
              style: text.bodyMedium,
            ),
            const SizedBox(height: AppSpacing.lg),

            RadioGroup<ReminderFrequency>(
              groupValue: controller.reminderFrequency,
              onChanged: (value) {
                if (value == null) return;

                // Persist selection
                controller.setReminderFrequency(value);

                // If Custom is chosen, we show placeholder UI only (no real scheduling yet)
                if (value == ReminderFrequency.custom) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Custom schedule setup (coming soon)'),
                    ),
                  );

                  // TODO(implement): Navigate to a CustomReminderScheduleScreen
                  // where user can pick days/times, and then persist those settings.
                }
              },
              child: Column(
                children: ReminderFrequency.values.map((freq) {
                  return RadioListTile<ReminderFrequency>(
                    value: freq,
                    title: Text(freq.label),
                    subtitle: Text(freq.subtitle),
                  );
                }).toList(),
              ),
            ),

            const SizedBox(height: AppSpacing.lg),

            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Text(
                  'Note: Reminders are not actually scheduled yet. This screen only saves your selection for UI/state.',
                  style: text.bodySmall,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
