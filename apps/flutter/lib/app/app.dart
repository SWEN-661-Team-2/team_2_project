import 'package:flutter/material.dart';
import '../core/theme/app_theme.dart';
import 'routes.dart';

class CareConnectApp extends StatelessWidget {
  const CareConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CareConnect-LH',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      initialRoute: Routes.welcome,
      routes: Routes.map,
    );
  }
}
