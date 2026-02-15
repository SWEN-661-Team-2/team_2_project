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

/**
 * Welcome Screen - CareConnect
 * Hardened for Assignment 6: Accessibility & UI Testing
 */
export default function WelcomeScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % carouselImages.length;
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Settings Button - Accessibility hardened */}
        <View style={styles.settingsContainer}>
          <TouchableOpacity
            testID="welcome_settings_button"
            style={styles.settingsButton}
            onPress={handleSettingsPress}
          >
            <Text style={styles.settingsIcon} aria-hidden="true">⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Logo and Branding - Grouped for Screen Readers */}
        <View 
          style={styles.brandingContainer}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="CareConnect. Supporting Care, Connecting Hearts. Empowering caregivers and care recipients with compassion."
        >
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo/careconnect_logo.png')}
              style={{ width: 180, height: 180 }}
              resizeMode="contain"
              accessibilityLabel="CareConnect Logo"
            />
          </View>
          <Text style={styles.title} testID="welcome_title">CareConnect</Text>
          <Text style={styles.tagline}>Supporting Care, Connecting Hearts</Text>
          <Text style={styles.taglineSubtitle}>
            Empowering caregivers and care recipients with compassion.
          </Text>
        </View>

        {/* Carousel - Informing user of slide changes */}
        <View 
          style={styles.carouselContainer}
          testID="welcome_carousel"
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={`Caregiving illustration ${currentIndex + 1} of ${carouselImages.length}`}
          accessibilityLiveRegion="polite"
        >
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

          {/* Indicators - hidden from screen readers as they are purely visual */}
          <View style={styles.indicators} aria-hidden="true">
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
          testID="welcome_continue_button"
          style={styles.continueButton}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to Login"
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFB' },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 8 },
  settingsContainer: { alignItems: 'flex-end', marginBottom: 10 },
  settingsButton: { padding: 8 },
  settingsIcon: { fontSize: 24 },
  brandingContainer: { alignItems: 'center', marginBottom: 20 },
  logoContainer: { marginBottom: 16 },
  title: { fontSize: 48, fontWeight: '800', color: '#0A7A8A', textAlign: 'center', marginBottom: 10 },
  tagline: { fontSize: 20, fontWeight: '700', textAlign: 'center', color: '#0A7A8A', marginBottom: 8 },
  taglineSubtitle: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 24, paddingHorizontal: 24, lineHeight: 22 },
  carouselContainer: { width: '100%', aspectRatio: 16 / 10, marginBottom: 40, borderRadius: 12, overflow: 'hidden' },
  carousel: { flex: 1 },
  carouselImage: { height: width * (10 / 16), width: width },
  indicators: { flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 16, left: 0, right: 0 },
  indicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.5)', marginHorizontal: 4 },
  indicatorActive: { backgroundColor: '#ffffff', width: 24 },
  continueButton: { width: '100%', height: 56, backgroundColor: '#0A7A8A', borderRadius: 8, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  continueText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
});




