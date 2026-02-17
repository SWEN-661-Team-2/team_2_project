// apps/flutter/test/caregiver_task_test.dart
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app/core/tasks/caregiver_task.dart';

void main() {
  test('CaregiverTask.copyWith overrides only provided fields', () {
    final now = DateTime.now();

    final t1 = CaregiverTask(
      id: 't1',
      title: 'A',
      description: 'D',
      priority: TaskPriority.medium,
      status: TaskStatus.pending,
      dueDate: now.add(const Duration(hours: 2)),
      patientId: 'p1',
      patientName: 'Pat',
      createdAt: now.subtract(const Duration(days: 1)),
      completedAt: null,
    );

    final t2 = t1.copyWith(
      title: 'B',
      status: TaskStatus.inProgress,
      patientName: 'Pat 2',
    );

    expect(t2.id, 't1');
    expect(t2.title, 'B');
    expect(t2.description, 'D');
    expect(t2.priority, TaskPriority.medium);
    expect(t2.status, TaskStatus.inProgress);
    expect(t2.dueDate, t1.dueDate);
    expect(t2.patientId, 'p1');
    expect(t2.patientName, 'Pat 2');
    expect(t2.createdAt, t1.createdAt);
    expect(t2.completedAt, isNull);
  });

  test('CaregiverTask.isOverdue true when pending/inProgress and past due', () {
    final now = DateTime.now();

    final overduePending = CaregiverTask(
      id: 'o1',
      title: 'Overdue',
      description: 'D',
      priority: TaskPriority.high,
      status: TaskStatus.pending,
      dueDate: now.subtract(const Duration(minutes: 1)),
      createdAt: now,
    );

    final overdueInProgress = overduePending.copyWith(status: TaskStatus.inProgress);

    expect(overduePending.isOverdue, isTrue);
    expect(overdueInProgress.isOverdue, isTrue);
  });

  test('CaregiverTask.isOverdue false when completed', () {
    final now = DateTime.now();

    final completedPastDue = CaregiverTask(
      id: 'c1',
      title: 'Done',
      description: 'D',
      priority: TaskPriority.low,
      status: TaskStatus.completed,
      dueDate: now.subtract(const Duration(days: 1)),
      createdAt: now.subtract(const Duration(days: 2)),
      completedAt: now.subtract(const Duration(hours: 1)),
    );

    expect(completedPastDue.isOverdue, isFalse);
  });

  test('CaregiverTask.isDueToday true only for non-completed, non-overdue tasks due today', () {
    final now = DateTime.now();

    final dueLaterToday = CaregiverTask(
      id: 'd1',
      title: 'Today',
      description: 'D',
      priority: TaskPriority.medium,
      status: TaskStatus.pending,
      dueDate: now.add(const Duration(hours: 2)),
      createdAt: now,
    );

    final overdueToday = dueLaterToday.copyWith(
      id: 'd2',
      dueDate: now.subtract(const Duration(minutes: 1)),
    );

    final completedToday = dueLaterToday.copyWith(
      id: 'd3',
      status: TaskStatus.completed,
      completedAt: now,
    );

    expect(dueLaterToday.isDueToday, isTrue);
    expect(overdueToday.isDueToday, isFalse);
    expect(completedToday.isDueToday, isFalse);
  });
}

