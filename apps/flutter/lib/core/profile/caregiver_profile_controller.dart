import 'package:flutter/foundation.dart';

import 'caregiver_profile.dart';
import 'caregiver_profile_storage.dart';

class CaregiverProfileController extends ChangeNotifier {
  final CaregiverProfileStorage _storage = CaregiverProfileStorage();

  CaregiverProfile _profile = const CaregiverProfile();
  CaregiverProfile get profile => _profile;

  bool _loaded = false;
  bool get loaded => _loaded;

  Future<void> load() async {
    _profile = await _storage.load();
    _loaded = true;
    notifyListeners();
  }

  Future<void> save(CaregiverProfile updated) async {
    _profile = updated;
    await _storage.save(_profile);
    notifyListeners();
  }

  Future<void> updateField({
    String? photoPath,
    String? name,
    String? titleRole,
    String? position,
    String? organization,
    String? email,
    String? phone,
  }) async {
    final updated = _profile.copyWith(
      photoPath: photoPath,
      name: name,
      titleRole: titleRole,
      position: position,
      organization: organization,
      email: email,
      phone: phone,
    );
    await save(updated);
  }
}
