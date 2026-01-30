import 'package:flutter/material.dart';
import '../../widgets/reach_scaffold.dart';

class PatientOverviewScreen extends StatelessWidget {
  const PatientOverviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;

    return ReachScaffold(
      title: 'Patient Overview',
      child: ListView(
        children: [
          Text('Active Patients', style: text.headlineMedium),
          const SizedBox(height: 12),
          _PatientCard(name: 'Sarah Johnson', detail: 'Upcoming visit: 2:30 PM'),
          _PatientCard(name: 'Mark Lee', detail: 'Medication due: 8:00 PM'),
          _PatientCard(name: 'Ana Rivera', detail: 'New message received'),
          const SizedBox(height: 24),
          Text('Upcoming Visits', style: text.headlineMedium),
          const SizedBox(height: 12),
          const _InfoRow(label: 'Thu', value: 'Home health check-in'),
          const _InfoRow(label: 'Fri', value: 'Physical therapy session'),
        ],
      ),
    );
  }
}

class _PatientCard extends StatelessWidget {
  final String name;
  final String detail;

  const _PatientCard({required this.name, required this.detail});

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(name, style: text.headlineSmall),
            const SizedBox(height: 6),
            Text(detail, style: text.bodyMedium),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;

  const _InfoRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          SizedBox(
            width: 48,
            child: Text(label, style: text.bodyMedium?.copyWith(fontWeight: FontWeight.w600)),
          ),
          const SizedBox(width: 12),
          Expanded(child: Text(value, style: text.bodyMedium)),
        ],
      ),
    );
  }
}
