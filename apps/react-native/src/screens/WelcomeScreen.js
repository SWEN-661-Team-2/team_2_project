import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useHandedness, useTheme } from '../contexts/AppProviders';

const { width } = Dimensions.get('window');

/**
 * Welcome Screen
 * React Native equivalent of Flutter WelcomeScreen widget
 */
export default function WelcomeScreen({ navigation }) {
  const { isLeftHanded, toggleHandedness } = useHandedness();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, isLeftHanded && styles.headerReversed]}>
          <Text style={[styles.title, { color: colors.primary }]}>
            CareConnect
          </Text>
          <TouchableOpacity
            style={styles.handednessButton}
            onPress={toggleHandedness}
            accessibilityLabel={`Switch to ${isLeftHanded ? 'right' : 'left'}-handed mode`}
          >
            <Text style={styles.handednessText}>
              {isLeftHanded ? '👈 Left' : '👉 Right'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Welcome to CareConnect
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Accessible UI designed for clinical workflows
          </Text>

          {/* Carousel Placeholder */}
          <View style={[styles.carousel, { backgroundColor: colors.surface }]}>
            <Text style={[styles.carouselText, { color: colors.textSecondary }]}>
              Auto-rotating carousel
            </Text>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            style={[styles.getStartedButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Tasks')}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>

          {/* Quick Links */}
          <View style={styles.quickLinks}>
            <TouchableOpacity
              style={[styles.quickLinkButton, { borderColor: colors.border }]}
              onPress={() => navigation.navigate('Patients')}
            >
              <Text style={[styles.quickLinkText, { color: colors.text }]}>
                👥 Patients
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickLinkButton, { borderColor: colors.border }]}
              onPress={() => navigation.navigate('Schedule')}
            >
              <Text style={[styles.quickLinkText, { color: colors.text }]}>
                📅 Schedule
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={[styles.footer, { color: colors.textSecondary }]}>
          Optimized for left-handed and right-handed caregivers
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  headerReversed: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  handednessButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
  },
  handednessText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369a1',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
  },
  carousel: {
    width: width - 40,
    height: 250,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  carouselText: {
    fontSize: 16,
  },
  getStartedButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickLinks: {
    flexDirection: 'row',
    gap: 12,
  },
  quickLinkButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickLinkText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 32,
  },
});
