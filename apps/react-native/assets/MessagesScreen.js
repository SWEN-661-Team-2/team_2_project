import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MessagesRepository } from '../data/MessagesRepository';

/**
 * Messages Screen
 * Displays all messages with unread count
 */
export default function MessagesScreen({ route }) {
  const messagesRepo = MessagesRepository.instance;
  const mode = route?.params?.mode || 'all';
  
  const messages = mode === 'unread' 
    ? messagesRepo.unreadMessages()
    : messagesRepo.allMessages();

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  const MessageItem = ({ message }) => (
    <TouchableOpacity
      style={[
        styles.messageCard,
        !message.read && styles.messageUnread,
      ]}
    >
      <View style={styles.messageHeader}>
        <Text style={styles.messageFrom}>{message.from}</Text>
        <Text style={styles.messageDate}>{formatDate(message.date)}</Text>
      </View>
      <Text style={styles.messageSubject}>{message.subject}</Text>
      {!message.read && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>NEW</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>
          {mode === 'unread' ? 'Unread Messages' : 'All Messages'}
        </Text>
      </View>

      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageItem message={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No messages</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  list: {
    padding: 16,
  },
  messageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  messageUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#0A7A8A',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageFrom: {
    fontSize: 16,
    fontWeight: '600',
  },
  messageDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  messageSubject: {
    fontSize: 15,
    color: '#374151',
  },
  unreadBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#0A7A8A',
    borderRadius: 4,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 32,
    fontSize: 16,
  },
});
