import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:nested/nested.dart';

import 'package:flutter_app/features/profile/profile_screen.dart';
import 'package:flutter_app/core/profile/caregiver_profile.dart';
import 'package:flutter_app/core/profile/caregiver_profile_controller.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';

class FakeCaregiverProfileController extends ChangeNotifier
    implements CaregiverProfileController {
  @override
  bool loaded = true;

  @override
  CaregiverProfile profile = const CaregiverProfile(
    photoPath: null,
    name: 'Jane Doe',
    titleRole: 'RN',
    position: 'Caregiver',
    organization: 'CareConnect',
    email: 'jane@example.com',
    phone: '555-555-5555',
  );

  @override
  Future<void> load() async {
    loaded = true;

    // IMPORTANT: avoid notifying during build
    await Future<void>.delayed(Duration.zero);

    notifyListeners();
  }

  @override
  Future<void> save(CaregiverProfile updated) async {
    profile = updated;
    notifyListeners();
  }

  @override
  Future<void> updateField({
    String? photoPath,
    String? name,
    String? titleRole,
    String? position,
    String? organization,
    String? email,
    String? phone,
  }) async {
    profile = CaregiverProfile(
      photoPath: photoPath ?? profile.photoPath,
      name: name ?? profile.name,
      titleRole: titleRole ?? profile.titleRole,
      position: position ?? profile.position,
      organization: organization ?? profile.organization,
      email: email ?? profile.email,
      phone: phone ?? profile.phone,
    );
    notifyListeners();
  }
}

Future<void> pumpProfile(
  WidgetTester tester,
  FakeCaregiverProfileController c,
) async {
  await tester.binding.setSurfaceSize(const Size(800, 1400));

  await tester.pumpWidget(
    MultiProvider(
      providers: <SingleChildWidget>[
        ChangeNotifierProvider<CaregiverProfileController>.value(value: c),
        ChangeNotifierProvider<AppSettingsController>(
          create: (_) => AppSettingsController(),
        ),
      ],
      child: const MaterialApp(home: ProfileScreen()),
    ),
  );

  // allow didChangeDependencies + load() + FutureBuilder to resolve
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 20));
  await tester.pump(const Duration(milliseconds: 80));
}

void main() {
  testWidgets('Profile loads and shows readonly view then enters edit view', (
    tester,
  ) async {
    final c = FakeCaregiverProfileController();
    await pumpProfile(tester, c);

    expect(find.byKey(const Key('profile_readonly')), findsOneWidget);
    expect(find.text('Edit Profile'), findsOneWidget);

    await tester.tap(find.byKey(const Key('profile_edit')));
    await tester.pump();

    expect(find.byKey(const Key('profile_edit_view')), findsOneWidget);
  });

  testWidgets('Cancel returns to readonly view', (tester) async {
    final c = FakeCaregiverProfileController();
    await pumpProfile(tester, c);

    await tester.tap(find.byKey(const Key('profile_edit')));
    await tester.pump();

    await tester.tap(find.byKey(const Key('profile_cancel')));
    await tester.pump();

    expect(find.byKey(const Key('profile_readonly')), findsOneWidget);
  });

  testWidgets('Save updates controller and shows snackbar', (tester) async {
    final c = FakeCaregiverProfileController();
    await pumpProfile(tester, c);

    await tester.tap(find.byKey(const Key('profile_edit')));
    await tester.pump();

    await tester.enterText(find.byType(TextField).at(0), 'Updated Name');
    await tester.tap(find.byKey(const Key('profile_save')));
    await tester.pump(const Duration(milliseconds: 250));

    expect(find.text('Profile saved'), findsOneWidget);
    expect(c.profile.name, 'Updated Name');
    expect(find.byKey(const Key('profile_readonly')), findsOneWidget);
  });

  testWidgets(
    'Tapping photo in edit view shows platform-not-supported snackbar in tests',
    (tester) async {
      final c = FakeCaregiverProfileController();
      await pumpProfile(tester, c);

      await tester.tap(find.byKey(const Key('profile_edit')));
      await tester.pump();

      // Tap the photo inkwell (edit view has InkWell wrapper)
      await tester.tap(find.byType(InkWell).first);
      await tester.pump(const Duration(milliseconds: 250));

      expect(
        find.text('Photo upload is supported on Android/iOS for now.'),
        findsOneWidget,
      );
    },
  );
}
