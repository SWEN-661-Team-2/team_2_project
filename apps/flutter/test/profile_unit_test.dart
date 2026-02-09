import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:flutter_app/core/profile/caregiver_profile.dart';
import 'package:flutter_app/core/profile/caregiver_profile_controller.dart';
import 'package:flutter_app/core/profile/caregiver_profile_storage.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('CaregiverProfile copyWith updates only specified fields', () {
    const base = CaregiverProfile(name: 'Alice', email: 'a@a.com');
    final updated = base.copyWith(name: 'Bob');

    expect(updated.name, 'Bob');
    expect(updated.email, 'a@a.com'); // unchanged
  });

  test('CaregiverProfile toJson/fromJson round trip preserves fields', () {
    const p = CaregiverProfile(
      photoPath: '/tmp/photo.jpg',
      name: 'Jane',
      titleRole: 'RN',
      position: 'Nurse',
      organization: 'Clinic',
      email: 'jane@x.com',
      phone: '555',
    );

    final json = p.toJson();
    final back = CaregiverProfile.fromJson(json);

    expect(back.photoPath, '/tmp/photo.jpg');
    expect(back.name, 'Jane');
    expect(back.titleRole, 'RN');
    expect(back.position, 'Nurse');
    expect(back.organization, 'Clinic');
    expect(back.email, 'jane@x.com');
    expect(back.phone, '555');
  });

  test(
    'CaregiverProfileStorage save then load returns saved profile',
    () async {
      final storage = CaregiverProfileStorage();
      const p = CaregiverProfile(name: 'Saved User', email: 'saved@test.com');

      await storage.save(p);
      final loaded = await storage.load();

      expect(loaded.name, 'Saved User');
      expect(loaded.email, 'saved@test.com');
    },
  );

  test(
    'CaregiverProfileController updateField persists and updates profile',
    () async {
      final controller = CaregiverProfileController();

      await controller.load();
      await controller.updateField(name: 'Updated Name', phone: '123');

      expect(controller.profile.name, 'Updated Name');
      expect(controller.profile.phone, '123');
      expect(controller.loaded, true);
    },
  );
}
