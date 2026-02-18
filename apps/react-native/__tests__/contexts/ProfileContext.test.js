/**
 * Context Tests - ProfileContext
 * Tests caregiver profile management context
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import * as FileSystem from 'expo-file-system';
import { ProfileProvider, useProfile } from '../../src/contexts/ProfileContext';
import CaregiverProfile from '../../src/models/CaregiverProfile';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///mock/documents/',
  makeDirectoryAsync: jest.fn(() => Promise.resolve()),
  copyAsync: jest.fn(() => Promise.resolve()),
}));

const wrapper = ({ children }) => <ProfileProvider>{children}</ProfileProvider>;

describe('ProfileContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    test('provides default profile', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      expect(result.current.profile).toBeInstanceOf(CaregiverProfile);
    });

    test('loads profile from storage on mount', async () => {
      const mockProfile = new CaregiverProfile({ name: 'John Doe' });
      AsyncStorage.getItem.mockResolvedValueOnce(
        JSON.stringify(mockProfile.toJson())
      );

      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('careconnect:caregiver_profile_v1');
      expect(result.current.profile.name).toBe('John Doe');
    });

    test('handles loading errors gracefully', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage error'));

      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    test('handles missing profile in storage', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      expect(result.current.profile).toBeInstanceOf(CaregiverProfile);
    });
  });

  describe('save', () => {
    test('saves profile to storage', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const newProfile = new CaregiverProfile({ name: 'Jane Smith' });

      await act(async () => {
        await result.current.save(newProfile);
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'careconnect:caregiver_profile_v1',
        JSON.stringify(newProfile.toJson())
      );
      expect(result.current.profile.name).toBe('Jane Smith');
    });

    test('handles save errors gracefully', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      AsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage error'));

      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const newProfile = new CaregiverProfile({ name: 'Error Test' });

      await act(async () => {
        await result.current.save(newProfile);
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('updateField', () => {
    test('updates specific profile fields', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.updateField({ name: 'Updated', phone: '555-1234' });
      });

      expect(result.current.profile.name).toBe('Updated');
      expect(result.current.profile.phone).toBe('555-1234');
    });

    test('preserves other fields when updating', async () => {
      const initialProfile = new CaregiverProfile({
        name: 'John',
        email: 'john@example.com',
      });
      AsyncStorage.getItem.mockResolvedValueOnce(
        JSON.stringify(initialProfile.toJson())
      );

      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.updateField({ name: 'Jane' });
      });

      expect(result.current.profile.name).toBe('Jane');
      expect(result.current.profile.email).toBe('john@example.com');
    });
  });

  describe('savePhoto', () => {
    test('saves photo to file system', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const mockUri = 'file:///mock/photo.jpg';
      let savedUri;

      await act(async () => {
        savedUri = await result.current.savePhoto(mockUri);
      });

      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalled();
      expect(FileSystem.copyAsync).toHaveBeenCalled();
      expect(savedUri).toContain('profile_photos/caregiver_');
    });

    test('handles null photo URI', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      let savedUri;

      await act(async () => {
        savedUri = await result.current.savePhoto(null);
      });

      expect(savedUri).toBeNull();
      expect(FileSystem.copyAsync).not.toHaveBeenCalled();
    });

    test('handles photo save errors', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      FileSystem.copyAsync.mockRejectedValueOnce(new Error('Copy failed'));

      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const mockUri = 'file:///mock/photo.jpg';
      let savedUri;

      await act(async () => {
        savedUri = await result.current.savePhoto(mockUri);
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(savedUri).toBe(mockUri);
      consoleWarnSpy.mockRestore();
    });

    test('creates directory if it does not exist', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      await act(async () => {
        await result.current.savePhoto('file:///mock/photo.jpg');
      });

      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        'file:///mock/documents/profile_photos/',
        { intermediates: true }
      );
    });

    test('generates unique filename with timestamp', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const mockUri = 'file:///mock/photo.jpg';
      let savedUri;

      await act(async () => {
        savedUri = await result.current.savePhoto(mockUri);
      });

      expect(savedUri).toMatch(/caregiver_\d+\.jpg$/);
    });
  });

  describe('load', () => {
    test('reloads profile from storage', async () => {
      const { result } = renderHook(() => useProfile(), { wrapper });

      await waitFor(() => {
        expect(result.current.loaded).toBe(true);
      });

      const newProfile = new CaregiverProfile({ name: 'Reloaded Profile' });
      AsyncStorage.getItem.mockResolvedValueOnce(
        JSON.stringify(newProfile.toJson())
      );

      await act(async () => {
        await result.current.load();
      });

      expect(result.current.profile.name).toBe('Reloaded Profile');
    });
  });

  describe('error handling', () => {
    test('throws error when used outside provider', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useProfile());
      }).toThrow('useProfile must be used within ProfileProvider');

      consoleErrorSpy.mockRestore();
    });
  });
});
