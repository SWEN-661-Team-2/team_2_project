import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { formatDtYmdHmm } from '../../utils/dtFormat';
import { useHandedness } from '../../contexts/AppProviders';

export default function MessageCard({ message, index, onPress }) {
  const { isLeftHanded } = useHandedness();

  const timestampText = formatDtYmdHmm(message.sentAt);

  const statusPrefix = message.unread ? 'Unread message' : 'Message';
  const accessibilityLabel = `${statusPrefix} from ${message.sender}, subject: ${message.subject}. Sent on ${timestampText}. Preview: ${message.preview}`;

  // We define this as a helper function or render it inline to avoid 
  // ReferenceErrors with the 'styles' object defined at the bottom.
  const renderUnreadIndicator = () => (
    message.unread ? (
      <View 
        style={styles.unreadDot} 
        importantForAccessibility="no-hide-descendants" 
      />
    ) : (
      <View style={styles.readDot} />
    )
  );

  return (
    <TouchableOpacity
      testID={`message_${index}`}
      style={[
        styles.card,
        message.unread && styles.cardUnread,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Double tap to open this message"
      accessibilityState={{
        selected: !!message.unread 
      }}
    >
      <View
        style={[
          styles.content,
          isLeftHanded && styles.contentReversed,
        ]}
      >
        {isLeftHanded && renderUnreadIndicator()}

        <View style={styles.messageInfo}>
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.sender,
                message.unread && styles.senderUnread,
              ]}
              numberOfLines={1}
            >
              {message.sender}
            </Text>
            <Text
              style={styles.timestamp}
              numberOfLines={1}
            >
              {timestampText}
            </Text>
          </View>

          <Text
            style={[
              styles.subject,
              message.unread && styles.subjectUnread,
            ]}
            numberOfLines={1}
          >
            {message.subject}
          </Text>

          <Text
            style={styles.preview}
            numberOfLines={2}
          >
            {message.preview}
          </Text>
        </View>

        {!isLeftHanded && renderUnreadIndicator()}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  cardUnread: {
    backgroundColor: '#E3F2FD',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contentReversed: {
    flexDirection: 'row-reverse',
  },
  messageInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sender: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  senderUnread: {
    fontWeight: '700',
    color: '#1976D2',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
    flexShrink: 1,
  },
  subject: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 2,
  },
  subjectUnread: {
    fontWeight: '600',
    color: '#333',
  },
  preview: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1976D2',
    marginTop: 4,
  },
  readDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
    marginTop: 4,
  },
});