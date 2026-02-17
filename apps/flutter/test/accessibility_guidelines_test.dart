import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/main.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
  });
  
  testWidgets('Welcome route meets basic accessibility guidelines', (tester) async {
    // Runs the real app with real providers + routes.
    await tester.pumpWidget(const MyApp());
    await tester.pumpAndSettle();

    // Touch target size
    await expectLater(tester, meetsGuideline(androidTapTargetGuideline));
    await expectLater(tester, meetsGuideline(iOSTapTargetGuideline));

    // Labels for tappable controls (helps screen readers)
    await expectLater(tester, meetsGuideline(labeledTapTargetGuideline));

    // Text contrast (WCAG-ish signal; also screenshotable)
    await expectLater(tester, meetsGuideline(textContrastGuideline));
  });
}