/**
 * Caregiver Dashboard Screen
 * Equivalent to Flutter's CaregiverDashboardScreen
 * 
 * Main dashboard showing:
 * - KPI cards (patients, visits, alerts, messages)
 * - Patients needing attention
 * - Upcoming visits
 */

import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDashboard } from '../contexts/DashboardContext';
import { useHandedness } from '../contexts/AppProviders';
import { PatientCriticality } from '../models/Patient';
import { formatDtYmdHmm } from '../utils/dtFormat';
import StatCard from './components/StatCard';
import PatientRow from './components/PatientRow';
import SectionHeader from './components/SectionHeader';

const TABLET_BREAKPOINT = 600;

export default function CaregiverDashboardScreen({ navigation }) {
  const dashboard = useDashboard();
  const { isLeftHanded } = useHandedness();
  const windowWidth = Dimensions.get('window').width;

  const isTablet = windowWidth >= TABLET_BREAKPOINT;

  // Critical and visit colors/tags
  const getCriticalityColor = (criticality) => {
    if (!criticality) return '#999999';
    switch (criticality) {
      case PatientCriticality.CRITICAL:
        return '#DC2626';
      case PatientCriticality.HIGH:
        return '#EA580C';
      case PatientCriticality.MEDIUM:
        return '#60A5FA';
      case PatientCriticality.LOW:
        return '#10B981';
      default:
        return '#999999';
    }
  };

  const getCriticalityText = (criticality) => {
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
  };

  const getCriticalityTag = (criticality) => {
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
  };

  const handlePatientTap = (viewMode) => {
    // Navigate to patients screen with filter
    navigation.navigate('Patients', { viewMode });
  };

  const handleMessagesTap = (viewMode) => {
    navigation.navigate('Messages', { viewMode });
  };

  // Header component
  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.logoText}>CC</Text>
      </View>
      <Text style={styles.headerTitle} numberOfLines={1}>
        CareConnect
      </Text>
      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => {
          /* App info handler */
        }}
      >
        <Text style={styles.infoIcon}>ℹ️</Text>
      </TouchableOpacity>
    </View>
  );

  // KPI Grid
  const KPIGrid = () => (
    <View
      style={[
        styles.kpiContainer,
        isTablet ? styles.kpiTablet : styles.kpiMobile,
      ]}
    >
      <StatCard
        icon="👥"
        value={dashboard.totalPatients}
        label="Active Patients"
        testID="kpi_patients"
        onPress={() => handlePatientTap('all')}
      />
      <StatCard
        icon="📅"
        value={dashboard.totalUpcomingVisits}
        label="Upcoming Visits"
        testID="kpi_visits"
        onPress={() => handlePatientTap('upcomingVisits')}
      />
      <StatCard
        icon="⚠️"
        value={dashboard.totalNeedingAttention}
        label="Patients Needing Attention"
        testID="kpi_attention"
        onPress={() => handlePatientTap('needingAttention')}
      />
      <StatCard
        icon="💬"
        value={dashboard.unreadMessageCount}
        label="Messages / Unread"
        testID="kpi_messages"
        onPress={() => handleMessagesTap('unread')}
      />
    </View>
  );

  // Patients Needing Attention Section
  const NeedingAttentionSection = () => (
    <View style={styles.section}>
      <SectionHeader title="Patients Needing Attention" />
      <View style={styles.patientsList}>
        {dashboard.needingAttention.map((patient) => (
          <PatientRow
            key={`${patient.firstName}-${patient.lastName}`}
            name={patient.fullName}
            subtitle={`Priority: ${getCriticalityText(patient.criticality)}`}
            tag={getCriticalityTag(patient.criticality)}
            color={getCriticalityColor(patient.criticality)}
          />
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.viewAllButton,
          isLeftHanded && styles.viewAllButtonLeft,
        ]}
        onPress={() => handlePatientTap('needingAttention')}
      >
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
  );

  // Upcoming Visits Section
  const UpcomingVisitsSection = () => (
    <View style={styles.section}>
      <SectionHeader title="Upcoming Visits" />
      <View style={styles.patientsList}>
        {dashboard.upcomingVisits.map((patient) => (
          <PatientRow
            key={`${patient.firstName}-${patient.lastName}`}
            name={patient.fullName}
            subtitle={
              patient.nextVisit
                ? `Visit: ${formatDtYmdHmm(patient.nextVisit)}`
                : 'No visit scheduled'
            }
            tag={getCriticalityTag(patient.criticality)}
            color={getCriticalityColor(patient.criticality)}
          />
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.viewAllButton,
          isLeftHanded && styles.viewAllButtonLeft,
        ]}
        onPress={() => handlePatientTap('upcomingVisits')}
      >
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isTablet ? (
        <ScrollView
          contentContainerStyle={styles.scrollContentTablet}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.tabletContent}>
            <Header />
            <KPIGrid />
            <View style={styles.tabletSections}>
              <View style={styles.tabletColumn}>
                <NeedingAttentionSection />
              </View>
              <View style={styles.tabletColumn}>
                <UpcomingVisitsSection />
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContentMobile}
          showsVerticalScrollIndicator={false}
        >
          <Header />
          <KPIGrid />
          <NeedingAttentionSection />
          <UpcomingVisitsSection />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },
  scrollContentMobile: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  scrollContentTablet: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  tabletContent: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1100,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#E6F7F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0A7A8A',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  infoButton: {
    padding: 8,
  },
  infoIcon: {
    fontSize: 20,
  },
  kpiContainer: {
    marginBottom: 24,
  },
  kpiMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  section: {
    marginBottom: 24,
  },
  patientsList: {
    marginBottom: 12,
  },
  viewAllButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewAllButtonLeft: {
    alignSelf: 'flex-start',
  },
  viewAllText: {
    color: '#0A7A8A',
    fontSize: 14,
    fontWeight: '500',
  },
  tabletSections: {
    flexDirection: 'row',
    gap: 16,
  },
  tabletColumn: {
    flex: 1,
  },
});
