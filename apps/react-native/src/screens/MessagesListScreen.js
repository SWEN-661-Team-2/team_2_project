import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMessages } from '../contexts/MessagesContext';
import { useHandedness } from '../contexts/AppProviders';
import MessageCard from './components/MessageCard';
import FilterMenu from './components/FilterMenu';
import HandednessToggleOverlay from '../components/HandednessToggleOverlay';

/**
 * Messages List Screen - WK6 Accessibility Hardened
 * Features: Screen reader labels, Header roles, and Left-Handed layout support.
 */
export default function MessagesListScreen({ navigation, route }) {
  const { messages, viewMode, setViewMode } = useMessages();
  const { isLeftHanded } = useHandedness();
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  React.useEffect(() => {
    if (route?.params?.viewMode) {
      setViewMode(route.params.viewMode);
    }
  }, [route?.params?.viewMode, setViewMode]);

  const getTitle = () => {
    return viewMode === 'all' ? 'Messages' : 'Messages / Unread';
  };

  const handleFilterPress = () => setFilterModalVisible(true);
  const handleBackPress = () => navigation.goBack();
  const handleModeChange = (mode) => {
    setViewMode(mode);
    setFilterModalVisible(false);
  };

  const handleMessagePress = (message) => {
    navigation.navigate('MessageDetail', { message });
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
    <View style={styles.emptyContainer} accessibilityRole="summary">
      <Text style={styles.emptyText}>No messages</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View
        style={[styles.header, isLeftHanded && styles.headerReversed]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          accessibilityHint="Returns to the previous screen"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backIcon} importantForAccessibility="no-hide-descendants">←</Text>
        </TouchableOpacity>

        <Text 
          style={styles.title} 
          accessibilityRole="header"
        >
          {getTitle()}
        </Text>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}
          accessibilityLabel="Filter messages"
          accessibilityRole="button"
          accessibilityHint="Opens a menu to filter by read or unread status"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.filterIcon} importantForAccessibility="no-hide-descendants">☰</Text>
        </TouchableOpacity>
      </View>

      {/* List Content */}
      <View style={{ flex: 1 }}>
        {messages.length > 0 ? (
          <FlatList
            testID="messages_list"
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            // Accessibility: Announce when the list is refreshed or updated
            accessibilityRole="list"
            accessibilityLabel={`List of ${messages.length} messages`}
          />
        ) : (
          emptyListComponent()
        )}
      </View>

      {/* Overlays */}
      <FilterMenu
        visible={filterModalVisible}
        currentMode={viewMode}
        onModeChange={handleModeChange}
        onClose={() => setFilterModalVisible(false)}
        isLeftHanded={isLeftHanded}
      />
      <HandednessToggleOverlay />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFB' },
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
  headerReversed: { flexDirection: 'row-reverse' },
  backButton: { padding: 8 },
  backIcon: { fontSize: 22, color: '#0A7A8A' },
  title: { fontSize: 18, fontWeight: '600', color: '#333' },
  filterButton: { padding: 8 },
  filterIcon: { fontSize: 24, color: '#0A7A8A' },
  listContent: { paddingHorizontal: 16, paddingVertical: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },
});