// /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/react-native/jest.setup.js

import '@testing-library/react-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
  requestMediaLibraryPermissionsAsync: jest.fn(),
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://test/',
  makeDirectoryAsync: jest.fn(),
  getInfoAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

/**
 * Expo Notifications + Expo runtime mocks
 * Fixes: "Cannot read properties of undefined (reading 'EventEmitter')"
 */
jest.mock('expo-modules-core', () => {
  class EventEmitter {
    addListener() {
      return { remove: jest.fn() };
    }
    removeAllListeners() {}
    emit() {}
  }

  return {
    EventEmitter,
    NativeModulesProxy: {},
    Subscription: class Subscription {
      remove() {}
    },
    requireNativeModule: jest.fn(() => ({})),
    requireOptionalNativeModule: jest.fn(() => ({})),
  };
});

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(async () => 'mock-notification-id'),
  cancelScheduledNotificationAsync: jest.fn(async () => {}),
  getPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  removeNotificationSubscription: jest.fn(),
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
      replace: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    NavigationContainer: ({ children }) => children,
  };
});

// Silence console warnings/errors in tests
global.console = global.console || {};
global.console.warn = global.console.warn || jest.fn();
global.console.error = global.console.error || jest.fn();