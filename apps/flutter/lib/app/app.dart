import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:provider/provider.dart';
import '../core/accessibility/text_size_mode.dart';
import '../core/accessibility/app_settings_controller.dart';
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
    final controller = context.watch<AppSettingsController>();

    return MaterialApp(
      title: 'CareConnect-LH',
      debugShowCheckedModeBanner: false,

      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),

      // Keep ONLY this one:
      themeMode: controller.highContrastEnabled ? ThemeMode.dark : ThemeMode.light,

      builder: (context, child) {
        final controller = context.watch<AppSettingsController>();
        final mq = MediaQuery.of(context);

        return MediaQuery(
          data: mq.copyWith(
            textScaler: TextScaler.linear(
              controller.textSizeMode.textScaleFactor,
            ),
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
