import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/core/accessibility/reminder_frequency.dart';

void main() {
  test('ReminderFrequency enum values exist', () {
    expect(ReminderFrequency.values, isNotEmpty);
    expect(ReminderFrequency.values.length, 3);
  });

  test('ReminderFrequency contains daily/weekly/custom', () {
    expect(ReminderFrequency.values, contains(ReminderFrequency.daily));
    expect(ReminderFrequency.values, contains(ReminderFrequency.weekly));
    expect(ReminderFrequency.values, contains(ReminderFrequency.custom));
  });
}
