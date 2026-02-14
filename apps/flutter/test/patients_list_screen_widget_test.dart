import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:nested/nested.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/features/patients/patients_list_screen.dart';

Future<void> _pump(
  WidgetTester tester, {
  required PatientsViewMode mode,
}) async {
  await tester.pumpWidget(
    MultiProvider(
      providers: <SingleChildWidget>[
        ChangeNotifierProvider(create: (_) => AppSettingsController()),
      ],
      child: MaterialApp(home: PatientsListScreen(mode: mode)),
    ),
  );

  await tester.pumpAndSettle();
}

void main() {
  testWidgets('Patients list renders for ALL mode', (tester) async {
    await _pump(tester, mode: PatientsViewMode.allPatients);

    expect(find.text('Patients'), findsOneWidget);
    expect(find.byKey(const Key('patients_list')), findsOneWidget);
    expect(find.byType(Card), findsWidgets);
  });

  testWidgets('Patients list renders for UPCOMING VISITS mode', (tester) async {
    await _pump(tester, mode: PatientsViewMode.upcomingVisits);

    expect(find.text('Upcoming Visits'), findsOneWidget);
    expect(find.byKey(const Key('patients_list')), findsOneWidget);
    expect(find.byType(Card), findsWidgets);
  });

  testWidgets('Patients list renders for NEEDING ATTENTION mode', (
    tester,
  ) async {
    await _pump(tester, mode: PatientsViewMode.needingAttention);

    expect(find.text('Patients Needing Attention'), findsOneWidget);
    expect(find.byKey(const Key('patients_list')), findsOneWidget);
    expect(find.byType(Card), findsWidgets);
  });

  testWidgets('Sort menu opens and options render', (tester) async {
    await _pump(tester, mode: PatientsViewMode.allPatients);

    await tester.tap(find.byIcon(Icons.sort));
    await tester.pumpAndSettle();

    expect(find.text('Filter Patients'), findsOneWidget);
    expect(find.text('All Patients'), findsOneWidget);
    expect(find.text('Upcoming Visits'), findsOneWidget);
    expect(find.text('Needing Attention'), findsOneWidget);
  });

  testWidgets('Selecting a sort option does not crash', (tester) async {
    await _pump(tester, mode: PatientsViewMode.allPatients);

    await tester.tap(find.byIcon(Icons.sort));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Upcoming Visits'));
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('patients_list')), findsOneWidget);
  });
}
