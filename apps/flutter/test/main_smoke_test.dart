// test/main_smoke_test.dart
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/main.dart' as app;

void main() {
  test('main() runs without crashing', () async {
    await app.main();
  });
}
