import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/app/providers.dart';
import 'package:flutter_app/app/routes.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: AppProviders.build(),
      child: MaterialApp(
        routes: Routes.map,
        initialRoute: Routes.welcome,
      ),
    );
  }
}