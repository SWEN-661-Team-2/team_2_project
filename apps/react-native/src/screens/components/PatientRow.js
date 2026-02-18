/**
 * Patient Row Component
 * Displays a patient in a list with name, subtitle, and optional tag
 */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PatientRow({ patient, name, subtitle, tag, color, onPress }) {
  const displayName = patient ? patient.fullName : name;
  const displaySubtitle = patient ? (patient.nextVisit ? patient.nextVisit.toLocaleDateString() : '') : subtitle;
  const showTag = tag && tag.trim().length > 0;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(patient)}>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>{displaySubtitle}</Text>
      </View>
      {showTag && (
        <View style={[styles.tag, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.tagText, { color }]} numberOfLines={1}>{tag}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 12,
    maxWidth: 110,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
