# Figma → Flutter Handoff (SWEN 661)

## Overview
This project implements the CareConnect-LH UI using a structured design-token approach. Figma is treated as the source of truth for colors and typography, while Flutter provides maintainable UI structure and accessibility behavior.

## What Figma Provides
- Screen layout reference (frames and hierarchy)
- Design tokens (colors, typography scale)
- Assets (logo)

## What Flutter Implements
- Widget structure and navigation
- Reusable components
- Handedness behavior (left/right reach bias + toggle affordance)
- Accessibility overlay for review

## Implementation Pattern
1. Export/confirm tokens in Figma
2. Encode tokens in `lib/core/tokens/*`
3. Apply tokens through `lib/core/theme/app_theme.dart`
4. Build screens using theme styles and shared widgets

