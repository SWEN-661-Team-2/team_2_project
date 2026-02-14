// lib/features/welcome/welcome_screen.dart
import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';

import '../../core/tokens/spacing.dart';
import '../../widgets/app_logo.dart';
import '../../app/routes.dart';

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  late final PageController _pageController;
  Timer? _timer;

  final List<String> _carouselImages = const [
    'assets/carousel/caregiver_pair_01.jpg',
    'assets/carousel/caregiver_pair_02.jpg',
    'assets/carousel/caregiver_pair_03.jpg',
    'assets/carousel/caregiver_pair_04.jpg',
    'assets/carousel/caregiver_pair_05.jpg',
    'assets/carousel/caregiver_pair_06.jpg',
    'assets/carousel/caregiver_pair_07.jpg',
    'assets/carousel/caregiver_pair_08.jpg',
    'assets/carousel/caregiver_pair_09.jpg',
    'assets/carousel/caregiver_pair_10.jpg',
  ];

  int _index = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _index = math.Random().nextInt(_carouselImages.length);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _pageController.jumpToPage(_index);
      }
    });

    _timer = Timer.periodic(const Duration(seconds: 4), (_) {
      if (!mounted) return;
      final next = (_index + 1) % _carouselImages.length;
      setState(() => _index = next);
      _pageController.animateToPage(
        next,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final w = constraints.maxWidth;

            // Clamp sizes so they match your reference and never get “giant”.
            final titleSize = math.min(44.0, math.max(32.0, w * 0.10)); // ~32–44
            final taglineSize = math.min(22.0, math.max(16.0, w * 0.052)); // ~16–22
            final subSize = math.min(16.0, math.max(12.0, w * 0.038)); // ~12–16

            return SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Align(
                      alignment: Alignment.topRight,
                      child: IconButton(
                        key: const Key('welcome_settings'),
                        icon: const Icon(Icons.settings),
                        onPressed: () {
                          Navigator.of(context).pushNamed(Routes.login);
                        },
                      ),
                    ),

                    // Smaller logo to match the slide
                    const AppLogo(size: 120),

                    const SizedBox(height: 10),

                    Text(
                      'CareConnect',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: titleSize,
                        fontWeight: FontWeight.w800,
                        height: 1.05,
                        color: const Color(0xFF0A7A8A),
                      ),
                    ),

                    const SizedBox(height: 10),

                    Text(
                      'Supporting Care, Connecting Hearts',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: taglineSize,
                        fontWeight: FontWeight.w700,
                        height: 1.15,
                        color: const Color(0xFF0A7A8A),
                      ),
                    ),

                    const SizedBox(height: 8),

                    Text(
                      'Empowering caregivers and care recipients\nwith compassion.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: subSize,
                        height: 1.35,
                        fontWeight: FontWeight.w500,
                        color: Colors.grey.shade600,
                      ),
                    ),

                    const SizedBox(height: AppSpacing.lg),

                    ClipRRect(
                      borderRadius: BorderRadius.circular(18),
                      child: AspectRatio(
                        aspectRatio: 16 / 10,
                        child: PageView.builder(
                          controller: _pageController,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _carouselImages.length,
                          itemBuilder: (_, i) =>
                              Image.asset(_carouselImages[i], fit: BoxFit.cover),
                        ),
                      ),
                    ),

                    const SizedBox(height: AppSpacing.xl),

                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        key: const Key('welcome_continue'),
                        onPressed: () {
                          Navigator.of(context).pushNamed(Routes.login);
                        },
                        child: const Text('Continue'),
                      ),
                    ),

                    const SizedBox(height: AppSpacing.lg),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}