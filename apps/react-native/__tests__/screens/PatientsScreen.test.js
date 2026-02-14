import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PatientsScreen from '../../src/screens/PatientsScreen';
import * as PatientsContext from '../../src/contexts/PatientsContext';
import * as AppProviders from '../../src/contexts/AppProviders';

// Mock the contexts
jest.mock('../../src/contexts/PatientsContext', () => ({
  usePatients: jest.fn(),
  PatientViewMode: {
    ALL: 'all',
    NEEDING_ATTENTION: 'priority',
    UPCOMING_VISITS: 'visits'
  }
}));

jest.mock('../../src/contexts/AppProviders', () => ({
  useHandedness: jest.fn(),
}));

// Mock sub-components to keep tests focused on the Screen logic
jest.mock('../../src/screens/components/PatientCardComponents', () => {
 const React = require('react');
  const { View } = require('react-native');
  
  // Create the component for the default export
  const PriorityPatientCard = () => <View testID="priority-card" />;
  
  return {
    __esModule: true,
    // This maps to "import PriorityPatientCard"
    default: PriorityPatientCard, 
    // These map to "import { VisitPatientCard, PatientCard }"
    VisitPatientCard: () => <View testID="visit-card" />,
    PatientCard: () => <View testID="standard-card" />,
  };
})

jest.mock('../../src/screens/components/PatientFilterMenu', () => (props) => {
  const { View, TouchableOpacity } = require('react-native');
  return props.visible ? (
    <View testID="MockFilterMenu">
      <TouchableOpacity 
        testID="ChangeModeBtn" 
        onPress={() => props.onViewModeChange('priority')} 
      />
      <TouchableOpacity testID="CloseMenuBtn" onPress={props.onClose} />
    </View>
  ) : null;
});

describe('PatientsScreen Hardening & Accessibility', () => {
  const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
  const mockSetViewMode = jest.fn();
  const mockPatients = [
    { id: 'p1', fullName: 'John Doe', criticality: 'High' },
    { id: 'p2', fullName: 'Jane Smith', criticality: 'Low' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Default context values
    AppProviders.useHandedness.mockReturnValue({ isLeftHanded: false });
    PatientsContext.usePatients.mockReturnValue({
      viewMode: 'all',
      setViewMode: mockSetViewMode,
      patients: mockPatients,
    });
  });

test('renders correct title based on viewMode', () => {
    // Use the result object directly to avoid destructuring issues seen before
    const screen = render(<PatientsScreen navigation={mockNavigation} />);
    expect(screen.getByText('All Patients')).toBeTruthy();

    PatientsContext.usePatients.mockReturnValue({
      viewMode: 'priority',
      setViewMode: mockSetViewMode,
      patients: mockPatients,
    });
    
    // Use the rerender function correctly
    screen.rerender(<PatientsScreen navigation={mockNavigation} />);
    expect(screen.getByText('Needing Attention')).toBeTruthy();
  });

  test('toggles filter menu and updates view mode', () => {
    const { getByTestId } = render(<PatientsScreen navigation={mockNavigation} />);
    
    // Open menu
    fireEvent.press(getByTestId('patients_filter_button'));
    
    // Interact with mock menu
    fireEvent.press(getByTestId('ChangeModeBtn'));
    expect(mockSetViewMode).toHaveBeenCalledWith('priority');
  });

test('applies left-handed styles to header', () => {
    AppProviders.useHandedness.mockReturnValue({ isLeftHanded: true });
    const { getByTestId } = render(
      <PatientsScreen navigation={mockNavigation} />
    );

    // Find the header by its specific testID
    const header = getByTestId('screen_header');
    
    // Flatten styles to check for the injected property
    const flatStyle = Object.assign({}, ...[].concat(header.props.style));
      
    expect(flatStyle.flexDirection).toBe('row-reverse');
  });

  test('has correct accessibility labels for navigation', () => {
    const { getByLabelText } = render(<PatientsScreen navigation={mockNavigation} />);
    
    expect(getByLabelText('Go back')).toBeTruthy();
    expect(getByLabelText('Filter patients')).toBeTruthy();
  });

  test('shows empty state accessibility hint when list is empty', () => {
    PatientsContext.usePatients.mockReturnValue({
      viewMode: 'all',
      setViewMode: mockSetViewMode,
      patients: [],
    });

    const { getByText } = render(<PatientsScreen navigation={mockNavigation} />);
    expect(getByText('No patients found')).toBeTruthy();
  });

  test('handles back button press', () => {
    const { getByTestId } = render(<PatientsScreen navigation={mockNavigation} />);
    fireEvent.press(getByTestId('back_button'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});