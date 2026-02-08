/**
 * Message Detail Screen
 * Displays full message content
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Share,
} from 'react-native';
import { formatDtYmdHmm } from '../utils/dtFormat';
import { useHandedness } from '../contexts/AppProviders';

export default function MessageDetailScreen({ navigation, route }) {
  const { message } = route.params;
  const { isLeftHanded } = useHandedness();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${message.subject}\n\n${message.preview}`,
        title: message.subject,
      });
    } catch (error) {
      console.error('Error sharing message:', error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          isLeftHanded && styles.headerReversed,
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {message.subject}
        </Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Text style={styles.shareIcon}>↗</Text>
        </TouchableOpacity>
      </View>

      {/* Message Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Message Metadata */}
        <View style={styles.metadata}>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>From:</Text>
            <Text style={styles.metadataValue}>{message.sender}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Subject:</Text>
            <Text style={styles.metadataValue}>{message.subject}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Date:</Text>
            <Text style={styles.metadataValue}>
              {formatDtYmdHmm(message.sentAt)}
            </Text>
          </View>
        </View>

        {/* Message Body */}
        <View style={styles.messageBody}>
          <Text style={styles.preview}>{message.preview}</Text>
          
          {/* Additional content area for future expansion */}
          <Text style={styles.fullContent}>
            {message.preview}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerReversed: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    padding: 8,
    marginHorizontal: -8,
  },
  backIcon: {
    fontSize: 24,
    color: '#0A7A8A',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 8,
  },
  shareButton: {
    padding: 8,
    marginHorizontal: -8,
  },
  shareIcon: {
    fontSize: 20,
    color: '#0A7A8A',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  metadata: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metadataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 80,
  },
  metadataValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  messageBody: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  preview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  fullContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
});
