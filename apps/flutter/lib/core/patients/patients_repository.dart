import 'patient.dart';

class PatientsRepository {
  PatientsRepository._();
  static final PatientsRepository instance = PatientsRepository._();

  // ---- Sample Data ----
  // 10 needing attention (criticality != null)
  // 12 upcoming visits (nextVisit != null)
  // 6 overlap: criticality + nextVisit

  final List<Patient> _patients = [
    // --- OVERLAP (6): needing attention + upcoming appointment ---
    Patient(
      firstName: 'Sarah',
      lastName: 'Johnson',
      criticality: PatientCriticality.critical,
      nextVisit: DateTime(2026, 2, 1, 9, 0), // 0900
    ),
    Patient(
      firstName: 'Michael',
      lastName: 'Chen',
      criticality: PatientCriticality.critical,
      nextVisit: DateTime(2026, 1, 31, 21, 0), // 2100
    ),
    Patient(
      firstName: 'Emma',
      lastName: 'Williams',
      criticality: PatientCriticality.high,
      nextVisit: DateTime(2026, 2, 2, 14, 30), // 1430
    ),
    Patient(
      firstName: 'David',
      lastName: 'Nguyen',
      criticality: PatientCriticality.high,
      nextVisit: DateTime(2026, 2, 3, 10, 15), // 1015
    ),
    Patient(
      firstName: 'Priya',
      lastName: 'Patel',
      criticality: PatientCriticality.medium,
      nextVisit: DateTime(2026, 2, 4, 16, 45), // 1645
    ),
    Patient(
      firstName: 'Robert',
      lastName: 'King',
      criticality: PatientCriticality.low,
      nextVisit: DateTime(2026, 2, 5, 11, 30), // 1130
    ),

    // --- needing attention ONLY (4 more) ---
    Patient(
      firstName: 'Amina',
      lastName: 'Hassan',
      criticality: PatientCriticality.critical,
      nextVisit: null,
    ),
    Patient(
      firstName: 'Carlos',
      lastName: 'Rivera',
      criticality: PatientCriticality.high,
      nextVisit: null,
    ),
    Patient(
      firstName: 'Linda',
      lastName: 'Baker',
      criticality: PatientCriticality.medium,
      nextVisit: null,
    ),
    Patient(
      firstName: 'Noah',
      lastName: 'Brooks',
      criticality: PatientCriticality.low,
      nextVisit: null,
    ),

    // --- upcoming visits ONLY (6 more to make 12 total) ---
    Patient(
      firstName: 'Anna',
      lastName: 'Lopez',
      nextVisit: DateTime(2026, 2, 1, 14, 30), // 1430
    ),
    Patient(
      firstName: 'Mark',
      lastName: 'Lee',
      nextVisit: DateTime(2026, 2, 1, 16, 0), // 1600
    ),
    Patient(
      firstName: 'Zoe',
      lastName: 'Adams',
      nextVisit: DateTime(2026, 2, 2, 8, 15), // 0815
    ),
    Patient(
      firstName: 'James',
      lastName: 'Stewart',
      nextVisit: DateTime(2026, 2, 2, 9, 45), // 0945
    ),
    Patient(
      firstName: 'Mia',
      lastName: 'Carter',
      nextVisit: DateTime(2026, 2, 3, 13, 0), // 1300
    ),
    Patient(
      firstName: 'Ethan',
      lastName: 'Turner',
      nextVisit: DateTime(2026, 2, 4, 15, 15), // 1515
    ),
  ];

  // ---- Public API ----

  List<Patient> allPatients() => List<Patient>.from(_patients);

  /// “Most critical first”:
  /// Critical > High > Medium > Low
  /// Within same criticality: earlier nextVisit first (if present), else alpha by last name.
  List<Patient> needingAttentionSorted() {
    final items = _patients.where((p) => p.criticality != null).toList();

    items.sort((a, b) {
      final ca = a.criticality!;
      final cb = b.criticality!;
      final c = _critRank(ca).compareTo(_critRank(cb));
      if (c != 0) return c;

      final va = a.nextVisit;
      final vb = b.nextVisit;
      if (va != null && vb != null) {
        final t = va.compareTo(vb);
        if (t != 0) return t;
      } else if (va != null && vb == null) {
        return -1;
      } else if (va == null && vb != null) {
        return 1;
      }

      final ln = a.lastName.compareTo(b.lastName);
      if (ln != 0) return ln;
      return a.firstName.compareTo(b.firstName);
    });

    return items;
  }

  /// “Most recent first” in your wording means “soonest upcoming first” for appointments.
  List<Patient> upcomingVisitsSorted() {
    final items = _patients.where((p) => p.nextVisit != null).toList();

    items.sort((a, b) {
      final va = a.nextVisit!;
      final vb = b.nextVisit!;
      final t = va.compareTo(vb);
      if (t != 0) return t;

      final ln = a.lastName.compareTo(b.lastName);
      if (ln != 0) return ln;
      return a.firstName.compareTo(b.firstName);
    });

    return items;
  }

  /// Dashboard helpers
  List<Patient> topNeedingAttention(int n) =>
      needingAttentionSorted().take(n).toList();
  List<Patient> topUpcomingVisits(int n) =>
      upcomingVisitsSorted().take(n).toList();

  // Lower number = higher priority for sort()
  int _critRank(PatientCriticality c) {
    switch (c) {
      case PatientCriticality.critical:
        return 0;
      case PatientCriticality.high:
        return 1;
      case PatientCriticality.medium:
        return 2;
      case PatientCriticality.low:
        return 3;
    }
  }
}
