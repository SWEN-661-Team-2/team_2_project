enum HandednessMode {
  left,
  right,
  toggle,
}

extension HandednessModeLabel on HandednessMode {
  String get label {
    switch (this) {
      case HandednessMode.left:
        return 'Left-Handed View';
      case HandednessMode.right:
        return 'Right-Handed View';
      case HandednessMode.toggle:
        return 'Toggle Mode';
    }
  }
}
