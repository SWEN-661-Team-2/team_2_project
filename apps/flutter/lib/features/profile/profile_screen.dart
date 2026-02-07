import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:provider/provider.dart';

import '../../core/profile/caregiver_profile.dart';
import '../../core/profile/caregiver_profile_controller.dart';
import '../../core/accessibility/app_settings_controller.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _picker = ImagePicker();

  bool _editing = false;

  final _name = TextEditingController();
  final _titleRole = TextEditingController();
  final _position = TextEditingController();
  final _organization = TextEditingController();
  final _email = TextEditingController();
  final _phone = TextEditingController();

  Future<void>? _loadFuture;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_loadFuture != null) return;

    final controller = context.read<CaregiverProfileController>();
    _loadFuture = controller.load().then((_) {
      if (!mounted) return;
      _hydrate(controller.profile);
    });
  }

  void _hydrate(CaregiverProfile p0) {
    _name.text = p0.name;
    _titleRole.text = p0.titleRole;
    _position.text = p0.position;
    _organization.text = p0.organization;
    _email.text = p0.email;
    _phone.text = p0.phone;
  }

  void _startEdit(CaregiverProfileController c) {
    _hydrate(c.profile);
    setState(() => _editing = true);
  }

  void _cancelEdit(CaregiverProfileController c) {
    _hydrate(c.profile);
    setState(() => _editing = false);
  }

  Future<void> _save(CaregiverProfileController c) async {
    await c.save(
      CaregiverProfile(
        photoPath: c.profile.photoPath,
        name: _name.text.trim(),
        titleRole: _titleRole.text.trim(),
        position: _position.text.trim(),
        organization: _organization.text.trim(),
        email: _email.text.trim(),
        phone: _phone.text.trim(),
      ),
    );

    if (!mounted) return;
    setState(() => _editing = false);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Profile saved')),
    );
  }

  Future<void> _pickPhoto(CaregiverProfileController c) async {
    if (kIsWeb || !(Platform.isAndroid || Platform.isIOS)) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Photo upload is supported on Android/iOS for now.'),
        ),
      );
      return;
    }

    final picked = await _picker.pickImage(source: ImageSource.gallery);
    if (picked == null) return;

    final dir = await getApplicationDocumentsDirectory();
    final photos = Directory(p.join(dir.path, 'profile_photos'));
    if (!await photos.exists()) {
      await photos.create(recursive: true);
    }

    final ext = p.extension(picked.path);
    final saved = p.join(
      photos.path,
      'caregiver_${DateTime.now().millisecondsSinceEpoch}$ext',
    );

    await File(picked.path).copy(saved);
    await c.updateField(photoPath: saved);

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Photo updated')),
    );
  }

  @override
  void dispose() {
    _name.dispose();
    _titleRole.dispose();
    _position.dispose();
    _organization.dispose();
    _email.dispose();
    _phone.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.watch<CaregiverProfileController>();
    final settings = context.watch<AppSettingsController>();

    return FutureBuilder<void>(
      future: _loadFuture,
      builder: (context, snap) {
        if (!c.loaded) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        return Scaffold(
          appBar: AppBar(title: const Text('Profile information')),
          body: _editing
              ? _EditView(
                  key: const Key('profile_edit_view'),
                  profile: c.profile,
                  name: _name,
                  titleRole: _titleRole,
                  position: _position,
                  organization: _organization,
                  email: _email,
                  phone: _phone,
                  onSave: () => _save(c),
                  onCancel: () => _cancelEdit(c),
                  onTapPhoto: () => _pickPhoto(c),
                  isLeftAligned: settings.isLeftAligned,
                )
              : _ReadOnlyView(
                  profile: c.profile,
                  onEdit: () => _startEdit(c),
                ),
        );
      },
    );
  }
}

/* ========================= READ ONLY ========================= */

class _ReadOnlyView extends StatelessWidget {
  final CaregiverProfile profile;
  final VoidCallback onEdit;

  const _ReadOnlyView({
    required this.profile,
    required this.onEdit,
  });

  String _dash(String v) => v.trim().isEmpty ? '—' : v;

  @override
  Widget build(BuildContext context) {
    return ListView(
      key: const Key('profile_readonly'),
      padding: const EdgeInsets.all(16),
      children: [
        Center(child: _PhotoCircle(photoPath: profile.photoPath)),
        const SizedBox(height: 16),
        _InfoTile(label: 'Name', value: _dash(profile.name)),
        _InfoTile(label: 'Title / Role', value: _dash(profile.titleRole)),
        _InfoTile(label: 'Position', value: _dash(profile.position)),
        _InfoTile(label: 'Organization', value: _dash(profile.organization)),
        _InfoTile(label: 'Email', value: _dash(profile.email)),
        _InfoTile(label: 'Phone', value: _dash(profile.phone)),
        const SizedBox(height: 16),
        FilledButton(
          key: const Key('profile_edit'),
          onPressed: onEdit,
          child: const Text('Edit Profile'),
        ),
      ],
    );
  }
}

/* ========================= EDIT ========================= */

class _EditView extends StatelessWidget {
  final CaregiverProfile profile;
  final TextEditingController name;
  final TextEditingController titleRole;
  final TextEditingController position;
  final TextEditingController organization;
  final TextEditingController email;
  final TextEditingController phone;
  final VoidCallback onSave;
  final VoidCallback onCancel;
  final VoidCallback onTapPhoto;
  final bool isLeftAligned;

  const _EditView({
    super.key,
    required this.profile,
    required this.name,
    required this.titleRole,
    required this.position,
    required this.organization,
    required this.email,
    required this.phone,
    required this.onSave,
    required this.onCancel,
    required this.onTapPhoto,
    required this.isLeftAligned,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      key: const Key('profile_edit'),
      padding: const EdgeInsets.all(16),
      children: [
        Center(child: _PhotoCircle(photoPath: profile.photoPath, onTap: onTapPhoto)),
        const SizedBox(height: 16),
        TextField(controller: name),
        TextField(controller: titleRole),
        TextField(controller: position),
        TextField(controller: organization),
        TextField(controller: email),
        TextField(controller: phone),
        const SizedBox(height: 20),
        FilledButton(
          key: const Key('profile_save'),
          onPressed: onSave,
          child: const Text('Save'),
        ),
        const SizedBox(height: 12),
        OutlinedButton(
          key: const Key('profile_cancel'),
          onPressed: onCancel,
          child: const Text('Cancel'),
        ),
      ],
    );
  }
}

/* ========================= SHARED ========================= */

class _PhotoCircle extends StatelessWidget {
  final String? photoPath;
  final VoidCallback? onTap;

  const _PhotoCircle({required this.photoPath, this.onTap});

  @override
  Widget build(BuildContext context) {
    final child = photoPath != null
        ? ClipOval(
            child: Image.file(
              File(photoPath!),
              width: 96,
              height: 96,
              fit: BoxFit.cover,
            ),
          )
        : const Center(child: Text('Photo'));

    final circle = Container(
      width: 96,
      height: 96,
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        color: Color(0xFF0A8F84),
      ),
      child: child,
    );

    return onTap == null
        ? circle
        : InkWell(onTap: onTap, customBorder: const CircleBorder(), child: circle);
  }
}

class _InfoTile extends StatelessWidget {
  final String label;
  final String value;

  const _InfoTile({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(value),
      ),
    );
  }
}