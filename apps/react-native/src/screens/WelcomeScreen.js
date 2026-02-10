/**
 * Welcome Screen
 * Equivalent to Flutter's WelcomeScreen
 * 
 * Displays app branding, carousel of images, and navigation to login
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Carousel Image Assets
 * In a real app, these would be imported from an assets folder
 * Using placeholder data for now (removed external image URLs to prevent loading issues)
 */
const CAROUSEL_IMAGES = [
  { id: '1', color: '#4A90E2', text: 'Compassionate Care' },
  { id: '2', color: '#7B68EE', text: 'Professional Support' },
  { id: '3', color: '#50C878', text: 'Dedicated Service' },
  { id: '4', color: '#FF6B6B', text: 'Patient-Centered' },
  { id: '5', color: '#4ECDC4', text: 'Quality Healthcare' },
  { id: '6', color: '#FFD93D', text: 'Reliable Care' },
  { id: '7', color: '#95E1D3', text: 'Expert Guidance' },
  { id: '8', color: '#F38181', text: 'Trusted Partners' },
  { id: '9', color: '#AA96DA', text: 'Caring Hearts' },
  { id: '10', color: '#FCBAD3', text: 'Professional Excellence' },
];

const CAROUSEL_INTERVAL = 4000; // 4 seconds
const ANIMATION_DURATION = 300; // milliseconds

export default function WelcomeScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.floor(Math.random() * CAROUSEL_IMAGES.length)
  );
  const flatListRef = useRef(null);
  const timerRef = useRef(null);
  const { width } = Dimensions.get('window');

  // Setup carousel auto-rotation
  useEffect(() => {
    // Jump to initial random index
    if (flatListRef.current) {
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: currentIndex,
            animated: false,
          });
        }
      }, 100);
    }

    // Setup timer for automatic carousel rotation
    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % CAROUSEL_IMAGES.length;
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: next,
            animated: true,
          });
        }
        return next;
      });
    }, CAROUSEL_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleNavigateToLogin = () => {
    navigation.replace('Login');
  };

  const handleSettingsPress = () => {
    // Settings button navigates to login (like Flutter version)
    navigation.replace('Login');
  };

  const renderCarouselImage = ({ item }) => (
    <View style={[styles.carouselItem, { width }]}>
      <View style={[styles.carouselImage, { backgroundColor: item.color }]}>
        <Text style={styles.carouselText}>{item.text}</Text>
      </View>
    </View>
  );

  const onViewableItemsChanged = ({ viewableItems: vItems }) => {
    if (vItems.length > 0 && vItems[0].index !== null) {
      setCurrentIndex(vItems[0].index);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FAFB" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings Button */}
        <TouchableOpacity
          testID="welcome_settings"
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>

        {/* App Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>CC</Text>
          </View>
        </View>

        {/* App Title */}
        <Text style={styles.title}>CareConnect</Text>

        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={CAROUSEL_IMAGES}
            renderItem={renderCarouselImage}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
            scrollEventThrottle={16}
          />

          {/* Carousel Indicators */}
          <View style={styles.indicatorsContainer}>
            {CAROUSEL_IMAGES.map((_, index) => (
              <View
                key={`indicator-${index}`}
                style={[
                  styles.indicator,
                  index === currentIndex && styles.indicatorActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          testID="welcome_continue"
          style={styles.continueButton}
          onPress={handleNavigateToLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: 'center',
  },
  settingsButton: {
    alignSelf: 'flex-end',
    padding: 12,
    marginRight: -8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  logoContainer: {
    marginVertical: 16,
  },
  logo: {
    width: 220,
    height: 220,
    borderRadius: 16,
    backgroundColor: '#E6F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoText: {
    fontSize: 80,
    fontWeight: '800',
    color: '#0A7A8A',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0A7A8A',
    marginBottom: 24,
    textAlign: 'center',
  },
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    height: Dimensions.get('window').width * (10 / 16),
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
  },
  indicatorActive: {
    backgroundColor: '#0A7A8A',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  continueButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#0A7A8A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
