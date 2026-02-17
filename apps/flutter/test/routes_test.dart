// test/routes_test.dart
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/app/routes.dart';

void main() {
  test('Routes.map has welcome route + is not empty', () {
    expect(Routes.map.isNotEmpty, isTrue);
    expect(Routes.map.containsKey(Routes.welcome), isTrue);
  });
}

