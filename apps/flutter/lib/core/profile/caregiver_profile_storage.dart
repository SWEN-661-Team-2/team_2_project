import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

import 'caregiver_profile.dart';

class CaregiverProfileStorage {
  static const _kProfileJson = 'caregiver_profile_json';

  Future<CaregiverProfile> load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_kProfileJson);
    if (raw == null || raw.isEmpty) return const CaregiverProfile();

    final decoded = jsonDecode(raw);
    if (decoded is! Map) return const CaregiverProfile();

    return CaregiverProfile.fromJson(Map<String, Object?>.from(decoded));
  }

  Future<void> save(CaregiverProfile profile) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_kProfileJson, jsonEncode(profile.toJson()));
  }

  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_kProfileJson);
  }
}
