import 'package:flutter/material.dart';
import '../../app/routes.dart';
import '../../widgets/reach_scaffold.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;

    return ReachScaffold(
      title: 'Home',
      child: ListView(
        children: [
          Text('Patient Overview', style: text.displaySmall),
          const SizedBox(height: 12),
          Text(
            'This demo screen proves the design system + handedness wrapper across screens.',
            style: text.bodyMedium,
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, Routes.patientOverview),
            child: const Text('Open Patient Overview'),
          ),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, Routes.settings),
            child: const Text('Settings'),
          ),
        ],
      ),
    );
  }
}
