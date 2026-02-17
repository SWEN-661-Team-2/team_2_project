// lib/features/legal/terms_of_service_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/tokens/spacing.dart';
import '../../core/accessibility/app_settings_controller.dart';

class TermsOfServiceScreen extends StatelessWidget {
  const TermsOfServiceScreen({super.key});

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
        title: const Text('Terms of Service'),
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
                'These Terms of Service apply to the CareConnect-LH UI prototype.',
                style: text.bodyMedium?.copyWith(color: Colors.grey.shade700),
              ),
              const SizedBox(height: 18),

              _H2('1. Prototype Use'),
              _P('This application is a demonstration prototype and is not intended for clinical use.'),

              _H2('2. No Medical Advice'),
              _P('CareConnect does not provide medical advice. Always consult licensed professionals.'),

              _H2('3. Availability'),
              _P('Features may change or be removed at any time during development.'),

              _H2('4. Liability'),
              _P('The project team is not responsible for any outcomes resulting from use of this prototype.'),

              _H2('5. Contact'),
              _P('For project inquiries, contact the course team or instructor.'),

              const SizedBox(height: 22),
              Text(
                'Disclaimer: This is placeholder text. Production apps require legal review.',
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

