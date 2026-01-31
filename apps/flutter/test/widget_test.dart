import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:flutter_app/main.dart' as app;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('App builds smoke test', (WidgetTester tester) async {
    // Mock SharedPreferences for widget tests
    SharedPreferences.setMockInitialValues(<String, Object>{});

    // Run your real app main() which loads settings then calls runApp()
    await tester.runAsync(() async {
      await app.main();
    });

    // Let frames settle
    await tester.pumpAndSettle();

    // Smoke assertion: app didn't crash during build
    expect(tester.takeException(), isNull);
  });
}