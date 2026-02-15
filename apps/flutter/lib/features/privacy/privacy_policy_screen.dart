// lib/features/legal/privacy_policy_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/tokens/spacing.dart';
import '../../core/accessibility/app_settings_controller.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

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
        title: const Text('Privacy Policy'),
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
                'This Privacy Policy applies to the CareConnect-LH UI prototype.',
                style: text.bodyMedium?.copyWith(color: Colors.grey.shade700),
              ),
              const SizedBox(height: 18),

              _H2('1. Data Collection'),
              _P('This prototype does not collect, transmit, or sell personal data.'),

              _H2('2. Authentication'),
              _P('Login screens and authentication flows are for demonstration only unless integrated with a backend service.'),

              _H2('3. Storage'),
              _P('Any sample content shown in the app (patients, tasks, messages) is static demo data.'),

              _H2('4. Third-Party Services'),
              _P('This prototype does not integrate third-party analytics, advertising, or tracking SDKs.'),

              _H2('5. Changes'),
              _P('This policy may be updated as the project evolves.'),

              const SizedBox(height: 22),
              Text(
                'Disclaimer: This is not legal advice. For production healthcare apps, privacy policies must be reviewed by legal/compliance teams.',
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