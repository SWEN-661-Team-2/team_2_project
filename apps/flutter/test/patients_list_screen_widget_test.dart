// /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/flutter/test/patients_list_screen_widget_test.dart

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
  await tester.binding.setSurfaceSize(const Size(1200, 6000));

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

    expect(find.byKey(const Key('patients_list')), findsOneWidget);
    expect(find.byType(Card), findsWidgets);
  });

  testWidgets('Patients list renders for UPCOMING VISITS mode', (tester) async {
    await _pump(tester, mode: PatientsViewMode.upcomingVisits);

    expect(find.byKey(const Key('patients_list')), findsOneWidget);
    expect(find.byType(Card), findsWidgets);
  });

  testWidgets('Patients list renders for NEEDING ATTENTION mode', (tester) async {
    await _pump(tester, mode: PatientsViewMode.needingAttention);

    expect(find.byKey(const Key('patients_list')), findsOneWidget);
    expect(find.byType(Card), findsWidgets);
  });

  testWidgets('Sort menu opens and options render', (tester) async {
    await _pump(tester, mode: PatientsViewMode.allPatients);

    // Tap the SORT PopupMenuButton directly (not the icon)
    final sortButton = find.byWidgetPredicate(
      (w) => w is PopupMenuButton<SortOption>,
    );
    expect(sortButton, findsOneWidget);

    await tester.tap(sortButton);
    await tester.pumpAndSettle();

    // In widget tests, PopupMenuItem is often typed as PopupMenuItem<SortOption>
    // so match it that way (not dynamic).
    expect(find.byType(PopupMenuItem<SortOption>), findsAtLeastNWidgets(3));
  });

  testWidgets('Selecting a sort option does not crash', (tester) async {
    await _pump(tester, mode: PatientsViewMode.allPatients);

    final sortButton = find.byWidgetPredicate(
      (w) => w is PopupMenuButton<SortOption>,
    );
    expect(sortButton, findsOneWidget);

    await tester.tap(sortButton);
    await tester.pumpAndSettle();

    final items = find.byType(PopupMenuItem<SortOption>);
    expect(items, findsAtLeastNWidgets(2));

    await tester.tap(items.at(1));
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('patients_list')), findsOneWidget);
  });
}