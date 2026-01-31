import 'package:flutter/material.dart';

import '../features/welcome/welcome_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/settings/settings_screen.dart';
import '../features/caregiver_dashboard/caregiver_dashboard_screen.dart';
import '../features/profile/profile_screen.dart';
import '../features/auth/change_password_screen.dart';

class Routes {
  static const welcome = '/';
  static const login = '/login';
  static const home = '/home';
  static const settings = '/settings';

  static const profile = '/profile';
  static const changePassword = '/change-password';

  static Map<String, WidgetBuilder> get map => {
        welcome: (_) => const WelcomeScreen(),
        login: (_) => const LoginScreen(),
        home: (_) => const CaregiverDashboardScreen(),
        settings: (_) => const SettingsScreen(),
        profile: (_) => const ProfileScreen(),
        changePassword: (_) => const ChangePasswordScreen(),
      };
}