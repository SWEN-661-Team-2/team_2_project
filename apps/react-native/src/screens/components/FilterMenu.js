/**
 * Filter Menu Component
 * Modal for filtering messages (all/unread)
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function FilterMenu({
  visible,
  currentMode,
  onModeChange,
  onClose,
  isLeftHanded,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          <ScrollView
            style={styles.content}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Filter Messages</Text>

            {/* All Messages Option */}
            <TouchableOpacity
              style={[
                styles.option,
                currentMode === 'all' && styles.optionSelected,
              ]}
              onPress={() => onModeChange('all')}
            >
              <View
                style={[
                  styles.optionContent,
                  isLeftHanded && styles.optionContentReversed,
                ]}
              >
                <Text style={styles.optionIcon}>📧</Text>
                <Text
                  style={[
                    styles.optionText,
                    currentMode === 'all' && styles.optionTextSelected,
                  ]}
                >
                  All Messages
                </Text>
              </View>
            </TouchableOpacity>

            {/* Unread Only Option */}
            <TouchableOpacity
              style={[
                styles.option,
                currentMode === 'unread' && styles.optionSelected,
              ]}
              onPress={() => onModeChange('unread')}
            >
              <View
                style={[
                  styles.optionContent,
                  isLeftHanded && styles.optionContentReversed,
                ]}
              >
                <Text style={styles.optionIcon}>✉️</Text>
                <Text
                  style={[
                    styles.optionText,
                    currentMode === 'unread' && styles.optionTextSelected,
                  ]}
                >
                  Unread Only
                </Text>
              </View>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 16,
    maxHeight: '80%',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  content: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  option: {
    paddingVertical: 12,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionContentReversed: {
    flexDirection: 'row-reverse',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#1976D2',
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#0A7A8A',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
