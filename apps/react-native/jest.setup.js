// Path: /jest.setup.js

import '@testing-library/react-native/extend-expect';

// ✅ AsyncStorage mock (no recursion)
jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};

  return {
    __esModule: true,
    default: {
      setItem: jest.fn(async (key, value) => {
        store[key] = value;
        return null;
      }),
      getItem: jest.fn(async (key) => {
        return store.hasOwnProperty(key) ? store[key] : null;
      }),
      removeItem: jest.fn(async (key) => {
        delete store[key];
        return null;
      }),
      clear: jest.fn(async () => {
        store = {};
        return null;
      }),
      getAllKeys: jest.fn(async () => Object.keys(store)),
    },
  };
});

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
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
    useRoute: () => ({
      params: {},
    }),
    NavigationContainer: ({ children }) => children,
  };
});

// Silence console warnings in tests
global.console.warn = jest.fn();
global.console.error = jest.fn();