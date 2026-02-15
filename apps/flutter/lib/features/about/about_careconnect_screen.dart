// lib/features/about/about_careconnect_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/tokens/spacing.dart';
import '../../core/accessibility/app_settings_controller.dart';

class AboutCareConnectScreen extends StatelessWidget {
  const AboutCareConnectScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<AppSettingsController>();
    final isLeftAligned = settings.isLeftAligned;

    final back = IconButton(
      tooltip: 'Go back',
      icon: const Icon(Icons.arrow_back),
      onPressed: () => Navigator.of(context).maybePop(),
    );

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      appBar: AppBar(
        title: const Text('About CareConnect'),
        leading: isLeftAligned ? null : back,
        actions: isLeftAligned ? [back] : null,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'CareConnect-LH',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 6),
              Text(
                'Version 0.1.0',
                style: TextStyle(color: Colors.grey.shade700),
              ),

              const SizedBox(height: 18),
              const _H2('Purpose'),
              const _P(
                'This application is a UI prototype for accessibility-focused caregiving workflows '
                '(including left-handed layout support). It is not intended for clinical use.',
              ),

              const _H2('Credits'),
              const _P(
                'Created as part of a course project. Names/credits can be added here if required.',
              ),

              const _H2('Licensing'),
              const _P(
                'This prototype may include open-source components. Production apps should include '
                'a full license/attribution list and legal review.',
              ),

              const SizedBox(height: 22),
              Text(
                'Note: This is placeholder text. Production apps require legal/compliance review.',
                style: TextStyle(
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