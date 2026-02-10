import 'package:flutter/foundation.dart';

enum TextSizeMode { small, medium, large, extraLarge }

enum AccessibilityMode {
  standard,
  leftHanded,
  lowVision,
  tremorSupport,
  hearingImpaired,
  guidedMode,
}

extension AccessibilityModeX on AccessibilityMode {
  String get title {
    switch (this) {
      case AccessibilityMode.standard:
        return 'Standard';
      case AccessibilityMode.leftHanded:
        return 'Left-Handed';
      case AccessibilityMode.lowVision:
        return 'Low Vision';
      case AccessibilityMode.tremorSupport:
        return 'Tremor Support';
      case AccessibilityMode.hearingImpaired:
        return 'Hearing Impaired';
      case AccessibilityMode.guidedMode:
        return 'Guided Mode';
    }
  }

  String get subtitle {
    switch (this) {
      case AccessibilityMode.standard:
        return 'Default layout and interactions';
      case AccessibilityMode.leftHanded:
        return 'Controls and navigation optimized for left-hand use';
      case AccessibilityMode.lowVision:
        return 'Enhanced contrast, larger touch targets, bolder borders';
      case AccessibilityMode.tremorSupport:
        return 'Extra spacing, larger buttons, stabilized inputs';
      case AccessibilityMode.hearingImpaired:
        return 'Visual alerts, haptic feedback, text with all icons';
      case AccessibilityMode.guidedMode:
        return 'Step-by-step guidance, confirmations, simplified navigation';
    }
  }
}

class AppSettings extends ChangeNotifier {
  TextSizeMode textSize = TextSizeMode.medium;

  /// “Day/Night” style toggle (you can wire it to Theme later)
  bool highContrast = false;

  /// Option B: one “active” accessibility mode at a time
  AccessibilityMode activeMode = AccessibilityMode.standard;

  void setTextSize(TextSizeMode mode) {
    textSize = mode;
    notifyListeners();
  }

  void setHighContrast(bool v) {
    highContrast = v;
    notifyListeners();
  }

  void setActiveMode(AccessibilityMode mode) {
    activeMode = mode;
    notifyListeners();
  }
}
