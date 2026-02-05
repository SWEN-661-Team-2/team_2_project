import 'package:flutter/material.dart';
import '../../app/app_shell.dart';
import '../../core/patients/patient.dart';
import '../../core/patients/patients_repository.dart';
import '../../core/utils/dt_format.dart';

enum PatientsViewMode { all, upcomingVisits, needingAttention }

class PatientsListScreen extends StatelessWidget {
  final PatientsViewMode mode;

  const PatientsListScreen({
    super.key,
    this.mode = PatientsViewMode.all,
  });

  String get _title {
    switch (mode) {
      case PatientsViewMode.needingAttention:
        return 'Patients Needing Attention';
      case PatientsViewMode.upcomingVisits:
        return 'Upcoming Visits';
      case PatientsViewMode.all:
        return 'Patients';
    }
  }

  List<Patient> _items(PatientsRepository repo) {
    switch (mode) {
      case PatientsViewMode.needingAttention:
        return repo.needingAttentionSorted();
      case PatientsViewMode.upcomingVisits:
        return repo.upcomingVisitsSorted();
      case PatientsViewMode.all:
        return repo.allPatients();
    }
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
          onPressed: () => AppShell.of(context)?.setTab(0), // back to dashboard tab
        ),
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
    switch (mode) {
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