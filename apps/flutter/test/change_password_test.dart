import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/features/auth/change_password_screen.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Future<void> pumpChangePassword(WidgetTester tester) async {
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AppSettingsController()),
        ],
        child: MaterialApp(
          home: ChangePasswordScreen(), // ❗ NOT const
        ),
      ),
    );

    await tester.pumpAndSettle();
  }

  testWidgets('Change password fields and save button exist', (tester) async {
    await pumpChangePassword(tester);

    expect(find.byKey(const Key('change_old')), findsOneWidget);
    expect(find.byKey(const Key('change_new')), findsOneWidget);
    expect(find.byKey(const Key('change_confirm')), findsOneWidget);
    expect(find.byKey(const Key('change_save')), findsOneWidget);
  });

  testWidgets('Mismatch new/confirm shows error', (tester) async {
    await pumpChangePassword(tester);

    await tester.enterText(find.byKey(const Key('change_new')), 'abc123');
    await tester.enterText(find.byKey(const Key('change_confirm')), 'xyz123');

    await tester.tap(find.byKey(const Key('change_save')));
    await tester.pumpAndSettle();

    expect(
      find.text('New password and confirmation must match.'),
      findsOneWidget,
    );
  });

  testWidgets('Matching new/confirm pops route', (tester) async {
    final popped = <Route<dynamic>>[];

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AppSettingsController()),
        ],
        child: MaterialApp(
          home: ChangePasswordScreen(), // ❗ NOT const
          navigatorObservers: [_RecorderObserver(onPop: (r) => popped.add(r))],
        ),
      ),
    );

    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('change_new')), 'abc123');
    await tester.enterText(find.byKey(const Key('change_confirm')), 'abc123');

    await tester.tap(find.byKey(const Key('change_save')));
    await tester.pumpAndSettle();

    expect(popped.isNotEmpty, true);
  });
}

class _RecorderObserver extends NavigatorObserver {
  final void Function(Route) onPop;
  _RecorderObserver({required this.onPop});

  @override
  void didPop(Route route, Route? previousRoute) {
    onPop(route);
    super.didPop(route, previousRoute);
  }
}
