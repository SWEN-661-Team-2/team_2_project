// lib/app/app.dart
import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:provider/provider.dart';

import '../core/accessibility/text_size_mode.dart';
import '../core/accessibility/app_settings_controller.dart';
import '../core/theme/app_theme.dart';
import 'routes.dart';

class AppScrollBehavior extends MaterialScrollBehavior {
  const AppScrollBehavior();

  @override
  Set<PointerDeviceKind> get dragDevices => {
        PointerDeviceKind.touch,
        PointerDeviceKind.mouse,
        PointerDeviceKind.trackpad,
      };
}

class CareConnectApp extends StatelessWidget {
  const CareConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    final c = context.watch<AppSettingsController>();

    final ThemeData lightTheme =
        c.highContrastEnabled ? AppTheme.highContrastLight() : AppTheme.light();

    final ThemeData darkTheme =
        c.highContrastEnabled ? AppTheme.highContrastDark() : AppTheme.dark();

    return MaterialApp(
      title: 'CareConnect-LH',
      debugShowCheckedModeBanner: false,
      theme: lightTheme,
      darkTheme: darkTheme,

      // Day/Night MUST be driven by darkModeEnabled
      themeMode: c.darkModeEnabled ? ThemeMode.dark : ThemeMode.light,

      builder: (context, child) {
        final c = context.watch<AppSettingsController>();
        final mq = MediaQuery.of(context);

        return MediaQuery(
          data: mq.copyWith(
            textScaler: TextScaler.linear(c.textSizeMode.textScaleFactor),
          ),
          child: child ?? const SizedBox.shrink(),
        );
      },

      scrollBehavior: const AppScrollBehavior(),
      initialRoute: Routes.welcome,
      routes: Routes.map,
    );
  }
}