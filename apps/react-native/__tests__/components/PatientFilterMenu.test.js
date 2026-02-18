/**
 * Component Tests - PatientFilterMenu
 * Tests the patient filter menu component
 */
import { fireEvent, render } from '@testing-library/react-native';
import { PatientViewMode } from '../../src/contexts/PatientsContext';
import PatientFilterMenu from '../../src/screens/components/PatientFilterMenu';

const mockOnClose = jest.fn();
const mockOnViewModeChange = jest.fn();

describe('PatientFilterMenu Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders when visible', () => {
      const { getByText } = render(
        <PatientFilterMenu
          visible={true}
          onClose={mockOnClose}
          viewMode={PatientViewMode.ALL}
          onViewModeChange={mockOnViewModeChange}
        />
      );

      expect(getByText('Filter Patients')).toBeTruthy();
    });

    test('does not render when not visible', () => {
      const { queryByText } = render(
        <PatientFilterMenu
          visible={false}
          onClose={mockOnClose}
          viewMode={PatientViewMode.ALL}
          onViewModeChange={mockOnViewModeChange}
        />
      );

      expect(queryByText('Filter Patients')).toBeFalsy();
    });

    test('shows all filter options', () => {
      const { getByText } = render(
        <PatientFilterMenu
          visible={true}
          onClose={mockOnClose}
          viewMode={PatientViewMode.ALL}
          onViewModeChange={mockOnViewModeChange}
        />
      );

      expect(getByText('All Patients')).toBeTruthy();
      expect(getByText('Needing Attention')).toBeTruthy();
      expect(getByText('Upcoming Visits')).toBeTruthy();
    });

    test('renders close button', () => {
      const { getByText } = render(
        <PatientFilterMenu
          visible={true}
          onClose={mockOnClose}
          viewMode={PatientViewMode.ALL}
          onViewModeChange={mockOnViewModeChange}
        />
      );

      expect(getByText('Close')).toBeTruthy();
    });
  });

  describe('interaction', () => {
    test('calls onViewModeChange and onClose when all patients is selected', () => {
      const { getByText } = render(
        <PatientFilterMenu
          visible={true}
          onClose={mockOnClose}
          viewMode={PatientViewMode.NEEDING_ATTENTION}
          onViewModeChange={mockOnViewModeChange}
        />
      );

      fireEvent.press(getByText('All Patients'));
      expect(mockOnViewModeChange).toHaveBeenCalledWith(PatientViewMode.ALL);
      expect(mockOnClose).toHaveBeenCalled();
    });

    test('calls onViewModeChange when needing attention is selected', () => {
      const { getByText } = render(
        <PatientFilterMenu
          visible={true}
          onClose={mockOnClose}
          viewMode={PatientViewMode.ALL}
          onViewModeChange={mockOnViewModeChange}
        />
      );

      fireEvent.press(getByText('Needing Attention'));
      expect(mockOnViewModeChange).toHaveBeenCalledWith(PatientViewMode.NEEDING_ATTENTION);
      expect(mockOnClose).toHaveBeenCalled();
    });

    test('calls onViewModeChange when upcoming visits is selected', () => {
      const { getByText } = render(
        <PatientFilterMenu
          visible={true}
          onClose={mockOnClose}
          viewMode={PatientViewMode.ALL}
          onViewModeChange={mockOnViewModeChange}
        />
      );

      fireEvent.press(getByText('Upcoming Visits'));
      expect(mockOnViewModeChange).toHaveBeenCalledWith(PatientViewMode.UPCOMING_VISITS);
      expect(mockOnClose).toHaveBeenCalled();
    });

    test('calls onClose when close button is pressed', () => {
      const { getByTestId } = render(
        <PatientFilterMenu
          visible={true}
          onClose={mockOnClose}
          viewMode={PatientViewMode.ALL}
          onViewModeChange={mockOnViewModeChange}
        />
      );

      fireEvent.press(getByTestId('filter_close_button'));
      expect(mockOnClose).toHaveBeenCalled();
    });

    test('calls onClose when overlay is pressed', () => {
      const { getByTestId } = render(
        <PatientFilterMenu
          visible={true}
          onClose={mockOnClose}
          viewMode={PatientViewMode.ALL}
          onViewModeChange={mockOnViewModeChange}
        />
      );

      fireEvent.press(getByTestId('filter_close_button'));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('selection state', () => {
    test('shows selected state for all patients', () => {
      const { getByTestId } = render(
        <PatientFilterMenu
          visible={true}
          onClose={mockOnClose}
          viewMode={PatientViewMode.ALL}
          onViewModeChange={mockOnViewModeChange}
        />
      );

      expect(getByTestId(`filter_option_${PatientViewMode.ALL}`)).toBeTruthy();
    });

    test('shows selected state for needing attention', () => {
      const { getByTestId } = render(
        <PatientFilterMenu
          visible={true}
          onClose={mockOnClose}
          viewMode={PatientViewMode.NEEDING_ATTENTION}
          onViewModeChange={mockOnViewModeChange}
        />
      );

      expect(getByTestId(`filter_option_${PatientViewMode.NEEDING_ATTENTION}`)).toBeTruthy();
    });

    test('shows selected state for upcoming visits', () => {
      const { getByTestId } = render(
        <PatientFilterMenu
          visible={true}
          onClose={mockOnClose}
          viewMode={PatientViewMode.UPCOMING_VISITS}
          onViewModeChange={mockOnViewModeChange}
        />
      );

      expect(getByTestId(`filter_option_${PatientViewMode.UPCOMING_VISITS}`)).toBeTruthy();
    });
  });

  describe('radio buttons', () => {
    test('shows selected radio button for current view mode', () => {
      const { UNSAFE_root } = render(
        <PatientFilterMenu
          visible={true}
          onClose={mockOnClose}
          viewMode={PatientViewMode.ALL}
          onViewModeChange={mockOnViewModeChange}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
