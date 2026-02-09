import 'package:flutter/widgets.dart';

class Breakpoints {
  static const double tablet = 600;

  static bool isTablet(BuildContext context) =>
      MediaQuery.sizeOf(context).width >= tablet;
}
