import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

const SettingsScreen = ({ navigation }) => {
  const { user, token, logout } = useApp();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Profile edit state
  const [editName, setEditName] = useState(user.fullName || user.name);
  const [editPhone, setEditPhone] = useState(user.phone || '');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showWarning('Missing Information', 'Please fill all fields');
      return;
    }
    if (newPassword.length < 4) {
      showWarning('Weak Password', 'Password must be at least 4 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('Mismatch', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://luxesense-backend-production.up.railway.app/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await response.json();

      if (data.success) {
        showSuccess('Password Updated', 'Your password has been changed');
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showError('Failed', data.message || 'Could not change password');
      }
    } catch (error) {
      showError('Connection Error', 'Please check your internet');
    }
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      showWarning('Missing Information', 'Name cannot be empty');
      return;
    }

    try {
      const response = await fetch('https://luxesense-backend-production.up.railway.app/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
        }),
      });
      const data = await response.json();

      if (data.success) {
        showSuccess('Profile Updated', 'Your changes have been saved');
        setShowEditProfile(false);
      } else {
        showError('Failed', data.message || 'Could not update profile');
      }
    } catch (error) {
      showError('Connection Error', 'Please check your internet');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            showInfo('Account Deleted', 'Your account has been removed');
            logout();
            setTimeout(() => navigation.replace('Landing'), 1500);
          },
        },
      ]
    );
  };

  const settingsOptions = [
    {
      icon: 'person-outline',
      label: 'Edit Profile',
      desc: 'Change your name, phone number',
      onPress: () => setShowEditProfile(true),
    },
    {
      icon: 'lock-closed-outline',
      label: 'Change Password',
      desc: 'Update your password',
      onPress: () => setShowChangePassword(true),
    },
    {
      icon: 'notifications-outline',
      label: 'Notifications',
      desc: 'Manage push notifications',
      onPress: () => {},
    },
    {
      icon: 'shield-outline',
      label: 'Privacy',
      desc: 'Privacy and data settings',
      onPress: () => {},
    },
    {
      icon: 'help-circle-outline',
      label: 'Help & Support',
      desc: 'FAQ and contact support',
      onPress: () => {},
    },
    {
      icon: 'document-text-outline',
      label: 'Terms & Conditions',
      desc: 'Read our terms of service',
      onPress: () => {},
    },
    {
      icon: 'trash-outline',
      label: 'Delete Account',
      desc: 'Permanently delete your account',
      onPress: handleDeleteAccount,
      danger: true,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user.name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.fullName || user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.optionsCard}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                index === settingsOptions.length - 1 && styles.optionItemLast,
              ]}
              onPress={option.onPress}
            >
              <View style={[styles.optionIcon, option.danger && styles.optionIconDanger]}>
                <Ionicons
                  name={option.icon}
                  size={22}
                  color={option.danger ? COLORS.error : COLORS.gold}
                />
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionLabel, option.danger && styles.optionLabelDanger]}>
                  {option.label}
                </Text>
                <Text style={styles.optionDesc}>{option.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={showChangePassword} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowChangePassword(false)}>
                <Ionicons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  secureTextEntry={!showCurrentPw}
                />
                <TouchableOpacity onPress={() => setShowCurrentPw(!showCurrentPw)}>
                  <Ionicons
                    name={showCurrentPw ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry={!showNewPw}
                />
                <TouchableOpacity onPress={() => setShowNewPw(!showNewPw)}>
                  <Ionicons
                    name={showNewPw ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry={!showNewPw}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleChangePassword}>
              <Text style={styles.saveBtnText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfile} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <Ionicons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your name"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[styles.inputWrapper, styles.inputDisabled]}>
                <TextInput
                  style={[styles.input, { color: COLORS.gray }]}
                  value={user.email}
                  editable={false}
                />
              </View>
              <Text style={styles.inputHint}>Email cannot be changed</Text>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateProfile}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SIZES.padding,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.white,
  },
  userInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  optionsCard: {
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.beigeDark,
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIconDanger: {
    backgroundColor: '#FFEBEE',
  },
  optionContent: {
    flex: 1,
    marginLeft: 14,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
  },
  optionLabelDanger: {
    color: COLORS.error,
  },
  optionDesc: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
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
    backgroundColor: COLORS.beige,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    height: 52,
  },
  inputDisabled: {
    backgroundColor: COLORS.beigeDark,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.black,
  },
  inputHint: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 6,
  },
  saveBtn: {
    height: 52,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default SettingsScreen;
