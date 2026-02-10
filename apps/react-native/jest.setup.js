// Test setup file
import '@testing-library/react-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

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

// Silence console warnings in tests (only if not already mocked)
if (global.console && typeof global.console.warn !== 'function') {
  global.console.warn = jest.fn();
}
if (global.console && typeof global.console.error !== 'function') {
  global.console.error = jest.fn();
}
