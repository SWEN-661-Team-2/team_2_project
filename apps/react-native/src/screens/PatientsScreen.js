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
import { useHandedness } from '../contexts/AppProviders'; // Added for layout support
import PriorityPatientCard, {
  VisitPatientCard,
  PatientCard,
} from './components/PatientCardComponents';
import PatientFilterMenu from './components/PatientFilterMenu';

export default function PatientsScreen({ navigation }) {
  const { viewMode, setViewMode, patients } = usePatients();
  const { isLeftHanded } = useHandedness(); // Consume handedness context
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
    // Shared props for all cards
    const cardProps = {
      patient: item,
      index,
      onPress: () => handlePatientPress(item),
    };

    switch (viewMode) {
      case PatientViewMode.NEEDING_ATTENTION:
        return <PriorityPatientCard {...cardProps} />;
      case PatientViewMode.UPCOMING_VISITS:
        return <VisitPatientCard {...cardProps} />;
      case PatientViewMode.ALL:
      default:
        return <PatientCard {...cardProps} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header respecting handedness */}
      <View style={[
        styles.header, 
        { flexDirection: isLeftHanded ? 'row-reverse' : 'row' }
      ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          testID="back_button"
          accessibilityLabel="Go back"
          accessibilityRole="button"
          accessibilityHint="Navigates to the previous screen"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <Text 
          style={[styles.title, { textAlign: isLeftHanded ? 'right' : 'left' }]}
          accessibilityRole="header"
        >
          {getTitle()}
        </Text>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
          testID="patients_filter_button"
          accessibilityLabel="Filter patients"
          accessibilityRole="button"
          accessibilityHint="Opens menu to change patient view mode"
        >
          <Text style={styles.filterIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Patients List */}
      {patients.length === 0 ? (
        <View style={styles.emptyContainer} accessibilityLiveRegion="polite">
          <Text style={styles.emptyText}>No patients found</Text>
        </View>
      ) : (
        <FlatList
          testID="patients_list"
          data={patients}
          renderItem={({ item, index }) => getCardComponent(item, index)}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Patient list"
          accessibilityRole="list"
        />
      )}

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
    alignItems: 'center',
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
    marginHorizontal: 12,
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