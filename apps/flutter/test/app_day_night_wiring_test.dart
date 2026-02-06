import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:flutter_app/app/app.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues(<String, Object>{});
  });

  testWidgets('CareConnectApp uses ThemeMode.light by default', (tester) async {
    final c = AppSettingsController();
    await c.load();

    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: c,
        child: const CareConnectApp(),
      ),
    );

    await tester.pumpAndSettle();

    final app = tester.widget<MaterialApp>(find.byType(MaterialApp));
    expect(app.themeMode, ThemeMode.light);
  });

  testWidgets('CareConnectApp switches to dark when highContrastEnabled=true', (tester) async {
    final c = AppSettingsController();
    await c.load();

    await c.setHighContrastEnabled(true);

    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: c,
        child: const CareConnectApp(),
      ),
    );

    await tester.pumpAndSettle();

    final app = tester.widget<MaterialApp>(find.byType(MaterialApp));
    expect(app.themeMode, ThemeMode.dark);
  });
}