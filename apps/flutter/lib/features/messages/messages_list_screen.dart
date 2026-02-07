import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../widgets/reach_scaffold.dart';

import '../../core/messages/messages_repository.dart';
import '../../core/messages/caregiver_message.dart';
import '../../core/utils/dt_format.dart';
import '../../core/accessibility/app_settings_controller.dart';

class MessagesListScreen extends StatelessWidget {
  const MessagesListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = context.watch<AppSettingsController>();
    final isLeftAligned = controller.isLeftAligned;
    
    final repo = MessagesRepository.instance;
    final messages = repo.all(); 

    return ReachScaffold(
      title: 'Messages',
      child: messages.isEmpty
          ? const Center(child: Text('No messages'))
          : ListView.builder(
              key: const Key('messages_list'),  // Added key
              padding: const EdgeInsets.all(16),
              itemCount: messages.length,
              itemBuilder: (context, index) {
                final message = messages[index];
                return _MessageCard(
                  key: Key('message_$index'),  // Added key
                  message: message,
                  isLeftAligned: isLeftAligned,
                );
              },
            ),
    );
  }
}

class _MessageCard extends StatelessWidget {
  final CaregiverMessage message;
  final bool isLeftAligned;

  const _MessageCard({
    super.key,  // Added super.key
    required this.message,
    required this.isLeftAligned,
  });

  @override
  Widget build(BuildContext context) {
    final timestampText = formatDtYmdHmm(message.sentAt.toLocal());
    
    final unreadIndicator = message.unread
        ? const Icon(  // Changed to Icon for test compatibility
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
