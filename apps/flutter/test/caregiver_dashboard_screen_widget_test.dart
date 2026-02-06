import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/features/caregiver_dashboard/caregiver_dashboard_screen.dart';

void main() {
  testWidgets('Dashboard renders on tablet layout (>=600)', (tester) async {
    await tester.binding.setSurfaceSize(const Size(900, 900));
    await tester.pumpWidget(const MaterialApp(home: CaregiverDashboardScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Patients Needing Attention'), findsWidgets);
    expect(find.text('Upcoming Visits'), findsWidgets);
  });

  testWidgets('Dashboard renders on phone layout (<600)', (tester) async {
    await tester.binding.setSurfaceSize(const Size(390, 900));
    await tester.pumpWidget(const MaterialApp(home: CaregiverDashboardScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Patients Needing Attention'), findsWidgets);
    expect(find.text('Upcoming Visits'), findsWidgets);
  });
}