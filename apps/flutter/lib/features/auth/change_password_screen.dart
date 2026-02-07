// lib/features/auth/change_password_screen.dart

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../widgets/reach_scaffold.dart';
import '../../core/accessibility/app_settings_controller.dart';

class ChangePasswordScreen extends StatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  State<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  final _oldController = TextEditingController();
  final _newController = TextEditingController();
  final _confirmController = TextEditingController();

  bool _showOld = false;
  bool _showNew = false;
  bool _showConfirm = false;

  String? _error;

  @override
  void dispose() {
    _oldController.dispose();
    _newController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  void _save() {
    final newPw = _newController.text;
    final confirm = _confirmController.text;

    if (newPw != confirm) {
      setState(() => _error = 'New password and confirmation must match.');
      return;
    }

    setState(() => _error = null);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Password updated (placeholder)')),
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<AppSettingsController>();
    final isLeftAligned = settings.isLeftAligned;

    return ReachScaffold(
      title: 'Change password',
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            key: const Key('change_old'),
            controller: _oldController,
            obscureText: !_showOld,
            decoration: InputDecoration(
              labelText: 'Old password',
              prefixIcon: isLeftAligned
                  ? IconButton(
                      onPressed: () => setState(() => _showOld = !_showOld),
                      icon: Icon(_showOld ? Icons.visibility_off : Icons.visibility),
                    )
                  : null,
              suffixIcon: !isLeftAligned
                  ? IconButton(
                      onPressed: () => setState(() => _showOld = !_showOld),
                      icon: Icon(_showOld ? Icons.visibility_off : Icons.visibility),
                    )
                  : null,
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            key: const Key('change_new'),
            controller: _newController,
            obscureText: !_showNew,
            decoration: InputDecoration(
              labelText: 'New password',
              prefixIcon: isLeftAligned
                  ? IconButton(
                      onPressed: () => setState(() => _showNew = !_showNew),
                      icon: Icon(_showNew ? Icons.visibility_off : Icons.visibility),
                    )
                  : null,
              suffixIcon: !isLeftAligned
                  ? IconButton(
                      onPressed: () => setState(() => _showNew = !_showNew),
                      icon: Icon(_showNew ? Icons.visibility_off : Icons.visibility),
                    )
                  : null,
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            key: const Key('change_confirm'),
            controller: _confirmController,
            obscureText: !_showConfirm,
            decoration: InputDecoration(
              labelText: 'Confirm new password',
              errorText: _error,
              prefixIcon: isLeftAligned
                  ? IconButton(
                      onPressed: () => setState(() => _showConfirm = !_showConfirm),
                      icon: Icon(_showConfirm ? Icons.visibility_off : Icons.visibility),
                    )
                  : null,
              suffixIcon: !isLeftAligned
                  ? IconButton(
                      onPressed: () => setState(() => _showConfirm = !_showConfirm),
                      icon: Icon(_showConfirm ? Icons.visibility_off : Icons.visibility),
                    )
                  : null,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 52,
            child: FilledButton(
              key: const Key('change_save'),
              onPressed: _save,
              child: const Text('Save'),
            ),
          ),
        ],
      ),
    );
  }
}