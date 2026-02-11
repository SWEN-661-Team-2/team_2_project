/**
 * PatientsListScreen.js
 * Handles 4 view modes: needingAttention, upcomingVisits, active, all (tab)
 */

import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHandedness } from '../contexts/AppProviders';
import {
  patientsRepository,
  getCriticalityText,
  getCriticalityTag,
  getCriticalityColor,
} from '../repositories/PatientsRepository';

import HandednessToggleOverlay from '../components/HandednessToggleOverlay';

// ============================================================================
// CONSTANTS
// ============================================================================

export const PatientsViewMode = {
  all:              'all',
  upcomingVisits:   'upcomingVisits',
  needingAttention: 'needingAttention',
  active:           'active',
};

const SortOption = {
  LAST_NAME_AZ: 'LAST_NAME_AZ',
  LAST_NAME_ZA: 'LAST_NAME_ZA',
  CRIT_HIGH_MED_LOW: 'CRIT_HIGH_MED_LOW',
  LOW_MED_HIGH_CRIT: 'LOW_MED_HIGH_CRIT',
  DATE_EARLIEST: 'DATE_EARLIEST',
};

const DateFilter = {
  ALL:      'ALL',
  OVERDUE:  'OVERDUE',
  TODAY:    'TODAY',
  TOMORROW: 'TOMORROW',
};

const TabFilter = {
  ALL_PATIENTS:     'ALL_PATIENTS',
  NEED_ATTENTION:   'NEED_ATTENTION',
  UPCOMING_VISITS:  'UPCOMING_VISITS',
};

// ============================================================================
// HELPERS
// ============================================================================

const critRank = (c) => {
  if (!c) return 99;
  const val = String(c).toUpperCase();

  switch (val) {
    case 'CRITICAL': return 0;
    case 'HIGH':     return 1;
    case 'MEDIUM':   return 2;
    case 'LOW':      return 3;
    default:         return 99;
  }
};

const isOverdue = (date) => {
  if (!date) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date < today;
};

const isToday = (date) => {
  if (!date) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth()    === now.getMonth() &&
    date.getDate()     === now.getDate()
  );
};

const isTomorrow = (date) => {
  if (!date) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth()    === tomorrow.getMonth() &&
    date.getDate()     === tomorrow.getDate()
  );
};

