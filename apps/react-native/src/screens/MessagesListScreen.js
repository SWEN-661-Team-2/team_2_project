/**
 * Messages List Screen
 * Equivalent to Flutter's MessagesListScreen
 * 
 * Displays messages with filtering options (all/unread)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMessages } from '../contexts/MessagesContext';
import { useHandedness } from '../contexts/AppProviders';
import MessageCard from './components/MessageCard';
import FilterMenu from './components/FilterMenu';

export default function MessagesListScreen({ navigation, route }) {
  const { messages, viewMode, setViewMode, unreadCount } = useMessages();
  const { isLeftHanded } = useHandedness();
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Get initial view mode from route params if provided
  React.useEffect(() => {
    if (route?.params?.viewMode) {
      setViewMode(route.params.viewMode);
    }
  }, [route?.params?.viewMode, setViewMode]);

  const getTitle = () => {
    return viewMode === 'all' ? 'Messages' : 'Messages / Unread';
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleModeChange = (mode) => {
    setViewMode(mode);
    setFilterModalVisible(false);
  };

  const handleMessagePress = (message) => {
    // Serialize the message to avoid non-serializable warning
    const serializedMessage = {
      ...message,
      sentAt: message.sentAt?.toISOString(),
    };
    navigation.navigate('MessageDetail', { message: serializedMessage });
  };

  const renderMessageItem = ({ item, index }) => (
    <MessageCard
      key={`message-${item.id}`}
      message={item}
      index={index}
      onPress={() => handleMessagePress(item)}
    />
  );

  const emptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No messages</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with filter/back button */}
      <View
        style={[
          styles.header,
          isLeftHanded && styles.headerReversed,
        ]}
      >
        <Text style={styles.title}>{getTitle()}</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      {messages.length > 0 ? (
        <FlatList
          testID="messages_list"
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          scrollIndicatorInsets={{ right: 1 }}
        />
      ) : (
        emptyListComponent()
      )}

      {/* Filter Modal */}
      <FilterMenu
        visible={filterModalVisible}
        currentMode={viewMode}
        onModeChange={handleModeChange}
        onClose={() => setFilterModalVisible(false)}
        isLeftHanded={isLeftHanded}
      />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerReversed: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  filterButton: {
    padding: 8,
    marginHorizontal: -8,
  },
  filterIcon: {
    fontSize: 24,
    color: '#0A7A8A',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
