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
  Image,
  StatusBar,
} from 'react-native';
import { useHandedness } from '../contexts/AppProviders';
import { useAuth } from '../contexts/AuthContext';

/**
 * Login Screen - CareConnect
 * Updated for Assignment 6: Accessibility & UI Testing
 */
export default function LoginScreen({ navigation }) {
  const { isLeftHanded } = useHandedness();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    
    // Validate
    const hasEmailError = trimmedEmail === '';
    const hasPasswordError = password === '';
    
    setEmailError(hasEmailError);
    setPasswordError(hasPasswordError);

    if (!hasEmailError && !hasPasswordError) {
      try {
        await login(email, password);
        // Navigation is usually handled by Auth state change in AppNavigation,
        // but if your test specifically checks for manual navigation:
        // navigation.replace('Home'); 
      } catch (error) {
        console.error('Login failed', error);
      }
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Logo - Added testID and accessibilityLabel */}
        <View style={styles.logoContainer} testID="login_logo">
          <Image 
            source={require('../../assets/logo/careconnect_logo.png')}
            style={{ width: 150, height: 150 }}
            resizeMode="contain"
            accessibilityLabel="CareConnect Logo"
            accessible={true}
          />
        </View>

        {/* Title & Subtitles */}
        <Text style={styles.title} testID="login_title">CareConnect</Text>
        <Text style={styles.subtitleSecure}>Access your information securely</Text>
        <Text style={styles.subtitleSignIn}>Sign in to your account</Text>

        {/* Email Field */}
        <Text style={[styles.label, isLeftHanded ? { textAlign: 'left' } : { textAlign: 'right' }]}>
          Email address
        </Text>
        <TextInput
          testID="login_email"
          accessibilityLabel="Enter your email"
          accessibilityHint="Input field for your account email address"
          style={[styles.input, emailError && styles.inputError]}
          placeholder="you@example.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (emailError) setEmailError(false);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {emailError && (
          <Text 
            style={styles.errorText} 
            accessibilityLiveRegion="assertive"
            accessibilityRole="alert"
          >
            Email is required
          </Text>
        )}

        {/* Password Field */}
        <Text style={[styles.label, styles.labelMarginTop, isLeftHanded ? { textAlign: 'left' } : { textAlign: 'right' }]}>
          Password
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            testID="login_password"
            accessibilityLabel="Enter your password"
            accessibilityHint="Input field for your account password"
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
              isLeftHanded ? styles.eyeButtonRight : styles.eyeButtonLeft,
            ]}
            onPress={() => setShowPassword(!showPassword)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          >
            <Text style={styles.eyeIcon} aria-hidden="true">
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        </View>
        {passwordError && (
          <Text 
            style={styles.errorText} 
            accessibilityLiveRegion="assertive"
            accessibilityRole="alert"
          >
            Password is required
          </Text>
        )}

        {/* Forgot Password */}
        <View
          style={[
            styles.forgotContainer,
            isLeftHanded ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' },
          ]}
        >
          <TouchableOpacity 
            onPress={handleForgotPassword}
            accessibilityRole="link"
            accessibilityLabel="Forgot your password?"
          >
            <Text style={styles.forgotText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity 
          style={styles.signInButton} 
          onPress={handleLogin}
          accessibilityRole="button"
          accessibilityLabel="Sign In"
          accessibilityHint="Double tap to log into CareConnect"
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        {/* Security Info - Grouped for Screen Readers */}
        <View 
          style={styles.securityContainer}
          accessible={true}
          accessibilityLabel="Security notice: We use bank-level encryption to keep your health information safe."
        >
          <Text style={styles.securityIcon} aria-hidden="true">🛡️</Text>
          <Text style={styles.securityText}>
            We use bank-level encryption to keep your health information safe and secure.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFB' },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 60 },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 36, fontWeight: '800', color: '#0A7A8A', textAlign: 'center', marginBottom: 12 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#374151' },
  labelMarginTop: { marginTop: 20 },
  subtitleSecure: { fontSize: 15, textAlign: 'center', color: '#6b7280', marginBottom: 4 },
  subtitleSignIn: { fontSize: 16, fontWeight: '600', textAlign: 'center', color: '#111827', marginBottom: 32 },
  input: { height: 48, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, backgroundColor: '#ffffff' },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 14, marginTop: 4 },
  passwordContainer: { position: 'relative' },
  passwordInput: { paddingRight: 50 },
  eyeButton: { position: 'absolute', top: 12, padding: 8 },
  eyeButtonLeft: { left: 8 },
  eyeButtonRight: { right: 8 },
  eyeIcon: { fontSize: 20 },
  forgotContainer: { marginTop: 12, marginBottom: 20 },
  forgotText: { color: '#0A7A8A', fontSize: 16, fontWeight: '600' },
  signInButton: { height: 56, backgroundColor: '#0A7A8A', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  signInText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  securityContainer: { marginTop: 32, padding: 20, backgroundColor: '#E6F7F5', borderRadius: 16, alignItems: 'center' },
  securityIcon: { fontSize: 36, marginBottom: 12 },
  securityText: { textAlign: 'center', color: '#374151', lineHeight: 20 },
});