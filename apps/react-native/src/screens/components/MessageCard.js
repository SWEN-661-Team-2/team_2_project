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

  // Define unread status for the accessibility label
  const statusPrefix = message.unread ? 'Unread message' : 'Message';
  const accessibilityLabel = `${statusPrefix} from ${message.sender}, subject: ${message.subject}. Sent on ${timestampText}. Preview: ${message.preview}`;

  const unreadIndicator = message.unread ? (
    <View 
      style={styles.unreadDot} 
      importantForAccessibility="no-hide-descendants" // Hide the dot itself from accessibility tree
    />
  ) : (
    <View style={styles.readDot} />
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
      // Accessibility Props
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Double tap to open this message"
      accessibilityState={{
        // Using 'selected' to indicate unread/read state is a common pattern
        selected: message.unread 
      }}
    >
      <View
        style={[
          styles.content,
          isLeftHanded && styles.contentReversed,
        ]}
      >
        {isLeftHanded && unreadIndicator}

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

        {!isLeftHanded && unreadIndicator}
      </View>
    </TouchableOpacity>
  );
}