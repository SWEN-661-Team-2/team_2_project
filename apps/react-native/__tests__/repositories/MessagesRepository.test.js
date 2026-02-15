// /Volumes/DevDrive/code/swen-661-ui/team_2_project/apps/react-native/__tests__/repositories/MessagesRepository.test.js

/**
 * Business Logic Tests - MessagesRepository
 * Tests message data fetching and management
 */
import * as RepoModule from '../../src/repositories/MessagesRepository';

const getRepository = () => {
  const maybeCtor =
    RepoModule.MessagesRepository ||
    RepoModule.default ||
    RepoModule.repository ||
    RepoModule.MessagesRepositoryInstance;

  // constructor export
  if (typeof maybeCtor === 'function') return new maybeCtor();

  // singleton export (object)
  if (maybeCtor && typeof maybeCtor === 'object') return maybeCtor;

  // last resort: module itself might be the repo object
  if (RepoModule && typeof RepoModule === 'object') return RepoModule;

  throw new Error('MessagesRepository export not found');
};

describe('MessagesRepository', () => {
  let repository;

  beforeEach(() => {
    repository = getRepository();
  });

  describe('getAllMessages', () => {
    test('returns array of messages', async () => {
      const messages = await repository.getAllMessages();

      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThan(0);
    });

    test('messages have required properties', async () => {
      const messages = await repository.getAllMessages();
      const message = messages[0];

      expect(message).toHaveProperty('id');
      expect(message).toHaveProperty('title');
      expect(message).toHaveProperty('body');
    });
  });

  describe('getMessageById', () => {
    test('returns null for non-existent message', async () => {
      const message = await repository.getMessageById('nonexistent-id');
      expect(message).toBeNull();
    });

    test('returns message when found', async () => {
      const allMessages = await repository.getAllMessages();
      const testMessage = allMessages[0];
      const foundMessage = await repository.getMessageById(testMessage.id);

      expect(foundMessage).not.toBeNull();
      expect(foundMessage.id).toBe(testMessage.id);
    });
  });

  describe('getUnreadMessages', () => {
    test('returns array of unread messages', async () => {
      const unreadMessages = await repository.getUnreadMessages();
      expect(Array.isArray(unreadMessages)).toBe(true);
    });

    test('unread messages have isRead as false', async () => {
      const unreadMessages = await repository.getUnreadMessages();

      unreadMessages.forEach((message) => {
        expect(message.isRead).toBe(false);
      });
    });
  });

  describe('markAsRead', () => {
    test('marks message as read', async () => {
      const messages = await repository.getAllMessages();
      const message = messages[0];

      await repository.markAsRead(message.id);

      const updatedMessage = await repository.getMessageById(message.id);
      expect(updatedMessage.isRead).toBe(true);
    });
  });
});
