import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { useHandedness, useTheme } from '../contexts/AppProviders';

/**
 * Tasks Screen
 * React Native equivalent of Flutter TasksScreen
 * Features: filtering, back button navigation
 */
export default function TasksScreen({ navigation }) {
  const { isLeftHanded } = useHandedness();
  const { colors } = useTheme();
  const [filter, setFilter] = useState('all');

  const [tasks] = useState([
    { id: '1', title: 'Check patient vitals', status: 'pending', priority: 'high', patient: 'John Doe' },
    { id: '2', title: 'Update medication log', status: 'completed', priority: 'medium', patient: 'Jane Smith' },
    { id: '3', title: 'Schedule follow-up', status: 'pending', priority: 'low', patient: 'Bob Johnson' },
    { id: '4', title: 'Document consultation', status: 'pending', priority: 'high', patient: 'Alice Williams' },
    { id: '5', title: 'Review test results', status: 'completed', priority: 'medium', patient: 'Charlie Brown' },
  ]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'high') return task.priority === 'high';
    return true;
  });

  const FilterButton = ({ filterValue, label, count }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterValue && { backgroundColor: colors.primary },
        { borderColor: colors.border },
      ]}
      onPress={() => setFilter(filterValue)}
    >
      <Text
        style={[
          styles.filterText,
          { color: filter === filterValue ? '#ffffff' : colors.text },
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const TaskCard = ({ task }) => (
    <View style={[styles.taskCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.taskHeader, isLeftHanded && styles.taskHeaderReversed]}>
        <View style={isLeftHanded ? { alignItems: 'flex-end' } : {}}>
          <Text style={[styles.taskTitle, { color: colors.text }]}>
            {task.title}
          </Text>
          <Text style={[styles.taskPatient, { color: colors.textSecondary }]}>
            Patient: {task.patient}
          </Text>
        </View>
        <View style={[styles.badges, isLeftHanded && styles.badgesReversed]}>
          <View
            style={[
              styles.badge,
              task.status === 'completed'
                ? styles.badgeCompleted
                : styles.badgePending,
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Back Button */}
      <View style={[styles.header, isLeftHanded && styles.headerReversed]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Tasks</Text>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        <FilterButton filterValue="all" label="All" count={tasks.length} />
        <FilterButton
          filterValue="pending"
          label="Pending"
          count={tasks.filter(t => t.status === 'pending').length}
        />
        <FilterButton
          filterValue="completed"
          label="Completed"
          count={tasks.filter(t => t.status === 'completed').length}
        />
        <FilterButton
          filterValue="high"
          label="High Priority"
          count={tasks.filter(t => t.priority === 'high').length}
        />
      </ScrollView>

      {/* Tasks List */}
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => <TaskCard task={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No tasks match the current filter
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerReversed: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filters: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  taskHeaderReversed: {
    flexDirection: 'row-reverse',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskPatient: {
    fontSize: 14,
  },
  badges: {
    flexDirection: 'column',
    gap: 4,
  },
  badgesReversed: {
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  badgeCompleted: {
    backgroundColor: '#10b981',
  },
  badgePending: {
    backgroundColor: '#f59e0b',
  },
  badgeHigh: {
    backgroundColor: '#ef4444',
  },
  badgeMedium: {
    backgroundColor: '#f97316',
  },
  badgeLow: {
    backgroundColor: '#3b82f6',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 32,
  },
});
