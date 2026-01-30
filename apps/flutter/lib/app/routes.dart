import 'package:flutter/material.dart';
import '../features/welcome/welcome_screen.dart';
import '../features/settings/settings_screen.dart';
import '../features/home/home_screen.dart';
import '../features/patient_overview/patient_overview_screen.dart';

class Routes {
  static const welcome = '/';
  static const settings = '/settings';
  static const home = '/home';
  static const patientOverview = '/patient-overview';

  static Map<String, WidgetBuilder> get map => {
        welcome: (_) => const WelcomeScreen(),
        settings: (_) => const SettingsScreen(),
        home: (_) => const HomeScreen(),
        patientOverview: (_) => const PatientOverviewScreen(),
      };
}
