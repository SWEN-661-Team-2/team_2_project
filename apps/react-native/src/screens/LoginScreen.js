import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useHandedness } from '../contexts/AppProviders';

/**
 * Login Screen for React Native
 * Equivalent to Flutter's LoginScreen
 * 
 * Provides email/password authentication with security messaging
 */
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const { login, loading } = useAuth();
  const { isLeftHanded } = useHandedness();

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    let hasError = false;

    // Validate
    if (!trimmedEmail) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (!password) {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (hasError) {
      return;
    }

    // Attempt login
    const success = await login(trimmedEmail, password);
    if (success) {
      // Navigation will be handled by auth state in App.js
      navigation.replace('Home');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) {
      setEmailError(false);
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logo} testID="login_logo">
            {/* Placeholder for app logo */}
            <Text style={styles.logoText}>CC</Text>
          </View>
        </View>

        {/* Title */}
        <Text
          testID="login_title"
          style={[styles.title, { textAlign: 'center' }]}
        >
          CareConnect
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Access your information securely{'\n'}Sign in to your account
        </Text>

        {/* Email Field */}
        <Text style={styles.label}>Email address</Text>
        <TextInput
          testID="login_email"
          style={[
            styles.input,
            emailError && styles.inputError,
            isLeftHanded && styles.rtlText,
          ]}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          editable={!loading}
        />
        {emailError && <Text style={styles.errorText}>Email is required</Text>}

        {/* Password Field */}
        <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
        <View
          style={[
            styles.passwordContainer,
            passwordError && styles.inputError,
          ]}
        >
          <TextInput
            testID="login_password"
            style={[styles.passwordInput, isLeftHanded && styles.rtlText]}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={handlePasswordChange}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={isLeftHanded ? styles.eyeIconLeft : styles.eyeIconRight}
          >
            <Text style={styles.eyeIcon}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        </View>
        {passwordError && (
          <Text style={styles.errorText}>Password is required</Text>
        )}

        {/* Forgot Password */}
        <TouchableOpacity
          testID="login_forgot"
          style={isLeftHanded ? styles.forgotLeft : styles.forgotRight}
        >
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          testID="login_submit"
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {/* Security Message */}
        <View style={styles.securityBox}>
          <Text style={styles.securityIcon}>🛡️</Text>
          <Text style={styles.securityText}>
            We use bank-level encryption to keep your health information safe
            and secure.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'flex-start',
    paddingTop: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E6F7F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0A7A8A',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0A7A8A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingRight: 8,
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
    fontSize: 20,
  },
  forgotLeft: {
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 20,
  },
  forgotRight: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 20,
  },
  forgotText: {
    color: '#0A7A8A',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#0A7A8A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  securityBox: {
    backgroundColor: '#E6F7F5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  securityIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  securityText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
