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

    final scheme = base.colorScheme;

    return base.copyWith(
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
      ),

      switchTheme: SwitchThemeData(
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return scheme.primary;
          return AppColors.border;
        }),
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return Colors.white;
          return AppColors.textSecondary;
        }),
      ),

      textTheme: base.textTheme
          .copyWith(
            displayLarge: AppTypography.h1,
            displayMedium: AppTypography.h2,
            displaySmall: AppTypography.h3,
            headlineMedium: AppTypography.h4,
            headlineSmall: AppTypography.h5,
            titleMedium: AppTypography.h6,
            bodyLarge: AppTypography.body,
            bodyMedium: AppTypography.body,
            bodySmall: AppTypography.bodySmall,
          )
          .apply(
            bodyColor: AppColors.textPrimary,
            displayColor: AppColors.textPrimary,
          ),

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

      dividerTheme: const DividerThemeData(
        color: AppColors.border,
        thickness: 1,
      ),
    );
  }

  static ThemeData dark() {
    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      fontFamily: AppTypography.fontFamily,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.brandPrimary,
        brightness: Brightness.dark,
      ),
    );

    final scheme = base.colorScheme;

    return base.copyWith(
      textTheme: base.textTheme
          .copyWith(
            displayLarge: AppTypography.h1,
            displayMedium: AppTypography.h2,
            displaySmall: AppTypography.h3,
            headlineMedium: AppTypography.h4,
            headlineSmall: AppTypography.h5,
            titleMedium: AppTypography.h6,
            bodyLarge: AppTypography.body,
            bodyMedium: AppTypography.body,
            bodySmall: AppTypography.bodySmall,
          )
          .apply(
            bodyColor: scheme.onSurface,
            displayColor: scheme.onSurface,
          ),

      appBarTheme: AppBarTheme(
        centerTitle: true,
        backgroundColor: scheme.surface,
        foregroundColor: scheme.onSurface,
        elevation: 0,
      ),

      switchTheme: SwitchThemeData(
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return scheme.primary;
          return scheme.surfaceContainerHighest;
        }),
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return Colors.white;
          return scheme.onSurfaceVariant;
        }),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: scheme.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: scheme.outline),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: scheme.outline),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: scheme.primary, width: 2),
        ),
      ),

      dividerTheme: DividerThemeData(
        color: scheme.outlineVariant,
        thickness: 1,
      ),
    );
  }

  // =========================
  // High-Contrast Variants
  // =========================

  static ThemeData highContrastLight() {
    final base = light();
    final scheme = base.colorScheme;

    final hcScheme = scheme.copyWith(
      primary: const Color(0xFF005A66),
      onPrimary: Colors.white,
      secondary: const Color(0xFF006B5E),
      onSecondary: Colors.white,
      surface: Colors.white,
      onSurface: Colors.black,
      outline: Colors.black,
      outlineVariant: Colors.black,
    );

    return base.copyWith(
      colorScheme: hcScheme,

      dividerTheme: const DividerThemeData(
        color: Colors.black,
        thickness: 1.5,
      ),

      inputDecorationTheme: base.inputDecorationTheme.copyWith(
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.black, width: 1.4),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.black, width: 1.4),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: hcScheme.primary, width: 2.2),
        ),
        labelStyle: const TextStyle(color: Colors.black),
        hintStyle: const TextStyle(color: Colors.black87),
      ),

      switchTheme: SwitchThemeData(
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return hcScheme.primary;
          return Colors.black;
        }),
        thumbColor: WidgetStateProperty.resolveWith((states) {
          return Colors.white;
        }),
      ),

      textTheme: base.textTheme.apply(
        bodyColor: Colors.black,
        displayColor: Colors.black,
      ),
    );
  }

  static ThemeData highContrastDark() {
    final base = dark();
    final scheme = base.colorScheme;

    final hcScheme = scheme.copyWith(
      primary: const Color(0xFF33D6E5),
      onPrimary: Colors.black,
      secondary: const Color(0xFF55F0D8),
      onSecondary: Colors.black,
      surface: const Color(0xFF0B0F10),
      onSurface: Colors.white,
      outline: Colors.white,
      outlineVariant: Colors.white,
    );

    return base.copyWith(
      colorScheme: hcScheme,

      dividerTheme: const DividerThemeData(
        color: Colors.white,
        thickness: 1.5,
      ),

      inputDecorationTheme: base.inputDecorationTheme.copyWith(
        fillColor: const Color(0xFF0B0F10),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.white, width: 1.4),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.white, width: 1.4),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: hcScheme.primary, width: 2.2),
        ),
      ),

      switchTheme: SwitchThemeData(
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return hcScheme.primary;
          return Colors.white;
        }),
        thumbColor: WidgetStateProperty.resolveWith((states) {
          return Colors.black;
        }),
      ),

      textTheme: base.textTheme.apply(
        bodyColor: Colors.white,
        displayColor: Colors.white,
      ),
    );
  }
}