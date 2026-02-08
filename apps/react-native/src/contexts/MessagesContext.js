/**
 * Messages Context
 * Manages messages state and operations
 * Equivalent to Flutter's messages feature
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { messagesRepository } from '../repositories/MessagesRepository';

const MessagesContext = createContext();

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within MessagesProvider');
  }
  return context;
};

export function MessagesProvider({ children }) {
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'unread'

  // Get messages based on view mode
  const messages = viewMode === 'unread'
    ? messagesRepository.unreadMessages()
    : messagesRepository.allMessages();

  const unreadCount = messagesRepository.unreadCount();

  const handleMarkAsRead = useCallback((messageId) => {
    // In a real app, this would update the backend
    // For now, just a placeholder
    console.log(`Mark message ${messageId} as read`);
  }, []);

  const handleMarkAsUnread = useCallback((messageId) => {
    // In a real app, this would update the backend
    console.log(`Mark message ${messageId} as unread`);
  }, []);

  const handleDeleteMessage = useCallback((messageId) => {
    // In a real app, this would update the backend
    console.log(`Delete message ${messageId}`);
  }, []);

  const value = {
    messages,
    viewMode,
    setViewMode,
    unreadCount,
    handleMarkAsRead,
    handleMarkAsUnread,
    handleDeleteMessage,
    messagesRepository,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}
