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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { loginUser } from '../services/api';

const LoginScreen = ({ navigation }) => {
  const { login } = useApp();
  const { t } = useTranslation();
  const { showSuccess, showError, showWarning } = useToast();
  const [userType, setUserType] = useState(null); // 'customer' or 'advisor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async () => {
    if (!email || !password) {
      showWarning('Missing Information', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(email.toLowerCase(), password);

      if (response.success) {
        const loggedInUserType = response.user.role || userType;
        login(loggedInUserType, response.user, response.token);

        if (loggedInUserType === 'customer') {
          navigation.replace('Splash');
        } else {
          navigation.replace('AdvisorTabs');
        }
      } else {
        showError('Login Failed', response.message || 'Invalid email or password');
      }
    } catch (error) {
      showError('Connection Error', 'Please check your internet connection');
    } finally {
      setLoading(false);
    }
  };

  const selectUserType = (type) => {
    setUserType(type);
    setEmail('');
    setPassword('');
  };

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
          <Text style={styles.brandTagline}>A New Way of Shopping</Text>
        </Animated.View>

        <Animated.View style={[styles.userTypeSection, { opacity: fadeAnim }]}>
          <Text style={styles.selectTitle}>{t('auth.welcome')}</Text>
          <Text style={styles.selectSubtitle}>{t('auth.selectAccountType')}</Text>

          <TouchableOpacity
            style={styles.userTypeCard}
            onPress={() => selectUserType('customer')}
          >
            <View style={styles.userTypeIcon}>
              <Ionicons name="person-outline" size={28} color={COLORS.gold} />
            </View>
            <View style={styles.userTypeInfo}>
              <Text style={styles.userTypeTitle}>{t('auth.customer')}</Text>
              <Text style={styles.userTypeDesc}>{t('auth.shopLuxury')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.userTypeCard}
            onPress={() => selectUserType('advisor')}
          >
            <View style={styles.userTypeIcon}>
              <Ionicons name="briefcase-outline" size={28} color={COLORS.gold} />
            </View>
            <View style={styles.userTypeInfo}>
              <Text style={styles.userTypeTitle}>{t('auth.salesAdvisor')}</Text>
              <Text style={styles.userTypeDesc}>{t('auth.signInToContinue')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footerText}>
          Experience personalized luxury
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setUserType(null);
          setEmail('');
          setPassword('');
        }}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.black} />
      </TouchableOpacity>

      <View style={styles.loginContent}>
        <View style={styles.loginHeader}>
          <Text style={styles.brandNameSmall}>LUXESENSE AI</Text>
          <Text style={styles.loginTitle}>
            {userType === 'customer' ? 'Customer Login' : 'Advisor Login'}
          </Text>
          <Text style={styles.loginSubtitle}>
            {userType === 'customer'
              ? 'Welcome back to your luxury experience'
              : 'Access your sales dashboard'}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.email')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={COLORS.gray} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.email')}
                placeholderTextColor={COLORS.gray}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.password')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.password')}
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

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.loginBtnText}>{t('auth.login')}</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.signupPrompt}>
            <Text style={styles.signupPromptText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  brandSection: {
    alignItems: 'center',
    paddingTop: 120,
    marginBottom: 60,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '300',
    color: COLORS.black,
    letterSpacing: 8,
  },
  brandAI: {
    fontSize: 24,
    fontWeight: '500',
    color: COLORS.gold,
    letterSpacing: 6,
    marginTop: 4,
  },
  brandDivider: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.gold,
    marginVertical: 24,
  },
  brandTagline: {
    fontSize: 14,
    color: COLORS.gray,
    letterSpacing: 2,
  },
  userTypeSection: {
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
  userTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: 16,
    ...SHADOWS.light,
  },
  userTypeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userTypeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userTypeTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.black,
  },
  userTypeDesc: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  footerText: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    fontSize: 13,
    color: COLORS.gray,
    letterSpacing: 1,
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
  loginContent: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 120,
  },
  loginHeader: {
    marginBottom: 40,
  },
  brandNameSmall: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gold,
    letterSpacing: 3,
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 15,
    color: COLORS.gray,
  },
  form: {
    marginBottom: 32,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '500',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
    gap: 10,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupPromptText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  signupLink: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '600',
  },
});

export default LoginScreen;
