/**
 * Section Header Component
 * Displays a section title
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function SectionHeader({ title }) {
  return (
    <Text style={styles.title}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
});
