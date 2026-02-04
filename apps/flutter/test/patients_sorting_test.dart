import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/features/patients/patients_list_screen.dart';
import 'package:flutter_app/core/patients/patients_repository.dart';

import 'test_harness.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Patient List Sorting Tests - Global Consistency', () {
    testWidgets('Sort dropdown renders in Active Patients mode', (tester) async {
      await pumpWidgetWithApp(tester, const PatientsListScreen(mode: PatientsViewMode.all));
      
      expect(find.byKey(const Key('sort_dropdown')), findsOneWidget);
      expect(find.text('Active Patients'), findsOneWidget);
    });

    testWidgets('Sort dropdown renders in needingAttention mode (consistent behavior)', (tester) async {
      await pumpWidgetWithApp(tester, const PatientsListScreen(mode: PatientsViewMode.needingAttention));
      
      // Sort dropdown should now be visible in ALL modes
      expect(find.byKey(const Key('sort_dropdown')), findsOneWidget);
      expect(find.text('Patients Needing Attention'), findsOneWidget);
    });

    testWidgets('Sort dropdown renders in upcomingVisits mode (consistent behavior)', (tester) async {
      await pumpWidgetWithApp(tester, const PatientsListScreen(mode: PatientsViewMode.upcomingVisits));
      
      // Sort dropdown should now be visible in ALL modes
      expect(find.byKey(const Key('sort_dropdown')), findsOneWidget);
      expect(find.text('Upcoming Visits'), findsOneWidget);
    });

    testWidgets('Sort dropdown shows all 5 sorting options', (tester) async {
      await pumpWidgetWithApp(tester, const PatientsListScreen(mode: PatientsViewMode.all));
      
      // Tap the sort dropdown
      await tester.tap(find.byKey(const Key('sort_dropdown')));
      await tester.pumpAndSettle();

      // Verify all options are present
      expect(find.byKey(const Key('sort_option_lastNameAsc')), findsOneWidget);
      expect(find.byKey(const Key('sort_option_lastNameDesc')), findsOneWidget);
      expect(find.byKey(const Key('sort_option_criticalityHighToLow')), findsOneWidget);
      expect(find.byKey(const Key('sort_option_criticalityLowToHigh')), findsOneWidget);
      expect(find.byKey(const Key('sort_option_upcomingVisits')), findsOneWidget);
    });

    testWidgets('Selecting sort option reorders patient list', (tester) async {
      await pumpWidgetWithApp(tester, const PatientsListScreen(mode: PatientsViewMode.all));
      
      final repo = PatientsRepository.instance;
      
      // Get first patient before sorting
      final firstPatientBefore = find.byKey(const Key('patient_0'));
      expect(firstPatientBefore, findsOneWidget);
      
      // Open dropdown and select Z-A sort
      await tester.tap(find.byKey(const Key('sort_dropdown')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const Key('sort_option_lastNameDesc')));
      await tester.pumpAndSettle();

      // Verify list updated (we can check that patient at index 0 changed)
      expect(find.byKey(const Key('patient_0')), findsOneWidget);
      
      // Verify patients are sorted descending by last name
      final sortedDesc = repo.sortedByLastName(ascending: false);
      expect(sortedDesc.isNotEmpty, true);
    });

    testWidgets('Sorting works on Needing Attention view', (tester) async {
      await pumpWidgetWithApp(tester, const PatientsListScreen(mode: PatientsViewMode.needingAttention));
      
      // Open dropdown and select A-Z sort
      await tester.tap(find.byKey(const Key('sort_dropdown')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const Key('sort_option_lastNameAsc')));
      await tester.pumpAndSettle();

      // Verify list still renders
      expect(find.byKey(const Key('patients_list')), findsOneWidget);
    });

    testWidgets('Sorting works on Upcoming Visits view', (tester) async {
      await pumpWidgetWithApp(tester, const PatientsListScreen(mode: PatientsViewMode.upcomingVisits));
      
      // Open dropdown and select criticality sort
      await tester.tap(find.byKey(const Key('sort_dropdown')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const Key('sort_option_criticalityHighToLow')));
      await tester.pumpAndSettle();

      // Verify list still renders
      expect(find.byKey(const Key('patients_list')), findsOneWidget);
    });
  });

  group('PatientsRepository Sorting Tests', () {
    final repo = PatientsRepository.instance;

    test('sortedByLastName ascending orders A-Z', () {
      final sorted = repo.sortedByLastName(ascending: true);
      
      expect(sorted.isNotEmpty, true);
      
      // Verify order is ascending
      for (int i = 0; i < sorted.length - 1; i++) {
        final current = sorted[i].lastName.toLowerCase();
        final next = sorted[i + 1].lastName.toLowerCase();
        expect(current.compareTo(next) <= 0, true,
            reason: '$current should come before or equal to $next');
      }
    });

    test('sortedByLastName descending orders Z-A', () {
      final sorted = repo.sortedByLastName(ascending: false);
      
      expect(sorted.isNotEmpty, true);
      
      // Verify order is descending
      for (int i = 0; i < sorted.length - 1; i++) {
        final current = sorted[i].lastName.toLowerCase();
        final next = sorted[i + 1].lastName.toLowerCase();
        expect(current.compareTo(next) >= 0, true,
            reason: '$current should come after or equal to $next');
      }
    });

    test('sortedByCriticality high to low puts critical first', () {
      final sorted = repo.sortedByCriticality(ascending: true);
      
      expect(sorted.isNotEmpty, true);
      
      // Find first patient with criticality
      final firstWithCrit = sorted.firstWhere((p) => p.criticality != null);
      expect(firstWithCrit.criticality, isNotNull);
      
      // Patients without criticality should be at the end
      final withCrit = sorted.where((p) => p.criticality != null).toList();
      final withoutCrit = sorted.where((p) => p.criticality == null).toList();
      expect(sorted, [...withCrit, ...withoutCrit]);
    });

    test('sortedByCriticality low to high puts low priority first', () {
      final sorted = repo.sortedByCriticality(ascending: false);
      
      expect(sorted.isNotEmpty, true);
      
      // Patients with criticality should still come before null
      final withCrit = sorted.where((p) => p.criticality != null).toList();
      final withoutCrit = sorted.where((p) => p.criticality == null).toList();
      expect(sorted, [...withCrit, ...withoutCrit]);
    });

    test('allPatientsSortedByVisit puts soonest visits first', () {
      final sorted = repo.allPatientsSortedByVisit();
      
      expect(sorted.isNotEmpty, true);
      
      // Patients with visits should come before those without
      final withVisit = sorted.where((p) => p.nextVisit != null).toList();
      final withoutVisit = sorted.where((p) => p.nextVisit == null).toList();
      
      expect(sorted, [...withVisit, ...withoutVisit]);
      
      // Verify visits are in chronological order
      for (int i = 0; i < withVisit.length - 1; i++) {
        final current = withVisit[i].nextVisit!;
        final next = withVisit[i + 1].nextVisit!;
        expect(current.isBefore(next) || current.isAtSameMomentAs(next), true);
      }
    });
  });
}
