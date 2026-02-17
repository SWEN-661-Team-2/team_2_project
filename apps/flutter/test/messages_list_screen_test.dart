// test/messages_list_screen_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/features/messages/messages_list_screen.dart';

void main() {
  Widget _wrap(Widget child) {
    return MaterialApp(
      home: ChangeNotifierProvider<AppSettingsController>(
        create: (_) => AppSettingsController(),
        child: child,
      ),
    );
  }

  testWidgets('MessagesListScreen shows list and can filter to unread only', (tester) async {
    SharedPreferences.setMockInitialValues({});

    await tester.pumpWidget(_wrap(const MessagesListScreen()));
    await tester.pumpAndSettle();

    expect(find.text('Messages'), findsOneWidget);
    expect(find.byKey(const Key('messages_list')), findsOneWidget);

    await tester.tap(find.byIcon(Icons.filter_list));
    await tester.pumpAndSettle();

    expect(find.text('Filter Messages'), findsOneWidget);

    await tester.tap(find.text('Unread Only'));
    await tester.pumpAndSettle();

    expect(find.text('Messages / Unread'), findsOneWidget);
    expect(find.byKey(const Key('messages_list')), findsOneWidget);
  });
}