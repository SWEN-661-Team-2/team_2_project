import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../app/routes.dart';
import '../../widgets/app_logo.dart';
import '../../core/tokens/spacing.dart';
import '../../core/accessibility/app_settings_controller.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _showPassword = false;

  bool _emailError = false;
  bool _passwordError = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() {
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    setState(() {
      _emailError = email.isEmpty;
      _passwordError = password.isEmpty;
    });

    if (!_emailError && !_passwordError) {
      Navigator.of(
        context,
      ).pushNamedAndRemoveUntil(Routes.app, (route) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final settingsController = context.watch<AppSettingsController>();
    final isLeftAligned = settingsController.isLeftAligned;

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 24),

              const AppLogo(size: 140),
              const SizedBox(height: 16),

              Text(
                'CareConnect',
                key: const Key('login_title'),
                textAlign: TextAlign.center,
                style: text.displaySmall?.copyWith(
                  fontWeight: FontWeight.w800,
                  color: const Color(0xFF0A7A8A),
                ),
              ),

              const SizedBox(height: 12),

              Text(
                'Access your information securely\nSign in to your account',
                textAlign: TextAlign.center,
                style: text.bodyLarge,
              ),

              const SizedBox(height: 32),

              /// EMAIL
              const Text('Email address'),
              const SizedBox(height: 6),
              TextField(
                key: const Key('login_email'),
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                onChanged: (_) {
                  if (_emailError) {
                    setState(() => _emailError = false);
                  }
                },
                decoration: InputDecoration(
                  hintText: 'Enter your email',
                  errorText: _emailError ? 'Email is required' : null,
                ),
              ),

              const SizedBox(height: 20),

              /// PASSWORD
              const Text('Password'),
              const SizedBox(height: 6),
              TextField(
                key: const Key('login_password'),
                controller: _passwordController,
                obscureText: !_showPassword,
                onChanged: (_) {
                  if (_passwordError) {
                    setState(() => _passwordError = false);
                  }
                },
                decoration: InputDecoration(
                  hintText: 'Enter your password',
                  errorText: _passwordError ? 'Password is required' : null,
                  prefixIcon: isLeftAligned
                      ? IconButton(
                          icon: Icon(
                            _showPassword
                                ? Icons.visibility_off
                                : Icons.visibility,
                          ),
                          onPressed: () {
                            setState(() => _showPassword = !_showPassword);
                          },
                        )
                      : null,
                  suffixIcon: !isLeftAligned
                      ? IconButton(
                          icon: Icon(
                            _showPassword
                                ? Icons.visibility_off
                                : Icons.visibility,
                          ),
                          onPressed: () {
                            setState(() => _showPassword = !_showPassword);
                          },
                        )
                      : null,
                ),
              ),

              const SizedBox(height: 12),

              const SizedBox(height: 12),

              Align(
                alignment: isLeftAligned
                    ? Alignment.centerLeft
                    : Alignment.centerRight,
                child: TextButton(
                  key: const Key('login_forgot'),
                  onPressed: () {},
                  child: const Text('Forgot your password?'),
                ),
              ),

              const SizedBox(height: 20),

              const SizedBox(height: 20),

              SizedBox(
                height: 56,
                child: FilledButton(
                  key: const Key('login_submit'),
                  onPressed: _login,
                  child: const Text('Sign In'),
                ),
              ),

              const SizedBox(height: 32),

              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFFE6F7F5),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Column(
                  children: [
                    Icon(
                      Icons.shield_outlined,
                      size: 36,
                      color: Color(0xFF0A8F84),
                    ),
                    SizedBox(height: 12),
                    Text(
                      'We use bank-level encryption to keep your health information safe and secure.',
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
