import 'package:flutter/material.dart';
import '../../app/app_shell.dart';
import '../../core/patients/patient.dart';
import '../../core/patients/patients_repository.dart';
import '../../core/utils/dt_format.dart';

enum PatientsViewMode { all, upcomingVisits, needingAttention }

enum PatientSortMode {
  lastNameAsc,
  lastNameDesc,
  criticalityHighToLow,
  criticalityLowToHigh,
  upcomingVisits,
}

class PatientsListScreen extends StatefulWidget {
  final PatientsViewMode mode;

  const PatientsListScreen({
    super.key,
    this.mode = PatientsViewMode.all,
  });

  @override
  State<PatientsListScreen> createState() => _PatientsListScreenState();
}

class _PatientsListScreenState extends State<PatientsListScreen> {
  PatientSortMode _sortMode = PatientSortMode.lastNameAsc;

  String get _title {
    switch (widget.mode) {
      case PatientsViewMode.needingAttention:
        return 'Patients Needing Attention';
      case PatientsViewMode.upcomingVisits:
        return 'Upcoming Visits';
      case PatientsViewMode.all:
        return 'Patients';
    }
  }

  String _sortLabel(PatientSortMode mode) {
    switch (mode) {
      case PatientSortMode.lastNameAsc:
        return 'Last Name (A–Z)';
      case PatientSortMode.lastNameDesc:
        return 'Last Name (Z–A)';
      case PatientSortMode.criticalityHighToLow:
        return 'Criticality (High → Low)';
      case PatientSortMode.criticalityLowToHigh:
        return 'Criticality (Low → High)';
      case PatientSortMode.upcomingVisits:
        return 'Upcoming Visits';
    }
  }

  int _critRank(PatientCriticality? c) {
    switch (c) {
      case PatientCriticality.critical:
        return 4;
      case PatientCriticality.high:
        return 3;
      case PatientCriticality.medium:
        return 2;
      case PatientCriticality.low:
        return 1;
      case null:
        return 0;
    }
  }

  List<Patient> _items(PatientsRepository repo) {
    List<Patient> items;
    switch (widget.mode) {
      case PatientsViewMode.needingAttention:
        items = repo.needingAttentionSorted();
        break;
      case PatientsViewMode.upcomingVisits:
        items = repo.upcomingVisitsSorted();
        break;
      case PatientsViewMode.all:
        items = repo.allPatients();
        break;
    }

    items = List<Patient>.from(items);

    items.sort((a, b) {
      switch (_sortMode) {
        case PatientSortMode.lastNameAsc:
          return a.lastName.toLowerCase().compareTo(b.lastName.toLowerCase());

        case PatientSortMode.lastNameDesc:
          return b.lastName.toLowerCase().compareTo(a.lastName.toLowerCase());

        case PatientSortMode.criticalityHighToLow:
          return _critRank(b.criticality).compareTo(_critRank(a.criticality));

        case PatientSortMode.criticalityLowToHigh:
          return _critRank(a.criticality).compareTo(_critRank(b.criticality));

        case PatientSortMode.upcomingVisits:
          final adt = a.nextVisit;
          final bdt = b.nextVisit;

          if (adt == null && bdt == null) return 0;
          if (adt == null) return 1;
          if (bdt == null) return -1;

          return adt.compareTo(bdt);
      }
    });

    return items;
  }

  @override
  Widget build(BuildContext context) {
    final repo = PatientsRepository.instance;
    final items = _items(repo);

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      appBar: AppBar(
        title: Text(_title),
        automaticallyImplyLeading: false,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => AppShell.of(context)?.setTab(0),
        ),
        actions: [
          PopupMenuButton<PatientSortMode>(
            tooltip: 'Sort patients',
            icon: const Icon(Icons.sort),
            initialValue: _sortMode,
            onSelected: (mode) {
              setState(() => _sortMode = mode);
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: PatientSortMode.lastNameAsc,
                child: Text(_sortLabel(PatientSortMode.lastNameAsc)),
              ),
              PopupMenuItem(
                value: PatientSortMode.lastNameDesc,
                child: Text(_sortLabel(PatientSortMode.lastNameDesc)),
              ),
              const PopupMenuDivider(),
              PopupMenuItem(
                value: PatientSortMode.criticalityHighToLow,
                child: Text(_sortLabel(PatientSortMode.criticalityHighToLow)),
              ),
              PopupMenuItem(
                value: PatientSortMode.criticalityLowToHigh,
                child: Text(_sortLabel(PatientSortMode.criticalityLowToHigh)),
              ),
              const PopupMenuDivider(),
              PopupMenuItem(
                value: PatientSortMode.upcomingVisits,
                child: Text(_sortLabel(PatientSortMode.upcomingVisits)),
              ),
            ],
          ),
        ],
      ),
      body: ListView.separated(
        key: const Key('patients_list'),
        padding: const EdgeInsets.all(16),
        itemCount: items.length,
        separatorBuilder: (context, index) => const SizedBox(height: 12),
        itemBuilder: (context, i) {
          final p = items[i];
          return Card(
            child: ListTile(
              key: Key('patient_$i'),
              title: Text(
                p.fullName,
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
              subtitle: Text(_subtitleForMode(p)),
              trailing: p.criticality == null
                  ? null
                  : Container(
                      key: Key('patient_tag_$i'),
                      child: _tagForPatient(p),
                    ),
            ),
          );
        },
      ),
    );
  }

  String _subtitleForMode(Patient p) {
    switch (widget.mode) {
      case PatientsViewMode.upcomingVisits:
        final dt = p.nextVisit;
        return dt == null
            ? 'No visit scheduled'
            : 'Visit: ${formatDtYmdHmm(dt.toLocal())}';

      case PatientsViewMode.needingAttention:
        return 'Priority: ${_critText(p.criticality)}';

      case PatientsViewMode.all:
        final crit = _critText(p.criticality);
        final appt = p.nextVisit == null
            ? 'No upcoming visit'
            : 'Next Appt.: ${formatDtYmdHmm(p.nextVisit!.toLocal())}';

        return '$crit\n$appt';
    }
  }

  Widget _tagForPatient(Patient p) {
    final c = p.criticality;

    if (c == null) return const SizedBox.shrink();

    Color color;
    String text;

    switch (c) {
      case PatientCriticality.critical:
        color = Colors.red;
        text = 'CRITICAL';
        break;
      case PatientCriticality.high:
        color = Colors.orange;
        text = 'HIGH';
        break;
      case PatientCriticality.medium:
        color = Colors.blueGrey;
        text = 'MED';
        break;
      case PatientCriticality.low:
        color = Colors.green;
        text = 'LOW';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        text,
        style: TextStyle(color: color, fontWeight: FontWeight.bold),
      ),
    );
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
}