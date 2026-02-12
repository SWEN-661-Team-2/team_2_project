import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHandedness, useTheme } from '../contexts/AppProviders';

export default function PrivacyPolicyScreen({ navigation }) {
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

        <Text style={[styles.title, { color: colors.text }]}>Privacy Policy</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          This Privacy Policy applies to the CareConnect-LH UI prototype.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>1. Data Collection</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          This prototype does not collect, transmit, or sell personal data.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>2. Authentication</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          Login screens and authentication flows are for demonstration only unless integrated
          with a backend service.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>3. Storage</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          Any sample content shown in the app (patients, tasks, messages) is static demo data.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>4. Third-Party Services</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          This prototype does not integrate third-party analytics, advertising, or tracking SDKs.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>5. Changes</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          This policy may be updated as the project evolves.
        </Text>

        <Text style={[styles.note, { color: colors.textSecondary }]}>
          Disclaimer: This is not legal advice. For production healthcare apps, privacy policies
          must be reviewed by legal/compliance teams.
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