enum PatientCriticality { critical, high, medium, low }

class Patient {
  final String firstName;
  final String lastName;

  /// If null: not in “needing attention”
  final PatientCriticality? criticality;

  /// If null: no upcoming visit
  final DateTime? nextVisit;

  const Patient({
    required this.firstName,
    required this.lastName,
    this.criticality,
    this.nextVisit,
  });

  String get fullName => '$firstName $lastName';
}
