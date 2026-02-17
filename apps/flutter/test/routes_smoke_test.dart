// test/routes_smoke_test.dart
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/app/routes.dart';

void main() {
  test('Routes.map contains expected keys', () {
    expect(Routes.map, isNotEmpty);

    // These should exist in every build of your app
    expect(Routes.map.containsKey(Routes.welcome), isTrue);
  });
}

