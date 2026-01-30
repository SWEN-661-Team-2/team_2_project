import 'package:flutter/material.dart';

/// Typography tokens sourced from the CareConnect design system (Figma).
/// Primary font: Roboto (Flutter-friendly). iOS may render as SF Pro at runtime.
class AppTypography {
  static const String fontFamily = 'Roboto';

  // Headings
  static const TextStyle h1 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 32,
    height: 40 / 32,
    fontWeight: FontWeight.w700, // Bold
  );

  static const TextStyle h2 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 28,
    height: 36 / 28,
    fontWeight: FontWeight.w600, // Semibold
  );

  static const TextStyle h3 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 24,
    height: 32 / 24,
    fontWeight: FontWeight.w600, // Semibold
  );

  static const TextStyle h4 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 20,
    height: 28 / 20,
    fontWeight: FontWeight.w500, // Medium
  );

  static const TextStyle h5 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 18,
    height: 24 / 18,
    fontWeight: FontWeight.w500, // Medium
  );

  static const TextStyle h6 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    height: 24 / 16,
    fontWeight: FontWeight.w500, // Medium
  );

  // Body
  static const TextStyle body = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    height: 24 / 16,
    fontWeight: FontWeight.w400, // Regular
  );

  static const TextStyle bodyEmphasis = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    height: 24 / 16,
    fontWeight: FontWeight.w600, // Emphasis
  );

  static const TextStyle bodySmall = TextStyle(
    fontFamily: fontFamily,
    fontSize: 14,
    height: 20 / 14,
    fontWeight: FontWeight.w400, // Regular
  );
}
