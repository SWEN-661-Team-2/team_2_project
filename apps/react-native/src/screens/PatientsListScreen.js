/**
 * Patients List Screen
 * Equivalent to Flutter's PatientsListScreen
 * 
 * Displays patients with filtering by view mode:
 * - All Patients: shows all patients with criticality info
 * - Needing Attention: shows patients sorted by criticality level
 * - Upcoming Visits: shows patients with upcoming appointments sorted by visit date
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePatients, PatientViewMode } from '../contexts/PatientsContext';
import PriorityPatientCard, {
  VisitPatientCard,
  PatientCard,
} from './components/PatientCardComponents';
import PatientFilterMenu from './components/PatientFilterMenu';
import HandednessToggleOverlay from '../components/HandednessToggleOverlay';

const PatientsListScreen = ({ navigation }) => {
  const { viewMode, setViewMode, patients } = usePatients();
  const [filterVisible, setFilterVisible] = useState(false);

  const handlePatientPress = (patient) => {
    Alert.alert(
      'Patient Selected',
      `${patient.fullName}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const getTitle = () => {
    switch (viewMode) {
      case PatientViewMode.NEEDING_ATTENTION:
        return 'Needing Attention';
      case PatientViewMode.UPCOMING_VISITS:
        return 'Upcoming Visits';
      case PatientViewMode.ALL:
      default:
        return 'All Patients';
    }
  };

  const getCardComponent = (item, index) => {
    switch (viewMode) {
      case PatientViewMode.NEEDING_ATTENTION:
        return (
          <PriorityPatientCard
            patient={item}
            index={index}
            onPress={() => handlePatientPress(item)}
          />
        );
      case PatientViewMode.UPCOMING_VISITS:
        return (
          <VisitPatientCard
            patient={item}
            index={index}
            onPress={() => handlePatientPress(item)}
          />
        );
      case PatientViewMode.ALL:
      default:
        return (
          <PatientCard
            patient={item}
            index={index}
            onPress={() => handlePatientPress(item)}
          />
        );
    }
  };

  const renderPatientItem = ({ item, index }) => {
    return getCardComponent(item, index);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{getTitle()}</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
          testID="patients_filter_button"
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Patient List */}
      {patients.length > 0 ? (
        <FlatList
          data={patients}
          renderItem={renderPatientItem}
          keyExtractor={(item, index) => `patient_${index}`}
          contentContainerStyle={styles.listContent}
          scrollEnabled
          testID="patients_list"
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No patients found</Text>
        </View>
      )}

      {/* Filter Modal */}
      <PatientFilterMenu
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <HandednessToggleOverlay />
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A7A8A',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
  },
});

export default PatientsListScreen;
