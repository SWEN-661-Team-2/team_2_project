class CaregiverProfile {
  final String? photoPath;
  final String name;
  final String titleRole;
  final String position;
  final String organization;
  final String email;
  final String phone;

  const CaregiverProfile({
    this.photoPath,
    this.name = '',
    this.titleRole = '',
    this.position = '',
    this.organization = '',
    this.email = '',
    this.phone = '',
  });

  CaregiverProfile copyWith({
    String? photoPath,
    String? name,
    String? titleRole,
    String? position,
    String? organization,
    String? email,
    String? phone,
  }) {
    return CaregiverProfile(
      photoPath: photoPath ?? this.photoPath,
      name: name ?? this.name,
      titleRole: titleRole ?? this.titleRole,
      position: position ?? this.position,
      organization: organization ?? this.organization,
      email: email ?? this.email,
      phone: phone ?? this.phone,
    );
  }

  Map<String, Object?> toJson() => {
        'photoPath': photoPath,
        'name': name,
        'titleRole': titleRole,
        'position': position,
        'organization': organization,
        'email': email,
        'phone': phone,
      };

  static CaregiverProfile fromJson(Map<String, Object?> json) {
    String? asString(Object? v) => v is String ? v : null;

    return CaregiverProfile(
      photoPath: asString(json['photoPath']),
      name: asString(json['name']) ?? '',
      titleRole: asString(json['titleRole']) ?? '',
      position: asString(json['position']) ?? '',
      organization: asString(json['organization']) ?? '',
      email: asString(json['email']) ?? '',
      phone: asString(json['phone']) ?? '',
    );
  }
}
