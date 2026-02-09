import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../widgets/reach_scaffold.dart';
import '../../core/tasks/tasks_repository.dart';
import '../../core/tasks/caregiver_task.dart';
import '../../core/utils/dt_format.dart';
import '../../core/accessibility/app_settings_controller.dart';

enum TasksViewMode { all, pending, completed, overdue, dueToday }

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  TasksViewMode _currentMode = TasksViewMode.all;

  String _getTitle() {
    switch (_currentMode) {
      case TasksViewMode.all:
        return 'All Tasks';
      case TasksViewMode.pending:
        return 'Pending Tasks';
      case TasksViewMode.completed:
        return 'Completed Tasks';
      case TasksViewMode.overdue:
        return 'Overdue Tasks';
      case TasksViewMode.dueToday:
        return 'Due Today';
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppSettingsController>();
    final isLeftAligned = controller.isLeftAligned;

    final repo = TasksRepository.instance;

    List<CaregiverTask> tasks;
    switch (_currentMode) {
      case TasksViewMode.all:
        tasks = repo.all();
        break;
      case TasksViewMode.pending:
        tasks = repo.sortedByPriorityAndDate();
        break;
      case TasksViewMode.completed:
        tasks = repo.completed();
        break;
      case TasksViewMode.overdue:
        tasks = repo.overdue();
        break;
      case TasksViewMode.dueToday:
        tasks = repo.dueToday();
        break;
    }

    return ReachScaffold(
      title: _getTitle(),
      child: Column(
        children: [
          // Filter button row at the top
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                if (isLeftAligned) ...[
                  IconButton(
                    icon: const Icon(Icons.filter_list),
                    onPressed: () => _showFilterMenu(context),
                  ),
                  const Spacer(),
                ] else ...[
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.filter_list),
                    onPressed: () => _showFilterMenu(context),
                  ),
                ],
              ],
            ),
          ),
          // Tasks list
          Expanded(
            child: tasks.isEmpty
                ? const Center(child: Text('No tasks found'))
                : ListView.builder(
                    key: const Key('tasks_list'),
                    padding: const EdgeInsets.all(16),
                    itemCount: tasks.length,
                    itemBuilder: (context, index) {
                      final task = tasks[index];
                      return _TaskCard(
                        key: Key('task_$index'),
                        task: task,
                        index: index,
                        isLeftAligned: isLeftAligned,
                        onToggleComplete: () {
                          setState(() {
                            repo.toggleComplete(task.id);
                          });
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  void _showFilterMenu(BuildContext context) {
    final controller = context.read<AppSettingsController>();
    final isLeftAligned = controller.isLeftAligned;

    showModalBottomSheet(
      context: context,
      showDragHandle: true,
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Filter Tasks',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                ListTile(
                  leading: isLeftAligned ? const Icon(Icons.list) : null,
                  trailing: !isLeftAligned ? const Icon(Icons.list) : null,
                  title: const Text('All Tasks'),
                  selected: _currentMode == TasksViewMode.all,
                  onTap: () {
                    setState(() => _currentMode = TasksViewMode.all);
                    Navigator.pop(ctx);
                  },
                ),
                ListTile(
                  leading: isLeftAligned
                      ? const Icon(Icons.pending_actions)
                      : null,
                  trailing: !isLeftAligned
                      ? const Icon(Icons.pending_actions)
                      : null,
                  title: const Text('Pending (Sorted by Priority)'),
                  selected: _currentMode == TasksViewMode.pending,
                  onTap: () {
                    setState(() => _currentMode = TasksViewMode.pending);
                    Navigator.pop(ctx);
                  },
                ),
                ListTile(
                  leading: isLeftAligned ? const Icon(Icons.today) : null,
                  trailing: !isLeftAligned ? const Icon(Icons.today) : null,
                  title: const Text('Due Today'),
                  selected: _currentMode == TasksViewMode.dueToday,
                  onTap: () {
                    setState(() => _currentMode = TasksViewMode.dueToday);
                    Navigator.pop(ctx);
                  },
                ),
                ListTile(
                  leading: isLeftAligned
                      ? const Icon(Icons.warning_amber)
                      : null,
                  trailing: !isLeftAligned
                      ? const Icon(Icons.warning_amber)
                      : null,
                  title: const Text('Overdue'),
                  selected: _currentMode == TasksViewMode.overdue,
                  onTap: () {
                    setState(() => _currentMode = TasksViewMode.overdue);
                    Navigator.pop(ctx);
                  },
                ),
                ListTile(
                  leading: isLeftAligned
                      ? const Icon(Icons.check_circle)
                      : null,
                  trailing: !isLeftAligned
                      ? const Icon(Icons.check_circle)
                      : null,
                  title: const Text('Completed'),
                  selected: _currentMode == TasksViewMode.completed,
                  onTap: () {
                    setState(() => _currentMode = TasksViewMode.completed);
                    Navigator.pop(ctx);
                  },
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _TaskCard extends StatelessWidget {
  final CaregiverTask task;
  final int index;
  final bool isLeftAligned;
  final VoidCallback onToggleComplete;

  const _TaskCard({
    super.key,
    required this.task,
    required this.index,
    required this.isLeftAligned,
    required this.onToggleComplete,
  });

  @override
  Widget build(BuildContext context) {
    final priorityColor = _getPriorityColor(task.priority);
    final statusIcon = _getStatusIcon(task.status);
    final dueText = formatDtYmdHmm(task.dueDate.toLocal());
    final isOverdue = task.isOverdue;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      color: isOverdue
          ? Colors.red.withValues(alpha: 0.05)
          : (task.status == TaskStatus.completed
                ? Colors.green.withValues(alpha: 0.05)
                : Colors.white),
      child: InkWell(
        onTap: () {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Task: ${task.title}')));
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (isLeftAligned) ...[
                InkWell(
                  onTap: onToggleComplete,
                  child: Icon(
                    statusIcon,
                    color: task.status == TaskStatus.completed
                        ? Colors.green
                        : Colors.grey,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
              ],

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            task.title,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              decoration: task.status == TaskStatus.completed
                                  ? TextDecoration.lineThrough
                                  : null,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: priorityColor.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            _getPriorityText(task.priority),
                            style: TextStyle(
                              color: priorityColor,
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    if (task.patientName != null) ...[
                      Text(
                        'Patient: ${task.patientName}',
                        style: TextStyle(fontSize: 13, color: Colors.grey[700]),
                      ),
                      const SizedBox(height: 2),
                    ],
                    Text(
                      task.description,
                      style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Icon(
                          isOverdue ? Icons.warning_amber : Icons.schedule,
                          size: 14,
                          color: isOverdue ? Colors.red : Colors.grey[600],
                        ),
                        const SizedBox(width: 4),
                        Text(
                          isOverdue ? 'Overdue: $dueText' : 'Due: $dueText',
                          style: TextStyle(
                            fontSize: 12,
                            color: isOverdue ? Colors.red : Colors.grey[600],
                            fontWeight: isOverdue
                                ? FontWeight.w600
                                : FontWeight.normal,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              if (!isLeftAligned) ...[
                const SizedBox(width: 12),
                InkWell(
                  onTap: onToggleComplete,
                  child: Icon(
                    statusIcon,
                    color: task.status == TaskStatus.completed
                        ? Colors.green
                        : Colors.grey,
                    size: 24,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  String _getPriorityText(TaskPriority priority) {
    switch (priority) {
      case TaskPriority.high:
        return 'HIGH';
      case TaskPriority.medium:
        return 'MED';
      case TaskPriority.low:
        return 'LOW';
    }
  }

  Color _getPriorityColor(TaskPriority priority) {
    switch (priority) {
      case TaskPriority.high:
        return Colors.red;
      case TaskPriority.medium:
        return Colors.orange;
      case TaskPriority.low:
        return Colors.blue;
    }
  }

  IconData _getStatusIcon(TaskStatus status) {
    switch (status) {
      case TaskStatus.pending:
        return Icons.radio_button_unchecked;
      case TaskStatus.inProgress:
        return Icons.pending;
      case TaskStatus.completed:
        return Icons.check_circle;
    }
  }
}
