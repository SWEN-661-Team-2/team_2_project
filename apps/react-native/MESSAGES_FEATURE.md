# React Native Messages Feature

## Overview

This document describes the React Native implementation of the messages feature from the Flutter app. The messages feature provides a complete messaging system with list filtering and message detail views.

## Architecture

### File Structure

```
src/
├── contexts/
│   ├── MessagesContext.js           # Messages state and operations
│   └── ...
├── repositories/
│   ├── MessagesRepository.js        # Message data (already exists)
│   └── ...
├── models/
│   ├── CaregiverMessage.js          # Message model (already exists)
│   └── ...
├── screens/
│   ├── MessagesListScreen.js        # Main messages list screen
│   ├── MessageDetailScreen.js       # Message detail view
│   ├── components/
│   │   ├── MessageCard.js           # Individual message card
│   │   └── FilterMenu.js            # Filter modal menu
│   └── ...
└── ...

App.js                              # Navigation setup
```

## Components

### 1. MessagesContext (`src/contexts/MessagesContext.js`)

Provides messages state and operations to all screens.

**Exported Hook**:
```javascript
const {
  messages,                 // Array of messages (filtered by viewMode)
  viewMode,                 // 'all' or 'unread'
  setViewMode,              // Change view mode
  unreadCount,              // Number of unread messages
  handleMarkAsRead,         // Mark message as read (placeholder)
  handleMarkAsUnread,       // Mark message as unread (placeholder)
  handleDeleteMessage,      // Delete message (placeholder)
  messagesRepository,       // Direct repository access
} = useMessages();
```

**State Variables**:
- `viewMode` - Current filter mode (all/unread)
- Messages are derived from repository based on viewMode

### 2. MessagesListScreen (`src/screens/MessagesListScreen.js`)

Main screen displaying filtered messages with filter options.

**Features**:
- View all messages or unread only
- Filter menu (bottom sheet modal)
- Message list with infinite scroll
- Empty state message
- Handedness support (left/right alignment)
- Navigation to message detail
- Pull-to-refresh support (future enhancement)

**Test IDs**:
- `messages_list` - Main FlatList component
- `message_<index>` - Individual message rows

**Navigation Parameters**:
- `viewMode` - Initial view mode (can be 'all' or 'unread')

### 3. MessageDetailScreen (`src/screens/MessageDetailScreen.js`)

Displays full message content with metadata.

**Features**:
- Full message display
- Message metadata (from, subject, date)
- Share message capability
- Back navigation
- Handedness support
- Formatted timestamps

**Navigation Parameters**:
- `message` - Full CaregiverMessage object

### 4. MessageCard Component (`src/screens/components/MessageCard.js`)

Displays a single message in the list.

**Features**:
- Sender name
- Message subject
- Preview text (2 lines)
- Timestamp
- Unread indicator (blue dot)
- Unread styling (light blue background)
- Handedness support (indicator position)

**Props**:
```javascript
<MessageCard
  message={message}        // CaregiverMessage object
  index={index}            // List index for testID
  onPress={handlePress}    // Press handler
/>
```

### 5. FilterMenu Component (`src/screens/components/FilterMenu.js`)

Modal bottom sheet for filtering messages.

**Features**:
- Two filter options: All Messages, Unread Only
- Selected state styling
- Icon indicators for each option
- Done button to close
- Handedness support
- Smooth animations

**Props**:
```javascript
<FilterMenu
  visible={isVisible}              // Modal visibility
  currentMode={viewMode}           // Current filter mode
  onModeChange={handleModeChange}  // Mode change handler
  onClose={handleClose}            // Close handler
  isLeftHanded={isLeftHanded}      // Handedness support
/>
```

## Usage

### Displaying Messages List

```javascript
import { useMessages } from './src/contexts/MessagesContext';

export default function MyScreen() {
  const { messages, viewMode } = useMessages();

  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => <Text>{item.subject}</Text>}
      keyExtractor={item => item.id}
    />
  );
}
```

### Changing View Mode

```javascript
import { useMessages } from './src/contexts/MessagesContext';

export default function MyScreen() {
  const { setViewMode } = useMessages();

  return (
    <TouchableOpacity onPress={() => setViewMode('unread')}>
      <Text>Show Unread Only</Text>
    </TouchableOpacity>
  );
}
```

### Navigating to Message Detail

```javascript
const handleMessagePress = (message) => {
  navigation.navigate('MessageDetail', { message });
};
```

## Data Models

### CaregiverMessage

Represents a single message in the system.

```javascript
class CaregiverMessage {
  constructor(id, sender, subject, preview, sentAt, unread = false)
  
  id: string              // Unique message ID
  sender: string          // Message sender name
  subject: string         // Message subject line
  preview: string         // Message preview text
  sentAt: Date            // When message was sent
  unread: boolean         // Whether message is unread
}
```

## Styling System

### Colors
- Primary: `#0A7A8A` (teal) - Headers, buttons, indicators
- Background: `#F7FAFB` (light gray) - Screen background
- Surface: `#FFFFFF` (white) - Cards, containers
- Unread: `#E3F2FD` (light blue) - Unread message background
- Unread Indicator: `#1976D2` (blue) - Unread dot
- Text: `#333333` (dark) - Primary text
- Text Secondary: `#999999` (gray) - Secondary text

