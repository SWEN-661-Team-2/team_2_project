import 'package:flutter/material.dart';

import '../../app/routes.dart';
import '../../widgets/app_logo.dart';

class CaregiverDashboardScreen extends StatelessWidget {
  const CaregiverDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        type: BottomNavigationBarType.fixed,
        onTap: (i) {
          if (i == 4) {
            Navigator.of(context).pushNamed(Routes.settings);
          }
          // Later: route Patients/Tasks/Messages by index.
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Patients'),
          BottomNavigationBarItem(icon: Icon(Icons.check_circle_outline), label: 'Tasks'),
          BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline), label: 'Messages'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Settings'),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
          children: [
            // Header
            Row(
              children: [
                const AppLogo(size: 22),
                const SizedBox(width: 10),
                const Text(
                  'CareConnect',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
                ),
                const Spacer(),
                IconButton(icon: const Icon(Icons.info_outline), onPressed: () {}),
              ],
            ),

            const SizedBox(height: 16),

            // KPI Grid (NO OVERFLOW)
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                mainAxisExtent: 166,
              ),
              itemCount: 4,
              itemBuilder: (context, index) {
                const cards = [
                  _StatCard(icon: Icons.people, value: '24', label: 'Active Patients'),
                  _StatCard(icon: Icons.schedule, value: '8', label: 'Upcoming Visits'),
                  _StatCard(icon: Icons.warning_amber, value: '3', label: 'Patients Needing Attention'),
                  _StatCard(icon: Icons.chat_bubble_outline, value: '12', label: 'Messages'),
                ];
                return cards[index];
              },
            ),

            const SizedBox(height: 24),
            const _SectionHeader(title: 'Patients Needing Attention'),

            const _PatientRow(
              name: 'Sarah Johnson',
              subtitle: 'Medication missed - Morning insulin',
              tag: 'CRITICAL',
              color: Colors.red,
            ),
            const _PatientRow(
              name: 'Michael Chen',
              subtitle: 'New symptom reported - Chest pain',
              tag: 'CRITICAL',
              color: Colors.red,
            ),
            const _PatientRow(
              name: 'Emma Williams',
              subtitle: 'Elevated blood pressure reading',
              tag: 'HIGH',
              color: Colors.orange,
            ),

            TextButton(onPressed: () {}, child: const Text('View All')),

            const SizedBox(height: 24),
            const _SectionHeader(title: 'Upcoming Visits'),

            const _PatientRow(
              name: 'Anna Lopez',
              subtitle: 'Home health check – 2:30 PM',
              tag: '2:30 PM',
              color: Colors.blue,
            ),
            const _PatientRow(
              name: 'Mark Lee',
              subtitle: 'Physical therapy – 4:00 PM',
              tag: '4:00 PM',
              color: Colors.blue,
            ),

            TextButton(onPressed: () {}, child: const Text('View All')),
          ],
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const _StatCard({
    required this.icon,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: Colors.blue, size: 22),

            const SizedBox(height: 10),

            // Make the bottom part flexible so it can never overflow
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Value: scale down if needed
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.centerLeft,
                    child: Text(
                      value,
                      style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                    ),
                  ),

                  const SizedBox(height: 6),

                  // Label: allow up to 2 lines and ellipsis
                  Text(
                    label,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PatientRow extends StatelessWidget {
  final String name;
  final String subtitle;
  final String tag;
  final Color color;

  const _PatientRow({
    required this.name,
    required this.subtitle,
    required this.tag,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        title: Text(
          name,
          style: const TextStyle(fontWeight: FontWeight.w600),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Text(
          subtitle,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        trailing: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 110),
          child: Align(
            alignment: Alignment.centerRight,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  tag,
                  style: TextStyle(color: color, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}