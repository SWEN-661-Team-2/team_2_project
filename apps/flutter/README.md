# flutter_app

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

---

## Running on Mobile Devices (Team Convention)

CareConnect is developed **mobile-first**.

### Primary development targets
- Android Emulator (API 36)
- iOS Simulator (iPhone 15 Pro Max)

Chrome/Web is used only for quick layout sanity checks and should not be treated
as a primary development target.

### Run both mobile platforms simultaneously

From the Flutter app directory:

```bash
./scripts/run_mobile.sh
```
---

## Simulator Scrolling Notes (Team Convention)

Scrolling behavior differs slightly between platforms and hardware.

### Android Emulator
- Mouse wheel scrolling works as expected.
- Click-and-drag scrolling also works.

### iOS Simulator (macOS)
- Scrolling **works**, but input method may vary by hardware.
- If mouse wheel or trackpad scrolling does not respond:
  - Use **click + drag (grab and move)** inside the simulator window.
- This is a known iOS Simulator input behavior and not an application bug.

Developers should verify scrollability using **drag gestures** on iOS Simulator.
