import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../widgets/reach_scaffold.dart';

import '../../core/messages/messages_repository.dart';
import '../../core/messages/caregiver_message.dart';
import '../../core/utils/dt_format.dart';
import '../../core/accessibility/app_settings_controller.dart';
import '../../app/app_shell.dart';

enum MessagesViewMode { all, unread }

class MessagesListScreen extends StatefulWidget {
  final MessagesViewMode mode;
  final bool showBackButton;

  const MessagesListScreen({
    super.key,
    this.mode = MessagesViewMode.all,
    this.showBackButton = false,
  });

  @override
  State<MessagesListScreen> createState() => _MessagesListScreenState();
}

class _MessagesListScreenState extends State<MessagesListScreen> {
  MessagesViewMode _currentMode = MessagesViewMode.all;

  @override
  void initState() {
    super.initState();
    _currentMode = widget.mode;
  }

  @override
  void didUpdateWidget(MessagesListScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.mode != widget.mode) {
      setState(() {
        _currentMode = widget.mode;
      });
    }
  }

  String _getTitle() {
    switch (_currentMode) {
      case MessagesViewMode.all:
        return 'Messages';
      case MessagesViewMode.unread:
        return 'Messages / Unread';
    }
  }

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppSettingsController>();
    final isLeftAligned = controller.isLeftAligned;
    
    final repo = MessagesRepository.instance;
    final messages = _currentMode == MessagesViewMode.all
        ? repo.all()
        : repo.all().where((m) => m.unread).toList();

    return ReachScaffold(
      title: _getTitle(),
      child: Column(
        children: [
          // Menu/back button row at the top
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                if (isLeftAligned) ...[
                  widget.showBackButton
                      ? IconButton(
                          icon: const Icon(Icons.arrow_back),
                          onPressed: () => AppShell.of(context)?.goBackToDashboard(),
                          tooltip: 'Back to dashboard',
                        )
                      : IconButton(
                          icon: const Icon(Icons.filter_list),
                          onPressed: () => _showFilterMenu(context),
                        ),
                  const Spacer(),
                ] else ...[
                  const Spacer(),
                  widget.showBackButton
                      ? IconButton(
                          icon: const Icon(Icons.arrow_back),
                          onPressed: () => AppShell.of(context)?.goBackToDashboard(),
                          tooltip: 'Back to dashboard',
                        )
                      : IconButton(
                          icon: const Icon(Icons.filter_list),
                          onPressed: () => _showFilterMenu(context),
                        ),
                ],
              ],
            ),
          ),
          // Messages list
          Expanded(
            child: messages.isEmpty
                ? const Center(child: Text('No messages'))
                : ListView.builder(
                    key: const Key('messages_list'),
                    padding: const EdgeInsets.all(16),
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final message = messages[index];
                      return _MessageCard(
                        key: Key('message_$index'),
                        message: message,
                        isLeftAligned: isLeftAligned,
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
                  'Filter Messages',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                ListTile(
                  leading: isLeftAligned ? const Icon(Icons.mail) : null,
                  trailing: !isLeftAligned ? const Icon(Icons.mail) : null,
                  title: const Text('All Messages'),
                  selected: _currentMode == MessagesViewMode.all,
                  onTap: () {
                    setState(() => _currentMode = MessagesViewMode.all);
                    Navigator.pop(ctx);
                  },
                ),
                ListTile(
                  leading: isLeftAligned ? const Icon(Icons.mark_email_unread) : null,
                  trailing: !isLeftAligned ? const Icon(Icons.mark_email_unread) : null,
                  title: const Text('Unread Only'),
                  selected: _currentMode == MessagesViewMode.unread,
                  onTap: () {
                    setState(() => _currentMode = MessagesViewMode.unread);
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

class _MessageCard extends StatelessWidget {
  final CaregiverMessage message;
  final bool isLeftAligned;

  const _MessageCard({
    super.key,
    required this.message,
    required this.isLeftAligned,
  });

  @override
  Widget build(BuildContext context) {
    final timestampText = formatDtYmdHmm(message.sentAt.toLocal());
    
    final unreadIndicator = message.unread
        ? const Icon(
            Icons.circle,
            color: Colors.blue,
            size: 12,
          )
        : const SizedBox(width: 12);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      color: message.unread
          ? Colors.blue.withValues(alpha: 0.05)
          : Colors.white,
      child: InkWell(
        onTap: () {
          // TODO: Navigate to message detail when screen is created
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Message from ${message.sender}')),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (isLeftAligned) ...[
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: unreadIndicator,
                ),
                const SizedBox(width: 12),
              ],
              
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            message.sender,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: message.unread
                                  ? FontWeight.bold 
                                  : FontWeight.w600,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          timestampText,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      message.subject,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: message.unread
                            ? FontWeight.w600 
                            : FontWeight.normal,
                        color: Colors.grey[700],
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      message.preview,
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey[600],
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              
              if (!isLeftAligned) ...[
                const SizedBox(width: 12),
                Padding(
                  padding: const EdgeInsets.only(top: 4),
                  child: unreadIndicator,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
