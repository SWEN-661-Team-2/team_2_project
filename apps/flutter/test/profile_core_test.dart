import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:flutter_app/core/profile/caregiver_profile.dart';
import 'package:flutter_app/core/profile/caregiver_profile_controller.dart';
import 'package:flutter_app/core/profile/caregiver_profile_storage.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
  });

  test('CaregiverProfile copyWith updates only provided fields', () {
    const base = CaregiverProfile(
      name: 'Alice',
      email: 'a@test.com',
    );

    final updated = base.copyWith(email: 'b@test.com');

    expect(updated.name, 'Alice');
    expect(updated.email, 'b@test.com');
  });

  test('CaregiverProfile toJson / fromJson round-trip', () {
    const profile = CaregiverProfile(
      name: 'Bob',
      titleRole: 'RN',
      phone: '555',
    );

    final json = profile.toJson();
    final restored = CaregiverProfile.fromJson(json);

    expect(restored.name, 'Bob');
    expect(restored.titleRole, 'RN');
    expect(restored.phone, '555');
  });

  test('CaregiverProfileStorage saves and loads profile', () async {
    final storage = CaregiverProfileStorage();

    const profile = CaregiverProfile(name: 'Saved User');
    await storage.save(profile);

    final loaded = await storage.load();
    expect(loaded.name, 'Saved User');
  });

  test('CaregiverProfileController updateField persists changes', () async {
    final controller = CaregiverProfileController();

    await controller.load();
    await controller.updateField(name: 'Updated Name');

    expect(controller.profile.name, 'Updated Name');
  });
}