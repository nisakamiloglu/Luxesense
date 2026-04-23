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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { loginUser } from '../services/api';

const LoginScreen = ({ navigation }) => {
  const { login } = useApp();
  const { t } = useTranslation();
  const { showError, showWarning } = useToast();
  const [userType, setUserType] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 600, useNativeDriver: true }),
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
        const type = response.user.role || userType;
        login(type, response.user, response.token);
        navigation.replace(type === 'customer' ? 'Splash' : 'AdvisorTabs');
      } else {
        showError('Login Failed', response.message || 'Invalid email or password');
      }
    } catch {
      showError('Connection Error', 'Please check your internet connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>

        <Animated.View style={[styles.inner, { opacity: fade, transform: [{ translateY: slide }] }]}>
          <Text style={styles.title}>Log into{'\n'}your account</Text>

          {/* Role tabs */}
          <View style={styles.roleTabs}>
            {['customer', 'advisor'].map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleTab, userType === r && styles.roleTabActive]}
                onPress={() => setUserType(r)}
              >
                <Text style={[styles.roleTabText, userType === r && styles.roleTabTextActive]}>
                  {r === 'customer' ? 'Customer' : 'Advisor'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Username / Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="username@email.com"
              placeholderTextColor="#C0B8B0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.inputLine} />
          </View>

          {/* Password */}
          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity><Text style={styles.forgot}>Forgot?</Text></TouchableOpacity>
            </View>
            <View style={styles.pwRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#C0B8B0"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#AAA" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputLine} />
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.loginBtnText}>Log In</Text>}
          </TouchableOpacity>

          {/* Social divider */}
          <View style={styles.dividerRow}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>Or sign up with social account</Text>
            <View style={styles.divLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            </TouchableOpacity>
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1, paddingBottom: 40 },
  backBtn: {
    marginTop: 58,
    marginLeft: SIZES.padding,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 40,
    marginBottom: 28,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#F5F0EB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  roleTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  roleTabText: { fontSize: 14, color: '#999', fontWeight: '500' },
  roleTabTextActive: { color: '#1A1A1A', fontWeight: '700' },
  field: { marginBottom: 28 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  input: { fontSize: 16, color: '#1A1A1A', paddingVertical: 8 },
  pwRow: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { paddingLeft: 12, paddingVertical: 8 },
  inputLine: { height: 1, backgroundColor: '#E8E0D8', marginTop: 4 },
  forgot: { fontSize: 13, color: COLORS.gold, fontWeight: '600', marginBottom: 8 },
  loginBtn: {
    height: 56,
    backgroundColor: '#1A1A1A',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  loginBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  divLine: { flex: 1, height: 1, backgroundColor: '#EEE8E0' },
  divText: { fontSize: 12, color: '#AAA', textAlign: 'center', flexShrink: 1 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 40 },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  signupRow: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { fontSize: 14, color: '#888' },
  signupLink: { fontSize: 14, color: '#1A1A1A', fontWeight: '700' },
});

export default LoginScreen;
