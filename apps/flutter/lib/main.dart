import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app/app/providers.dart';
import 'package:flutter_app/app/app.dart';

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
      child: const CareConnectApp(), // IMPORTANT: use the app that wires themeMode.
    );
  }
}


