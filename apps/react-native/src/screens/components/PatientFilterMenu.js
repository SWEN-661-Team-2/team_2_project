/**
 * Patient Filter Menu Component
 * Bottom sheet modal for filtering patients by view mode
 * Equivalent to Flutter's filter bottom sheet
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { PatientViewMode } from '../contexts/PatientsContext';

const PatientFilterMenu = ({ visible, onClose, viewMode, onViewModeChange }) => {
  const filterOptions = [
    { label: 'All Patients', value: PatientViewMode.ALL },
    { label: 'Needing Attention', value: PatientViewMode.NEEDING_ATTENTION },
    { label: 'Upcoming Visits', value: PatientViewMode.UPCOMING_VISITS },
  ];

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.container}>
        <View style={styles.handle} />
        <View style={styles.content}>
          <Text style={styles.title}>Filter Patients</Text>

          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                viewMode === option.value && styles.optionSelected,
              ]}
              onPress={() => {
                onViewModeChange(option.value);
                onClose();
              }}
              testID={`filter_option_${option.value}`}
            >
              <View
                style={[
                  styles.radio,
                  viewMode === option.value && styles.radioSelected,
                ]}
              >
                {viewMode === option.value && (
                  <View style={styles.radioDot} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  viewMode === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            testID="filter_close_button"
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    maxHeight: '60%',
  },
  handle: {
    height: 4,
    width: 40,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: '#E3F2FD',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0A7A8A',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#0A7A8A',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0A7A8A',
  },
  optionText: {
    fontSize: 15,
    color: '#666666',
  },
  optionTextSelected: {
    color: '#0A7A8A',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#F7FAFB',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0A7A8A',
  },
});

export default PatientFilterMenu;
