import 'package:flutter/material.dart';

import '../features/welcome/welcome_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/profile/profile_screen.dart';
import '../features/auth/change_password_screen.dart';
import '../app/app_shell.dart';

class Routes {
  static const welcome = '/';
  static const login = '/login';
  static const app = '/app';
  static const profile = '/profile';
  static const changePassword = '/change-password';

  static Map<String, WidgetBuilder> get map => {
        welcome: (_) => const WelcomeScreen(),
        login: (_) => const LoginScreen(),
        app: (_) => const AppShell(),
        profile: (_) => const ProfileScreen(),
        changePassword: (_) => const ChangePasswordScreen(),
      };
}

