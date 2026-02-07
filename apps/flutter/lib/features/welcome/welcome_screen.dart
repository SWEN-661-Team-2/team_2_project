import 'dart:async';
import 'dart:math';
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
    _index = Random().nextInt(_carouselImages.length);

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
    final text = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFB),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: Column(
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

                const AppLogo(size: 220),

                Text(
                  'CareConnect',
                  style: text.displayLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF0A7A8A),
                  ),
                ),

                const SizedBox(height: AppSpacing.lg),

                AspectRatio(
                  aspectRatio: 16 / 10,
                  child: PageView.builder(
                    controller: _pageController,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _carouselImages.length,
                    itemBuilder: (_, i) => Image.asset(
                      _carouselImages[i],
                      fit: BoxFit.cover,
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
        ),
      ),
    );
  }
}
