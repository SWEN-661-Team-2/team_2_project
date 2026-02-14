/**
 * Component Tests - ProfileScreen
 * Tests profile display, editing, and photo upload functionality with Accessibility
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

// Fixed factory mock to ensure stable references
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
  setOptions: jest.fn(),
};

const renderProfileScreen = (nav = mockNavigation) => {
  return render(
    <AppProviders>
      <ProfileProvider>
        <ProfileScreen navigation={nav} />
      </ProfileProvider>
    </AppProviders>
  );
};

describe('ProfileScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Use .mockResolvedValue instead of re-assigning jest.fn()
    ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({
      status: 'granted',
    });
    
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test-photo.jpg' }],
    });
  });

  describe('rendering & accessibility', () => {
    test('renders profile screen with title as a header', async () => {
      const { getByRole } = renderProfileScreen();
      await waitFor(() => {
        expect(getByRole('header', { name: /profile information/i })).toBeTruthy();
      });
    });

    test('renders accessible back button', async () => {
      const { getByRole } = renderProfileScreen();
      await waitFor(() => {
        expect(getByRole('button', { name: /go back/i })).toBeTruthy();
      });
    });

    test('back button navigates back if possible', async () => {
      const { getByRole } = renderProfileScreen();
      
      await waitFor(() => {
        const backButton = getByRole('button', { name: /go back/i });
        fireEvent.press(backButton);
      });

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });

    test('back button navigates to Settings if cannot go back', async () => {
      const altNav = { ...mockNavigation, canGoBack: () => false };
      const { getByRole } = renderProfileScreen(altNav);
      
      await waitFor(() => {
        const backButton = getByRole('button', { name: /go back/i });
        fireEvent.press(backButton);
      });

      expect(altNav.navigate).toHaveBeenCalledWith('Settings');
    });
  });

  describe('edit mode', () => {
    test('enters edit mode when edit button is pressed', async () => {
      const { getByRole, getByTestId } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId('profile_edit');
        fireEvent.press(editButton);
      });

      await waitFor(() => {
        expect(getByRole('button', { name: /save profile changes/i })).toBeTruthy();
        expect(getByRole('button', { name: /cancel editing/i })).toBeTruthy();
      });
    });

    test('cancel button exits edit mode without saving', async () => {
      const { getByTestId, getByRole } = renderProfileScreen();

      await waitFor(() => fireEvent.press(getByTestId('profile_edit')));

      await waitFor(() => {
        const cancelButton = getByRole('button', { name: /cancel editing/i });
        fireEvent.press(cancelButton);
      });

      await waitFor(() => {
        expect(getByTestId('profile_edit')).toBeTruthy();
      });
    });

    test('save button saves profile and exits edit mode', async () => {
      const { getByTestId, getByRole } = renderProfileScreen();

      await waitFor(() => fireEvent.press(getByTestId('profile_edit')));

      await waitFor(() => {
        const saveButton = getByRole('button', { name: /save profile changes/i });
        fireEvent.press(saveButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Profile saved');
      });
    });
  });

  describe('profile fields', () => {
    test('allows editing name field via accessibility label', async () => {
      const { getByTestId, getByLabelText } = renderProfileScreen();

      await waitFor(() => fireEvent.press(getByTestId('profile_edit')));

      await waitFor(() => {
        const nameInput = getByLabelText('Full Name');
        fireEvent.changeText(nameInput, 'John Doe');
        expect(nameInput.props.value).toBe('John Doe');
      });
    });

    test('allows editing email field via accessibility label', async () => {
      const { getByTestId, getByLabelText } = renderProfileScreen();

      await waitFor(() => fireEvent.press(getByTestId('profile_edit')));

      await waitFor(() => {
        const emailInput = getByLabelText('Email Address');
        fireEvent.changeText(emailInput, 'john@example.com');
        expect(emailInput.props.value).toBe('john@example.com');
      });
    });
  });

  describe('photo upload', () => {
    test('allows photo selection in edit mode', async () => {
      const { getByRole, getByTestId } = renderProfileScreen();

      await waitFor(() => fireEvent.press(getByTestId('profile_edit')));

      await waitFor(() => {
        const photoButton = getByRole('button', { name: /change profile photo/i });
        fireEvent.press(photoButton);
      });

      await waitFor(() => {
        expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      });
    });

    test('shows alert when permission is denied', async () => {
      // Use mockResolvedValueOnce to override the default "granted" state
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
        status: 'denied',
      });

      const { getByRole, getByTestId } = renderProfileScreen();

      await waitFor(() => fireEvent.press(getByTestId('profile_edit')));

      await waitFor(() => {
        const photoButton = getByRole('button', { name: /change profile photo/i });
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