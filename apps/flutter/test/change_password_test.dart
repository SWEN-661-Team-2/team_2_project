import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/features/auth/change_password_screen.dart';

import 'test_harness.dart';
import 'package:flutter_app/app/app_scope.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Change password fields and save button exist', (tester) async {
    await pumpWidgetWithApp(tester, const ChangePasswordScreen());

    expect(find.byKey(const Key('change_old')), findsOneWidget);
    expect(find.byKey(const Key('change_new')), findsOneWidget);
    expect(find.byKey(const Key('change_confirm')), findsOneWidget);
    expect(find.byKey(const Key('change_save')), findsOneWidget);
  });

  testWidgets('Mismatch new/confirm shows error', (tester) async {
    await pumpWidgetWithApp(tester, const ChangePasswordScreen());

    await tester.enterText(find.byKey(const Key('change_new')), 'abc123');
    await tester.enterText(find.byKey(const Key('change_confirm')), 'different');
    await tester.tap(find.byKey(const Key('change_save')));
    await tester.pumpAndSettle();

    expect(find.text('New password and confirmation must match.'), findsOneWidget);
  });

  testWidgets('Matching new/confirm triggers save and pop', (tester) async {
    // Use a NavigatorObserver to detect pop
    final pops = <Route<dynamic>>[];
    final observer = _RecorderObserver(onPop: (r) => pops.add(r));

    await tester.pumpWidget(
      AppScope(
        controller: AppSettingsController(),
        child: MaterialApp(
          home: const ChangePasswordScreen(),
          navigatorObservers: [observer],
        ),
      ),
    );

    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(const Key('change_new')), 'abc123');
    await tester.enterText(find.byKey(const Key('change_confirm')), 'abc123');
    await tester.tap(find.byKey(const Key('change_save')));
    await tester.pumpAndSettle();

    expect(pops.length, greaterThanOrEqualTo(1));
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
