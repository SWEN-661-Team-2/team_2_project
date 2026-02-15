import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PatientCriticality } from '../../models/Patient';
import { formatDtYmdHmm } from '../../utils/dtFormat';

// --- UTILITY FUNCTIONS MOVED TO TOP TO PREVENT REFERENCE ERRORS ---

function getCriticalityTag(criticality) {
  if (!criticality) return '';
  switch (criticality) {
    case PatientCriticality.CRITICAL: return 'CRITICAL';
    case PatientCriticality.HIGH: return 'HIGH';
    case PatientCriticality.MEDIUM: return 'MED';
    case PatientCriticality.LOW: return 'LOW';
    default: return '';
  }
}

function getCriticalityText(criticality) {
  if (!criticality) return '—';
  switch (criticality) {
    case PatientCriticality.CRITICAL: return 'Critical';
    case PatientCriticality.HIGH: return 'High';
    case PatientCriticality.MEDIUM: return 'Medium';
    case PatientCriticality.LOW: return 'Low';
    default: return '—';
  }
}

function getCriticalityColor(criticality) {
  if (!criticality) return '#999999';
  switch (criticality) {
    case PatientCriticality.CRITICAL: return '#D32F2F';
    case PatientCriticality.HIGH: return '#F57C00';
    case PatientCriticality.MEDIUM: return '#455A64';
    case PatientCriticality.LOW: return '#388E3C';
    default: return '#999999';
  }
}

const getPatientAccessibilityLabel = (patient, visitText, typeDescription) => {
  const criticality = getCriticalityText(patient.criticality);
  return `${typeDescription}: ${patient.fullName}. Status: ${criticality}. ${visitText}.`;
};

// --- COMPONENTS ---

export const PriorityPatientCard = ({ patient, index, onPress }) => {
  const criticalityTag = getCriticalityTag(patient.criticality);
  const criticalityColor = getCriticalityColor(patient.criticality);
  const visitText = patient.nextVisit
    ? `Visit: ${formatDtYmdHmm(patient.nextVisit)}`
    : 'No upcoming visit';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      testID={`patient_card_${index}`}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={getPatientAccessibilityLabel(patient, visitText, "Priority Patient")}
      accessibilityHint="Double tap to view patient details"
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.visitText}>{visitText}</Text>
        </View>
        {criticalityTag && (
          <View style={[styles.tag, { backgroundColor: `${criticalityColor}26`, borderColor: criticalityColor }]} importantForAccessibility="no-hide-descendants">
            <Text style={[styles.tagText, { color: criticalityColor }]}>{criticalityTag}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const VisitPatientCard = ({ patient, index, onPress }) => {
  const criticalityTag = getCriticalityTag(patient.criticality);
  const criticalityColor = getCriticalityColor(patient.criticality);
  const visitText = patient.nextVisit
    ? `Visit: ${formatDtYmdHmm(patient.nextVisit)}`
    : 'No upcoming visit';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      testID={`patient_card_${index}`}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={getPatientAccessibilityLabel(patient, visitText, "Upcoming Visit")}
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.visitText}>{visitText}</Text>
        </View>
        {criticalityTag && (
          <View style={[styles.tag, { backgroundColor: `${criticalityColor}26`, borderColor: criticalityColor }]} importantForAccessibility="no-hide-descendants">
            <Text style={[styles.tagText, { color: criticalityColor }]}>{criticalityTag}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const PatientCard = ({ patient, index, onPress }) => {
  const criticalityTag = getCriticalityTag(patient.criticality);
  const criticalityColor = getCriticalityColor(patient.criticality);
  const criticalityText = getCriticalityText(patient.criticality);
  const visitText = patient.nextVisit
    ? `Next Appt.: ${formatDtYmdHmm(patient.nextVisit)}`
    : 'No upcoming visit';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      testID={`patient_card_${index}`}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={getPatientAccessibilityLabel(patient, visitText, "Patient Record")}
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.criticalityText}>{criticalityText}</Text>
          <Text style={styles.visitText}>{visitText}</Text>
        </View>
        {criticalityTag && (
          <View style={[styles.tag, { backgroundColor: `${criticalityColor}26`, borderColor: criticalityColor }]} importantForAccessibility="no-hide-descendants">
            <Text style={[styles.tagText, { color: criticalityColor }]}>{criticalityTag}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: { flex: 1, marginRight: 8 },
  patientName: { fontSize: 16, fontWeight: '600', color: '#000000', marginBottom: 4 },
  criticalityText: { fontSize: 13, color: '#999999', marginBottom: 2 },
  visitText: { fontSize: 13, color: '#999999' },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: '700' },
});

export default PriorityPatientCard;