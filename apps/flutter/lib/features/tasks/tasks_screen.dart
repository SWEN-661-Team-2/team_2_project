import 'package:flutter/material.dart';

class TasksScreen extends StatelessWidget {
  const TasksScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      appBar: AppBar(title: const Text('Tasks')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Text(
            'Caregiver Tasks (Placeholder)',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
          ),
          SizedBox(height: 12),
          Text(
            'TODO:\n'
            '- List caregiver tasks\n'
            '- Prioritize and sort tasks\n'
            '- Mark complete\n',
          ),
        ],
      ),
    );
  }
}