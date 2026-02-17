// lib/features/help/help_support_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/tokens/spacing.dart';
import '../../core/accessibility/app_settings_controller.dart';

class HelpSupportScreen extends StatelessWidget {
  const HelpSupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<AppSettingsController>();
    final isLeftAligned = settings.isLeftAligned;
    final text = Theme.of(context).textTheme;

    final back = IconButton(
      tooltip: 'Go back',
      icon: const Icon(Icons.arrow_back),
      onPressed: () => Navigator.of(context).maybePop(),
    );

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      appBar: AppBar(
        title: const Text('Help / Support'),
        leading: isLeftAligned ? null : back,
        actions: isLeftAligned ? [back] : null,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'If you need help using CareConnect, review the guidance below.',
                style: text.bodyMedium?.copyWith(color: Colors.grey.shade700),
              ),

              const SizedBox(height: 18),
              _H2('Common Topics'),
              _P(
                '• How to switch handedness layout\n'
                '• How to enable accessibility modes\n'
                '• How to view tasks and messages\n'
                '• How to change notification settings',
              ),

              _H2('Accessibility'),
              _P(
                'CareConnect includes UI-only accessibility profiles (Low Vision, Tremor/Motor, STML, Hearing Impaired). '
                'Functional mitigations may be implemented later.',
              ),

              _H2('Contact'),
              _P('Support is not active in this prototype. For course support, contact your instructor.'),

              const SizedBox(height: 22),
              Text(
                'Tip: In production apps, this screen usually includes email support, FAQs, and a “Report a problem” flow.',
                style: text.bodySmall?.copyWith(
                  fontStyle: FontStyle.italic,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _H2 extends StatelessWidget {
  final String s;
  const _H2(this.s);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 14, bottom: 6),
      child: Text(
        s,
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
      ),
    );
  }
}

class _P extends StatelessWidget {
  final String s;
  const _P(this.s);

  @override
  Widget build(BuildContext context) {
    return Text(
      s,
      style: const TextStyle(fontSize: 14, height: 1.45),
    );
  }
}
