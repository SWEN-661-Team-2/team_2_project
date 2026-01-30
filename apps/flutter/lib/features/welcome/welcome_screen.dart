import 'package:flutter/material.dart';
import '../../app/routes.dart';
import '../../widgets/app_logo.dart';
import '../../widgets/reach_scaffold.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;

    return ReachScaffold(
      title: 'Welcome',
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const AppLogo(size: 96),
            const SizedBox(height: 24),
            Text('CareConnect', style: text.displayMedium),
            const SizedBox(height: 8),
            Text(
              'Left-hand optimized UI (SWEN 661)',
              style: text.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, Routes.settings),
              child: const Text('Go to Settings'),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, Routes.home),
              child: const Text('Enter Demo Home'),
            ),
          ],
        ),
      ),
    );
  }
}
