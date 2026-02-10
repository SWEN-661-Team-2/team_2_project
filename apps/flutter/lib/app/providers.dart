import 'package:provider/provider.dart';
import 'package:provider/single_child_widget.dart';
import 'package:flutter_app/core/accessibility/app_settings_controller.dart';
import 'package:flutter_app/core/profile/caregiver_profile_controller.dart';

class AppProviders {
  const AppProviders._();

  static List<SingleChildWidget> build() => [
    ChangeNotifierProvider<AppSettingsController>(
      create: (_) => AppSettingsController()..load(),
    ),
    ChangeNotifierProvider<CaregiverProfileController>(
      create: (_) => CaregiverProfileController()..load(),
    ),
  ];
}
