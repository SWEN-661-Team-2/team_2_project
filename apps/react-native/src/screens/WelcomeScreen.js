import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  // Carousel images - using local assets
  const carouselImages = [
    require('../../assets/carousel/caregiver_pair_01.jpg'),
    require('../../assets/carousel/caregiver_pair_02.jpg'),
    require('../../assets/carousel/caregiver_pair_03.jpg'),
    require('../../assets/carousel/caregiver_pair_04.jpg'),
    require('../../assets/carousel/caregiver_pair_05.jpg'),
    require('../../assets/carousel/caregiver_pair_06.jpg'),
    require('../../assets/carousel/caregiver_pair_07.jpg'),
    require('../../assets/carousel/caregiver_pair_08.jpg'),
    require('../../assets/carousel/caregiver_pair_09.jpg'),
    require('../../assets/carousel/caregiver_pair_10.jpg'),
  ];

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % carouselImages.length;
        // Scroll to next image
        scrollViewRef.current?.scrollTo({
          x: next * width,
          animated: true,
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
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
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Settings Icon (top right) */}
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleContinue}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logo}>
          <Image 
            source={require('../../assets/logo/careconnect_logo.png')}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
        </View>

        {/* CareConnect Title */}
        <Text style={styles.title}>CareConnect</Text>

        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            style={styles.carousel}
          >
            {carouselImages.map((uri, index) => (
              <Image
                key={index}
                source={uri}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Carousel Indicators */}
          <View style={styles.indicators}>
            {carouselImages.map((_, index) => (
              <View
                key={index}
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
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
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
    padding: 20,
    paddingTop: 40,
  },
  settingsContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 120,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#0A7A8A',
    textAlign: 'center',
    marginBottom: 32,
  },
  carouselContainer: {
    width: '100%',
    aspectRatio: 16 / 10,
    marginBottom: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  carousel: {
    flex: 1,
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
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#ffffff',
    width: 24,
  },
  continueButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#0A7A8A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  continueText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
