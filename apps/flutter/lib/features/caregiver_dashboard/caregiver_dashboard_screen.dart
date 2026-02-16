import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../widgets/app_logo.dart';
import '../../app/app_shell.dart';

import '../patients/patients_list_screen.dart'; 
import '../messages/messages_list_screen.dart';

import '../../core/patients/patient.dart';
import '../../core/patients/patients_repository.dart';
import '../../core/utils/dt_format.dart';
import '../../core/messages/messages_repository.dart';
import '../../core/accessibility/app_settings_controller.dart';

class CaregiverDashboardScreen extends StatelessWidget {
  const CaregiverDashboardScreen({super.key});

  static const double _tabletBreakpoint = 600;

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppSettingsController>();
    final isLeftAligned = controller.isLeftAligned;

    final repo = PatientsRepository.instance;
    final msgRepo = MessagesRepository.instance;

    final needingTop3 = repo.topNeedingAttention(3);
    final upcomingTop3 = repo.topUpcomingVisits(3);

    Widget header() => Row(
          children: [
            const AppLogo(size: 22),
            const SizedBox(width: 10),
            const Expanded(
              child: Text(
                'CareConnect',
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
              ),
            ),
            IconButton(
              tooltip: 'App information',
              icon: const Icon(Icons.info_outline),
              onPressed: () {},
            ),
          ],
        );

    Widget kpiGrid({
      required int crossAxisCount,
      required double mainAxisExtent,
    }) =>
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            mainAxisExtent: mainAxisExtent,
          ),
          itemCount: 4,
          itemBuilder: (context, index) {
            final cards = [
              _StatCard(
                icon: Icons.people,
                value: '${repo.allPatients().where((p) => p.nextVisit != null || p.criticality != null).length}',
                label: 'Active Patients',
                onTap: () => AppShell.of(context)?.openPatients(
                  PatientsViewMode.activePatients,
                ),
              ),
              _StatCard(
                icon: Icons.schedule,
                value: '${repo.upcomingVisitsSorted().length}',
                label: 'Upcoming Visits',
                onTap: () => AppShell.of(context)?.openPatients(
                  PatientsViewMode.upcomingVisits,
                ),
              ),
              _StatCard(
                icon: Icons.warning_amber,
                value: '${repo.needingAttentionSorted().length}',
                label: 'Patients Needing Attention',
                onTap: () => AppShell.of(context)?.openPatients(
                  PatientsViewMode.needingAttention,
                ),
              ),
              _StatCard(
                icon: Icons.chat_bubble_outline,
                value: '${msgRepo.unreadCount()}',
                label: 'Unread Messages', 
                onTap: () => AppShell.of(context)?.openMessages(
                  MessagesViewMode.unread,
                ),
              ),
            ];
            return cards[index];
          },
        );

    Widget needingSection() => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const _SectionHeader(title: 'Patients Needing Attention'),
            for (final p in needingTop3)
              _PatientRow(
                name: p.fullName,
                subtitle: 'Priority: ${_critText(p.criticality)}',
                tag: _critTag(p.criticality),
                color: _critColor(p.criticality),
              ),
            Align(
              alignment:
                  isLeftAligned ? Alignment.centerLeft : Alignment.centerRight,         
              child: Semantics(
                button: true,
                excludeSemantics: true,
                label: 'View all patients needing attention',
                hint: 'Opens the patients needing attention list',
                child: TextButton(
                  onPressed: () => AppShell.of(context)?.openPatients(
                    PatientsViewMode.needingAttention,
                  ),
                  child: const Text('View All'),
                ),
              ),
            ),
          ],
        );

    Widget upcomingSection() => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const _SectionHeader(title: 'Upcoming Visits'),
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
              alignment:
                  isLeftAligned ? Alignment.centerLeft : Alignment.centerRight,
              child: Semantics(
                button: true,
                excludeSemantics: true,
                label: 'View all upcoming visits',
                hint: 'Opens the upcoming visits list',
                child: TextButton(
                  onPressed: () => AppShell.of(context)?.openPatients(
                    PatientsViewMode.upcomingVisits,
                  ),
                  child: const Text('View All'),
                ),
              ),
            ),
          ],
        );

    return LayoutBuilder(
      builder: (context, constraints) {
        final isTablet = constraints.maxWidth >= _tabletBreakpoint;

        return Scaffold(
          backgroundColor: const Color(0xFFF7FAFB),
          body: SafeArea(
            child: isTablet
                ? Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 1100),
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            header(),
                            const SizedBox(height: 16),
                            LayoutBuilder(
                              builder: (context, constraints) {
                                final w = constraints.maxWidth;
                                final cols =
                                    w >= 900 ? 4 : (w >= 600 ? 3 : 2);
                                return kpiGrid(
                                  crossAxisCount: cols,
                                  mainAxisExtent: 170,
                                );
                              },
                            ),
                            const SizedBox(height: 24),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(child: needingSection()),
                                const SizedBox(width: 16),
                                Expanded(child: upcomingSection()),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  )
                : ListView(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
                    children: [
                      header(),
                      const SizedBox(height: 16),
                      LayoutBuilder(
                        builder: (context, constraints) {
                          final w = constraints.maxWidth;
                          final cols =
                              w >= 900 ? 4 : (w >= 600 ? 3 : 2);
                          return kpiGrid(
                            crossAxisCount: cols,
                            mainAxisExtent: 170,
                          );
                        },
                      ),
                      const SizedBox(height: 24),
                      needingSection(),
                      const SizedBox(height: 24),
                      upcomingSection(),
                    ],
                  ),
          ),
        );
      },
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
      child: Text(
        title,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
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
    final enabled = onTap != null;

    return Semantics(
      button: true,
      enabled: enabled,
      excludeSemantics: true,
      label: label,
      value: value,
      hint: enabled ? 'Double tap to open' : null,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onTap,
          child: Card(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.circle, size: 0), // keeps layout stable
                  Icon(icon, color: Colors.blue, size: 22),
                  const SizedBox(height: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        FittedBox(
                          fit: BoxFit.scaleDown,
                          alignment: Alignment.centerLeft,
                          child: Text(
                            value,
                            maxLines: 1,
                            overflow: TextOverflow.clip,
                            style: const TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Expanded(
                          child: Align(
                            alignment: Alignment.topLeft,
                            child: Text(
                              label,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(color: Colors.grey),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
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
    final tagWidget = (tag.trim().isEmpty)
        ? null
        : Container(
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
          );

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(fontWeight: FontWeight.w600),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(subtitle, maxLines: 2, overflow: TextOverflow.ellipsis),
                ],
              ),
            ),
            if (tagWidget != null) ...[
              const SizedBox(width: 12),
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 110),
                child: tagWidget,
              ),
            ],
          ],
        ),
      ),
    );
  }
}