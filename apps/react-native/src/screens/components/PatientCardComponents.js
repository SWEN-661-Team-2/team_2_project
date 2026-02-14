/**
 * Patient Card Components with Accessibility support
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PatientCriticality } from '../../models/Patient';
import { formatDtYmdHmm } from '../../utils/dtFormat';

// Helper to generate a consistent accessibility label across all card types
const getPatientAccessibilityLabel = (patient, visitText, typeDescription) => {
  const criticality = getCriticalityText(patient.criticality);
  return `${typeDescription}: ${patient.fullName}. Status: ${criticality}. ${visitText}.`;
};

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
      // Accessibility Props
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={getPatientAccessibilityLabel(patient, visitText, "Priority Patient")}
      accessibilityHint="Double tap to view patient details and care plan"
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.visitText}>{visitText}</Text>
        </View>

        {criticalityTag && (
          <View
            style={[styles.tag, { backgroundColor: `${criticalityColor}26`, borderColor: criticalityColor }]}
            importantForAccessibility="no-hide-descendants" // The parent button already describes this
          >
            <Text style={[styles.tagText, { color: criticalityColor }]}>
              {criticalityTag}
            </Text>
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
      accessibilityHint="Double tap to open visit checklist"
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.visitText}>{visitText}</Text>
        </View>

        {criticalityTag && (
          <View
            style={[styles.tag, { backgroundColor: `${criticalityColor}26`, borderColor: criticalityColor }]}
            importantForAccessibility="no-hide-descendants"
          >
            <Text style={[styles.tagText, { color: criticalityColor }]}>
              {criticalityTag}
            </Text>
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
      accessibilityHint="Double tap to open full patient profile"
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.criticalityText}>{criticalityText}</Text>
          <Text style={styles.visitText}>{visitText}</Text>
        </View>

        {criticalityTag && (
          <View
            style={[styles.tag, { backgroundColor: `${criticalityColor}26`, borderColor: criticalityColor }]}
            importantForAccessibility="no-hide-descendants"
          >
            <Text style={[styles.tagText, { color: criticalityColor }]}>
              {criticalityTag}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ... (getCriticalityTag, getCriticalityText, getCriticalityColor, and styles remain the same)

export default PriorityPatientCard;