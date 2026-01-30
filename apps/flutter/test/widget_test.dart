import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/app/app.dart';

void main() {
  testWidgets('App builds smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const CareConnectApp());
    expect(find.text('Welcome'), findsOneWidget);
  });
}
