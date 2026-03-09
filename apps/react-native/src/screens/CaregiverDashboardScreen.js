import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HandednessToggleOverlay from '../components/HandednessToggleOverlay';
import { useHandedness } from '../contexts/AppProviders';
import { useDashboard } from '../contexts/DashboardContext';
import { getCriticalityColor, getCriticalityTag, getCriticalityText } from '../repositories/PatientsRepository';

const { width } = Dimensions.get('window');
const TABLET_BREAKPOINT = 600;

/**
 * Caregiver Dashboard Screen - WCAG 2.1 Level AA Compliant
 */
export default function CaregiverDashboardScreen({ navigation }) {
  const { isLeftHanded } = useHandedness();
  const isTablet = width >= TABLET_BREAKPOINT;

  const {
    allPatients = [],
    upcomingVisits = [],
    needingAttention = [],
    unreadMessageCount = 0,
    needingTop3 = [],
  } = useDashboard();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTop3 = upcomingVisits
    .filter(p => p.nextVisit && p.nextVisit >= today)
    .slice(0, 3);

  const formatDateTime = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleActivePatients = () => navigation.push('Patients', { mode: 'active' });
  const handleUpcomingVisits = () => navigation.push('Patients', { mode: 'upcomingVisits' });
  const handleNeedingAttention = () => navigation.push('Patients', { mode: 'needingAttention' });
  const handleMessages = () => navigation.navigate('Messages', { mode: 'unread' });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section - WCAG: Roles and Labels */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo/careconnect_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="CareConnect Home Logo"
            accessibilityRole="image"
          />
          <Text style={styles.headerTitle} accessibilityRole="header">CareConnect</Text>

          <TouchableOpacity 
            style={styles.infoButton}
            accessibilityLabel="Application Information"
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.infoIcon}>ℹ️</Text>
          </TouchableOpacity>
        </View>

        {/* KPI Grid - WCAG: Distinct Button Labels */}
        <View style={[styles.kpiGrid, isTablet && styles.kpiGridTablet]}>
          <StatCard icon="👥" value={String(allPatients.length)} label="Active Patients" onPress={handleActivePatients} />
          <StatCard icon="📅" value={String(upcomingVisits.length)} label="Upcoming Visits" onPress={handleUpcomingVisits} />
          <StatCard icon="⚠️" value={String(needingAttention.length)} label="Patients Needing Attention" onPress={handleNeedingAttention} />
          <StatCard icon="💬" value={String(unreadMessageCount)} label="Unread Messages" onPress={handleMessages} />
        </View>

        {/* Patient Lists Section */}
        <View style={isTablet ? styles.sectionsRow : null}>
          <View style={isTablet ? styles.sectionHalf : styles.section}>
            <SectionHeader title="Patients Needing Attention" />
            {needingTop3.map((patient) => (
              <PatientRow 
                key={patient.id} 
                name={patient.fullName} 
                subtitle={`Priority: ${getCriticalityText(patient.criticality)}`} 
                tag={getCriticalityTag(patient.criticality)} 
                color={getCriticalityColor(patient.criticality)} 
              />
            ))}
            <ViewAllButton onPress={handleNeedingAttention} isLeftAligned={isLeftHanded} title="Patients Needing Attention" />
          </View>

          <View style={isTablet ? styles.sectionHalf : styles.section}>
            <SectionHeader title="Upcoming Visits" />
            {upcomingTop3.map((patient) => (
              <PatientRow 
                key={patient.id} 
                name={patient.fullName} 
                subtitle={patient.nextVisit ? `Visit: ${formatDateTime(patient.nextVisit)}` : 'No visit scheduled'} 
                tag={getCriticalityTag(patient.criticality)} 
                color={getCriticalityColor(patient.criticality)} 
              />
            ))}
            <ViewAllButton onPress={handleUpcomingVisits} isLeftAligned={isLeftHanded} title="Upcoming Visits" />
          </View>
        </View>
      </ScrollView>
      <HandednessToggleOverlay />
    </View>
  );
}

// Sub-components with Accessibility Props
function StatCard({ icon, value, label, onPress }) {
  return (
    <TouchableOpacity
      style={styles.statCard}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      accessibilityHint={`Opens list of ${label}`}
    >
      <Text style={styles.statIcon} accessibilityElementsHidden={true}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function SectionHeader({ title }) {
  return <Text style={styles.sectionTitle} accessibilityRole="header">{title}</Text>;
}

function PatientRow({ name, subtitle, tag, color }) {
  // WCAG: Combine text into one label for screen readers to prevent fragmented reading
  const rowLabel = `Patient: ${name}. ${subtitle}. ${tag ? `Status: ${tag}` : ''}`;
  
  return (
    <View 
      style={styles.patientCard} 
      accessible={true} 
      accessibilityLabel={rowLabel}
    >
      <View style={styles.patientInfo}>
        <Text style={styles.patientName} numberOfLines={1}>{name}</Text>
        <Text style={styles.patientSubtitle} numberOfLines={2}>{subtitle}</Text>
      </View>
      {tag && tag.trim() !== '' && tag !== '—' && (
        <View style={[styles.patientTag, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.patientTagText, { color }]}>{tag}</Text>
        </View>
      )}
    </View>
  );
}

function ViewAllButton({ onPress, isLeftAligned, title }) {
  return (
    <View style={[
      styles.viewAllContainer,
      isLeftAligned ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' },
    ]}>
      <TouchableOpacity 
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`View all ${title}`}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} // Expands touch target to 44x44
      >
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827', // High contrast
  },
  infoButton: {
    padding: 8,
    minWidth: 44, // WCAG Touch Target
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  kpiGridTablet: {
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 52) / 2, 
    minHeight: 170,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#4b5563', // WCAG AA Contrast (4.5:1)
    lineHeight: 18,
  },
  sectionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  sectionHalf: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  patientCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  patientInfo: {
    flex: 1,
    marginRight: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  patientSubtitle: {
    fontSize: 14,
    color: '#4b5563', // WCAG AA Contrast (4.5:1)
  },
  patientTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  patientTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    // color is set dynamically but should be checked in the repository
  },
  viewAllContainer: {
    marginTop: 8,
  },
  viewAllText: {
    color: '#1d4ed8', // Darker blue for contrast
    fontSize: 16,
    fontWeight: '600',
    padding: 4,
  },
});