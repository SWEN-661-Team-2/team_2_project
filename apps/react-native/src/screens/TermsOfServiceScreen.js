import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHandedness, useTheme } from '../contexts/AppProviders';

export default function TermsOfServiceScreen({ navigation }) {
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

        <Text style={[styles.title, { color: colors.text }]}>Terms of Service</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          These Terms of Service apply to the CareConnect-LH UI prototype.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>1. Prototype Use</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          This application is a demonstration prototype and is not intended for clinical use.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>2. No Medical Advice</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          CareConnect does not provide medical advice. Always consult licensed professionals.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>3. Availability</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          Features may change or be removed at any time during development.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>4. Liability</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          The project team is not responsible for any outcomes resulting from use of this prototype.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>5. Contact</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          For project inquiries, contact the course team or instructor.
        </Text>

        <Text style={[styles.note, { color: colors.textSecondary }]}>
          Disclaimer: This is placeholder text. Production apps require legal review.
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