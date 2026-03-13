import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { registerUser } from '../services/api';

const RegisterScreen = ({ navigation }) => {
  const { login } = useApp();
  const { showSuccess, showError, showWarning } = useToast();
  const [userType, setUserType] = useState(null); // 'customer' or 'advisor'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    storeLocation: '',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword, employeeId, storeLocation } = formData;

    if (!fullName.trim()) {
      showWarning('Missing Information', 'Please enter your full name');
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      showWarning('Invalid Email', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 4) {
      showWarning('Weak Password', 'Password must be at least 4 characters');
      return false;
    }

    if (password !== confirmPassword) {
      showError('Password Mismatch', 'Passwords do not match');
      return false;
    }

    if (userType === 'advisor') {
      if (!employeeId.trim()) {
        showWarning('Missing Information', 'Please enter your Employee ID');
        return false;
      }
      if (!storeLocation.trim()) {
        showWarning('Missing Information', 'Please enter your Store Location');
        return false;
      }
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = {
        name: formData.fullName,
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: userType,
        phone: formData.phone || undefined,
        employeeId: userType === 'advisor' ? formData.employeeId : undefined,
        storeLocation: userType === 'advisor' ? formData.storeLocation : undefined,
      };

      const response = await registerUser(userData);

      if (response.success) {
        showSuccess('Welcome!', `Account created successfully, ${formData.fullName}!`);
        login(userType, response.user, response.token);
        setTimeout(() => {
          if (userType === 'customer') {
            navigation.replace('Splash');
          } else {
            navigation.replace('AdvisorTabs');
          }
        }, 1500);
      } else {
        showError('Registration Failed', response.message || 'Please try again');
      }
    } catch (error) {
      showError('Connection Error', 'Please check your internet connection');
    } finally {
      setLoading(false);
    }
  };

  // Role Selection Screen
  if (!userType) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.brandSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.brandName}>LUXESENSE</Text>
          <Text style={styles.brandAI}>AI</Text>
          <View style={styles.brandDivider} />
        </Animated.View>

        <Animated.View style={[styles.roleSection, { opacity: fadeAnim }]}>
          <Text style={styles.selectTitle}>Create Account</Text>
          <Text style={styles.selectSubtitle}>Select your account type to get started</Text>

          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => setUserType('customer')}
          >
            <View style={styles.roleIcon}>
              <Ionicons name="person-outline" size={28} color={COLORS.gold} />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleTitle}>Customer</Text>
              <Text style={styles.roleDesc}>Shop luxury products with AI assistance</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => setUserType('advisor')}
          >
            <View style={styles.roleIcon}>
              <Ionicons name="briefcase-outline" size={28} color={COLORS.gold} />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleTitle}>Sales Advisor</Text>
              <Text style={styles.roleDesc}>Manage customers and track sales</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Registration Form
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setUserType(null);
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            employeeId: '',
            storeLocation: '',
          });
        }}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.black} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formHeader}>
          <Text style={styles.brandNameSmall}>LUXESENSE AI</Text>
          <Text style={styles.formTitle}>
            {userType === 'customer' ? 'Customer Registration' : 'Advisor Registration'}
          </Text>
          <Text style={styles.formSubtitle}>
            {userType === 'customer'
              ? 'Create your account to start shopping'
              : 'Register to access the sales dashboard'}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={COLORS.gray} />
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={(v) => updateField('fullName', v)}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.gray}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={COLORS.gray} />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(v) => updateField('email', v)}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.gray}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Phone (Customer only) */}
          {userType === 'customer' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={20} color={COLORS.gray} />
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(v) => updateField('phone', v)}
                  placeholder="Enter your phone number"
                  placeholderTextColor={COLORS.gray}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          )}

          {/* Employee ID (Advisor only) */}
          {userType === 'advisor' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Employee ID *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="id-card-outline" size={20} color={COLORS.gray} />
                <TextInput
                  style={styles.input}
                  value={formData.employeeId}
                  onChangeText={(v) => updateField('employeeId', v)}
                  placeholder="Enter your employee ID"
                  placeholderTextColor={COLORS.gray}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          )}

          {/* Store Location (Advisor only) */}
          {userType === 'advisor' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Store Location *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="location-outline" size={20} color={COLORS.gray} />
                <TextInput
                  style={styles.input}
                  value={formData.storeLocation}
                  onChangeText={(v) => updateField('storeLocation', v)}
                  placeholder="Enter store name or location"
                  placeholderTextColor={COLORS.gray}
                />
              </View>
            </View>
          )}

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(v) => updateField('password', v)}
                placeholder="Create a password"
                placeholderTextColor={COLORS.gray}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
              <TextInput
                style={styles.input}
                value={formData.confirmPassword}
                onChangeText={(v) => updateField('confirmPassword', v)}
                placeholder="Confirm your password"
                placeholderTextColor={COLORS.gray}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.registerBtnText}>Create Account</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.loginPromptForm}>
          <Text style={styles.loginPromptText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: SIZES.padding,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...SHADOWS.light,
  },
  brandSection: {
    alignItems: 'center',
    paddingTop: 120,
    marginBottom: 40,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '300',
    color: COLORS.black,
    letterSpacing: 6,
  },
  brandAI: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.gold,
    letterSpacing: 4,
    marginTop: 4,
  },
  brandDivider: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.gold,
    marginTop: 20,
  },
  roleSection: {
    paddingHorizontal: SIZES.padding,
  },
  selectTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 8,
  },
  selectSubtitle: {
    fontSize: 15,
    color: COLORS.gray,
    marginBottom: 32,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: 16,
    ...SHADOWS.light,
  },
  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleInfo: {
    flex: 1,
    marginLeft: 16,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.black,
  },
  roleDesc: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  loginPrompt: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  loginPromptText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
  },
  formHeader: {
    marginBottom: 32,
  },
  brandNameSmall: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gold,
    letterSpacing: 3,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 15,
    color: COLORS.gray,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.beigeDark,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.black,
    marginLeft: 12,
  },
  termsText: {
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: 24,
  },
  termsLink: {
    color: COLORS.gold,
    fontWeight: '500',
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
    gap: 10,
  },
  registerBtnDisabled: {
    opacity: 0.7,
  },
  registerBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  loginPromptForm: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default RegisterScreen;