const formatVisitDate = (date) => {
  if (!date) return null;
  return date.toLocaleDateString(undefined, {
    year:   'numeric',
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
};

const applySort = (patients, sortOption) => {
  const sorted = [...patients];
  switch (sortOption) {
    case SortOption.LAST_NAME_AZ:
      return sorted.sort((a, b) => a.lastName.localeCompare(b.lastName));
    case SortOption.LAST_NAME_ZA:
      return sorted.sort((a, b) => b.lastName.localeCompare(a.lastName));
    case SortOption.CRIT_HIGH_MED_LOW:
      return sorted.sort((a, b) => critRank(a.criticality) - critRank(b.criticality));
    case SortOption.LOW_MED_HIGH_CRIT:
      return sorted.sort((a, b) => critRank(b.criticality) - critRank(a.criticality));
    case SortOption.DATE_EARLIEST:
      return sorted.sort((a, b) => {
        if (!a.nextVisit && !b.nextVisit) return 0;
        if (!a.nextVisit) return 1;
        if (!b.nextVisit) return -1;
        return a.nextVisit.getTime() - b.nextVisit.getTime();
      });
    default:
      return sorted;
  }
};

const applyDateFilter = (patients, dateFilter) => {
  switch (dateFilter) {
    case DateFilter.OVERDUE:
      return patients.filter(p => isOverdue(p.nextVisit));
    case DateFilter.TODAY:
      return patients.filter(p => isToday(p.nextVisit));
    case DateFilter.TOMORROW:
      return patients.filter(p => isTomorrow(p.nextVisit));
    default:
      return patients;
  }
};

const applyTabFilter = (patients, tabFilter) => {
  switch (tabFilter) {
    case TabFilter.NEED_ATTENTION:
      return patients.filter(p => p.criticality !== null);
    case TabFilter.UPCOMING_VISITS:
      return patients.filter(p => p.nextVisit !== null);
    default:
      return patients;
  }
};

// ============================================================================
// DEFAULT SORTS PER MODE
// ============================================================================

const defaultSort = (mode) => {
  switch (mode) {
    case PatientsViewMode.upcomingVisits: return SortOption.DATE_EARLIEST;
    case PatientsViewMode.needingAttention: return SortOption.CRIT_HIGH_MED_LOW;
    default: return SortOption.LAST_NAME_AZ;
  }
};

// ============================================================================
// PATIENT CARD
// ============================================================================

function PatientCard({ patient, index, showVisit, showPriority }) {
  const critTag   = getCriticalityTag(patient.criticality);
  const critColor = getCriticalityColor(patient.criticality);
  const overdue   = isOverdue(patient.nextVisit);

  const visitText = patient.nextVisit
    ? `${showVisit === 'next' ? 'Next Appt.: ' : 'Visit: '}${formatVisitDate(patient.nextVisit)}`
    : null;

  const priorityText = patient.criticality
    ? `Priority: ${getCriticalityText(patient.criticality)}`
    : null;

  return (
    <TouchableOpacity
      style={styles.card}
      testID={`patient_${index}`}
      onPress={() => Alert.alert('Patient', patient.fullName)}
    >
      <View style={styles.cardRow}>
        <View style={styles.cardInfo}>
          <Text style={styles.patientName} numberOfLines={1}>
            {patient.fullName}
          </Text>
          {showPriority && priorityText && (
            <Text style={styles.patientSubtitle}>{priorityText}</Text>
          )}
          {visitText && (
            <Text style={[styles.patientSubtitle, overdue && styles.overdueText]}>
              {visitText}
            </Text>
          )}
          {!visitText && !showPriority && (
            <Text style={styles.patientSubtitle}>No upcoming visit</Text>
          )}
        </View>
        {critTag ? (
          <View
            style={[styles.tag, { backgroundColor: critColor + '26' }]}
            testID={`patient_tag_${index}`}
          >
            <Text style={[styles.tagText, { color: critColor }]}>{critTag}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

// ============================================================================
// SORT MENU
// ============================================================================

function SortMenu({ visible, onClose, currentSort, onSortChange, showDateOption }) {
  const options = [
    { label: 'Last Name (A→Z)',       value: SortOption.LAST_NAME_AZ },
    { label: 'Last Name (Z→A)',       value: SortOption.LAST_NAME_ZA },
    { label: 'Criticality (Critical→Low)', value: SortOption.CRIT_HIGH_MED_LOW },
    { label: 'Criticality (Low→Critical)', value: SortOption.LOW_MED_HIGH_CRIT },
    ...(showDateOption ? [{ label: 'Date (Earliest First)', value: SortOption.DATE_EARLIEST }] : []),
  ];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalSheet}>
          <View style={styles.dragHandle} />
          <Text style={styles.modalTitle}>Sort By</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={`${String(opt.value)}-${opt.label}`}
              style={[styles.modalOption, currentSort === opt.value && styles.modalOptionSelected]}
              onPress={() => { onSortChange(opt.value); onClose(); }}
            >
              <Text style={[styles.modalOptionText, currentSort === opt.value && styles.modalOptionTextSelected]}>
                {opt.label}
              </Text>
              {currentSort === opt.value && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
          <View style={{ height: 16 }} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ============================================================================
// DATE FILTER MENU (for needingAttention, upcomingVisits, active)
// ============================================================================

function DateFilterMenu({ visible, onClose, currentFilter, onFilterChange }) {
  const options = [
    { label: 'All',      value: DateFilter.ALL },
    { label: 'Overdue',  value: DateFilter.OVERDUE },
    { label: 'Today',    value: DateFilter.TODAY },
    { label: 'Tomorrow', value: DateFilter.TOMORROW },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalSheet}>
          <View style={styles.dragHandle} />
          <Text style={styles.modalTitle}>Filter by Date</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={`${String(opt.value)}-${opt.label}`}
              style={[styles.modalOption, currentFilter === opt.value && styles.modalOptionSelected]}
              onPress={() => { onFilterChange(opt.value); onClose(); }}
            >
              <Text style={[styles.modalOptionText, currentFilter === opt.value && styles.modalOptionTextSelected]}>
                {opt.label}
              </Text>
              {currentFilter === opt.value && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
          <View style={{ height: 16 }} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ============================================================================
// TAB FILTER MENU (for Patients tab)
// ============================================================================

function TabFilterMenu({ visible, onClose, currentFilter, onFilterChange }) {
  const options = [
    { label: 'All Patients',     value: TabFilter.ALL_PATIENTS },
    { label: 'Need Attention',   value: TabFilter.NEED_ATTENTION },
    { label: 'Upcoming Visits',  value: TabFilter.UPCOMING_VISITS },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalSheet}>
          <View style={styles.dragHandle} />
          <Text style={styles.modalTitle}>Filter Patients</Text>
          {options.map((opt) => (
            <TouchableOpacity
              key={`${String(opt.value)}-${opt.label}`}
              style={[styles.modalOption, currentFilter === opt.value && styles.modalOptionSelected]}
              onPress={() => { onFilterChange(opt.value); onClose(); }}
            >
              <Text style={[styles.modalOptionText, currentFilter === opt.value && styles.modalOptionTextSelected]}>
                {opt.label}
              </Text>
              {currentFilter === opt.value && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
          <View style={{ height: 16 }} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ============================================================================
// MAIN SCREEN
// ============================================================================

export default function PatientsListScreen({ navigation, route }) {
  const { isLeftHanded } = useHandedness();
  const repo = patientsRepository;

  const mode = route?.params?.mode || PatientsViewMode.all;

  const [currentMode, setCurrentMode]         = useState(mode);
  const [sortOption, setSortOption]           = useState(defaultSort(mode));
  const [dateFilter, setDateFilter]           = useState(DateFilter.ALL);
  const [tabFilter, setTabFilter]             = useState(TabFilter.ALL_PATIENTS);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  // Update mode when nav params change
  useEffect(() => {
    const newMode = route?.params?.mode;
    if (newMode && newMode !== currentMode) {
      setCurrentMode(newMode);
      setSortOption(defaultSort(newMode));
      setDateFilter(DateFilter.ALL);
    }
  }, [route?.params?.mode]);

  const isTabMode = currentMode === PatientsViewMode.all;
  const showBackArrow = !isTabMode;
  const showDateSort = currentMode !== PatientsViewMode.needingAttention;

  // ---- Title ----
  const getTitle = () => {
    switch (currentMode) {
      case PatientsViewMode.upcomingVisits:   return 'Upcoming Visits';
      case PatientsViewMode.needingAttention: return 'Needing Attention';
      case PatientsViewMode.active:           return 'Active Patients';
      default:                                return 'Patients';
    }
  };

  // ---- Base patient list per mode ----
  const getBasePatients = () => {
    const all = repo.allPatients();
    switch (currentMode) {
      case PatientsViewMode.needingAttention:
        return all.filter(p => p.criticality !== null);
      case PatientsViewMode.upcomingVisits:
        return all.filter(p => p.nextVisit !== null);
      case PatientsViewMode.active:
        return all.filter(p => p.criticality !== null || p.nextVisit !== null);
      default:
        return all;
    }
  };

  // ---- Apply filters + sort ----
  const getPatients = () => {
    let patients = getBasePatients();

    if (isTabMode) {
      patients = applyTabFilter(patients, tabFilter);
    } else {
      patients = applyDateFilter(patients, dateFilter);
    }

    return applySort(patients, sortOption);
  };

  const patients = useMemo(() => getPatients(), [currentMode, sortOption, dateFilter, tabFilter]);

  // ---- Card display mode ----
  const getCardProps = () => {
    switch (currentMode) {
      case PatientsViewMode.needingAttention:
        return { showPriority: true, showVisit: 'visit' };
      case PatientsViewMode.upcomingVisits:
        return { showPriority: false, showVisit: 'visit' };
      default:
        return { showPriority: true, showVisit: 'next' };
    }
  };

  const cardProps = getCardProps();

  // ---- Active filter label ----
  const getFilterLabel = () => {
    if (isTabMode) {
      switch (tabFilter) {
        case TabFilter.NEED_ATTENTION:  return 'Need Attention';
        case TabFilter.UPCOMING_VISITS: return 'Upcoming';
        default:                        return 'All';
      }
    } else {
      switch (dateFilter) {
        case DateFilter.OVERDUE:  return 'Overdue';
        case DateFilter.TODAY:    return 'Today';
        case DateFilter.TOMORROW: return 'Tomorrow';
        default:                  return 'All';
      }
    }
  };

  const renderItem = ({ item, index }) => (
    <PatientCard
      patient={item}
      index={index}
      showVisit={cardProps.showVisit}
      showPriority={cardProps.showPriority}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header row */}
      <View style={styles.header}>
        {/* Left side */}
        <View style={styles.headerLeft}>
          {showBackArrow && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              testID="back_button"
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <Text style={styles.headerTitle} numberOfLines={1}>{getTitle()}</Text>

        {/* Right side - sort button */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setSortMenuVisible(true)}
            testID="sort_button"
          >
            <Text style={styles.iconButtonText}>⇅</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter chips row */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => setFilterMenuVisible(true)}
          testID="filter_button"
        >
          <Text style={styles.filterChipText}>📋 {getFilterLabel()}</Text>
        </TouchableOpacity>
        <Text style={styles.patientCount}>{patients.length} patients</Text>
      </View>

      {/* Patient list */}
      {patients.length > 0 ? (
        <FlatList
          testID="patients_list"
          data={patients}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No patients found</Text>
        </View>
      )}

      {/* Sort menu */}
      <SortMenu
        visible={sortMenuVisible}
        onClose={() => setSortMenuVisible(false)}
        currentSort={sortOption}
        onSortChange={setSortOption}
        showDateOption={showDateSort}
      />

      {/* Filter menu */}
      {isTabMode ? (
        <TabFilterMenu
          visible={filterMenuVisible}
          onClose={() => setFilterMenuVisible(false)}
          currentFilter={tabFilter}
          onFilterChange={setTabFilter}
        />
      ) : (
        <DateFilterMenu
          visible={filterMenuVisible}
          onClose={() => setFilterMenuVisible(false)}
          currentFilter={dateFilter}
          onFilterChange={setDateFilter}
        />
      )}

      <HandednessToggleOverlay />
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerLeft: {
    width: 44,
    alignItems: 'flex-start',
  },
  headerRight: {
    width: 44,
    alignItems: 'flex-end',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 22,
    color: '#0A7A8A',
  },
  iconButton: {
    padding: 8,
  },
  iconButtonText: {
    fontSize: 22,
    color: '#0A7A8A',
  },

  // Filter chip row
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E6F7F5',
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 13,
    color: '#0A7A8A',
    fontWeight: '600',
  },
  patientCount: {
    fontSize: 13,
    color: '#6b7280',
  },

  // List
  listContent: {
    padding: 16,
  },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  patientSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  overdueText: {
    color: '#ef4444',
    fontWeight: '600',
  },

  // Tag
  tag: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOptionSelected: {
    backgroundColor: '#E6F7F5',
  },
  modalOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  modalOptionTextSelected: {
    color: '#0A7A8A',
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 18,
    color: '#0A7A8A',
    fontWeight: '700',
  },
});
