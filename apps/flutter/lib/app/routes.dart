import 'package:flutter/material.dart';

import '../features/welcome/welcome_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/profile/profile_screen.dart';
import '../features/auth/change_password_screen.dart';
import '../app/app_shell.dart';
import '../features/privacy/privacy_policy_screen.dart';
import '../features/privacy/terms_of_service_screen.dart';
import '../features/help/help_support_screen.dart';
import '../features/about/about_careconnect_screen.dart';

class Routes {
  static const welcome = '/';
  static const login = '/login';
  static const app = '/app';
  static const profile = '/profile';
  static const changePassword = '/change-password';

  static const privacyPolicy = '/privacy-policy';
  static const termsOfService = '/terms-of-service';
  static const helpSupport = '/help-support';
  static const aboutCareConnect = '/about-careconnect';

  static Map<String, WidgetBuilder> get map => {
        welcome: (_) => const WelcomeScreen(),
        login: (_) => const LoginScreen(),
        app: (_) => const AppShell(),
        profile: (_) => const ProfileScreen(),
        changePassword: (_) => const ChangePasswordScreen(),
        privacyPolicy: (_) => const PrivacyPolicyScreen(),
        termsOfService: (_) => const TermsOfServiceScreen(),
        helpSupport: (_) => const HelpSupportScreen(),
        aboutCareConnect: (_) => const AboutCareConnectScreen(),
      };
}
