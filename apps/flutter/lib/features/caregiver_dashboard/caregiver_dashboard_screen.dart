import 'package:flutter/material.dart';

import '../../widgets/app_logo.dart';
import '../../app/app_shell.dart';
import '../patients/patients_list_screen.dart';
import '../../core/patients/patient.dart';
import '../../core/patients/patients_repository.dart';
import '../../core/utils/dt_format.dart';
import '../../core/messages/messages_repository.dart';

class CaregiverDashboardScreen extends StatelessWidget {
  const CaregiverDashboardScreen({super.key});

@override
Widget build(BuildContext context) {
  final repo = PatientsRepository.instance;
  final msgRepo = MessagesRepository.instance; // 👈 ADD THIS

  final needingTop3 = repo.topNeedingAttention(3);
  final upcomingTop3 = repo.topUpcomingVisits(3);

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
          children: [
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
                final cards = [
                  _StatCard(
                    icon: Icons.people,
                    value: '${repo.allPatients().length}',
                    label: 'Active Patients',
                    onTap: () => AppShell.of(context)?.openPatients(PatientsViewMode.all),
                  ),
                  _StatCard(
                    icon: Icons.schedule,
                    value: '${repo.upcomingVisitsSorted().length}',
                    label: 'Upcoming Visits',
                    onTap: () => AppShell.of(context)?.openPatients(PatientsViewMode.upcomingVisits),
                  ),
                  _StatCard(
                    icon: Icons.warning_amber,
                    value: '${repo.needingAttentionSorted().length}',
                    label: 'Patients Needing Attention',
                    onTap: () =>
                        AppShell.of(context)?.openPatients(PatientsViewMode.needingAttention),
                  ),
                  _StatCard(
                    icon: Icons.chat_bubble_outline,
                    value: '${msgRepo.unreadCount()}',
                    label: 'Messages / Unread',
                    onTap: () => AppShell.of(context)?.setTab(3),
                  ),
                ];
                return cards[index];
              },
            ),

            const SizedBox(height: 24),
            const _SectionHeader(title: 'Patients Needing Attention'),

            for (final p in needingTop3)
              _PatientRow(
                name: p.fullName,
                subtitle: 'Priority: ${_critText(p.criticality)}',
                tag: _critTag(p.criticality),
                color: _critColor(p.criticality),
              ),

            Align(
              alignment: Alignment.centerLeft,
              child: TextButton(
                onPressed: () =>
                    AppShell.of(context)?.openPatients(PatientsViewMode.needingAttention),
                child: const Text('View All'),
              ),
            ),

            const SizedBox(height: 24),
            const _SectionHeader(title: 'Upcoming Visits'),

            // In Upcoming Visits: still show Visit date/time; show criticality pill ONLY if present
            for (final p in upcomingTop3)
              _PatientRow(
                name: p.fullName,
                subtitle: p.nextVisit == null
                    ? 'No visit scheduled'
                    : 'Visit: ${formatDtYmdHmm(p.nextVisit!.toLocal())}',
                tag: _critTagOrBlank(p.criticality),
                color: _critColorOrTransparent(p.criticality),
              ),

            Align(
              alignment: Alignment.centerLeft,
              child: TextButton(
                onPressed: () =>
                    AppShell.of(context)?.openPatients(PatientsViewMode.upcomingVisits),
                child: const Text('View All'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

String _critText(PatientCriticality? c) {
  if (c == null) return '—';
  switch (c) {
    case PatientCriticality.critical:
      return 'Critical';
    case PatientCriticality.high:
      return 'High';
    case PatientCriticality.medium:
      return 'Medium';
    case PatientCriticality.low:
      return 'Low';
  }
}

String _critTag(PatientCriticality? c) {
  if (c == null) return '—';
  switch (c) {
    case PatientCriticality.critical:
      return 'CRITICAL';
    case PatientCriticality.high:
      return 'HIGH';
    case PatientCriticality.medium:
      return 'MED';
    case PatientCriticality.low:
      return 'LOW';
  }
}

Color _critColor(PatientCriticality? c) {
  if (c == null) return Colors.grey;
  switch (c) {
    case PatientCriticality.critical:
      return Colors.red;
    case PatientCriticality.high:
      return Colors.orange;
    case PatientCriticality.medium:
      return Colors.blueGrey;
    case PatientCriticality.low:
      return Colors.green;
  }
}

// Upcoming Visits helpers: blank pill if no criticality
String _critTagOrBlank(PatientCriticality? c) {
  if (c == null) return '';
  switch (c) {
    case PatientCriticality.critical:
      return 'CRITICAL';
    case PatientCriticality.high:
      return 'HIGH';
    case PatientCriticality.medium:
      return 'MED';
    case PatientCriticality.low:
      return 'LOW';
  }
}

Color _critColorOrTransparent(PatientCriticality? c) {
  if (c == null) return Colors.transparent;
  switch (c) {
    case PatientCriticality.critical:
      return Colors.red;
    case PatientCriticality.high:
      return Colors.orange;
    case PatientCriticality.medium:
      return Colors.blueGrey;
    case PatientCriticality.low:
      return Colors.green;
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
  final VoidCallback? onTap;

  const _StatCard({
    required this.icon,
    required this.value,
    required this.label,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: Colors.blue, size: 22),
              const SizedBox(height: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      alignment: Alignment.centerLeft,
                      child: Text(
                        value,
                        style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                      ),
                    ),
                    const SizedBox(height: 6),
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
        subtitle: Text(subtitle, maxLines: 2, overflow: TextOverflow.ellipsis),

        // CHANGE: If tag is blank, remove the pill entirely
        trailing: (tag.trim().isEmpty)
            ? null
            : ConstrainedBox(
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