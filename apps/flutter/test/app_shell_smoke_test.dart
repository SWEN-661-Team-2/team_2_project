// test/app_shell_smoke_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/app/app_shell.dart';
import 'package:flutter_app/app/providers.dart';

void main() {
  testWidgets('AppShell builds (with AppProviders)', (tester) async {
    await tester.pumpWidget(
      MultiProvider(
        providers: AppProviders.build(),
        child: const MaterialApp(home: AppShell()),
      ),
    );

    await tester.pumpAndSettle();
    expect(find.byType(AppShell), findsOneWidget);
  });
}

