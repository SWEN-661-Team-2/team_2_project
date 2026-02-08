import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useHandedness, useTheme } from '../contexts/AppProviders';

export default function PatientsScreen({ navigation }) {
  const { isLeftHanded } = useHandedness();
  const { colors } = useTheme();

  const [patients] = useState([
    { id: '1', name: 'John Doe', age: 45, condition: 'Diabetes', photo: '👨' },
    { id: '2', name: 'Jane Smith', age: 32, condition: 'Hypertension', photo: '👩' },
    { id: '3', name: 'Bob Johnson', age: 67, condition: 'Arthritis', photo: '👴' },
    { id: '4', name: 'Alice Williams', age: 28, condition: 'Asthma', photo: '👱‍♀️' },
  ]);

  const PatientCard = ({ patient }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={[styles.cardContent, isLeftHanded && styles.cardContentReversed]}>
        <Text style={styles.photo}>{patient.photo}</Text>
        <View style={isLeftHanded ? { alignItems: 'flex-end' } : {}}>
          <Text style={[styles.name, { color: colors.text }]}>{patient.name}</Text>
          <Text style={[styles.info, { color: colors.textSecondary }]}>Age: {patient.age}</Text>
          <Text style={styles.condition}>{patient.condition}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, isLeftHanded && styles.headerReversed]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Patients</Text>
      </View>

      <FlatList
        data={patients}
        renderItem={({ item }) => <PatientCard patient={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerReversed: { flexDirection: 'row-reverse' },
  backButton: { padding: 8, marginRight: 12 },
  backIcon: { fontSize: 24 },
  title: { fontSize: 24, fontWeight: 'bold' },
  list: { paddingHorizontal: 20 },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  cardContentReversed: { flexDirection: 'row-reverse' },
  photo: { fontSize: 48 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  info: { fontSize: 14, marginBottom: 2 },
  condition: { fontSize: 14, color: '#2563eb', fontWeight: '600' },
});
