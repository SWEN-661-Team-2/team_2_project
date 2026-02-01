import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/app/app_shell.dart';
import 'package:flutter_app/features/patients/patients_list_screen.dart';
import 'package:flutter_app/features/messages/messages_list_screen.dart';
import 'package:flutter_app/features/caregiver_dashboard/caregiver_dashboard_screen.dart';

import 'test_harness.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('AppShell builds with bottom navigation', (tester) async {
    await pumpWidgetWithApp(tester, const AppShell());

    expect(find.byType(BottomNavigationBar), findsOneWidget);
    expect(find.byType(CaregiverDashboardScreen), findsOneWidget);
  });

  testWidgets('Tapping Patients tab shows PatientsListScreen', (tester) async {
    await pumpWidgetWithApp(tester, const AppShell());

    // Tap the bottom nav Patients icon (people)
    await tester.tap(find.byKey(const Key('bn_people')));
    await tester.pumpAndSettle();

    expect(find.byType(PatientsListScreen), findsOneWidget);
    expect(find.byKey(const Key('patients_list')), findsOneWidget);
  });

  testWidgets('Tapping Messages tab shows MessagesListScreen', (tester) async {
    await pumpWidgetWithApp(tester, const AppShell());

    await tester.tap(find.byKey(const Key('bn_messages')));
    await tester.pumpAndSettle();

    expect(find.byType(MessagesListScreen), findsOneWidget);
    expect(find.byKey(const Key('messages_list')), findsOneWidget);
  });
}
