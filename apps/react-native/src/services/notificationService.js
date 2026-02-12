// /src/services/notificationService.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDER_NOTIFICATION_ID = 'careconnect-reminder';

// Optional: show alerts while app is foregrounded (otherwise iOS may not show)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationSetupAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

// Ask permission (iOS mainly; Android varies by version/device)
export async function requestNotificationPermissionAsync() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const req = await Notifications.requestPermissionsAsync();
  return !!req.granted;
}

// Cancel any reminders we created
export async function cancelReminderAsync() {
  // We cancel by identifier if we scheduled with identifier
  try {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_NOTIFICATION_ID);
  } catch {
    // If it wasn't scheduled yet, ignore.
  }
}

// Schedule based on your frequency setting
export async function scheduleReminderAsync(reminderFrequency) {
  await ensureNotificationSetupAsync();
  await cancelReminderAsync();

  // Pick a sane default time (9:00 AM local)
  const hour = 9;
  const minute = 0;

  // Expo supports date/time triggers; repeating calendar triggers differ by platform.
  // Keep it simple: daily/weekly with calendar trigger.
  // (If you want more control later, schedule multiple one-off notifications.)
  const trigger =
    reminderFrequency === 'weekly'
      ? { weekday: 1, hour, minute, repeats: true } // Monday 9am
      : { hour, minute, repeats: true }; // daily 9am

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_NOTIFICATION_ID,
    content: {
      title: 'CareConnect reminder',
      body: 'You have tasks to review today.',
      sound: false,
    },
    trigger,
  });
}