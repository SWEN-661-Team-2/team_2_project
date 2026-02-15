import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HandednessToggleOverlay from '../components/HandednessToggleOverlay';
import { useHandedness, useTheme } from '../contexts/AppProviders';
import TasksRepository from '../repositories/TasksRepository';

export default function TasksScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  const { handednessMode, isLeftHanded } = useHandedness();
  const { colors } = useTheme();

  const [filter, setFilter] = useState('all');
  const repo = TasksRepository;

  const tasks = useMemo(() => repo.all(), [repo]);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'all':
        return tasks;
      case 'pending':
        return repo.pending();
      case 'completed':
        return repo.completed();
      case 'high':
        return tasks.filter((t) => t.priority === 'high');
      case 'overdue':
        return repo.overdue();
      case 'dueToday':
        return repo.dueToday();
      default:
        return tasks;
    }
  }, [filter, repo, tasks]);

  const listBottomPadding = tabBarHeight + insets.bottom + 16;

  const FilterButton = ({ filterValue, label, count }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterValue && { backgroundColor: colors.primary },
        { borderColor: colors.border },
      ]}
      onPress={() => setFilter(filterValue)}
      activeOpacity={0.85}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.filterTitle,
          { color: filter === filterValue ? '#fff' : colors.text },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.filterCount,
          { color: filter === filterValue ? '#fff' : colors.textSecondary },
        ]}
      >
        ({count})
      </Text>
    </TouchableOpacity>
  );

  const TaskCard = ({ task }) => (
    <View style={[styles.taskCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.taskHeader, isLeftHanded && styles.taskHeaderReversed]}>
        <View style={isLeftHanded ? { alignItems: 'flex-end' } : null}>
          <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
          <Text style={[styles.taskPatient, { color: colors.textSecondary }]}>
            Patient: {task.patient}
          </Text>
        </View>

        <View style={[styles.badges, isLeftHanded && styles.badgesReversed]}>
          <View
            style={[
              styles.badge,
              task.status === 'completed' ? styles.badgeCompleted : styles.badgePending,
            ]}
          >
            <Text style={styles.badgeText}>{task.status}</Text>
          </View>

          <View
            style={[
              styles.badge,
              task.priority === 'high'
                ? styles.badgeHigh
                : task.priority === 'medium'
                ? styles.badgeMedium
                : styles.badgeLow,
            ]}
          >
            <Text style={styles.badgeText}>{task.priority}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const HeaderAndFilters = () => (
    <View>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 12 },
          isLeftHanded && styles.headerReversed,
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Tasks</Text>
      </View>

      {/* Filters (tiles) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
      >
        <FilterButton filterValue="all" label="All" count={tasks.length} />
        <FilterButton filterValue="pending" label="Pending" count={repo.pending().length} />
        <FilterButton filterValue="completed" label="Completed" count={repo.completed().length} />
        <FilterButton
          filterValue="high"
          label="High Priority"
          count={tasks.filter((t) => t.priority === 'high').length}
        />
        <FilterButton filterValue="dueToday" label="Due Today" count={repo.dueToday().length} />
        <FilterButton filterValue="overdue" label="Overdue" count={repo.overdue().length} />
      </ScrollView>

      {/* Tiny, controlled gap between tiles and list */}
      <View style={{ height: 6 }} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => <TaskCard task={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={HeaderAndFilters}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: listBottomPadding },
        ]}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
      />

      {handednessMode === 'toggle' ? <HandednessToggleOverlay /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12, 
  },
  headerReversed: { flexDirection: 'row-reverse' },

  backButton: { padding: 8, marginRight: 12 },
  backIcon: { fontSize: 24 },

  title: { fontSize: 24, fontWeight: 'bold' },

  filters: {
    marginBottom: 0, 
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingTop: 4,    
    paddingBottom: 2,  
    paddingRight: 32,
  },

  filterButton: {
    width: 110,
    height: 110,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
    flexShrink: 1,
  },
  filterCount: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 0, // tasks land right under tiles
  },

  taskCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskHeaderReversed: { flexDirection: 'row-reverse' },

  taskTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  taskPatient: { fontSize: 14 },

  badges: { flexDirection: 'column', gap: 4 },
  badgesReversed: { alignItems: 'flex-end' },

  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#ffffff' },

  badgeCompleted: { backgroundColor: '#10b981' },
  badgePending: { backgroundColor: '#f59e0b' },
  badgeHigh: { backgroundColor: '#ef4444' },
  badgeMedium: { backgroundColor: '#f97316' },
  badgeLow: { backgroundColor: '#3b82f6' },
});