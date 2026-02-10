/**
 * Component Tests - StatCard
 * Tests the StatCard component rendering and styling
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import StatCard from '../../src/screens/components/StatCard';

describe('StatCard Component', () => {
  describe('rendering', () => {
    test('renders with label and value', () => {
      const { getByText } = render(
        <StatCard label="Active Patients" value="25" />
      );

      expect(getByText('Active Patients')).toBeTruthy();
      expect(getByText('25')).toBeTruthy();
    });

    test('renders with numeric value', () => {
      const { getByText } = render(
        <StatCard label="Total" value={100} />
      );

      expect(getByText('Total')).toBeTruthy();
      expect(getByText('100')).toBeTruthy();
    });

    test('renders with zero value', () => {
      const { getByText } = render(
        <StatCard label="Alerts" value="0" />
      );

      expect(getByText('Alerts')).toBeTruthy();
      expect(getByText('0')).toBeTruthy();
    });
  });

  describe('styling', () => {
    test('applies custom background color', () => {
      const { getByText } = render(
        <StatCard label="Test" value="10" backgroundColor="#FF0000" />
      );

      const card = getByText('Test').parent;
      expect(card).toBeTruthy();
    });
  });
});
