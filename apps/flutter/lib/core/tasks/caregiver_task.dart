enum TaskPriority { high, medium, low }

enum TaskStatus { pending, inProgress, completed }

class CaregiverTask {
  final String id;
  final String title;
  final String description;
  final TaskPriority priority;
  final TaskStatus status;
  final DateTime dueDate;
  final String? patientId;
  final String? patientName;
  final DateTime createdAt;
  final DateTime? completedAt;

  CaregiverTask({
    required this.id,
    required this.title,
    required this.description,
    required this.priority,
    required this.status,
    required this.dueDate,
    this.patientId,
    this.patientName,
    required this.createdAt,
    this.completedAt,
  });

  CaregiverTask copyWith({
    String? id,
    String? title,
    String? description,
    TaskPriority? priority,
    TaskStatus? status,
    DateTime? dueDate,
    String? patientId,
    String? patientName,
    DateTime? createdAt,
    DateTime? completedAt,
  }) {
    return CaregiverTask(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      priority: priority ?? this.priority,
      status: status ?? this.status,
      dueDate: dueDate ?? this.dueDate,
      patientId: patientId ?? this.patientId,
      patientName: patientName ?? this.patientName,
      createdAt: createdAt ?? this.createdAt,
      completedAt: completedAt ?? this.completedAt,
    );
  }

  bool get isOverdue => status != TaskStatus.completed && DateTime.now().isAfter(dueDate);
    bool get isDueToday {
    if (status == TaskStatus.completed) return false;
    if (isOverdue) return false;  // Exclude overdue tasks
    
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final taskDay = DateTime(dueDate.year, dueDate.month, dueDate.day);
    return today == taskDay;
    }
}
