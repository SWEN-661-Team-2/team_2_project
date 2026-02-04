import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:provider/provider.dart';
import 'package:flutter_app/app/providers.dart';

import 'package:flutter_app/app/routes.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues(<String, Object>{});
  });

  testWidgets('App builds smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      MultiProvider(
        providers: AppProviders.build(),
        child: MaterialApp(
          routes: Routes.map,
          initialRoute: Routes.welcome,
        ),
      ),
    );

    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
  });
}