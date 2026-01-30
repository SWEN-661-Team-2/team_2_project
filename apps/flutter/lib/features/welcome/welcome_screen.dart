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

    // Random start per load
    _index = Random().nextInt(_carouselImages.length);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      _pageController.jumpToPage(_index);
    });

    // Auto-rotate (no user interaction)
    _timer = Timer.periodic(const Duration(seconds: 4), (_) {
      if (!mounted) return;
      final next = (_index + 1) % _carouselImages.length;
      setState(() => _index = next);
      _pageController.animateToPage(
        next,
        duration: const Duration(milliseconds: 350),
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
            // Mobile-first: reduce vertical padding so logo/title sit higher
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: Column(
              children: [
                Align(
                  alignment: Alignment.topRight,
                  child: _CircleIconButton(
                    icon: Icons.settings,
                    onTap: () {
                      Navigator.of(context).pushNamed(Routes.settings);
                    },
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),

                // Logo (no background circle) — larger
                const AppLogo(size: 220),
                const SizedBox(height: AppSpacing.sm),

                // Title — larger
                Text(
                  'CareConnect',
                  style: text.displayLarge?.copyWith(
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF0A7A8A),
                  ),
                ),

                const SizedBox(height: AppSpacing.lg),

                // Carousel image card
                ClipRRect(
                  borderRadius: BorderRadius.circular(28),
                  child: AspectRatio(
                    aspectRatio: 16 / 10,
                    child: PageView.builder(
                      controller: _pageController,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _carouselImages.length,
                      itemBuilder: (context, i) {
                        return Image.asset(
                          _carouselImages[i],
                          fit: BoxFit.cover,
                        );
                      },
                    ),
                  ),
                ),

                const SizedBox(height: AppSpacing.md),

                _Dots(count: _carouselImages.length, index: _index),

                const SizedBox(height: AppSpacing.xl),

                // Gradient headline
                ShaderMask(
                  shaderCallback: (rect) => const LinearGradient(
                    colors: [
                      Color(0xFF2F80ED),
                      Color(0xFF00A4BB),
                      Color(0xFF6FCF97),
                    ],
                  ).createShader(rect),
                  child: Text(
                    'Supporting Care, Connecting\nHearts',
                    textAlign: TextAlign.center,
                    style: text.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                ),

                const SizedBox(height: AppSpacing.md),

                Text(
                  'Empowering caregivers and care recipients\nwith compassion.',
                  textAlign: TextAlign.center,
                  style: text.titleMedium?.copyWith(
                    color: const Color(0xFF6B7280),
                    height: 1.4,
                  ),
                ),

                const SizedBox(height: 48),

                SizedBox(
                  width: double.infinity,
                  height: 58,
                  child: ElevatedButton(
                    onPressed: () {
                      // Keep your current behavior; swap to Routes.home later if desired
                      Navigator.of(context).pushNamed(Routes.settings);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0A8F84),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(32),
                      ),
                      elevation: 10,
                      shadowColor: Colors.black.withValues(alpha: 0.18),
                    ),
                    child: const Text(
                      'Continue',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
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

class _Dots extends StatelessWidget {
  final int count;
  final int index;

  const _Dots({required this.count, required this.index});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(count, (i) {
        final active = i == index;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          margin: const EdgeInsets.symmetric(horizontal: 6),
          width: active ? 34 : 10,
          height: 10,
          decoration: BoxDecoration(
            color: active ? const Color(0xFF2F80ED) : const Color(0xFF93C5FD),
            borderRadius: BorderRadius.circular(99),
          ),
        );
      }),
    );
  }
}

class _CircleIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _CircleIconButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white.withValues(alpha: 0.9),
      shape: const CircleBorder(),
      elevation: 6,
      shadowColor: Colors.black.withValues(alpha: 0.12),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: SizedBox(
          width: 52,
          height: 52,
          child: Icon(icon, color: const Color(0xFF374151)),
        ),
      ),
    );
  }
}