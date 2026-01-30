import 'package:flutter/material.dart';
import '../tokens/colors.dart';
import '../tokens/typography.dart';

class AppTheme {
  static ThemeData light() {
    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      fontFamily: AppTypography.fontFamily,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.brandPrimary,
        brightness: Brightness.light,
        primary: AppColors.brandPrimary,
        secondary: AppColors.brandSecondary,
        surface: AppColors.surface,
        error: AppColors.error500,
      ),
    );

    return base.copyWith(
      // AppBar styling
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
      ),

      // Text styling
      textTheme: base.textTheme.copyWith(
        displayLarge: AppTypography.h1,
        displayMedium: AppTypography.h2,
        displaySmall: AppTypography.h3,
        headlineMedium: AppTypography.h4,
        headlineSmall: AppTypography.h5,
        titleMedium: AppTypography.h6,
        bodyLarge: AppTypography.body,
        bodyMedium: AppTypography.body,
        bodySmall: AppTypography.bodySmall,
      ).apply(
        bodyColor: AppColors.textPrimary,
        displayColor: AppColors.textPrimary,
      ),

      // Buttons
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.brandPrimary,
          foregroundColor: Colors.white,
          textStyle: AppTypography.bodyEmphasis,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),

      // Inputs
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.focus, width: 2),
        ),
        labelStyle: const TextStyle(color: AppColors.textSecondary),
        hintStyle: const TextStyle(color: AppColors.textSecondary),
      ),

      // Dividers
      dividerTheme: const DividerThemeData(
        color: AppColors.border,
        thickness: 1,
      ),
    );
  }
}
