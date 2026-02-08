/**
 * Priority Patient Card Component
 * Used in "Needing Attention" view mode
 * Displays patient name, next visit, and criticality tag
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PatientCriticality } from '../../models/Patient';
import { formatDtYmdHmm } from '../../utils/dtFormat';

const PriorityPatientCard = ({ patient, index, onPress }) => {
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
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.visitText}>{visitText}</Text>
        </View>

        {criticalityTag && (
          <View
            style={[
              styles.tag,
              {
                backgroundColor: `${criticalityColor}26`,
                borderColor: criticalityColor,
              },
            ]}
            testID={`patient_tag_${index}`}
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

/**
 * Visit Patient Card Component
 * Used in "Upcoming Visits" view mode
 * Displays patient name, next visit appointment, and criticality tag
 */
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
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.visitText}>{visitText}</Text>
        </View>

        {criticalityTag && (
          <View
            style={[
              styles.tag,
              {
                backgroundColor: `${criticalityColor}26`,
                borderColor: criticalityColor,
              },
            ]}
            testID={`patient_tag_${index}`}
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

/**
 * Default Patient Card Component
 * Used in "All Patients" view mode
 * Displays patient name, criticality level, next appointment, and criticality tag
 */
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
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.patientName}>{patient.fullName}</Text>
          <Text style={styles.criticalityText}>{criticalityText}</Text>
          <Text style={styles.visitText}>{visitText}</Text>
        </View>

        {criticalityTag && (
          <View
            style={[
              styles.tag,
              {
                backgroundColor: `${criticalityColor}26`,
                borderColor: criticalityColor,
              },
            ]}
            testID={`patient_tag_${index}`}
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

// Utility functions
function getCriticalityTag(criticality) {
  if (!criticality) return '';
  switch (criticality) {
    case PatientCriticality.CRITICAL:
      return 'CRITICAL';
    case PatientCriticality.HIGH:
      return 'HIGH';
    case PatientCriticality.MEDIUM:
      return 'MED';
    case PatientCriticality.LOW:
      return 'LOW';
    default:
      return '';
  }
}

function getCriticalityText(criticality) {
  if (!criticality) return '—';
  switch (criticality) {
    case PatientCriticality.CRITICAL:
      return 'Critical';
    case PatientCriticality.HIGH:
      return 'High';
    case PatientCriticality.MEDIUM:
      return 'Medium';
    case PatientCriticality.LOW:
      return 'Low';
    default:
      return '—';
  }
}

function getCriticalityColor(criticality) {
  if (!criticality) return '#999999'; // grey
  switch (criticality) {
    case PatientCriticality.CRITICAL:
      return '#D32F2F'; // red
    case PatientCriticality.HIGH:
      return '#F57C00'; // orange
    case PatientCriticality.MEDIUM:
      return '#455A64'; // blue-grey
    case PatientCriticality.LOW:
      return '#388E3C'; // green
    default:
      return '#999999';
  }
}

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
  content: {
    flex: 1,
    marginRight: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  criticalityText: {
    fontSize: 13,
    color: '#999999',
    marginBottom: 2,
  },
  visitText: {
    fontSize: 13,
    color: '#999999',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default PriorityPatientCard;
