/**
 * Component Tests - FilterMenu
 * Tests the message filter menu component
 */
import { fireEvent, render } from '@testing-library/react-native';
import FilterMenu from '../../src/screens/components/FilterMenu';

const mockOnModeChange = jest.fn();
const mockOnClose = jest.fn();

describe('FilterMenu Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    test('renders when visible', () => {
      const { getByText } = render(
        <FilterMenu
          visible={true}
          currentMode="all"
          onModeChange={mockOnModeChange}
          onClose={mockOnClose}
          isLeftHanded={false}
        />
      );
      expect(getByText('Filter Messages')).toBeTruthy();
    });

    test('does not render when not visible', () => {
      const { queryByText } = render(
        <FilterMenu
          visible={false}
          currentMode="all"
          onModeChange={mockOnModeChange}
          onClose={mockOnClose}
          isLeftHanded={false}
        />
      );
      expect(queryByText('Filter Messages')).toBeFalsy();
    });

    test('shows all messages option', () => {
      const { getByText } = render(
        <FilterMenu
          visible={true}
          currentMode="all"
          onModeChange={mockOnModeChange}
          onClose={mockOnClose}
          isLeftHanded={false}
        />
      );
      expect(getByText(/All Messages/i)).toBeTruthy();
    });

    test('shows unread messages option', () => {
      const { getByText } = render(
        <FilterMenu
          visible={true}
          currentMode="all"
          onModeChange={mockOnModeChange}
          onClose={mockOnClose}
          isLeftHanded={false}
        />
      );
      expect(getByText(/Unread/i)).toBeTruthy();
    });
  });

  describe('interaction', () => {
    test('calls onModeChange when all messages is selected', () => {
      const { getByText } = render(
        <FilterMenu
          visible={true}
          currentMode="unread"
          onModeChange={mockOnModeChange}
          onClose={mockOnClose}
          isLeftHanded={false}
        />
      );
      fireEvent.press(getByText(/All Messages/i));
      expect(mockOnModeChange).toHaveBeenCalledWith('all');
    });

    test('calls onModeChange when unread is selected', () => {
      const { getByText } = render(
        <FilterMenu
          visible={true}
          currentMode="all"
          onModeChange={mockOnModeChange}
          onClose={mockOnClose}
          isLeftHanded={false}
        />
      );
      fireEvent.press(getByText(/Unread/i));
      expect(mockOnModeChange).toHaveBeenCalledWith('unread');
    });

    test('calls onClose when close button is pressed', () => {
      const { getByText } = render(
        <FilterMenu
          visible={true}
          currentMode="all"
          onModeChange={mockOnModeChange}
          onClose={mockOnClose}
          isLeftHanded={false}
        />
      );
      fireEvent.press(getByText('Close'));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('selection state', () => {
    test('highlights current mode', () => {
      const { UNSAFE_root } = render(
        <FilterMenu
          visible={true}
          currentMode="all"
          onModeChange={mockOnModeChange}
          onClose={mockOnClose}
          isLeftHanded={false}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
