import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { useAppSettings, HandednessMode, TextSizeMode, ReminderFrequency } from '../contexts/AppSettingsContext';
import { useTheme } from '../contexts/AppProviders';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsScreen() {
  const s = useAppSettings();
  const { colors } = useTheme();
  const { logout } = useAuth();

  const [reminderModalVisible, setReminderModalVisible] = useState(false);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Handedness</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.choice} onPress={() => s.setHandedness(HandednessMode.left)}>
            <Text style={{ color: colors.text }}>Left</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.choice} onPress={() => s.setHandedness(HandednessMode.right)}>
            <Text style={{ color: colors.text }}>Right</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.choice} onPress={() => s.setHandedness(HandednessMode.toggle)}>
            <Text style={{ color: colors.text }}>Toggle</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Accessibility</Text>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.text }}>A11y Overlay</Text>
          <Switch value={s.a11yOverlay} onValueChange={s.setA11yOverlayEnabled} />
        </View>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.text }}>High Contrast</Text>
          <Switch value={s.highContrastEnabled} onValueChange={s.setHighContrast} />
        </View>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.text }}>Text Size</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.smallBtn} onPress={() => s.setTextSize(TextSizeMode.small)}>
              <Text style={{ color: colors.text }}>S</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallBtn} onPress={() => s.setTextSize(TextSizeMode.medium)}>
              <Text style={{ color: colors.text }}>M</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallBtn} onPress={() => s.setTextSize(TextSizeMode.large)}>
              <Text style={{ color: colors.text }}>L</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.text }}>Enable Notifications</Text>
          <Switch value={s.notificationsEnabled} onValueChange={s.setNotifications} />
        </View>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.text }}>Reminder Frequency</Text>
          <TouchableOpacity onPress={() => setReminderModalVisible(true)}>
            <Text style={{ color: colors.textSecondary }}>{s.reminderFrequency}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Accessibility Modes (UI-only)</Text>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.text }}>Low Vision</Text>
          <Switch value={s.lowVisionEnabled} onValueChange={s.setLowVisionEnabled} />
        </View>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.text }}>Tremor Support</Text>
          <Switch value={s.tremorSupportEnabled} onValueChange={s.setTremorSupportEnabled} />
        </View>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.text }}>Hearing Impaired</Text>
          <Switch value={s.hearingImpairedEnabled} onValueChange={s.setHearingImpairedEnabled} />
        </View>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.text }}>Guided Mode</Text>
          <Switch value={s.guidedModeEnabled} onValueChange={s.setGuidedModeEnabled} />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.border }]} onPress={() => logout()}>
          <Text style={{ color: colors.primary }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={reminderModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setReminderModalVisible(false)}>
          <View style={[styles.modal, { backgroundColor: colors.surface }]}> 
            <Text style={{ color: colors.text, marginBottom: 8 }}>Select reminder frequency</Text>
            <TouchableOpacity onPress={async () => { await s.setReminder(ReminderFrequency.daily); setReminderModalVisible(false); }}>
              <Text style={{ color: colors.text }}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => { await s.setReminder(ReminderFrequency.weekly); setReminderModalVisible(false); }}>
              <Text style={{ color: colors.text }}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={async () => { await s.setReminder(ReminderFrequency.custom); setReminderModalVisible(false); }}>
              <Text style={{ color: colors.text }}>Custom</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  sectionTitle: { fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  choice: { padding: 8, marginRight: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 6 },
  smallBtn: { padding: 8, marginLeft: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 4 },
  logoutBtn: { padding: 12, alignItems: 'center', borderRadius: 6, borderWidth: 1 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modal: { padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12, elevation: 4 },
});
