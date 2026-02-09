import 'package:flutter/material.dart';

import '../features/caregiver_dashboard/caregiver_dashboard_screen.dart';
import '../features/patients/patients_list_screen.dart';
import '../features/tasks/tasks_screen.dart';
import '../features/messages/messages_list_screen.dart';
import '../features/settings/settings_screen.dart';

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  static AppShellState? of(BuildContext context) {
    return context.findAncestorStateOfType<AppShellState>();
  }

  @override
  State<AppShell> createState() => AppShellState();
}

class AppShellState extends State<AppShell> {
  int _index = 0;
  PatientsViewMode _patientsMode = PatientsViewMode.all;
  MessagesViewMode _messagesMode = MessagesViewMode.all;
  bool _showBackButton = false;

  int get index => _index;
  PatientsViewMode get patientsMode => _patientsMode;
  MessagesViewMode get messagesMode => _messagesMode;
  bool get showBackButton => _showBackButton;

  void setTab(int i) {
    setState(() {
      _index = i;
      _showBackButton = false;
      if (i == 1) {
        _patientsMode = PatientsViewMode.all;
      }
      if (i == 3) {
        _messagesMode = MessagesViewMode.all;
      }
    });
  }

  void openPatients(PatientsViewMode mode) {
    setState(() {
      _patientsMode = mode;
      _index = 1;
      _showBackButton = true;
    });
  }

  void openMessages(MessagesViewMode mode) {
    setState(() {
      _messagesMode = mode;
      _index = 3;
      _showBackButton = true;
    });
  }

  void goBackToDashboard() {
    setState(() {
      _index = 0;
      _showBackButton = false;
      _patientsMode = PatientsViewMode.all;
      _messagesMode = MessagesViewMode.all;
    });
  }

  @override
  Widget build(BuildContext context) {
    final pages = <Widget>[
      const CaregiverDashboardScreen(),
      PatientsListScreen(mode: _patientsMode, showBackButton: _showBackButton),
      const TasksScreen(),
      MessagesListScreen(mode: _messagesMode, showBackButton: _showBackButton),
      const SettingsScreen(),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      body: SafeArea(
        child: IndexedStack(index: _index, children: pages),
      ),
      bottomNavigationBar: BottomNavigationBar(
        key: const Key('bottom_nav'),
        currentIndex: _index,
        type: BottomNavigationBarType.fixed,
        onTap: setTab,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home, key: Key('bn_home')),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people, key: Key('bn_people')),
            label: 'Patients',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.check_circle_outline, key: Key('bn_tasks')),
            label: 'Tasks',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat_bubble_outline, key: Key('bn_messages')),
            label: 'Messages',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings, key: Key('bn_settings')),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
