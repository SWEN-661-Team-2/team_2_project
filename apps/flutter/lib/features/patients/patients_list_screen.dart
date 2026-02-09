import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../widgets/reach_scaffold.dart';
import '../../core/patients/patients_repository.dart';
import '../../core/patients/patient.dart';
import '../../core/utils/dt_format.dart';
import '../../core/accessibility/app_settings_controller.dart';
import '../../app/app_shell.dart';

enum PatientsViewMode { all, upcomingVisits, needingAttention }

class PatientsListScreen extends StatefulWidget {
  final PatientsViewMode mode;
  final bool showBackButton;

  const PatientsListScreen({
    super.key,
    this.mode = PatientsViewMode.all,
    this.showBackButton = false,
  });

  @override
  State<PatientsListScreen> createState() => _PatientsListScreenState();
}

class _PatientsListScreenState extends State<PatientsListScreen> {
  PatientsViewMode _currentMode = PatientsViewMode.all;

  @override
  void initState() {
    super.initState();
    _currentMode = widget.mode;
  }

  @override
  void didUpdateWidget(PatientsListScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.mode != widget.mode) {
      setState(() {
        _currentMode = widget.mode;
      });
    }
  }

  String _getTitle() {
    switch (_currentMode) {
      case PatientsViewMode.all:
        return 'Patients';
      case PatientsViewMode.upcomingVisits:
        return 'Upcoming Visits';
      case PatientsViewMode.needingAttention:
        return 'Patients Needing Attention';
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppSettingsController>();
    final isLeftAligned = controller.isLeftAligned;

    final repo = PatientsRepository.instance;

    List<Patient> patients;
    switch (_currentMode) {
      case PatientsViewMode.all:
        patients = repo.allPatients();
        break;
      case PatientsViewMode.upcomingVisits:
        patients = repo.upcomingVisitsSorted();
        break;
      case PatientsViewMode.needingAttention:
        patients = repo.needingAttentionSorted();
        break;
    }

    return ReachScaffold(
      title: _getTitle(),
      child: Column(
        children: [
          // Menu/back button row at the top
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                if (isLeftAligned) ...[
                  widget.showBackButton
                      ? IconButton(
                          icon: const Icon(Icons.arrow_back),
                          onPressed: () =>
                              AppShell.of(context)?.goBackToDashboard(),
                          tooltip: 'Back to dashboard',
                        )
                      : IconButton(
                          icon: const Icon(Icons.sort),
                          onPressed: () => _showFilterMenu(context),
                        ),
                  const Spacer(),
                ] else ...[
                  const Spacer(),
                  widget.showBackButton
                      ? IconButton(
                          icon: const Icon(Icons.arrow_back),
                          onPressed: () =>
                              AppShell.of(context)?.goBackToDashboard(),
                          tooltip: 'Back to dashboard',
                        )
                      : IconButton(
                          icon: const Icon(Icons.sort),
                          onPressed: () => _showFilterMenu(context),
                        ),
                ],
              ],
            ),
          ),
          // Patient list
          Expanded(
            child: patients.isEmpty
                ? const Center(child: Text('No patients found'))
                : ListView.builder(
                    key: const Key('patients_list'),
                    padding: const EdgeInsets.all(16),
                    itemCount: patients.length,
                    itemBuilder: (context, index) {
                      final patient = patients[index];

                      // Different card styles based on current view mode
                      switch (_currentMode) {
                        case PatientsViewMode.needingAttention:
                          return _PriorityPatientCard(
                            key: Key('patient_$index'),
                            patient: patient,
                            index: index,
                          );
                        case PatientsViewMode.upcomingVisits:
                          return _VisitPatientCard(
                            key: Key('patient_$index'),
                            patient: patient,
                            index: index,
                          );
                        case PatientsViewMode.all:
                          return _PatientCard(
                            key: Key('patient_$index'),
                            patient: patient,
                            index: index,
                          );
                      }
                    },
                  ),
          ),
        ],
      ),
    );
  }

  void _showFilterMenu(BuildContext context) {
    final controller = context.read<AppSettingsController>();
    final isLeftAligned = controller.isLeftAligned;

    showModalBottomSheet(
      context: context,
      showDragHandle: true,
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Filter Patients',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                ListTile(
                  leading: isLeftAligned ? const Icon(Icons.people) : null,
                  trailing: !isLeftAligned ? const Icon(Icons.people) : null,
                  title: const Text('All Patients'),
                  selected: _currentMode == PatientsViewMode.all,
                  onTap: () {
                    setState(() => _currentMode = PatientsViewMode.all);
                    Navigator.pop(ctx);
                  },
                ),
                ListTile(
                  leading: isLeftAligned ? const Icon(Icons.schedule) : null,
                  trailing: !isLeftAligned ? const Icon(Icons.schedule) : null,
                  title: const Text('Upcoming Visits'),
                  selected: _currentMode == PatientsViewMode.upcomingVisits,
                  onTap: () {
                    setState(
                      () => _currentMode = PatientsViewMode.upcomingVisits,
                    );
                    Navigator.pop(ctx);
                  },
                ),
                ListTile(
                  leading: isLeftAligned
                      ? const Icon(Icons.warning_amber)
                      : null,
                  trailing: !isLeftAligned
                      ? const Icon(Icons.warning_amber)
                      : null,
                  title: const Text('Needing Attention'),
                  selected: _currentMode == PatientsViewMode.needingAttention,
                  onTap: () {
                    setState(
                      () => _currentMode = PatientsViewMode.needingAttention,
                    );
                    Navigator.pop(ctx);
                  },
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        );
      },
    );
  }
}

