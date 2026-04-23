import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';

const ProfileScreen = ({ navigation }) => {
  const { user, orders, wishlist, getCartCount, logout, language, changeLanguage } = useApp();
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  useScrollToTop(scrollRef);

  const handleLanguageChange = () => {
    Alert.alert(
      t('profile.language'),
      '',
      [
        { text: 'English', onPress: () => changeLanguage('en') },
        { text: 'Türkçe', onPress: () => changeLanguage('tr') },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const myAdvisor = {
    id: 1,
    name: 'Isabelle Moreau',
    role: 'Senior Sales Advisor',
    store: 'Paris Flagship',
    phone: '+33 1 42 65 24 00',
    email: 'isabelle@luxesense.com',
    avatar: 'IM',
    rating: 4.9,
    specialties: ['Fine Jewelry', 'Haute Horlogerie'],
    availability: 'Available Now',
  };

  const handleCall = () => {
    // Feature not implemented yet
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${myAdvisor.email}?subject=Inquiry from ${user.name}`);
  };

  const menuItems = [
    {
      icon: 'bag-outline',
      label: t('profile.myOrders'),
      onPress: () => {},
    },
    {
      icon: 'location-outline',
      label: t('profile.myAddresses'),
      onPress: () => {},
    },
    {
      icon: 'card-outline',
      label: 'Payment Methods',
      onPress: () => {},
    },
    {
      icon: 'notifications-outline',
      label: t('profile.notifications'),
      onPress: () => {},
    },
    {
      icon: 'globe-outline',
      label: t('profile.language'),
      onPress: handleLanguageChange,
    },
    {
      icon: 'help-circle-outline',
      label: t('profile.help'),
      onPress: () => {},
    },
    {
      icon: 'information-circle-outline',
      label: 'About',
      onPress: () => {},
    },
  ];

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('common.profile')}</Text>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => navigation.navigate('Cart')}
        >
          <Ionicons name="bag-outline" size={22} color="#1A1A1A" />
          {getCartCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getCartCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* Top user area */}
        <View style={styles.topArea}>
          {/* Avatar + name + tier */}
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.tierBadge}>
                <Text style={styles.tierText}>{user.tier} Member</Text>
              </View>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{orders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{wishlist.length}</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${user.totalSpent.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
          </View>
        </View>

        {/* Thin divider */}
        <View style={styles.divider} />

        {/* My Advisor card */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>My Advisor</Text>
          <View style={styles.advisorCard}>
            <View style={styles.advisorAvatar}>
              <Text style={styles.advisorAvatarText}>{myAdvisor.avatar}</Text>
            </View>
            <View style={styles.advisorInfo}>
              <Text style={styles.advisorName}>{myAdvisor.name}</Text>
              <Text style={styles.advisorRole}>{myAdvisor.role}</Text>
            </View>
            <View style={styles.advisorActions}>
              <TouchableOpacity style={styles.advisorActionBtn} onPress={handleCall}>
                <Ionicons name="call-outline" size={16} color="#1A1A1A" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.advisorActionBtn}
                onPress={() => navigation.navigate('Chat', { advisor: myAdvisor })}
              >
                <Ionicons name="chatbubble-outline" size={16} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Thin divider */}
        <View style={styles.divider} />

        {/* Menu items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuIconCircle}>
                <Ionicons name={item.icon} size={18} color="#1A1A1A" />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#AAAAAA" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <View style={styles.signOutWrapper}>
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={() => {
              logout();
              navigation.replace('Landing');
            }}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },

  // Top area
  topArea: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F0E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.2,
  },
  userEmail: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#C9A84C',
    borderRadius: 20,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EDE8',
    borderRadius: 12,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#EBEBEB',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#F2F2F2',
    marginHorizontal: 0,
  },

  // Section wrapper
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
  },

  // Advisor card
  advisorCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  advisorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F0E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  advisorAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  advisorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  advisorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  advisorRole: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  advisorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  advisorActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F0E8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Menu
  menuSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F0E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },

  // Sign out
  signOutWrapper: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  signOutBtn: {
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;
