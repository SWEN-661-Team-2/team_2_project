// apps/react-native/src/screens/WelcomeScreen.js
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
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

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

  const handleContinue = () => {
    navigation.navigate('Login');
  };

  const handleSettingsPress = () => {
    // Settings button navigates to login (like Flutter version)
    navigation.replace('Login');
  };

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
            onPress={handleSettingsPress}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo/careconnect_logo.png')}
            style={{ width: 180, height: 180 }}
            resizeMode="contain"
          />
        </View>

        {/* CareConnect Title */}
        <Text style={styles.title}>CareConnect</Text>
        <Text style={styles.tagline}>Supporting Care, Connecting Hearts</Text>
        <Text style={styles.taglineSubtitle}>Empowering caregivers and care recipients with compassion.</Text>

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
    padding: 10,
    paddingTop: 8,
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
  tagline: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#0A7A8A',
    marginBottom: 8,
    marginTop: -16,
  },
  taglineSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
    lineHeight: 22,
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
    width: Dimensions.get('window').width,
    borderRadius: 12,
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
