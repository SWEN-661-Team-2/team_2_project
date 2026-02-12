import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHandedness, useTheme } from '../contexts/AppProviders';

export default function HelpSupportScreen({ navigation }) {
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

        <Text style={[styles.title, { color: colors.text }]}>Help / Support</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          If you need help using CareConnect, review the guidance below.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>Common Topics</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          • How to switch handedness layout{'\n'}
          • How to enable accessibility modes{'\n'}
          • How to view tasks and messages{'\n'}
          • How to change notification settings
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>Accessibility</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          CareConnect includes UI-only accessibility profiles (Low Vision, Tremor/Motor, STML,
          Hearing Impaired). Functional mitigations may be implemented later.
        </Text>

        <Text style={[styles.h2, { color: colors.text }]}>Contact</Text>
        <Text style={[styles.p, { color: colors.textSecondary }]}>
          Support is not active in this prototype. For course support, contact your instructor.
        </Text>

        <Text style={[styles.note, { color: colors.textSecondary }]}>
          Tip: In production apps, this screen usually includes email support, FAQs, and a
          “Report a problem” flow.
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