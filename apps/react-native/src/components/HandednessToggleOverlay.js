import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useHandedness } from '../contexts/AppProviders';

/**
 * Handedness Toggle Overlay
 * Floating button that appears on all screens (except Landing/Login) when Toggle Mode is active
 */
export default function HandednessToggleOverlay() {
  const { handednessMode, isLeftHanded, toggleHandedness } = useHandedness();

  // Only show when handedness mode is 'toggle'
  if (handednessMode !== 'toggle') {
    return null;
  }

  return (
    <View style={[
      styles.container,
      isLeftHanded ? styles.containerLeft : styles.containerRight,
    ]}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={toggleHandedness}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleIcon}>
          {isLeftHanded ? '👈' : '👉'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    marginTop: -30, // Half of button height
    zIndex: 9999,
  },
  containerLeft: {
    left: 10,
  },
  containerRight: {
    right: 10,
  },
  toggleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0A7A8A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  toggleIcon: {
    fontSize: 28,
  },
});
