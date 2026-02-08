# React Native Welcome Feature

## Overview

This document describes the React Native implementation of the welcome feature from the Flutter app. The welcome screen serves as the entry point for unauthenticated users, displaying the app branding, an auto-rotating carousel of images, and navigation to the login screen.

## Architecture

### File Structure

```
src/
├── screens/
│   └── WelcomeScreen.js             # Main welcome screen
└── ...

App.js                              # Navigation setup
```

## Components

### WelcomeScreen (`src/screens/WelcomeScreen.js`)

The main welcome screen displayed to unauthenticated users.

**Features**:
- Large app logo with brand colors
- App title "CareConnect"
- Auto-rotating image carousel (4-second intervals)
- Carousel progress indicators (dots)
- Settings button (navigates to login)
- Continue button (navigates to login)
- Random starting position for carousel
- Smooth carousel animations

**Carousel Details**:
- 10 placeholder images (using placeholder URLs)
- Auto-rotates every 4 seconds
- Starts at random image on load
- Smooth 300ms animation between images
- Dot indicators show current position
- Non-interactive (scrolling disabled)

**Test IDs**:
- `welcome_settings` - Settings button
- `welcome_continue` - Continue button

## Styling System

### Colors
- Primary: `#0A7A8A` (teal) - Logo, title, buttons
- Background: `#F7FAFB` (light gray) - Screen background
- Surface: `#FFFFFF` (white) - Cards
- Accent: `#E6F7F5` (light teal) - Logo background

### Typography
- Title: 32px, fontWeight 800, teal color
- Body: 16px, fontWeight 600, white color

### Spacing
- Logo container: 220x220dp
- Carousel: 16:10 aspect ratio (like Flutter)
- Padding: 16dp horizontal, 8-16dp vertical
- Carousel interval: 4000ms

## Usage

### Basic Integration

The welcome screen is automatically integrated as part of the auth stack in App.js:

```javascript
// In App.js - Auth Stack
<Stack.Screen name="Welcome" component={WelcomeScreen} />
```

### Navigation

The welcome screen navigates to the login screen in two ways:
1. Settings button press → Navigate to Login
2. Continue button press → Navigate to Login

```javascript
const handleNavigateToLogin = () => {
  navigation.replace('Login');
};
```

## Carousel Implementation

### How It Works

1. **Initialization**
   - Random starting index selected on mount
   - FlatList scrolls to random index without animation
   - Timer started for automatic rotation

2. **Auto-Rotation**
   - Timer fires every 4 seconds
   - Index incremented (wraps around at end)
   - FlatList animates to next image (300ms)

3. **Indicators**
   - Dot for each image
   - Current image dot is larger and darker
   - Updated in real-time as carousel changes

### Image Assets

Currently using placeholder URLs from `placeholder.com`. In production, these should be:

```javascript
// Replace with local assets
import caregiver1 from '../../assets/carousel/caregiver_pair_01.jpg';
import caregiver2 from '../../assets/carousel/caregiver_pair_02.jpg';
// ... etc

const CAROUSEL_IMAGES = [
  { id: '1', source: caregiver1 },
  { id: '2', source: caregiver2 },
  // ...
];
```

Then use local source:
```javascript
<Image source={item.source} style={styles.carouselImage} />
```

## Responsive Design

### Mobile Layout
- Full width with 16dp horizontal padding
- Carousel: 100% width × (width × 10/16) height
- Settings button in top-right
- Continue button: full width

### Tablet Layout
- Same responsive layout adapts naturally
- Touch targets remain >= 44x44dp
- Carousel scales proportionally

## Accessibility Features

- Test IDs for automated testing
- Semantic button press handlers
- High contrast colors (WCAG AA compliant)
- Touch targets >= 44x44dp (44dp for buttons)
- Status bar color management

## Animation Details

### Carousel Animation
- Curve: Linear
- Duration: 300ms per transition
- Type: Horizontal scroll

### Timing
- Initial delay: 100ms (for FlatList to render)
- Auto-rotate interval: 4000ms
- Smooth frame rate: 60fps (React Native default)

## State Management

Simple state management using React hooks:

```javascript
const [currentIndex, setCurrentIndex] = useState(randomIndex);
const flatListRef = useRef(null);
const timerRef = useRef(null);
```

**State Variables**:
- `currentIndex` - Current carousel position
- `flatListRef` - Reference to FlatList for scrolling
- `timerRef` - Reference to interval timer

**Effects**:
- `useEffect` - Setup carousel and auto-rotation timer
- Cleanup: Cancel timer on unmount

## Comparison with Flutter Implementation

| Feature | Flutter | React Native |
|---------|---------|--------------|
| Carousel | PageController + PageView | FlatList + horizontal |
| Auto-rotation | Timer.periodic | setInterval |
| Indicators | Manual widgets | View elements |
| Navigation | Navigator.pushNamed | navigation.replace |
| Animation | Curves.easeOut | Default linear |
| Styling | ThemeData | StyleSheet |

## Integration Points

### With Auth Stack
- Part of unauthenticated user navigation
- Navigates to Login screen
- Replaces history (replace, not push)

### With App Navigation
- Not part of authenticated app screens
- Hidden when user is authenticated
- Accessible only via logout

## Performance Considerations

1. **Memory**
   - Carousel images loaded from network (lightweight)
   - Consider caching strategy for local implementation

2. **Battery**
   - Auto-rotation continues while screen visible
   - Timer cleaned up on unmount
   - No background activity

3. **Network**
   - Currently uses placeholder URLs
   - Consider image optimization for production
   - Implement caching headers

## Future Enhancements

1. **Local Images**
   - Replace placeholder URLs with actual carousel images
   - Optimize image sizes for different screen densities
   - Implement image caching

2. **User Gestures**
   - Allow manual swiping of carousel
   - Pause auto-rotation when user interacts
   - Resume after inactivity

3. **Analytics**
   - Track welcome screen views
   - Monitor carousel engagement
   - Track time spent on welcome

4. **Onboarding**
   - Add slide descriptions
   - Add skip button
   - Multi-step onboarding flow

5. **Personalization**
   - Remember last viewed carousel image
   - Show relevant content based on user type
   - A/B test different carousel images

## Testing

### Unit Tests

```javascript
// Test carousel initialization
test('carousel starts at random index', () => {
  // Verify currentIndex is within valid range
});

// Test navigation
test('continue button navigates to login', () => {
  // Verify navigation.replace('Login') called
});
```

### Integration Tests

```javascript
// Test with Detox or similar
it('should display welcome screen', async () => {
  await expect(element(by.testID('welcome_settings'))).toBeVisible();
  await expect(element(by.testID('welcome_continue'))).toBeVisible();
});

it('should navigate to login on continue', async () => {
  await element(by.testID('welcome_continue')).multiTap();
  await expect(element(by.testID('login_email'))).toBeVisible();
});
```

## Troubleshooting

### Carousel Not Auto-Rotating
- Check if timer is cleared prematurely
- Verify interval is 4000ms
- Check if component is mounted

### Images Not Displaying
- Verify image URLs are accessible
- Check image aspect ratio
- Test with local assets

### Performance Issues
- Monitor FlatList rendering
- Check image file sizes
- Profile with React Native Profiler

## Notes

- Welcome screen is only shown to unauthenticated users
- After login, accessing Welcome requires logout first
- Carousel is non-interactive (no manual scrolling)
- Images are loaded asynchronously from network
- In production, replace placeholder images with real carousel content
