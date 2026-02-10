import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useHandedness } from '../contexts/AppProviders';

export default function HandednessToggleOverlay() {
  const { handednessMode, isLeftHanded, toggleHandedness } = useHandedness();

  if (handednessMode !== 'toggle') {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={toggleHandedness}
        activeOpacity={0.7}
      >
        <Text style={[styles.arrow, isLeftHanded && styles.arrowActive]}>
          {'<<'}
        </Text>
        <Text style={[styles.arrow, !isLeftHanded && styles.arrowActive]}>
          {'>>'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    zIndex: 9999,
  },
  toggleButton: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    gap: 16,
  },
  arrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  arrowActive: {
    color: '#0A7A8A',
  },
});
