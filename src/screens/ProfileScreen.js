import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
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

  // Assigned Sales Advisor for this customer
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
    Alert.alert(
      'Call Advisor',
      `Call ${myAdvisor.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${myAdvisor.phone}`) },
      ]
    );
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${myAdvisor.email}?subject=Inquiry from ${user.name}`);
  };

  const menuItems = [
    {
      icon: 'bag-outline',
      label: t('profile.myOrders'),
      value: `${orders.length}`,
      onPress: () => {},
    },
    {
      icon: 'heart-outline',
      label: t('common.wishlist'),
      value: `${wishlist.length}`,
      onPress: () => navigation.navigate('Wishlist'),
    },
    {
      icon: 'location-outline',
      label: t('profile.myAddresses'),
      value: '2',
      onPress: () => {},
    },
    {
      icon: 'globe-outline',
      label: t('profile.language'),
      value: language === 'tr' ? 'Türkçe' : 'English',
      onPress: handleLanguageChange,
    },
    {
      icon: 'notifications-outline',
      label: t('profile.notifications'),
      value: 'On',
      onPress: () => {},
    },
    {
      icon: 'settings-outline',
      label: t('profile.settings'),
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'help-circle-outline',
      label: t('profile.help'),
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('common.profile')}</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Cart')}
        >
          <Ionicons name="bag-outline" size={24} color={COLORS.black} />
          {getCartCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getCartCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.split(' ').map((n) => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <View style={styles.tierBadge}>
              <Ionicons name="diamond" size={14} color={COLORS.gold} />
              <Text style={styles.tierText}>{user.tier} Member</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="create-outline" size={20} color={COLORS.gold} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.totalSpent.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.loyaltyPoints.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        {/* My Sales Advisor */}
        <View style={styles.advisorSection}>
          <Text style={styles.advisorSectionTitle}>Your Personal Advisor</Text>
          <View style={styles.advisorCard}>
            <View style={styles.advisorHeader}>
              <View style={styles.advisorAvatar}>
                <Text style={styles.advisorAvatarText}>{myAdvisor.avatar}</Text>
              </View>
              <View style={styles.advisorInfo}>
                <Text style={styles.advisorName}>{myAdvisor.name}</Text>
                <Text style={styles.advisorRole}>{myAdvisor.role}</Text>
                <View style={styles.advisorStore}>
                  <Ionicons name="location" size={12} color={COLORS.gray} />
                  <Text style={styles.advisorStoreText}>{myAdvisor.store}</Text>
                </View>
              </View>
              <View style={styles.advisorStatus}>
                <View style={styles.availabilityDot} />
                <Text style={styles.availabilityText}>Online</Text>
              </View>
            </View>

            <View style={styles.advisorSpecialties}>
              {myAdvisor.specialties.map((specialty, idx) => (
                <View key={idx} style={styles.specialtyTag}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
              <View style={styles.ratingTag}>
                <Ionicons name="star" size={12} color={COLORS.gold} />
                <Text style={styles.ratingText}>{myAdvisor.rating}</Text>
              </View>
            </View>

            <View style={styles.advisorActions}>
              <TouchableOpacity
                style={styles.advisorActionBtn}
                onPress={() => navigation.navigate('Chat', { advisor: myAdvisor })}
              >
                <Ionicons name="chatbubble-outline" size={20} color={COLORS.white} />
                <Text style={styles.advisorActionText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.advisorActionBtn, styles.advisorActionBtnOutline]}
                onPress={handleCall}
              >
                <Ionicons name="call-outline" size={20} color={COLORS.gold} />
                <Text style={[styles.advisorActionText, styles.advisorActionTextOutline]}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.advisorActionBtn, styles.advisorActionBtnOutline]}
                onPress={handleEmail}
              >
                <Ionicons name="mail-outline" size={20} color={COLORS.gold} />
                <Text style={[styles.advisorActionText, styles.advisorActionTextOutline]}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={22} color={COLORS.gold} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.value && (
                  <Text style={styles.menuValue}>{item.value}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <View style={styles.ordersSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {orders.slice(0, 2).map((order) => (
              <TouchableOpacity key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <View style={[
                    styles.statusBadge,
                    order.status === 'delivered' && styles.statusDelivered,
                    order.status === 'shipped' && styles.statusShipped,
                    order.status === 'processing' && styles.statusProcessing,
                  ]}>
                    <Text style={[
                      styles.statusText,
                      order.status === 'delivered' && styles.statusTextDelivered,
                    ]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.orderDate}>
                  {new Date(order.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
                <View style={styles.orderItems}>
                  {order.items.slice(0, 3).map((item, idx) => (
                    <Image
                      key={idx}
                      source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                      style={styles.orderItemImage}
                    />
                  ))}
                  {order.items.length > 3 && (
                    <View style={styles.moreItems}>
                      <Text style={styles.moreItemsText}>+{order.items.length - 3}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderTotal}>
                    ${order.total.toLocaleString()}
                  </Text>
                  <Text style={styles.trackingText}>
                    Track: {order.trackingNumber}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            logout();
            navigation.replace('Landing');
          }}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: COLORS.black,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SIZES.padding,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.white,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
  },
  profileEmail: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gold,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SIZES.padding,
    marginBottom: 16,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.beigeDark,
  },
  advisorSection: {
    margin: SIZES.padding,
    marginBottom: 0,
  },
  advisorSectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 12,
  },
  advisorCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.goldLight,
    ...SHADOWS.light,
  },
  advisorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  advisorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  advisorAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  advisorInfo: {
    flex: 1,
    marginLeft: 14,
  },
  advisorName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  advisorRole: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  advisorStore: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  advisorStoreText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  advisorStatus: {
    alignItems: 'center',
  },
  availabilityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '500',
  },
  advisorSpecialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
    gap: 8,
  },
  specialtyTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.beige,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  ratingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.beige,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: '600',
  },
  advisorActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  advisorActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radiusSm,
    gap: 6,
  },
  advisorActionBtnOutline: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.goldLight,
  },
  advisorActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.white,
  },
  advisorActionTextOutline: {
    color: COLORS.gold,
  },
  menuSection: {
    margin: SIZES.padding,
    marginTop: 0,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.beigeDark,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 14,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
  },
  menuValue: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  ordersSection: {
    margin: SIZES.padding,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '500',
  },
  orderCard: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: COLORS.beige,
  },
  statusDelivered: {
    backgroundColor: '#E8F5E9',
  },
  statusShipped: {
    backgroundColor: '#E3F2FD',
  },
  statusProcessing: {
    backgroundColor: '#FFF8E1',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gray,
  },
  statusTextDelivered: {
    color: COLORS.success,
  },
  orderDate: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 4,
  },
  orderItems: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  orderItemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.beige,
  },
  moreItems: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gold,
  },
  trackingText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: SIZES.padding,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    gap: 10,
    ...SHADOWS.light,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.error,
  },
});

export default ProfileScreen;