// ============================================================================
// PRIORITY PATIENT CARD (for "Needing Attention" view)
// Tags ALWAYS on the right
// ============================================================================

// _PriorityPatientCard
class _PriorityPatientCard extends StatelessWidget {
  final Patient patient;
  final int index;

  const _PriorityPatientCard({
    super.key,
    required this.patient,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    final critTag = _criticalityTag(patient.criticality);
    final critColor = _criticalityColor(patient.criticality);

    final priorityText = patient.criticality != null
        ? 'Priority: ${_criticalityText(patient.criticality!)}'
        : 'Priority: —';

    // Build the tag widget (only if there's a criticality)
    final tagWidget = critTag.isNotEmpty
        ? Container(
            key: Key('patient_tag_$index'),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: critColor.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              critTag,
              style: TextStyle(
                color: critColor,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          )
        : null;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Patient: ${patient.fullName}')),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Patient info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      patient.fullName,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      priorityText,
                      style: const TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              ),

              // Tag ALWAYS on right
              if (tagWidget != null) ...[const SizedBox(width: 12), tagWidget],
            ],
          ),
        ),
      ),
    );
  }

  String _criticalityTag(PatientCriticality? c) {
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

  String _criticalityText(PatientCriticality c) {
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

  Color _criticalityColor(PatientCriticality? c) {
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
}

// ============================================================================
// VISIT PATIENT CARD (for "Upcoming Visits" view)
// Tags ALWAYS on the right
// ============================================================================

class _VisitPatientCard extends StatelessWidget {
  final Patient patient;
  final int index;

  const _VisitPatientCard({
    super.key,
    required this.patient,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    final critTag = _criticalityTag(patient.criticality);
    final critColor = _criticalityColor(patient.criticality);

    final visitText = patient.nextVisit != null
        ? 'Visit: ${formatDtYmdHmm(patient.nextVisit!.toLocal())}'
        : 'No upcoming visit';

    // Build the tag widget (only if there's a criticality)
    final tagWidget = critTag.isNotEmpty
        ? Container(
            key: Key('patient_tag_$index'),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: critColor.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              critTag,
              style: TextStyle(
                color: critColor,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          )
        : null;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Patient: ${patient.fullName}')),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Patient info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      patient.fullName,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(visitText, style: const TextStyle(color: Colors.grey)),
                  ],
                ),
              ),

              // Tag ALWAYS on right
              if (tagWidget != null) ...[const SizedBox(width: 12), tagWidget],
            ],
          ),
        ),
      ),
    );
  }

  String _criticalityTag(PatientCriticality? c) {
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

  Color _criticalityColor(PatientCriticality? c) {
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
}

// ============================================================================
// DEFAULT PATIENT CARD (for "All Patients" view)
// Tags ALWAYS on the right
// ============================================================================

class _PatientCard extends StatelessWidget {
  final Patient patient;
  final int index;

  const _PatientCard({super.key, required this.patient, required this.index});

  @override
  Widget build(BuildContext context) {
    final critTag = _criticalityTag(patient.criticality);
    final critColor = _criticalityColor(patient.criticality);

    final visitText = patient.nextVisit != null
        ? 'Next Appt.: ${formatDtYmdHmm(patient.nextVisit!.toLocal())}'
        : 'No upcoming visit';

    final criticalityText = patient.criticality != null
        ? _criticalityText(patient.criticality!)
        : '—';

    // Build the tag widget (only if there's a criticality)
    final tagWidget = critTag.isNotEmpty
        ? Container(
            key: Key('patient_tag_$index'),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: critColor.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              critTag,
              style: TextStyle(
                color: critColor,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          )
        : null;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Patient: ${patient.fullName}')),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Patient info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      patient.fullName,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      criticalityText,
                      style: const TextStyle(color: Colors.grey),
                    ),
                    Text(
                      visitText,
                      style: const TextStyle(color: Colors.grey, fontSize: 13),
                    ),
                  ],
                ),
              ),

              // Tag ALWAYS on right
              if (tagWidget != null) ...[const SizedBox(width: 12), tagWidget],
            ],
          ),
        ),
      ),
    );
  }

  String _criticalityTag(PatientCriticality? c) {
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

  String _criticalityText(PatientCriticality c) {
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

  Color _criticalityColor(PatientCriticality? c) {
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
}
