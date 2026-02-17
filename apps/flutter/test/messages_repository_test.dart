// test/messages_repository_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/core/messages/messages_repository.dart';

void main() {
  group('MessagesRepository', () {
    test('all() returns messages sorted by sentAt desc', () {
      final repo = MessagesRepository.instance;
      final items = repo.all();
      expect(items.length, greaterThan(1));

      for (var i = 0; i < items.length - 1; i++) {
        expect(
          items[i].sentAt.isAfter(items[i + 1].sentAt) ||
              items[i].sentAt.isAtSameMomentAs(items[i + 1].sentAt),
          isTrue,
        );
      }
    });

    test('unreadCount matches unread flags', () {
      final repo = MessagesRepository.instance;
      final expected = repo.all().where((m) => m.unread).length;
      expect(repo.unreadCount(), expected);
    });

    test('topN returns N items (or fewer if N > total)', () {
      final repo = MessagesRepository.instance;
      final total = repo.all().length;

      expect(repo.topN(5).length, 5);
      expect(repo.topN(total + 10).length, total);
    });
  });
}

