import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:provider/provider.dart';

import '../../core/profile/caregiver_profile.dart';
import '../../core/profile/caregiver_profile_controller.dart';

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
      _hydrateControllers(controller.profile);
    });
  }

  void _hydrateControllers(CaregiverProfile p0) {
    _name.text = p0.name;
    _titleRole.text = p0.titleRole;
    _position.text = p0.position;
    _organization.text = p0.organization;
    _email.text = p0.email;
    _phone.text = p0.phone;
  }

  void _startEdit(CaregiverProfileController controller) {
    _hydrateControllers(controller.profile);
    setState(() => _editing = true);
  }

  void _cancelEdit(CaregiverProfileController controller) {
    _hydrateControllers(controller.profile);
    setState(() => _editing = false);
  }

  Future<void> _save(CaregiverProfileController controller) async {
    final updated = CaregiverProfile(
      photoPath: controller.profile.photoPath,
      name: _name.text.trim(),
      titleRole: _titleRole.text.trim(),
      position: _position.text.trim(),
      organization: _organization.text.trim(),
      email: _email.text.trim(),
      phone: _phone.text.trim(),
    );

    await controller.save(updated);

    if (!mounted) return;
    setState(() => _editing = false);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Profile saved')),
    );
  }

  Future<void> _pickProfilePhoto(CaregiverProfileController controller) async {
    // Web/desktop support can be added later; keep it simple for mobile.
    if (kIsWeb || !(Platform.isAndroid || Platform.isIOS)) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Photo upload is supported on Android/iOS for now.'),
        ),
      );
      return;
    }

    try {
      final XFile? picked = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 85,
      );

      if (picked == null) return;

      final docsDir = await getApplicationDocumentsDirectory();
      final photosDir = Directory(p.join(docsDir.path, 'profile_photos'));
      if (!await photosDir.exists()) {
        await photosDir.create(recursive: true);
      }

      final ext = p.extension(picked.path).isEmpty ? '.jpg' : p.extension(picked.path);
      final filename = 'caregiver_${DateTime.now().millisecondsSinceEpoch}$ext';
      final savedPath = p.join(photosDir.path, filename);

      await File(picked.path).copy(savedPath);

      final oldPath = controller.profile.photoPath;

      await controller.updateField(photoPath: savedPath);

      // Optional cleanup
      if (oldPath != null && oldPath.trim().isNotEmpty && oldPath != savedPath) {
        try {
          final oldFile = File(oldPath);
          if (await oldFile.exists()) {
            await oldFile.delete();
          }
        } catch (_) {
          // ignore cleanup failure
        }
      }

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Photo updated')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not pick photo: $e')),
      );
    }
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
    final controller = context.watch<CaregiverProfileController>();

    return FutureBuilder<void>(
      future: _loadFuture,
      builder: (context, snap) {
        if (snap.connectionState != ConnectionState.done || !controller.loaded) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        return Scaffold(
          appBar: AppBar(
            title: const Text('Profile information'),
          ),
          body: _editing
              ? _EditView(
                  profile: controller.profile,
                  name: _name,
                  titleRole: _titleRole,
                  position: _position,
                  organization: _organization,
                  email: _email,
                  phone: _phone,
                  onCancel: () => _cancelEdit(controller),
                  onSave: () => _save(controller),
                  onTapPhoto: () => _pickProfilePhoto(controller),
                )
              : _ReadOnlyView(
                  profile: controller.profile,
                  onEdit: () => _startEdit(controller),
                ),
        );
      },
    );
  }
}

class _ReadOnlyView extends StatelessWidget {
  final CaregiverProfile profile;
  final VoidCallback onEdit;

  const _ReadOnlyView({
    required this.profile,
    required this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    String blankAsDash(String v) => v.trim().isEmpty ? '—' : v.trim();

    return ListView(
      key: const Key('profile_readonly'),
      padding: const EdgeInsets.all(16),
      children: [
        Center(
          child: _PhotoCircle(photoPath: profile.photoPath, onTap: null),
        ),
        const SizedBox(height: 16),
        _InfoTile(label: 'Name', value: blankAsDash(profile.name)),
        _InfoTile(label: 'Title / Role', value: blankAsDash(profile.titleRole)),
        _InfoTile(label: 'Position', value: blankAsDash(profile.position)),
        _InfoTile(label: 'Organization', value: blankAsDash(profile.organization)),
        _InfoTile(label: 'Email', value: blankAsDash(profile.email)),
        _InfoTile(label: 'Phone', value: blankAsDash(profile.phone)),
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

class _EditView extends StatelessWidget {
  final CaregiverProfile profile;

  final TextEditingController name;
  final TextEditingController titleRole;
  final TextEditingController position;
  final TextEditingController organization;
  final TextEditingController email;
  final TextEditingController phone;

  final VoidCallback onCancel;
  final VoidCallback onSave;
  final VoidCallback onTapPhoto;

  const _EditView({
    required this.profile,
    required this.name,
    required this.titleRole,
    required this.position,
    required this.organization,
    required this.email,
    required this.phone,
    required this.onCancel,
    required this.onSave,
    required this.onTapPhoto,
  });

  @override
  Widget build(BuildContext context) {
    return ListView(
      key: const Key('profile_edit_view'),
      padding: const EdgeInsets.all(16),
      children: [
        Center(
          child: _PhotoCircle(photoPath: profile.photoPath, onTap: onTapPhoto),
        ),
        const SizedBox(height: 16),
        const Text('Name'),
        const SizedBox(height: 6),
        TextField(controller: name),
        const SizedBox(height: 12),
        const Text('Title / Role'),
        const SizedBox(height: 6),
        TextField(controller: titleRole),
        const SizedBox(height: 12),
        const Text('Position'),
        const SizedBox(height: 6),
        TextField(controller: position),
        const SizedBox(height: 12),
        const Text('Organization'),
        const SizedBox(height: 6),
        TextField(controller: organization),
        const SizedBox(height: 12),
        const Text('Email'),
        const SizedBox(height: 6),
        TextField(controller: email, keyboardType: TextInputType.emailAddress),
        const SizedBox(height: 12),
        const Text('Phone'),
        const SizedBox(height: 6),
        TextField(controller: phone, keyboardType: TextInputType.phone),
        const SizedBox(height: 20),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                key: const Key('profile_cancel'),
                onPressed: onCancel,
                child: const Text('Cancel'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: FilledButton(
                key: const Key('profile_save'),
                onPressed: onSave,
                child: const Text('Save'),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _PhotoCircle extends StatelessWidget {
  final String? photoPath;
  final VoidCallback? onTap;

  const _PhotoCircle({
    required this.photoPath,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final hasPhoto = photoPath != null && photoPath!.trim().isNotEmpty;

    Widget inner;
    if (hasPhoto && !kIsWeb) {
      final f = File(photoPath!);
      inner = ClipOval(
        child: Image.file(
          f,
          width: 96,
          height: 96,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) => const Center(
            child: Text(
              'Photo',
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
            ),
          ),
        ),
      );
    } else {
      inner = const Center(
        child: Text(
          'Photo',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
        ),
      );
    }

    final circle = Container(
      width: 96,
      height: 96,
      decoration: const BoxDecoration(
        color: Color(0xFF0A8F84),
        shape: BoxShape.circle,
      ),
      child: inner,
    );

    if (onTap == null) return circle;

    return Material(
      color: Colors.transparent,
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: circle,
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  final String label;
  final String value;

  const _InfoTile({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(label, style: const TextStyle(fontWeight: FontWeight.w700)),
        subtitle: Text(value),
      ),
    );
  }
}