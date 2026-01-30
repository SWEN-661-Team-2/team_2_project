import 'package:flutter/material.dart';

class AppLogo extends StatelessWidget {
  final double size;

  const AppLogo({super.key, this.size = 48});

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      'assets/logo/careconnect_logo.png',
      width: size,
      height: size,
      fit: BoxFit.contain,
      semanticLabel: 'CareConnect logo',
    );
  }
}
