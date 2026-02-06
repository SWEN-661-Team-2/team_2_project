enum ReminderFrequency {
  daily,
  weekly,
  custom,
}

extension ReminderFrequencyX on ReminderFrequency {
  String get label {
    switch (this) {
      case ReminderFrequency.daily:
        return 'Daily';
      case ReminderFrequency.weekly:
        return 'Weekly';
      case ReminderFrequency.custom:
        return 'Custom';
    }
  }

  String get subtitle {
    switch (this) {
      case ReminderFrequency.daily:
        return 'Get reminders every day';
      case ReminderFrequency.weekly:
        return 'Get reminders once per week';
      case ReminderFrequency.custom:
        return 'Choose your own schedule (coming soon)';
    }
  }
}