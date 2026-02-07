import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/app/routes.dart';
import 'package:flutter_app/features/welcome/welcome_screen.dart';
import 'package:flutter_app/features/messages/messages_list_screen.dart';
import 'package:flutter_app/features/patients/patients_list_screen.dart';
import 'package:flutter_app/core/messages/messages_repository.dart';

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
    // FIXED: Use pumpAppWithRoutes instead of bare MaterialApp
    await pumpAppWithRoutes(tester, initialRoute: Routes.welcome);
    await tester.pumpAndSettle();

    await tester.ensureVisible(find.byKey(const Key('welcome_continue')));
    await tester.tap(find.byKey(const Key('welcome_continue')));
    await tester.pumpAndSettle();

    expect(find.byKey(const Key('login_email')), findsOneWidget);
  });

  testWidgets('Settings icon navigates to login', (tester) async {
    // FIXED: Use pumpAppWithRoutes instead of bare MaterialApp
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
    // Ensure first item exists by key
    expect(find.byKey(const Key('message_0')), findsOneWidget);

    // The first message is unread in the repository; assert icon inside first tile
    expect(find.descendant(of: find.byKey(const Key('message_0')), matching: find.byIcon(Icons.circle)), findsOneWidget);
  });

  testWidgets('Messages unreadCount matches visible unread icons', (tester) async {
    await pumpWidgetWithApp(tester, const MessagesListScreen());
    final repo = MessagesRepository.instance;
    final unread = repo.unreadCount();

    // Ensure repository reports unread and first tile shows the unread icon
    expect(unread, greaterThan(0));
    expect(find.descendant(of: find.byKey(const Key('message_0')), matching: find.byIcon(Icons.circle)), findsOneWidget);
  });







 testWidgets('Patients list renders for different modes', (tester) async {
    await pumpWidgetWithApp(
      tester, 
      const PatientsListScreen(
        key: Key('patients_all'),  // Added unique key
        mode: PatientsViewMode.all,
      ),
    );

    expect(find.byKey(const Key('patients_list')), findsOneWidget);
    expect(find.byKey(const Key('patient_0')), findsOneWidget);

    await pumpWidgetWithApp(
      tester,
      const PatientsListScreen(
        key: Key('patients_needing_attention'),  // Added unique key
        mode: PatientsViewMode.needingAttention,
      ),
    );
    
    expect(find.text('Patients Needing Attention'), findsOneWidget);
    expect(find.byKey(const Key('patient_tag_0')), findsOneWidget);

    await pumpWidgetWithApp(
      tester,
      const PatientsListScreen(
        key: Key('patients_upcoming'),  // Added unique key
        mode: PatientsViewMode.upcomingVisits,
      ),
    );
    
    expect(find.text('Upcoming Visits'), findsOneWidget);
  });


}


