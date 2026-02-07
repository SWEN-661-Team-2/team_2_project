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

  int get index => _index;
  PatientsViewMode get patientsMode => _patientsMode;

  void setTab(int i) {
    setState(() {
      _index = i;
      if (i == 1) {
        _patientsMode = PatientsViewMode.all;
      }
    });
  }

  void openPatients(PatientsViewMode mode) {
    setState(() {
      _patientsMode = mode;
      _index = 1;
    });
  }

  @override
  Widget build(BuildContext context) {
    final pages = <Widget>[
      const CaregiverDashboardScreen(),
      PatientsListScreen(mode: _patientsMode),
      const TasksScreen(),
      const MessagesListScreen(),
      const SettingsScreen(),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      body: SafeArea(
        child: IndexedStack(
          index: _index,
          children: pages,
        ),
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