### Typography
- Header: 18px, fontWeight 600
- Sender: 16px, fontWeight 600/700 (unread)
- Subject: 14px, fontWeight 500/600 (unread)
- Preview: 13px, fontWeight 400
- Timestamp: 12px, fontWeight 400

### Spacing
- Card padding: 16dp
- List padding: 16dp horizontal, 12dp vertical
- Card margin: 12dp bottom
- Header padding: 16dp horizontal, 12dp vertical

## Responsive Design

### Mobile Layout
- Full width with horizontal padding
- 1-column message list
- Touch targets >= 44x44dp
- Modal takes 80% max height

### Tablet Layout
- Same responsive layout scales naturally
- Wider cards may improve readability
- Touch targets remain >= 44x44dp

## Accessibility Features

- Test IDs on all interactive elements
- Semantic button labels
- High contrast colors (WCAG AA compliant)
- Touch targets >= 44x44dp
- Proper text sizing for readability
- Status bar management

## View Modes

### All Messages
Shows all messages sorted by date (newest first).

```javascript
setViewMode('all');
```

### Unread Only
Shows only unread messages.

```javascript
setViewMode('unread');
```

## Message Timestamps

All messages display formatted timestamps using `formatDtYmdHmm`:
- Format: `YYYY-MM-DD HH:MM`
- Example: `2026-01-31 21:45`

## Handedness Support

Both list and detail screens support left and right-handed layouts:
- Filter button position
- Unread indicator position (left/right)
- Back/close button positioning
- Content alignment

## Navigation Integration

### Routes
- `Messages` - Messages list screen
- `MessageDetail` - Message detail screen

### From Dashboard
```javascript
// Navigate to all messages
navigation.navigate('Messages', { viewMode: 'all' });

// Navigate to unread messages
navigation.navigate('Messages', { viewMode: 'unread' });
```

### Message Detail Navigation
```javascript
// From messages list
navigation.navigate('MessageDetail', { message });
```

## Share Functionality

Message detail screen supports sharing via native share menu:

```javascript
await Share.share({
  message: `${message.subject}\n\n${message.preview}`,
  title: message.subject,
});
```

## Placeholder Operations

The following operations are currently placeholders and should be implemented with backend integration:

1. **Mark as Read**
   ```javascript
   handleMarkAsRead(messageId)
   ```

2. **Mark as Unread**
   ```javascript
   handleMarkAsUnread(messageId)
   ```

3. **Delete Message**
   ```javascript
   handleDeleteMessage(messageId)
   ```

## Comparison with Flutter Implementation

| Feature | Flutter | React Native |
|---------|---------|--------------|
| List Widget | ListView.builder | FlatList |
| Filtering | setState + if/where | Context + state |
| Bottom Sheet | showModalBottomSheet | Modal + View |
| Icons | Material Icons | Emoji/Unicode |
| Handedness | isLeftAligned check | useHandedness hook |
| Unread Indicator | Icon widget | View circle |
| Navigation | Navigator.push | navigation.navigate |

## Future Enhancements

1. **Backend Integration**
   - Implement mark as read/unread
   - Implement delete message
   - Real-time message sync

2. **Search and Sort**
   - Search messages by sender/subject
   - Sort by date/sender/subject
   - Save view preferences

3. **Rich Content**
   - HTML/formatted message bodies
   - Attachments support
   - Image attachments in detail view

4. **Actions**
   - Reply to messages
   - Forward messages
   - Mark as spam/important

5. **Notifications**
   - Push notifications for new messages
   - Sound alerts for unread
   - Badge count updates

6. **Performance**
   - Virtual scrolling for large lists
   - Image caching
   - Message pagination

## Testing

### Unit Tests

```javascript
test('messages context provides filtered messages', () => {
  const { result } = renderHook(() => useMessages());
  expect(result.current.viewMode).toBe('all');
});

test('changing view mode filters messages', () => {
  const { result } = renderHook(() => useMessages());
  act(() => {
    result.current.setViewMode('unread');
  });
  expect(result.current.viewMode).toBe('unread');
});
```

### Integration Tests

```javascript
it('should display messages list', async () => {
  await expect(element(by.testID('messages_list'))).toBeVisible();
});

it('should filter to unread messages', async () => {
  await element(by.testID('filter_button')).multiTap();
  await element(by.text('Unread Only')).multiTap();
  // Verify only unread messages shown
});

it('should navigate to message detail', async () => {
  await element(by.testID('message_0')).multiTap();
  await expect(element(by.testID('message_detail'))).toBeVisible();
});
```

## Sample Data

The MessagesRepository provides 6 sample messages:
- 3 unread messages
- 3 read messages
- Various senders (Care Team, Doctors, Clinic, Alerts)
- Different subjects and preview content

## Performance Considerations

1. **Memory**
   - Messages loaded into memory at startup
   - Consider pagination for large datasets
   - Implement virtual scrolling if needed

2. **Battery**
   - No background processes
   - Efficient re-renders with React optimization

3. **Network**
   - Currently uses local mock data
   - Plan for API integration strategy
   - Implement message syncing

## Known Limitations

- Mark as read/unread: Placeholder only
- Delete message: Placeholder only
- No message search
- No sorting options
- No reply/compose functionality
- No attachments

## Notes

- Messages are currently stored locally via MessagesRepository
- View mode persists across navigation within the app session
- Message detail uses Share API for native sharing
- Timestamps automatically formatted for user's locale
- Handedness preference is global from AppProviders context
