import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHandedness } from '../contexts/AppProviders';
import { useAuth } from '../contexts/AuthContext';

/**
 * Change Password Screen - Hardened for WK6 Accessibility
 * Includes: Screen Reader labels, Live Regions, and Left-Handed support.
 */
export default function ChangePasswordScreen({ navigation }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { changePassword, loading, error: authError } = useAuth();
  const { isLeftHanded } = useHandedness();

  const handleSave = async () => {
    const success = await changePassword(oldPassword, newPassword, confirmPassword);
    if (success) {
      Alert.alert('Success', 'Password updated successfully');
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.navigate('Settings'); 
          }}
          style={styles.backTouch}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          accessibilityLabel="Back to Settings"
          accessibilityRole="button"
          accessibilityHint="Goes back to the previous screen"
        >
          <Text style={styles.backButton} importantForAccessibility="no-hide-descendants">←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} accessibilityRole="header">Change password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Old Password */}
        <Text style={styles.label}>Old password</Text>
        <PasswordInput
          value={oldPassword}
          onChangeText={setOldPassword}
          isVisible={showOld}
          onToggleVisibility={() => setShowOld(!showOld)}
          isLeftHanded={isLeftHanded}
          testID="change_old"
          label="Old password"
          editable={!loading}
        />

        {/* New Password */}
        <Text style={[styles.label, { marginTop: 12 }]}>New password</Text>
        <PasswordInput
          value={newPassword}
          onChangeText={setNewPassword}
          isVisible={showNew}
          onToggleVisibility={() => setShowNew(!showNew)}
          isLeftHanded={isLeftHanded}
          testID="change_new"
          label="New password"
          editable={!loading}
        />

        {/* Confirm Password */}
        <Text style={[styles.label, { marginTop: 12 }]}>Confirm new password</Text>
        <PasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isVisible={showConfirm}
          onToggleVisibility={() => setShowConfirm(!showConfirm)}
          isLeftHanded={isLeftHanded}
          testID="change_confirm"
          label="Confirm new password"
          editable={!loading}
        />

        {/* Error Message - Live Region alerts screen readers immediately */}
        {authError && (
          <Text 
            style={styles.errorText} 
            accessibilityLiveRegion="assertive"
            accessibilityRole="alert"
          >
            {authError}
          </Text>
        )}

        {/* Save Button */}
        <TouchableOpacity
          testID="change_save"
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
          accessibilityLabel={loading ? "Saving password" : "Save new password"}
          accessibilityRole="button"
          accessibilityState={{ disabled: loading, busy: loading }}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function PasswordInput({
  value,
  onChangeText,
  isVisible,
  onToggleVisibility,
  isLeftHanded,
  testID,
  label,
  editable = true,
}) {
  return (
    <View style={[styles.passwordContainer, !editable && styles.disabledInput]}>
      <TextInput
        testID={testID}
        style={[styles.passwordInput, isLeftHanded && styles.rtlText]}
        placeholder="Enter password"
        secureTextEntry={!isVisible}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        accessibilityLabel={label}
      />
      <TouchableOpacity
        onPress={onToggleVisibility}
        disabled={!editable}
        style={isLeftHanded ? styles.eyeIconLeft : styles.eyeIconRight}
        accessibilityLabel={isVisible ? "Hide password" : "Show password"}
        accessibilityRole="button"
      >
        <Text style={styles.eyeIcon}>{isVisible ? '👁️' : '👁️‍🗨️'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles remain the same...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  scrollView: { flex: 1 },
  content: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingRight: 8,
    marginBottom: 12,
  },
  passwordInput: { flex: 1, padding: 12, fontSize: 16 },
  rtlText: { textAlign: 'right' },
  eyeIconLeft: { paddingLeft: 8, paddingRight: 4 },
  eyeIconRight: { paddingLeft: 4, paddingRight: 8 },
  eyeIcon: { fontSize: 18 },
  disabledInput: { opacity: 0.6 },
  errorText: { color: '#E74C3C', fontSize: 14, marginTop: 8, marginBottom: 12 },
  button: {
    backgroundColor: '#0A7A8A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  backTouch: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  backButton: { fontSize: 28, color: '#0A7A8A', fontWeight: '600' },
});