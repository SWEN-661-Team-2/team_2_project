// test/app_boot_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/app/providers.dart';
import 'package:flutter_app/app/app.dart';

import 'package:provider/provider.dart';

void main() {
  testWidgets('CareConnectApp boots', (tester) async {
    await tester.pumpWidget(
      MultiProvider(
        providers: AppProviders.build(),
        child: const CareConnectApp(),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
