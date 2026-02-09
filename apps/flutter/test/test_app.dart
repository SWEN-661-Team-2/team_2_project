import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/app/routes.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';

Widget buildTestApp({String initialRoute = Routes.welcome}) {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider<AppSettingsController>(
        create: (_) => AppSettingsController(),
      ),
    ],
    child: MaterialApp(routes: Routes.map, initialRoute: initialRoute),
  );
}
