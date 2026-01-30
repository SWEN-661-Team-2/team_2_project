import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';

import '../core/theme/app_theme.dart';
import 'routes.dart';

/// Allows touch, mouse, and trackpad scrolling on mobile simulators
/// (fixes iOS Simulator mouse-wheel / trackpad scroll issues)
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
    return MaterialApp(
      title: 'CareConnect-LH',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),

      // 3iOS + Android simulator scrolling
      scrollBehavior: const AppScrollBehavior(),

      initialRoute: Routes.welcome,
      routes: Routes.map,
    );
  }
}
