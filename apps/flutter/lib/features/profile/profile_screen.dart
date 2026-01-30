import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile information')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Placeholder until real profile model exists
          const CircleAvatar(radius: 48),
          const SizedBox(height: 16),

          const Text('Name'),
          const TextField(decoration: InputDecoration(hintText: 'Your name')),
          const SizedBox(height: 12),

          const Text('Title / Role'),
          const TextField(decoration: InputDecoration(hintText: 'RN, Caregiver, Admin, etc.')),
          const SizedBox(height: 12),

          const Text('Position / Organization'),
          const TextField(decoration: InputDecoration(hintText: 'Facility / Team / Org')),
          const SizedBox(height: 12),

          const Text('Email'),
          const TextField(decoration: InputDecoration(hintText: 'name@example.com')),
          const SizedBox(height: 12),

          const Text('Phone'),
          const TextField(decoration: InputDecoration(hintText: '(555) 555-5555')),
          const SizedBox(height: 20),

          Align(
            alignment: Alignment.centerRight,
            child: FilledButton(
              onPressed: () {
                // TODO: save profile changes (wire later)
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Saved (placeholder)')),
                );
              },
              child: const Text('Save'),
            ),
          ),
        ],
      ),
    );
  }
}
