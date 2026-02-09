import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

/**
 * Welcome Screen with Auto-Rotating Carousel
 * Matches Flutter WelcomeScreen functionality
 */
const CAROUSEL_IMAGES = [
  { id: '1', uri: 'https://via.placeholder.com/800x500?text=Caregiver+1' },
  { id: '2', uri: 'https://via.placeholder.com/800x500?text=Caregiver+2' },
  { id: '3', uri: 'https://via.placeholder.com/800x500?text=Caregiver+3' },
  { id: '4', uri: 'https://via.placeholder.com/800x500?text=Caregiver+4' },
  { id: '5', uri: 'https://via.placeholder.com/800x500?text=Caregiver+5' },
  { id: '6', uri: 'https://via.placeholder.com/800x500?text=Caregiver+6' },
  { id: '7', uri: 'https://via.placeholder.com/800x500?text=Caregiver+7' },
  { id: '8', uri: 'https://via.placeholder.com/800x500?text=Caregiver+8' },
  { id: '9', uri: 'https://via.placeholder.com/800x500?text=Caregiver+9' },
  { id: '10', uri: 'https://via.placeholder.com/800x500?text=Caregiver+10' },
];

const CAROUSEL_INTERVAL = 4000; // 4 seconds
const ANIMATION_DURATION = 300; // milliseconds

export default function WelcomeScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  // Carousel images (using placeholder URLs for now)
  const carouselImages = [
    'https://picsum.photos/800/500?random=1',
    'https://picsum.photos/800/500?random=2',
    'https://picsum.photos/800/500?random=3',
    'https://picsum.photos/800/500?random=4',
    'https://picsum.photos/800/500?random=5',
    'https://picsum.photos/800/500?random=6',
    'https://picsum.photos/800/500?random=7',
    'https://picsum.photos/800/500?random=8',
    'https://picsum.photos/800/500?random=9',
    'https://picsum.photos/800/500?random=10',
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

  const handleContinue = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
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
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🏥</Text>
          </View>
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
                source={{ uri }}
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
    backgroundColor: '#e0f2fe',
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
    width: width - 40,
    height: '100%',
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
