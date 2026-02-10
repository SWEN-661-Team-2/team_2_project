/**
 * Business Logic Tests - AppSettingsContext
 * Tests settings persistence, handedness modes, text size, and accessibility features
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppSettingsProvider,
  useAppSettings,
  HandednessMode,
  TextSizeMode,
  ReminderFrequency,
} from '../../src/contexts/AppSettingsContext';

const wrapper = ({ children }) => <AppSettingsProvider>{children}</AppSettingsProvider>;

describe('AppSettingsContext', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('handedness settings', () => {
    test('starts with left-handed mode by default', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      expect(result.current.handednessMode).toBe(HandednessMode.left);
    });

    test('can switch to right-handed mode', async () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      await act(async () => {
        await result.current.setHandedness(HandednessMode.right);
      });

      expect(result.current.handednessMode).toBe(HandednessMode.right);
    });

    test('can switch to toggle mode', async () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      await act(async () => {
        await result.current.setHandedness(HandednessMode.toggle);
      });

      expect(result.current.handednessMode).toBe(HandednessMode.toggle);
    });

    test('persists handedness to AsyncStorage', async () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      await act(async () => {
        await result.current.setHandedness(HandednessMode.right);
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      const stored = await AsyncStorage.getItem('careconnect:settings_v1:handedness');
      expect(stored).toBe(HandednessMode.right);
    });
  });

  describe('text size settings', () => {
    test('starts with medium text size by default', () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      expect(result.current.textSizeMode).toBe(TextSizeMode.medium);
    });

    test('can change to small text size', async () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      await act(async () => {
        await result.current.setTextSize(TextSizeMode.small);
      });

      expect(result.current.textSizeMode).toBe(TextSizeMode.small);
    });

    test('can change to large text size', async () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      await act(async () => {
        await result.current.setTextSize(TextSizeMode.large);
      });

      expect(result.current.textSizeMode).toBe(TextSizeMode.large);
    });

    test('persists text size to AsyncStorage', async () => {
      const { result } = renderHook(() => useAppSettings(), { wrapper });

      await act(async () => {
        await result.current.setTextSize(TextSizeMode.large);
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      const stored = await AsyncStorage.getItem('careconnect:settings_v1:text_size');
      expect(stored).toBe(TextSizeMode.large);
    });
  });

  describe('HandednessMode enum', () => {
    test('contains all handedness modes', () => {
      expect(HandednessMode.left).toBe('left');
      expect(HandednessMode.right).toBe('right');
      expect(HandednessMode.toggle).toBe('toggle');
    });
  });

  describe('TextSizeMode enum', () => {
    test('contains all text size modes', () => {
      expect(TextSizeMode.small).toBe('small');
      expect(TextSizeMode.medium).toBe('medium');
      expect(TextSizeMode.large).toBe('large');
    });
  });

  describe('ReminderFrequency enum', () => {
    test('contains all reminder frequency options', () => {
      expect(ReminderFrequency.daily).toBe('daily');
      expect(ReminderFrequency.weekly).toBe('weekly');
      expect(ReminderFrequency.custom).toBe('custom');
    });
  });

  describe('settings persistence', () => {
    test('loads persisted handedness on mount', async () => {
      // Set a value in AsyncStorage before rendering
      await AsyncStorage.setItem('careconnect:settings_v1:handedness', HandednessMode.right);

      const { result } = renderHook(() => useAppSettings(), { wrapper });

      // Wait for async load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.handednessMode).toBe(HandednessMode.right);
    });

    test('loads persisted text size on mount', async () => {
      await AsyncStorage.setItem('careconnect:settings_v1:text_size', TextSizeMode.large);

      const { result } = renderHook(() => useAppSettings(), { wrapper });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.textSizeMode).toBe(TextSizeMode.large);
    });
  });
});
