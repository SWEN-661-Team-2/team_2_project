import 'package:flutter/material.dart';

import '../../app/app_shell.dart';
import '../../core/patients/patient.dart';
import '../../core/patients/patients_repository.dart';

/// Matches the required navigation modes:
/// - Patients tab: ALL patients
/// - Dashboard tiles: Active / Upcoming / Needing Attention / Unread
enum PatientsViewMode {
  allPatients,
  activePatients,
  upcomingVisits,
  needingAttention,
  unreadMessages,
}

enum SortOption {
  lastNameAZ,
  lastNameZA,
  criticalityHighToLow,
  criticalityLowToHigh,
  dateEarliestFirst,
}

enum DateFilter { all, overdue, today, tomorrow }

class PatientsListScreen extends StatefulWidget {
  final PatientsViewMode mode;
  final bool showBackButton;

  const PatientsListScreen({
    super.key,
    this.mode = PatientsViewMode.allPatients,
    this.showBackButton = false,
  });

  @override
  State<PatientsListScreen> createState() => _PatientsListScreenState();
}

class _PatientsListScreenState extends State<PatientsListScreen> {
  final repo = PatientsRepository.instance;

  late PatientsViewMode _mode;
  late SortOption _sort;
  late DateFilter _dateFilter;

  @override
  void initState() {
    super.initState();
    _mode = widget.mode;
    final d = _defaultsFor(_mode);
    _sort = d.$1;
    _dateFilter = d.$2;
  }

