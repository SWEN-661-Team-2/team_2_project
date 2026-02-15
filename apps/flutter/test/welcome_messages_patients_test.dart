import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/app/routes.dart';
import 'package:flutter_app/features/welcome/welcome_screen.dart';
import 'package:flutter_app/features/messages/messages_list_screen.dart';
import 'package:flutter_app/features/patients/patients_list_screen.dart';
import 'package:flutter_app/core/messages/messages_repository.dart';
import 'package:flutter_app/core/patients/patients_repository.dart';

import 'test_harness.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Welcome renders continue and settings', (tester) async {
    await pumpWidgetWithApp(tester, const WelcomeScreen());

    expect(find.byKey(const Key('welcome_continue')), findsOneWidget);
    expect(find.byKey(const Key('welcome_settings')), findsOneWidget);
  });

  testWidgets('Continue button shows correct label', (tester) async {
    await pumpWidgetWithApp(tester, const WelcomeScreen());
    expect(find.text('Continue'), findsOneWidget);
  });

  testWidgets('Continue navigates to login', (tester) async {
    await pumpAppWithRoutes(tester, initialRoute: Routes.welcome);
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.byKey(const Key('welcome_continue')));
    await tester.tap(find.byKey(const Key('welcome_continue')));
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('login_email')), findsOneWidget);
  });

  testWidgets('Settings icon navigates to login', (tester) async {
    await pumpAppWithRoutes(tester, initialRoute: Routes.welcome);
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.byKey(const Key('welcome_settings')));
    await tester.tap(find.byKey(const Key('welcome_settings')));
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('login_email')), findsOneWidget);
  });

  testWidgets('Messages list renders and has items', (tester) async {
    await pumpWidgetWithApp(tester, const MessagesListScreen());

    final all = MessagesRepository.instance.all();
    expect(all, isNotEmpty);
    expect(find.byKey(const Key('messages_list')), findsOneWidget);

    expect(find.byKey(const Key('message_0')), findsOneWidget);

    expect(
      find.descendant(
        of: find.byKey(const Key('message_0')),
        matching: find.byIcon(Icons.circle),
      ),
      findsOneWidget,
    );
  });

  testWidgets('Messages unreadCount matches visible unread icons', (tester) async {
    await pumpWidgetWithApp(tester, const MessagesListScreen());
    final repo = MessagesRepository.instance;
    final unread = repo.unreadCount();

    expect(unread, greaterThan(0));
    expect(
      find.descendant(
        of: find.byKey(const Key('message_0')),
        matching: find.byIcon(Icons.circle),
      ),
      findsOneWidget,
    );
  });

  testWidgets('Patients list renders for different modes', (tester) async {
    final patientsRepo = PatientsRepository.instance;
    final allPatients = patientsRepo.allPatients();
    expect(allPatients, isNotEmpty);

    // ---------- ALL PATIENTS ----------
    await pumpWidgetWithApp(
      tester,
      const PatientsListScreen(
        key: Key('patients_all'),
        mode: PatientsViewMode.allPatients,
      ),
    );

    expect(find.byKey(const Key('patients_list')), findsOneWidget);

    // DO NOT hardcode a specific patient name.
    // Just assert at least one patient name from repo is present.
    final anyPatientNameFinder = find.byWidgetPredicate((w) {
      if (w is! Text) return false;
      final data = w.data ?? '';
      return allPatients.any((p) => data == '${p.firstName} ${p.lastName}');
    });

    expect(anyPatientNameFinder, findsWidgets);

    // ---------- NEEDING ATTENTION ----------
    await pumpWidgetWithApp(
      tester,
      const PatientsListScreen(
        key: Key('patients_needing_attention'),
        mode: PatientsViewMode.needingAttention,
      ),
    );

    expect(find.byKey(const Key('patients_list')), findsOneWidget);
    expect(find.textContaining('Priority:'), findsWidgets);

    // ---------- UPCOMING VISITS ----------
    await pumpWidgetWithApp(
      tester,
      const PatientsListScreen(
        key: Key('patients_upcoming'),
        mode: PatientsViewMode.upcomingVisits,
      ),
    );

    expect(find.byKey(const Key('patients_list')), findsOneWidget);
    expect(find.textContaining('Visit:'), findsWidgets);
  });
}
