import 'patient.dart';

class PatientsRepository {
  PatientsRepository._();
  static final PatientsRepository instance = PatientsRepository._();

  late final List<Patient> _patients = _buildPatients();

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

  /// Soonest upcoming first
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

  // ---- Helpers ----

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

  /// Builds a date at midnight for “today”
  DateTime _todayBase() {
    final now = DateTime.now();
    return DateTime(now.year, now.month, now.day);
  }

  /// Equivalent of JS:
  /// new Date(new Date(Date.now() + daysOffset*dayMs).setHours(h,m,0,0))
  DateTime _atDayOffset(int daysOffset, int hour, int minute) {
    final base = _todayBase().add(Duration(days: daysOffset));
    return DateTime(base.year, base.month, base.day, hour, minute);
  }

  List<Patient> _buildPatients() {
    return [
      // ============================================================================
      // NO VISIT, NO ATTENTION (11 patients - IDs 22-32)
      // ============================================================================
      const Patient(id: '22', firstName: 'Sophie', lastName: 'Mitchell', criticality: null, nextVisit: null),
      const Patient(id: '23', firstName: 'Henry', lastName: 'Clarke', criticality: null, nextVisit: null),
      const Patient(id: '24', firstName: 'Grace', lastName: 'Bennett', criticality: null, nextVisit: null),
      const Patient(id: '25', firstName: 'Oscar', lastName: 'Fletcher', criticality: null, nextVisit: null),
      const Patient(id: '26', firstName: 'Lily', lastName: 'Chambers', criticality: null, nextVisit: null),
      const Patient(id: '27', firstName: 'Felix', lastName: 'Grant', criticality: null, nextVisit: null),
      const Patient(id: '28', firstName: 'Nora', lastName: 'Holt', criticality: null, nextVisit: null),
      const Patient(id: '29', firstName: 'Liam', lastName: 'Pearce', criticality: null, nextVisit: null),
      const Patient(id: '30', firstName: 'Isla', lastName: 'Watts', criticality: null, nextVisit: null),
      const Patient(id: '31', firstName: 'Hugo', lastName: 'Simmons', criticality: null, nextVisit: null),
      const Patient(id: '32', firstName: 'Clara', lastName: 'Norris', criticality: null, nextVisit: null),

      // ============================================================================
      // NO VISIT, NEED ATTENTION (5 patients - IDs 12-15, 33)
      // ============================================================================
      const Patient(id: '12', firstName: 'Amina', lastName: 'Hassan', criticality: PatientCriticality.critical, nextVisit: null),
      const Patient(id: '13', firstName: 'Carlos', lastName: 'Rivera', criticality: PatientCriticality.high, nextVisit: null),
      const Patient(id: '14', firstName: 'Linda', lastName: 'Baker', criticality: PatientCriticality.medium, nextVisit: null),
      const Patient(id: '15', firstName: 'Noah', lastName: 'Brooks', criticality: PatientCriticality.low, nextVisit: null),
      const Patient(id: '33', firstName: 'Victor', lastName: 'Stone', criticality: PatientCriticality.high, nextVisit: null),

      // ============================================================================
      // NEED ATTENTION + OVERDUE (6 patients - IDs 34-39)
      // ============================================================================
      Patient(id: '34', firstName: 'Diana', lastName: 'Cross', criticality: PatientCriticality.critical, nextVisit: _atDayOffset(-1, 9, 0)),
      Patient(id: '35', firstName: 'Marcus', lastName: 'Webb', criticality: PatientCriticality.high, nextVisit: _atDayOffset(-2, 10, 0)),
      Patient(id: '36', firstName: 'Elena', lastName: 'Drake', criticality: PatientCriticality.critical, nextVisit: _atDayOffset(-4, 11, 0)),
      Patient(id: '37', firstName: 'Julian', lastName: 'Marsh', criticality: PatientCriticality.high, nextVisit: _atDayOffset(-5, 14, 0)),
      Patient(id: '38', firstName: 'Rosa', lastName: 'Frost', criticality: PatientCriticality.medium, nextVisit: _atDayOffset(-7, 9, 30)),
      Patient(id: '39', firstName: 'Theo', lastName: 'Barker', criticality: PatientCriticality.low, nextVisit: _atDayOffset(-8, 15, 0)),

      // ============================================================================
      // OVERDUE ONLY (4 patients - IDs 40-43)
      // ============================================================================
      Patient(id: '40', firstName: 'Chloe', lastName: 'Horton', criticality: null, nextVisit: _atDayOffset(-1, 10, 0)),
      Patient(id: '41', firstName: 'Owen', lastName: 'Dalton', criticality: null, nextVisit: _atDayOffset(-2, 11, 0)),
      Patient(id: '42', firstName: 'Stella', lastName: 'Payne', criticality: null, nextVisit: _atDayOffset(-4, 13, 0)),
      Patient(id: '43', firstName: 'Finn', lastName: 'Sutton', criticality: null, nextVisit: _atDayOffset(-5, 14, 30)),

      // ============================================================================
      // NEED ATTENTION + TODAY (3 patients - IDs 44-46)
      // ============================================================================
      Patient(id: '44', firstName: 'Vera', lastName: 'Cannon', criticality: PatientCriticality.critical, nextVisit: _atDayOffset(0, 8, 0)),
      Patient(id: '45', firstName: 'Rex', lastName: 'Doyle', criticality: PatientCriticality.high, nextVisit: _atDayOffset(0, 11, 30)),
      Patient(id: '46', firstName: 'Iris', lastName: 'Forde', criticality: PatientCriticality.medium, nextVisit: _atDayOffset(0, 15, 0)),

      // ============================================================================
      // TODAY ONLY (10 patients - IDs 1, 47-56)
      // ============================================================================
      Patient(id: '1', firstName: 'John', lastName: 'Doe', criticality: PatientCriticality.critical, nextVisit: _atDayOffset(0, 10, 0)),
      Patient(id: '47', firstName: 'Miles', lastName: 'Garrett', criticality: null, nextVisit: _atDayOffset(0, 7, 30)),
      Patient(id: '48', firstName: 'Penny', lastName: 'Haines', criticality: null, nextVisit: _atDayOffset(0, 8, 45)),
      Patient(id: '49', firstName: 'Caleb', lastName: 'Ingram', criticality: null, nextVisit: _atDayOffset(0, 9, 15)),
      Patient(id: '50', firstName: 'Hazel', lastName: 'Jennings', criticality: null, nextVisit: _atDayOffset(0, 10, 0)),
      Patient(id: '51', firstName: 'Eli', lastName: 'Keane', criticality: null, nextVisit: _atDayOffset(0, 10, 45)),
      Patient(id: '52', firstName: 'Matilda', lastName: 'Lawson', criticality: null, nextVisit: _atDayOffset(0, 11, 30)),
      Patient(id: '53', firstName: 'Seth', lastName: 'Morton', criticality: null, nextVisit: _atDayOffset(0, 13, 0)),
      Patient(id: '54', firstName: 'Ivy', lastName: 'Nash', criticality: null, nextVisit: _atDayOffset(0, 14, 15)),
      Patient(id: '55', firstName: 'Cole', lastName: 'Osborne', criticality: null, nextVisit: _atDayOffset(0, 15, 30)),
      Patient(id: '56', firstName: 'Luna', lastName: 'Preston', criticality: null, nextVisit: _atDayOffset(0, 16, 45)),

      // ============================================================================
      // NEED ATTENTION + TOMORROW (5 patients - IDs 57-61)
      // ============================================================================
      Patient(id: '57', firstName: 'Beau', lastName: 'Quinn', criticality: PatientCriticality.critical, nextVisit: _atDayOffset(1, 9, 0)),
      Patient(id: '58', firstName: 'Wren', lastName: 'Rhodes', criticality: PatientCriticality.high, nextVisit: _atDayOffset(1, 10, 30)),
      Patient(id: '59', firstName: 'Jasper', lastName: 'Savage', criticality: PatientCriticality.high, nextVisit: _atDayOffset(1, 13, 0)),
      Patient(id: '60', firstName: 'Opal', lastName: 'Tanner', criticality: PatientCriticality.medium, nextVisit: _atDayOffset(1, 14, 45)),
      Patient(id: '61', firstName: 'Reid', lastName: 'Underwood', criticality: PatientCriticality.low, nextVisit: _atDayOffset(1, 16, 0)),

      // ============================================================================
      // TOMORROW ONLY (9 patients - IDs 2, 62-70)
      // ============================================================================
      Patient(id: '2', firstName: 'Jane', lastName: 'Smith', criticality: PatientCriticality.high, nextVisit: _atDayOffset(1, 14, 0)),
      Patient(id: '62', firstName: 'Sage', lastName: 'Vance', criticality: null, nextVisit: _atDayOffset(1, 8, 0)),
      Patient(id: '63', firstName: 'Troy', lastName: 'Wade', criticality: null, nextVisit: _atDayOffset(1, 9, 15)),
      Patient(id: '64', firstName: 'Jade', lastName: 'Xavier', criticality: null, nextVisit: _atDayOffset(1, 10, 0)),
      Patient(id: '65', firstName: 'Cole', lastName: 'Yates', criticality: null, nextVisit: _atDayOffset(1, 11, 30)),
      Patient(id: '66', firstName: 'Dawn', lastName: 'Zimmerman', criticality: null, nextVisit: _atDayOffset(1, 13, 0)),
      Patient(id: '67', firstName: 'Blake', lastName: 'Ashford', criticality: null, nextVisit: _atDayOffset(1, 14, 0)),
      Patient(id: '68', firstName: 'Faye', lastName: 'Bolton', criticality: null, nextVisit: _atDayOffset(1, 15, 15)),
      Patient(id: '69', firstName: 'Gene', lastName: 'Compton', criticality: null, nextVisit: _atDayOffset(1, 16, 0)),
      Patient(id: '70', firstName: 'Hope', lastName: 'Dalton', criticality: null, nextVisit: _atDayOffset(1, 17, 0)),

      // ============================================================================
      // NEED ATTENTION + RANDOM FUTURE (8 patients - IDs 71-78)
      // ============================================================================
      Patient(id: '71', firstName: 'Ivan', lastName: 'Everett', criticality: PatientCriticality.critical, nextVisit: _atDayOffset(3, 9, 0)),
      Patient(id: '72', firstName: 'Juno', lastName: 'Fitzgerald', criticality: PatientCriticality.high, nextVisit: _atDayOffset(4, 10, 0)),
      Patient(id: '73', firstName: 'Kurt', lastName: 'Goodwin', criticality: PatientCriticality.critical, nextVisit: _atDayOffset(5, 11, 0)),
      Patient(id: '74', firstName: 'Leah', lastName: 'Hayward', criticality: PatientCriticality.high, nextVisit: _atDayOffset(6, 13, 30)),
      Patient(id: '75', firstName: 'Milo', lastName: 'Irving', criticality: PatientCriticality.medium, nextVisit: _atDayOffset(7, 9, 45)),
      Patient(id: '76', firstName: 'Nina', lastName: 'Jenkinson', criticality: PatientCriticality.high, nextVisit: _atDayOffset(8, 14, 0)),
      Patient(id: '77', firstName: 'Otto', lastName: 'Kirkland', criticality: PatientCriticality.medium, nextVisit: _atDayOffset(9, 10, 30)),
      Patient(id: '78', firstName: 'Pia', lastName: 'Langford', criticality: PatientCriticality.low, nextVisit: _atDayOffset(10, 15, 0)),

      // ============================================================================
      // RANDOM FUTURE ONLY (12 patients - IDs 3, 4, 5, 79-90)
      // ============================================================================
      Patient(id: '3', firstName: 'Bob', lastName: 'Johnson', criticality: PatientCriticality.medium, nextVisit: _atDayOffset(2, 9, 0)),
      Patient(id: '4', firstName: 'Alice', lastName: 'Williams', criticality: PatientCriticality.high, nextVisit: _atDayOffset(3, 15, 30)),
      Patient(id: '5', firstName: 'Charlie', lastName: 'Brown', criticality: PatientCriticality.low, nextVisit: _atDayOffset(5, 11, 0)),
      Patient(id: '79', firstName: 'Quinn', lastName: 'Mercer', criticality: null, nextVisit: _atDayOffset(3, 8, 30)),
      Patient(id: '80', firstName: 'Rose', lastName: 'Neville', criticality: null, nextVisit: _atDayOffset(4, 9, 0)),
      Patient(id: '81', firstName: 'Sam', lastName: 'Ogden', criticality: null, nextVisit: _atDayOffset(5, 10, 15)),
      Patient(id: '82', firstName: 'Tara', lastName: 'Pemberton', criticality: null, nextVisit: _atDayOffset(6, 11, 0)),
      Patient(id: '83', firstName: 'Uma', lastName: 'Quigley', criticality: null, nextVisit: _atDayOffset(7, 13, 30)),
      Patient(id: '84', firstName: 'Wade', lastName: 'Ramsey', criticality: null, nextVisit: _atDayOffset(8, 14, 0)),
      Patient(id: '85', firstName: 'Xena', lastName: 'Shelton', criticality: null, nextVisit: _atDayOffset(9, 15, 0)),
      Patient(id: '86', firstName: 'Yale', lastName: 'Thornton', criticality: null, nextVisit: _atDayOffset(10, 9, 30)),
      Patient(id: '87', firstName: 'Zara', lastName: 'Upton', criticality: null, nextVisit: _atDayOffset(11, 10, 0)),
      Patient(id: '88', firstName: 'Abel', lastName: 'Vickers', criticality: null, nextVisit: _atDayOffset(13, 11, 30)),
      Patient(id: '89', firstName: 'Beth', lastName: 'Walton', criticality: null, nextVisit: _atDayOffset(14, 13, 0)),
      Patient(id: '90', firstName: 'Cora', lastName: 'Xenon', criticality: null, nextVisit: _atDayOffset(3, 16, 0)),

      // ============================================================================
      // NEED ATTENTION + UPCOMING VISIT - OLDER DATA (6 patients - IDs 6-11)
      // ============================================================================
      Patient(id: '6', firstName: 'Sarah', lastName: 'Johnson', criticality: PatientCriticality.critical, nextVisit: _atDayOffset(-9, 9, 0)),
      Patient(id: '7', firstName: 'Michael', lastName: 'Chen', criticality: PatientCriticality.critical, nextVisit: _atDayOffset(-10, 21, 0)),
      Patient(id: '8', firstName: 'Emma', lastName: 'Williams', criticality: PatientCriticality.high, nextVisit: _atDayOffset(-8, 14, 30)),
      Patient(id: '9', firstName: 'David', lastName: 'Nguyen', criticality: PatientCriticality.high, nextVisit: _atDayOffset(-7, 10, 15)),
      Patient(id: '10', firstName: 'Priya', lastName: 'Patel', criticality: PatientCriticality.medium, nextVisit: _atDayOffset(-6, 16, 45)),
      Patient(id: '11', firstName: 'Robert', lastName: 'King', criticality: PatientCriticality.low, nextVisit: _atDayOffset(-5, 11, 30)),

      // ============================================================================
      // OVERDUE ONLY - OLDER DATA (6 patients - IDs 16-21)
      // ============================================================================
      Patient(id: '16', firstName: 'Anna', lastName: 'Lopez', criticality: null, nextVisit: _atDayOffset(-9, 14, 30)),
      Patient(id: '17', firstName: 'Mark', lastName: 'Lee', criticality: null, nextVisit: _atDayOffset(-9, 16, 0)),
      Patient(id: '18', firstName: 'Zoe', lastName: 'Adams', criticality: null, nextVisit: _atDayOffset(-8, 8, 15)),
      Patient(id: '19', firstName: 'James', lastName: 'Stewart', criticality: null, nextVisit: _atDayOffset(-8, 9, 45)),
      Patient(id: '20', firstName: 'Mia', lastName: 'Carter', criticality: null, nextVisit: _atDayOffset(-7, 13, 0)),
      Patient(id: '21', firstName: 'Ethan', lastName: 'Turner', criticality: null, nextVisit: _atDayOffset(-6, 15, 15)),
    ];
  }
}