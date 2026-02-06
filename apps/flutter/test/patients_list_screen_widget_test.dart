import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/features/patients/patients_list_screen.dart';
import 'package:flutter_app/core/patients/patients_repository.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Future<void> pumpPatients(WidgetTester tester, PatientsViewMode mode) async {
    await tester.pumpWidget(
      MaterialApp(
        home: PatientsListScreen(mode: mode),
      ),
    );
    await tester.pumpAndSettle();
  }

  testWidgets('Patients list renders for ALL mode', (tester) async {
    await pumpPatients(tester, PatientsViewMode.all);

    expect(find.text('Patients'), findsOneWidget);
    expect(find.byKey(const Key('patients_list')), findsOneWidget);

    expect(find.byType(ListTile), findsWidgets);
  });

  testWidgets('Patients list renders for UPCOMING VISITS mode', (tester) async {
    await pumpPatients(tester, PatientsViewMode.upcomingVisits);

    expect(find.text('Upcoming Visits'), findsOneWidget);
    expect(find.byKey(const Key('patients_list')), findsOneWidget);
    expect(find.byType(ListTile), findsWidgets);
  });

  testWidgets('Patients list renders for NEEDING ATTENTION mode', (tester) async {
    await pumpPatients(tester, PatientsViewMode.needingAttention);

    expect(find.text('Patients Needing Attention'), findsOneWidget);
    expect(find.byKey(const Key('patients_list')), findsOneWidget);
    expect(find.byType(ListTile), findsWidgets);
  });

  testWidgets('Sort menu opens', (tester) async {
    await pumpPatients(tester, PatientsViewMode.all);

    // Tap sort icon
    await tester.tap(find.byIcon(Icons.sort));
    await tester.pumpAndSettle();

    expect(find.text('Last Name (A–Z)'), findsOneWidget);
    expect(find.text('Last Name (Z–A)'), findsOneWidget);
    expect(find.text('Criticality (High → Low)'), findsOneWidget);
    expect(find.text('Criticality (Low → High)'), findsOneWidget);
    expect(find.text('Upcoming Visits'), findsOneWidget);
  });

  testWidgets('Selecting a sort option does not crash', (tester) async {
    await pumpPatients(tester, PatientsViewMode.all);

    await tester.tap(find.byIcon(Icons.sort));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Last Name (Z–A)'));
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('patients_list')), findsOneWidget);
  });

  test('PatientsRepository has data', () {
    final repo = PatientsRepository.instance;
    final all = repo.allPatients();
    expect(all, isNotEmpty);
  });
}