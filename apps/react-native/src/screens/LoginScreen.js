import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useHandedness } from '../contexts/AppProviders';
import { Image } from 'react-native';

/**
 * Login Screen
 * Matches Flutter LoginScreen functionality
 */
export default function LoginScreen({ navigation }) {
  const { isLeftHanded } = useHandedness();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    
    // Validate
    const hasEmailError = trimmedEmail === '';
    const hasPasswordError = password === '';
    
    setEmailError(hasEmailError);
    setPasswordError(hasPasswordError);

    // If valid, navigate to dashboard
    if (!hasEmailError && !hasPasswordError) {
      navigation.navigate('MainApp');
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password
    console.log('Forgot password clicked');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Image 
              source={require('../../assets/logo/careconnect_logo.png')}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>CareConnect</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Access your information securely{'\n'}Sign in to your account
        </Text>

        {/* Email */}
        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) setEmailError(false);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {emailError && <Text style={styles.errorText}>Email is required</Text>}

        {/* Password */}
        <Text style={[styles.label, styles.labelMarginTop]}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              styles.passwordInput,
              passwordError && styles.inputError,
            ]}
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError(false);
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[
              styles.eyeButton,
              isLeftHanded ? styles.eyeButtonLeft : styles.eyeButtonRight,
            ]}
            onPress={() => setShowPassword(!showPassword)}
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
        <View
          style={[
            styles.forgotContainer,
            isLeftHanded
              ? { alignItems: 'flex-start' }
              : { alignItems: 'flex-end' },
          ]}
        >
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        {/* Security Info */}
        <View style={styles.securityContainer}>
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
    padding: 24,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0A7A8A',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 32,
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#374151',
  },
  labelMarginTop: {
    marginTop: 20,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    top: 12,
    padding: 8,
  },
  eyeButtonLeft: {
    left: 8,
  },
  eyeButtonRight: {
    right: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotContainer: {
    marginTop: 12,
    marginBottom: 20,
  },
  forgotText: {
    color: '#0A7A8A',
    fontSize: 16,
    fontWeight: '600',
  },
  signInButton: {
    height: 56,
    backgroundColor: '#0A7A8A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signInText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  securityContainer: {
    marginTop: 32,
    padding: 20,
    backgroundColor: '#E6F7F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  securityIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  securityText: {
    textAlign: 'center',
    color: '#374151',
    lineHeight: 20,
  },
});
