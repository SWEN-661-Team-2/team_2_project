/**
 * Component Tests - ProfileScreen
 * Tests profile display, editing, and photo upload functionality
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ProfileScreen from '../../src/screens/ProfileScreen';
import { ProfileProvider } from '../../src/contexts/ProfileContext';
import { AppProviders } from '../../src/contexts/AppProviders';

// Mock dependencies
jest.spyOn(Alert, 'alert');
jest.mock('expo-image-picker');

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
};

const renderProfileScreen = () => {
  return render(
    <AppProviders>
      <ProfileProvider>
        <ProfileScreen navigation={mockNavigation} />
      </ProfileProvider>
    </AppProviders>
  );
};

describe('ProfileScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ImagePicker.requestMediaLibraryPermissionsAsync = jest.fn().mockResolvedValue({
      status: 'granted',
    });
    ImagePicker.launchImageLibraryAsync = jest.fn().mockResolvedValue({
      cancelled: false,
      uri: 'file://test-photo.jpg',
    });
  });

  describe('rendering', () => {
    test('renders profile screen with title', async () => {
      const { getByText } = renderProfileScreen();

      await waitFor(() => {
        expect(getByText('Profile information')).toBeTruthy();
      });
    });

    test('renders back button', async () => {
      const { getByText } = renderProfileScreen();

      await waitFor(() => {
        expect(getByText('←')).toBeTruthy();
      });
    });

    test('back button navigates back', async () => {
      const { getByText } = renderProfileScreen();
      
      await waitFor(() => {
        const backButton = getByText('←');
        fireEvent.press(backButton);
      });

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  describe('edit mode', () => {
    test('enters edit mode when edit button is pressed', async () => {
      const { getByTestId, getByText } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId('profile_edit');
        fireEvent.press(editButton);
      });

      await waitFor(() => {
        expect(getByText('Save')).toBeTruthy();
        expect(getByText('Cancel')).toBeTruthy();
      });
    });

    test('cancel button exits edit mode without saving', async () => {
      const { getByTestId, getByText } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId('profile_edit');
        fireEvent.press(editButton);
      });

      await waitFor(() => {
        const cancelButton = getByText('Cancel');
        fireEvent.press(cancelButton);
      });

      await waitFor(() => {
        expect(getByText('Edit Profile')).toBeTruthy();
      });
    });

    test('save button saves profile and exits edit mode', async () => {
      const { getByTestId, getByText } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId('profile_edit');
        fireEvent.press(editButton);
      });

      await waitFor(() => {
        const saveButton = getByText('Save');
        fireEvent.press(saveButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Profile saved');
      });
    });
  });

  describe('profile fields', () => {
    test('allows editing name field', async () => {
      const { getByTestId, getByPlaceholderText } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId('profile_edit');
        fireEvent.press(editButton);
      });

      await waitFor(() => {
        const nameInput = getByPlaceholderText('Name');
        fireEvent.changeText(nameInput, 'John Doe');
        expect(nameInput.props.value).toBe('John Doe');
      });
    });

    test('allows editing email field', async () => {
      const { getByTestId, getByPlaceholderText } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId('profile_edit');
        fireEvent.press(editButton);
      });

      await waitFor(() => {
        const emailInput = getByPlaceholderText('Email');
        fireEvent.changeText(emailInput, 'john@example.com');
        expect(emailInput.props.value).toBe('john@example.com');
      });
    });
  });

  describe('photo upload', () => {
    test('allows photo selection in edit mode', async () => {
      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId('profile_edit');
        fireEvent.press(editButton);
      });

      await waitFor(() => {
        const photoButton = getByTestId('profile_pick_photo');
        fireEvent.press(photoButton);
      });

      await waitFor(() => {
        expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      });
    });

    test('shows alert when permission is denied', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync = jest.fn().mockResolvedValue({
        status: 'denied',
      });

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId('profile_edit');
        fireEvent.press(editButton);
      });

      await waitFor(() => {
        const photoButton = getByTestId('profile_pick_photo');
        fireEvent.press(photoButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Permission required',
          'Need permission to pick images.'
        );
      });
    });
  });
});
