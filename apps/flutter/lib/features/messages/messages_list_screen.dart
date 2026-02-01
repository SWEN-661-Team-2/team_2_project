import 'package:flutter/material.dart';
import '../../core/messages/messages_repository.dart';
import '../../core/utils/dt_format.dart';

class MessagesListScreen extends StatelessWidget {
  const MessagesListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final repo = MessagesRepository.instance;
    final items = repo.all();

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      appBar: AppBar(title: const Text('Messages')),
      body: ListView.separated(
        key: const Key('messages_list'),
        padding: const EdgeInsets.all(16),
        itemCount: items.length,
        separatorBuilder: (context, index) => const SizedBox(height: 12),
        itemBuilder: (context, i) {
          final m = items[i];

          return Card(
            child: ListTile(
              key: Key('message_$i'),
              title: Text(
                m.sender,
                style: TextStyle(
                  fontWeight: m.unread ? FontWeight.w700 : FontWeight.w500,
                ),
              ),
              subtitle: Text(
                '${m.subject}\n${m.preview}',
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              trailing: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    formatDtYmdHmm(m.sentAt.toLocal()),
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  const SizedBox(height: 6),
                  if (m.unread)
                    const Icon(Icons.circle, size: 10, color: Colors.blue),
                ],
              ),
              onTap: () {
                // later: open message detail + mark read
              },
            ),
          );
        },
      ),
    );
  }
}