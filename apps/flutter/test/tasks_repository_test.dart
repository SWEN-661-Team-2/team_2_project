// test/tasks_repository_test.dart
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/core/tasks/caregiver_task.dart';
import 'package:flutter_app/core/tasks/tasks_repository.dart';

void main() {
  group('TasksRepository', () {
    test('toggleComplete flips status and completedAt (completed <-> pending)', () {
      final repo = TasksRepository.instance;

      final completedTask =
          repo.all().firstWhere((t) => t.status == TaskStatus.completed);
      final id = completedTask.id;

      repo.toggleComplete(id);
      final t1 = repo.all().firstWhere((t) => t.id == id);
      expect(t1.status, TaskStatus.pending);
      expect(t1.completedAt, isNull);

      repo.toggleComplete(id);
      final t2 = repo.all().firstWhere((t) => t.id == id);
      expect(t2.status, TaskStatus.completed);
      expect(t2.completedAt, isNotNull);
    });

    test('updateStatus sets completedAt only when status == completed', () {
      final repo = TasksRepository.instance;

      final notCompleted =
          repo.all().firstWhere((t) => t.status != TaskStatus.completed);
      final id = notCompleted.id;

      repo.updateStatus(id, TaskStatus.inProgress);
      final t1 = repo.all().firstWhere((t) => t.id == id);
      expect(t1.status, TaskStatus.inProgress);
      expect(t1.completedAt, isNull);

      repo.updateStatus(id, TaskStatus.completed);
      final t2 = repo.all().firstWhere((t) => t.id == id);
      expect(t2.status, TaskStatus.completed);
      expect(t2.completedAt, isNotNull);

      repo.updateStatus(id, TaskStatus.pending);
      final t3 = repo.all().firstWhere((t) => t.id == id);
      expect(t3.status, TaskStatus.pending);
      expect(t3.completedAt, isNull);
    });
  });
}

