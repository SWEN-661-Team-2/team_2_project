import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/core/accessibility/text_size_mode.dart';

void main() {
  test('TextSizeMode has expected scale factors', () {
    expect(TextSizeMode.small.textScaleFactor, lessThan(1.0));
    expect(TextSizeMode.medium.textScaleFactor, equals(1.0));
    expect(TextSizeMode.large.textScaleFactor, greaterThan(1.0));
  });

  test('TextSizeMode values exist', () {
    expect(TextSizeMode.values, isNotEmpty);
  });
}