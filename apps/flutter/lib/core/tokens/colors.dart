import 'package:flutter/material.dart';

/// Color tokens sourced from the CareConnect design system (Figma).
class AppColors {
  // Primary (teal)
  static const primary300 = Color(0xFF00A4BB);
  static const primary400 = Color(0xFF0095A1);
  static const primary500 = Color(0xFF007A8A); // Brand base
  static const primary700 = Color(0xFF005E66); // Dark brand (pressed)

  // Secondary (supporting brand)
  static const secondary500 = Color(0xFF2F7F52);

  // Accent (UI highlight)
  static const accent500 = Color(0xFF3C52CF);

  // Neutrals
  static const neutral100 = Color(0xFFF5F5F5);
  static const neutral500 = Color(0xFF6B7280); // Body text / icons
  static const neutral900 = Color(0xFF111827); // High-contrast text

  // Semantic
  static const success500 = Color(0xFF1B873F);
  static const warning500 = Color(0xFFF6A623);
  static const error500 = Color(0xFFD32F2F);
  static const info500 = Color(0xFF1976D2);

  // Surfaces
  static const background = Color(0xFFF9FAFB);
  static const surface = Color(0xFFFFFFFF);

  // Convenience aliases (use these most often)
  static const brandPrimary = primary500;
  static const brandPrimaryPressed = primary700;
  static const brandSecondary = secondary500;

  static const textPrimary = neutral900;
  static const textSecondary = neutral500;
  static const border = Color(0xFFE5E7EB); // reasonable default border
  static const focus = accent500;
}
