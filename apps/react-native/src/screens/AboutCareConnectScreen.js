import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHandedness, useTheme } from '../contexts/AppProviders';

export default function AboutCareConnectScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isLeftHanded } = useHandedness();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 12 },
          isLeftHanded && styles.headerReversed,
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>About CareConnect</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        <Text style={[styles.h1, { color: colors.text }]}>CareConnect-LH</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          CareConnect is a healthcare-focused caregiver app concept designed with accessibility-first
          UI patterns and support for left-handed and right-handed layouts.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>Version</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>0.1.0 (UI prototype)</Text>

        <Text style={[styles.h2, { color: colors.text }]}>Credits</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          Built for SWEN 661 (UMGC). Team 2 project deliverable.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>Licensing</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          This is a prototype UI implementation. No production licensing terms are provided.
        </Text>

        <Text style={[styles.note, { color: colors.textSecondary }]}>
          Note: This screen is informational only. No personal data is stored here.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerReversed: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  h1: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
  },
  h2: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 18,
    marginBottom: 6,
  },
  p: {
    fontSize: 14,
    lineHeight: 20,
  },
  note: {
    marginTop: 24,
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});