  @override
  void didUpdateWidget(covariant PatientsListScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.mode != widget.mode) {
      setState(() {
        _mode = widget.mode;
        final d = _defaultsFor(_mode);
        _sort = d.$1;
        _dateFilter = d.$2;
      });
    }
  }

  // -----------------------------------
  // Defaults per YOUR spec
  // -----------------------------------
  (SortOption, DateFilter) _defaultsFor(PatientsViewMode m) {
    switch (m) {
      case PatientsViewMode.allPatients:
        return (SortOption.lastNameAZ, DateFilter.all);

      // Active Patients default = Last Name (A–Z)
      case PatientsViewMode.activePatients:
        return (SortOption.lastNameAZ, DateFilter.all);

      // Upcoming default = Date (Earliest First)
      case PatientsViewMode.upcomingVisits:
        return (SortOption.dateEarliestFirst, DateFilter.all);

      // Needing default = Criticality (Critical -> Low)
      case PatientsViewMode.needingAttention:
        return (SortOption.criticalityHighToLow, DateFilter.all);

      case PatientsViewMode.unreadMessages:
        // until messages->patients mapping is done
        return (SortOption.lastNameAZ, DateFilter.all);
    }
  }

  String _titleForMode(PatientsViewMode m) {
    switch (m) {
      case PatientsViewMode.allPatients:
        return 'Patients';
      case PatientsViewMode.activePatients:
        return 'Active Patients';
      case PatientsViewMode.upcomingVisits:
        return 'Upcoming Visits';
      case PatientsViewMode.needingAttention:
        return 'Needing Attention';
      case PatientsViewMode.unreadMessages:
        return 'Unread Messages';
    }
  }

  String _headerChipText(DateFilter f) {
    switch (f) {
      case DateFilter.all:
        return 'All';
      case DateFilter.overdue:
        return 'Overdue';
      case DateFilter.today:
        return 'Today';
      case DateFilter.tomorrow:
        return 'Tomorrow';
    }
  }

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();

    // -----------------------------------
    // Base list per mode (THIS is the important part)
    // -----------------------------------
    final all = repo.allPatients();

    final base = switch (_mode) {
      // Patients tab = ALL patients (no filtering)
      PatientsViewMode.allPatients => all,

      // Active Patients = those with (visit OR criticality)
      // Matches your screenshots (some show only visit, some only priority, some both)
      PatientsViewMode.activePatients =>
        all.where((p) => p.nextVisit != null || p.criticality != null).toList(),

      // Upcoming Visits = those with visits
      PatientsViewMode.upcomingVisits =>
        all.where((p) => p.nextVisit != null).toList(),

      // Needing Attention = those with criticality
      PatientsViewMode.needingAttention =>
        all.where((p) => p.criticality != null).toList(),

      // Placeholder until mapping exists
      PatientsViewMode.unreadMessages => all, // TODO: filter to patients with unread messages
    };

    final visible = _sortPatients(
      _filterByDate(base, _dateFilter, now),
      sort: _sort,
    );

    return Scaffold(
      appBar: AppBar(
        title: Text(_titleForMode(_mode)),
        leading: widget.showBackButton
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                tooltip: 'Back to dashboard',
                onPressed: () => AppShell.of(context)?.goBackToDashboard(),
              )
            : null,
        actions: [
          PopupMenuButton<DateFilter>(
            tooltip: 'Filter by date',
            initialValue: _dateFilter,
            onSelected: (v) => setState(() => _dateFilter = v),
            itemBuilder: (_) => const [
              PopupMenuItem(value: DateFilter.all, child: Text('All')),
              PopupMenuItem(value: DateFilter.overdue, child: Text('Overdue')),
              PopupMenuItem(value: DateFilter.today, child: Text('Today')),
              PopupMenuItem(value: DateFilter.tomorrow, child: Text('Tomorrow')),
            ],
            icon: const Icon(Icons.event),
          ),
          PopupMenuButton<SortOption>(
            tooltip: 'Sort',
            initialValue: _sort,
            onSelected: (v) => setState(() => _sort = v),
            itemBuilder: (_) => const [
              PopupMenuItem(value: SortOption.lastNameAZ, child: Text('Last Name (A–Z)')),
              PopupMenuItem(value: SortOption.lastNameZA, child: Text('Last Name (Z–A)')),
              PopupMenuItem(value: SortOption.criticalityHighToLow, child: Text('Criticality (Critical → Low)')),
              PopupMenuItem(value: SortOption.criticalityLowToHigh, child: Text('Criticality (Low → Critical)')),
              PopupMenuItem(value: SortOption.dateEarliestFirst, child: Text('Date (Earliest First)')),
            ],
            icon: const Icon(Icons.sort),
          ),
        ],
      ),
      body: ListView(
        key: const Key('patients_list'),
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
        children: [
          // Top row like your sample screens: "All" chip + count
          Row(
            children: [
              PopupMenuButton<DateFilter>(
                tooltip: 'Filter by date',
                initialValue: _dateFilter,
                onSelected: (v) => setState(() => _dateFilter = v),
                itemBuilder: (_) => const [
                  PopupMenuItem(value: DateFilter.all, child: Text('All')),
                  PopupMenuItem(value: DateFilter.overdue, child: Text('Overdue')),
                  PopupMenuItem(value: DateFilter.today, child: Text('Today')),
                  PopupMenuItem(value: DateFilter.tomorrow, child: Text('Tomorrow')),
                ],
                child: _FilterChipPill(label: _headerChipText(_dateFilter)),
              ),
              const Spacer(),
              Text(
                '${visible.length} patients',
                style: TextStyle(color: Colors.grey.shade600),
              ),
            ],
          ),
          const SizedBox(height: 12),

          if (visible.isEmpty)
            const Text('No results for the current view/filter.')
          else
            ...visible.map(
              (p) => _PatientCard(
                patient: p,
                mode: _mode,
              ),
            ),
        ],
      ),
    );
  }

  // -----------------------------------
  // Date filter
  // -----------------------------------
  List<Patient> _filterByDate(List<Patient> input, DateFilter f, DateTime now) {
    if (f == DateFilter.all) return [...input];

    bool sameDay(DateTime a, DateTime b) =>
        a.year == b.year && a.month == b.month && a.day == b.day;

    final today = DateTime(now.year, now.month, now.day);
    final tomorrow = today.add(const Duration(days: 1));

    return input.where((p) {
      final d = p.nextVisit;
      if (d == null) return false;

      switch (f) {
        case DateFilter.overdue:
          return d.isBefore(now);
        case DateFilter.today:
          return sameDay(d, today);
        case DateFilter.tomorrow:
          return sameDay(d, tomorrow);
        case DateFilter.all:
          return true;
      }
    }).toList();
  }

  int _critRank(PatientCriticality? c) {
    if (c == null) return 0;
    switch (c) {
      case PatientCriticality.critical:
        return 4;
      case PatientCriticality.high:
        return 3;
      case PatientCriticality.medium:
        return 2;
      case PatientCriticality.low:
        return 1;
    }
  }

  List<Patient> _sortPatients(
    List<Patient> input, {
    required SortOption sort,
  }) {
    final out = [...input];

    int cmpString(String a, String b) =>
        a.toLowerCase().compareTo(b.toLowerCase());

    out.sort((a, b) {
      switch (sort) {
        case SortOption.lastNameAZ:
          return cmpString(a.lastName, b.lastName);

        case SortOption.lastNameZA:
          return cmpString(b.lastName, a.lastName);

        case SortOption.criticalityHighToLow:
          final r = _critRank(b.criticality).compareTo(_critRank(a.criticality));
          if (r != 0) return r;
          final da = a.nextVisit;
          final db = b.nextVisit;
          if (da != null && db != null) return da.compareTo(db);
          if (da != null) return -1;
          if (db != null) return 1;
          return cmpString(a.lastName, b.lastName);

        case SortOption.criticalityLowToHigh:
          final r = _critRank(a.criticality).compareTo(_critRank(b.criticality));
          if (r != 0) return r;
          return cmpString(a.lastName, b.lastName);

        case SortOption.dateEarliestFirst:
          final da = a.nextVisit;
          final db = b.nextVisit;
          if (da != null && db != null) return da.compareTo(db);
          if (da != null) return -1;
          if (db != null) return 1;
          return cmpString(a.lastName, b.lastName);
      }
    });

    return out;
  }
}

