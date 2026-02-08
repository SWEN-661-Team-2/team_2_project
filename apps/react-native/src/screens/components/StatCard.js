/**
 * Stat Card Component
 * Displays a KPI card with icon, value, and label
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

export default function StatCard({
  icon,
  value,
  label,
  onPress,
  testID,
}) {
  const windowWidth = Dimensions.get('window').width;
  const isSmallScreen = windowWidth < 400;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        isSmallScreen && styles.cardSmall,
      ]}
      testID={testID}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardSmall: {
    minWidth: 120,
    padding: 12,
  },
  iconContainer: {
    marginBottom: 8,
  },
  icon: {
    fontSize: 22,
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
});
