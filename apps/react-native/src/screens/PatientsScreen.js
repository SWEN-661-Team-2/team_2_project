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

export default function PatientsScreen({ navigation }) {
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
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with title and filter button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          testID="back_button"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{getTitle()}</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
          testID="patients_filter_button"
        >
          <Text style={styles.filterIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Patients List */}
      {patients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No patients found</Text>
        </View>
      ) : (
        <FlatList
          testID="patients_list"
          data={patients}
          renderItem={renderPatientItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Filter Modal */}
      <PatientFilterMenu
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#0A7A8A',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginLeft: 12,
  },
  filterButton: {
    padding: 8,
  },
  filterIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A7A8A',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});
