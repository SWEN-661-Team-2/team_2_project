/**
 * Component Tests - SectionHeader  
 * Tests the SectionHeader component rendering
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import SectionHeader from '../../src/screens/components/SectionHeader';

describe('SectionHeader Component', () => {
  describe('rendering', () => {
    test('renders with title', () => {
      const { getByText } = render(
        <SectionHeader title="Patients" />
      );

      expect(getByText('Patients')).toBeTruthy();
    });

    test('renders with different titles', () => {
      const { getByText: getByText1 } = render(
        <SectionHeader title="Messages" />
      );
      expect(getByText1('Messages')).toBeTruthy();

      const { getByText: getByText2 } = render(
        <SectionHeader title="Tasks" />
      );
      expect(getByText2('Tasks')).toBeTruthy();
    });

    test('renders with long title', () => {
      const longTitle = 'This is a very long section header title';
      const { getByText } = render(
        <SectionHeader title={longTitle} />
      );

      expect(getByText(longTitle)).toBeTruthy();
    });

    test('renders with empty title', () => {
      const { getByText } = render(
        <SectionHeader title="" />
      );

      // Component should still render
      expect(getByText('')).toBeTruthy();
    });
  });
});