class _FilterChipPill extends StatelessWidget {
  final String label;
  const _FilterChipPill({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFE9F7F3),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.assignment_outlined, size: 16),
          const SizedBox(width: 8),
          Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

class _PatientCard extends StatelessWidget {
  final Patient patient;
  final PatientsViewMode mode;

  const _PatientCard({
    required this.patient,
    required this.mode,
  });

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

  Color _critColor(PatientCriticality? c) {
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

  String _formatAppt(BuildContext context, DateTime dt) {
    final loc = MaterialLocalizations.of(context);
    final date = loc.formatMediumDate(dt);
    final time = loc.formatTimeOfDay(TimeOfDay.fromDateTime(dt));
    return '$date at $time';
  }

  @override
  Widget build(BuildContext context) {
    final crit = patient.criticality;
    final next = patient.nextVisit;

    final tag = _critTag(crit);
    final tagColor = _critColor(crit);

    final showTag = tag.trim().isNotEmpty;

    // Labels aligned to your screenshots
    final dateLabel = switch (mode) {
      PatientsViewMode.upcomingVisits => 'Visit',
      PatientsViewMode.needingAttention => 'Visit',
      PatientsViewMode.activePatients => 'Next Appt.',
      PatientsViewMode.allPatients => 'Next Appt.',
      PatientsViewMode.unreadMessages => 'Next Appt.',
    };

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${patient.firstName} ${patient.lastName}',
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),

                  if (crit != null)
                    Text(
                      'Priority: ${_critText(crit)}',
                      style: TextStyle(color: Colors.grey.shade700),
                    ),

                  if (next != null) ...[
                    if (crit != null) const SizedBox(height: 2),
                    Text(
                      '$dateLabel: ${_formatAppt(context, next.toLocal())}',
                      style: const TextStyle(
                        color: Color(0xFFD44B4B), // similar to your red date line
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),

            if (showTag) ...[
              const SizedBox(width: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: tagColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Text(
                  tag,
                  style: TextStyle(color: tagColor, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}