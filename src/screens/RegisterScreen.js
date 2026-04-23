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
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { registerUser } from '../services/api';

const Field = ({ label, field, placeholder, secure, keyboard, caps, extra, value, onChange, showPw }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.pwRow}>
      <TextInput
        style={[styles.input, { flex: 1 }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#C0B8B0"
        secureTextEntry={secure && !showPw}
        keyboardType={keyboard || 'default'}
        autoCapitalize={caps || 'none'}
      />
      {extra}
    </View>
    <View style={styles.inputLine} />
  </View>
);

const RegisterScreen = ({ navigation }) => {
  const { login } = useApp();
  const { showSuccess, showError, showWarning } = useToast();
  const [userType, setUserType] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    employeeId: '', storeLocation: '',
  });
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const update = (key, val) => setFormData(p => ({ ...p, [key]: val }));

  const validate = () => {
    const { fullName, email, password, confirmPassword, employeeId, storeLocation } = formData;
    if (!fullName.trim()) { showWarning('Missing', 'Please enter your full name'); return false; }
    if (!email.includes('@')) { showWarning('Invalid Email', 'Enter a valid email'); return false; }
    if (password.length < 4) { showWarning('Weak Password', 'At least 4 characters'); return false; }
    if (password !== confirmPassword) { showError('Mismatch', 'Passwords do not match'); return false; }
    if (userType === 'advisor') {
      if (!employeeId.trim()) { showWarning('Missing', 'Enter Employee ID'); return false; }
      if (!storeLocation.trim()) { showWarning('Missing', 'Enter Store Location'); return false; }
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await registerUser({
        name: formData.fullName,
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: userType,
        phone: formData.phone || undefined,
        employeeId: userType === 'advisor' ? formData.employeeId : undefined,
        storeLocation: userType === 'advisor' ? formData.storeLocation : undefined,
      });
      if (response.success) {
        showSuccess('Welcome!', `Account created, ${formData.fullName}!`);
        login(userType, response.user, response.token, true);
        setTimeout(() => {
          if (userType === 'customer') {
            navigation.replace('StyleQuiz');
          } else {
            navigation.replace('AdvisorTabs');
          }
        }, 1200);
      } else {
        showError('Failed', response.message || 'Please try again');
      }
    } catch {
      showError('Connection Error', 'Check your internet connection');
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
          <Text style={styles.title}>Create{'\n'}your account</Text>

          {/* Role Tabs */}
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

          <Field label="Your Name" value={formData.fullName} onChange={v => update('fullName', v)} placeholder="Enter your full name" caps="words" />
          <Field label="Email" value={formData.email} onChange={v => update('email', v)} placeholder="username@email.com" keyboard="email-address" />
          {userType === 'customer' && (
            <Field label="Phone (Optional)" value={formData.phone} onChange={v => update('phone', v)} placeholder="+1 000 000 0000" keyboard="phone-pad" />
          )}
          {userType === 'advisor' && (
            <>
              <Field label="Employee ID" value={formData.employeeId} onChange={v => update('employeeId', v)} placeholder="EMP-12345" caps="characters" />
              <Field label="Store Location" value={formData.storeLocation} onChange={v => update('storeLocation', v)} placeholder="Store name or city" />
            </>
          )}
          <Field
            label="Password"
            value={formData.password}
            onChange={v => update('password', v)}
            placeholder="Create a password"
            secure
            showPw={showPassword}
            extra={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#AAA" />
              </TouchableOpacity>
            }
          />
          <Field label="Confirm Password" value={formData.confirmPassword} onChange={v => update('confirmPassword', v)} placeholder="Repeat your password" secure showPw={showPassword} />

          <Text style={styles.terms}>
            By creating an account, you agree to our <Text style={styles.termsLink}>Terms</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          <TouchableOpacity
            style={[styles.signupBtn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.signupBtnText}>Sign Up</Text>}
          </TouchableOpacity>

          {/* Social */}
          <View style={styles.dividerRow}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>Or sign up with Facebook</Text>
            <View style={styles.divLine} />
          </View>

          <TouchableOpacity style={styles.facebookBtn} activeOpacity={0.85}>
            <Ionicons name="logo-facebook" size={20} color="#fff" />
            <Text style={styles.facebookBtnText}>Sign Up with Facebook</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
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
  inner: { paddingHorizontal: SIZES.padding, paddingTop: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#1A1A1A', lineHeight: 40, marginBottom: 28 },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#F5F0EB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  roleTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
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
  field: { marginBottom: 24 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  pwRow: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { paddingLeft: 12, paddingVertical: 8 },
  input: { fontSize: 16, color: '#1A1A1A', paddingVertical: 8 },
  inputLine: { height: 1, backgroundColor: '#E8E0D8', marginTop: 4 },
  terms: { fontSize: 13, color: '#888', lineHeight: 20, marginBottom: 24 },
  termsLink: { color: COLORS.gold, fontWeight: '500' },
  signupBtn: {
    height: 56,
    backgroundColor: '#1A1A1A',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  signupBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  divLine: { flex: 1, height: 1, backgroundColor: '#EEE8E0' },
  divText: { fontSize: 12, color: '#AAA', textAlign: 'center', flexShrink: 1 },
  facebookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    backgroundColor: '#1877F2',
    borderRadius: 28,
    gap: 10,
    marginBottom: 28,
  },
  facebookBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 14, color: '#888' },
  loginLink: { fontSize: 14, color: '#1A1A1A', fontWeight: '700' },
});

export default RegisterScreen;
