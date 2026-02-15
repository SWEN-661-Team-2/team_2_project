// /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/react-native/__tests__/components/PatientRow.test.js

/**
 * Component Tests - PatientRow
 * Tests the PatientRow component rendering and interactions
 */
import { fireEvent, render } from '@testing-library/react-native';
import PatientRow from '../../src/screens/components/PatientRow';

// Avoid assuming Patient is a class constructor; supply the shape PatientRow reads.
const makePatient = (overrides = {}) => ({
  id: overrides.id ?? 'p-1',
  firstName: overrides.firstName ?? 'John',
  lastName: overrides.lastName ?? 'Doe',
  name: overrides.name ?? `${overrides.firstName ?? 'John'} ${overrides.lastName ?? 'Doe'}`,
  criticality: overrides.criticality ?? null,
  nextVisit: overrides.nextVisit ?? null,
  ...overrides,
});

const getPressTarget = (screen, fallbackNameRegex) => {
  const buttons = screen.queryAllByRole?.('button') ?? [];
  if (buttons.length) return buttons[0];

  const a11y = screen.queryByA11yLabel?.(/patient/i);
  if (a11y) return a11y;

  const nameNode = screen.queryByText?.(fallbackNameRegex);
  if (nameNode) return nameNode;

  throw new Error('No press target found for PatientRow');
};

describe('PatientRow Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe('rendering', () => {
    test('renders patient name', () => {
      const patient = makePatient({ firstName: 'John', lastName: 'Doe' });
      const { queryByText } = render(<PatientRow patient={patient} onPress={mockOnPress} />);

      expect(queryByText(/John\s+Doe|Doe,\s*John/i)).toBeTruthy();
    });

    test('renders patient with criticality', () => {
      const patient = makePatient({ firstName: 'Jane', lastName: 'Smith', criticality: 'HIGH' });
      const { queryByText } = render(<PatientRow patient={patient} onPress={mockOnPress} />);

      expect(queryByText(/Jane\s+Smith|Smith,\s*Jane/i)).toBeTruthy();
    });

    test('renders patient with next visit date', () => {
      const patient = makePatient({
        firstName: 'Bob',
        lastName: 'Johnson',
        nextVisit: new Date('2024-03-20'),
      });

      const { queryByText } = render(<PatientRow patient={patient} onPress={mockOnPress} />);
      expect(queryByText(/Bob\s+Johnson|Johnson,\s*Bob/i)).toBeTruthy();
    });
  });

  describe('interactions', () => {
    test('calls onPress when tapped', () => {
      const patient = makePatient({ firstName: 'Alice', lastName: 'Brown' });
      const screen = render(<PatientRow patient={patient} onPress={mockOnPress} />);

      const target = getPressTarget(screen, /Alice\s+Brown|Brown,\s*Alice/i);
      fireEvent.press(target);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
      expect(mockOnPress).toHaveBeenCalledWith(expect.objectContaining({ firstName: 'Alice', lastName: 'Brown' }));
    });

    test('handles multiple taps', () => {
      const patient = makePatient({ firstName: 'Charlie', lastName: 'Wilson' });
      const screen = render(<PatientRow patient={patient} onPress={mockOnPress} />);

      const target = getPressTarget(screen, /Charlie\s+Wilson|Wilson,\s*Charlie/i);
      fireEvent.press(target);
      fireEvent.press(target);
      fireEvent.press(target);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });
});