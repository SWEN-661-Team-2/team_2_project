import 'package:flutter/material.dart';
import '../../app/app_shell.dart';
import '../../core/patients/patient.dart';
import '../../core/patients/patients_repository.dart';
import '../../core/utils/dt_format.dart';

enum PatientsViewMode { all, upcomingVisits, needingAttention }

/// Sort options for the patient list
enum PatientSortOption {
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
  PatientSortOption _sortOption = PatientSortOption.lastNameAsc;

  String get _title {
    switch (widget.mode) {
      case PatientsViewMode.needingAttention:
        return 'Patients Needing Attention';
      case PatientsViewMode.upcomingVisits:
        return 'Upcoming Visits';
      case PatientsViewMode.all:
        return 'Active Patients';
    }
  }

  String _sortOptionLabel(PatientSortOption option) {
    switch (option) {
      case PatientSortOption.lastNameAsc:
        return 'Last Name (A-Z)';
      case PatientSortOption.lastNameDesc:
        return 'Last Name (Z-A)';
      case PatientSortOption.criticalityHighToLow:
        return 'Criticality (High → Low)';
      case PatientSortOption.criticalityLowToHigh:
        return 'Criticality (Low → High)';
      case PatientSortOption.upcomingVisits:
        return 'Upcoming Visits';
    }
  }

  /// Get base patient list based on view mode, then apply user sorting
  List<Patient> _items(PatientsRepository repo) {
    // Get base list based on mode (filters which patients to show)
    List<Patient> baseList;
    switch (widget.mode) {
      case PatientsViewMode.needingAttention:
        baseList = repo.needingAttentionSorted();
        break;
      case PatientsViewMode.upcomingVisits:
        baseList = repo.upcomingVisitsSorted();
        break;
      case PatientsViewMode.all:
        baseList = repo.allPatients();
        break;
    }
    
    // Apply user-selected sorting to the filtered list
    return _applySorting(baseList);
  }

  /// Apply user-selected sorting to any patient list
  List<Patient> _applySorting(List<Patient> patients) {
    final items = List<Patient>.from(patients);
    
    switch (_sortOption) {
      case PatientSortOption.lastNameAsc:
        items.sort((a, b) {
          final cmp = a.lastName.toLowerCase().compareTo(b.lastName.toLowerCase());
          if (cmp != 0) return cmp;
          return a.firstName.toLowerCase().compareTo(b.firstName.toLowerCase());
        });
        break;
      case PatientSortOption.lastNameDesc:
        items.sort((a, b) {
          final cmp = b.lastName.toLowerCase().compareTo(a.lastName.toLowerCase());
          if (cmp != 0) return cmp;
          return b.firstName.toLowerCase().compareTo(a.firstName.toLowerCase());
        });
        break;
      case PatientSortOption.criticalityHighToLow:
        items.sort((a, b) {
          final ca = a.criticality;
          final cb = b.criticality;
          if (ca == null && cb == null) return a.lastName.compareTo(b.lastName);
          if (ca == null) return 1;
          if (cb == null) return -1;
          final cmp = _critRank(ca).compareTo(_critRank(cb));
          if (cmp != 0) return cmp;
          return a.lastName.compareTo(b.lastName);
        });
        break;
      case PatientSortOption.criticalityLowToHigh:
        items.sort((a, b) {
          final ca = a.criticality;
          final cb = b.criticality;
          if (ca == null && cb == null) return a.lastName.compareTo(b.lastName);
          if (ca == null) return 1;
          if (cb == null) return -1;
          final cmp = _critRank(cb).compareTo(_critRank(ca));
          if (cmp != 0) return cmp;
          return a.lastName.compareTo(b.lastName);
        });
        break;
      case PatientSortOption.upcomingVisits:
        items.sort((a, b) {
          final va = a.nextVisit;
          final vb = b.nextVisit;
          if (va == null && vb == null) return a.lastName.compareTo(b.lastName);
          if (va == null) return 1;
          if (vb == null) return -1;
          final cmp = va.compareTo(vb);
          if (cmp != 0) return cmp;
          return a.lastName.compareTo(b.lastName);
        });
        break;
    }
    return items;
  }

  int _critRank(PatientCriticality c) {
    switch (c) {
      case PatientCriticality.critical: return 0;
      case PatientCriticality.high: return 1;
      case PatientCriticality.medium: return 2;
      case PatientCriticality.low: return 3;
    }
  }

  @override
  Widget build(BuildContext context) {
    final repo = PatientsRepository.instance;
    final items = _items(repo);

    // Show sort dropdown on ALL patient list screens for consistent behavior
    const showSortDropdown = true;

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      appBar: AppBar(
        title: Text(_title),
        automaticallyImplyLeading: false,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => AppShell.of(context)?.setTab(0), // back to dashboard tab
        ),
        actions: showSortDropdown
            ? [
                Semantics(
                  label: 'Sort patients',
                  hint: 'Select sorting option',
                  child: PopupMenuButton<PatientSortOption>(
                    key: const Key('sort_dropdown'),
                    icon: const Icon(Icons.sort),
                    tooltip: 'Sort patients',
                    onSelected: (option) {
                      setState(() {
                        _sortOption = option;
                      });
                    },
                    itemBuilder: (context) => PatientSortOption.values
                        .map(
                          (option) => PopupMenuItem<PatientSortOption>(
                            key: Key('sort_option_${option.name}'),
                            value: option,
                            child: Row(
                              children: [
                                if (option == _sortOption)
                                  const Icon(Icons.check, size: 18, color: Colors.blue)
                                else
                                  const SizedBox(width: 18),
                                const SizedBox(width: 8),
                                Text(_sortOptionLabel(option)),
                              ],
                            ),
                          ),
                        )
                        .toList(),
                  ),
                ),
              ]
            : null,
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
              trailing: p.criticality == null ? null : Container(
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
      case PatientsViewMode.upcomingVisits: {
        final dt = p.nextVisit;
        return dt == null ? 'No visit scheduled' : 'Visit: ${formatDtYmdHmm(dt.toLocal())}';
      }

      case PatientsViewMode.needingAttention:
        return 'Priority: ${_critText(p.criticality)}';

      case PatientsViewMode.all: {
        final crit = _critText(p.criticality);
        final appt = p.nextVisit == null
            ? 'No upcoming visit'
            : 'Next Appt.: ${formatDtYmdHmm(p.nextVisit!.toLocal())}';

        // ✅ NEWLINE between criticality and next appointment
        return '$crit\n$appt';
      }
    }
  }

  Widget _tagForPatient(Patient p) {
    final c = p.criticality;

    // Only show a tag when criticality exists
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
      child: Text(text, style: TextStyle(color: color, fontWeight: FontWeight.bold)),
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