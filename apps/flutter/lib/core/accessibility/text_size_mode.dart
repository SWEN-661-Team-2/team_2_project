enum TextSizeMode {
  small,
  medium,
  large,
  extraLarge,
}

extension TextSizeModeX on TextSizeMode {
  String get label {
    switch (this) {
      case TextSizeMode.small:
        return 'Small';
      case TextSizeMode.medium:
        return 'Medium';
      case TextSizeMode.large:
        return 'Large';
      case TextSizeMode.extraLarge:
        return 'XL';
    }
  }

  double get textScaleFactor {
    switch (this) {
      case TextSizeMode.small:
        return 0.90;
      case TextSizeMode.medium:
        return 1.00;
      case TextSizeMode.large:
        return 1.15;
      case TextSizeMode.extraLarge:
        return 1.30;
    }
  }
}