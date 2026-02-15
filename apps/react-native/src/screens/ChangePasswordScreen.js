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
 * Change Password Screen for React Native
 * Equivalent to Flutter's ChangePasswordScreen
 * 
 * Allows users to update their password with validation
 */
export default function ChangePasswordScreen({ navigation }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState(null);
  const { changePassword, loading } = useAuth();
  const { isLeftHanded } = useHandedness();

  const handleSave = async () => {
    const success = await changePassword(oldPassword, newPassword, confirmPassword);
    
    if (success) {
      Alert.alert('Success', 'Password updated successfully');
      navigation.goBack();
    } else {
      // Error is already set by the context
    }
  };

  // apps/react-native/src/screens/ChangePasswordScreen.js
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
        >
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change password</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
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
          editable={!loading}
        />

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Save Button */}
        <TouchableOpacity
          testID="change_save"
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Reusable Password Input Component
 */
function PasswordInput({
  value,
  onChangeText,
  isVisible,
  onToggleVisibility,
  isLeftHanded,
  testID,
  editable = true,
}) {
  return (
    <View
      style={[
        styles.passwordContainer,
        !editable && styles.disabledInput,
      ]}
    >
      <TextInput
        testID={testID}
        style={[styles.passwordInput, isLeftHanded && styles.rtlText]}
        placeholder="Enter password"
        secureTextEntry={!isVisible}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
      />
      <TouchableOpacity
        onPress={onToggleVisibility}
        disabled={!editable}
        style={isLeftHanded ? styles.eyeIconLeft : styles.eyeIconRight}
      >
        <Text style={styles.eyeIcon}>
          {isVisible ? '👁️' : '👁️‍🗨️'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },
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
  backButton: {
    fontSize: 16,
    color: '#0A7A8A',
    fontWeight: '500',
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
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
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  rtlText: {
    textAlign: 'right',
  },
  eyeIconLeft: {
    paddingLeft: 8,
    paddingRight: 4,
  },
  eyeIconRight: {
    paddingLeft: 4,
    paddingRight: 8,
  },
  eyeIcon: {
    fontSize: 18,
  },
  disabledInput: {
    opacity: 0.6,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0A7A8A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backTouch: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 28,
    color: '#0A7A8A',
    fontWeight: '600',
  },
});
