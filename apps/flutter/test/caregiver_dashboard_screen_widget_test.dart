import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/features/caregiver_dashboard/caregiver_dashboard_screen.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';

Future<void> _pump(WidgetTester tester, Size size) async {
  await tester.binding.setSurfaceSize(size);

  await tester.pumpWidget(
    ChangeNotifierProvider(
      create: (_) => AppSettingsController(),
      child: const MaterialApp(
        home: CaregiverDashboardScreen(),
      ),
    ),
  );

  await tester.pumpAndSettle();
}

void main() {
  testWidgets('Dashboard renders on tablet layout (>=600)', (tester) async {
    await _pump(tester, const Size(900, 900));

    expect(find.text('Patients Needing Attention'), findsWidgets);
    expect(find.text('Upcoming Visits'), findsWidgets);
  });

  testWidgets('Dashboard renders on phone layout (<600)', (tester) async {
    await _pump(tester, const Size(390, 900));

    expect(find.text('Patients Needing Attention'), findsWidgets);
    expect(find.text('Upcoming Visits'), findsWidgets);
  });
}
