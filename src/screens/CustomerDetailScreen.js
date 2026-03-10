import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const CustomerDetailScreen = ({ route, navigation }) => {
  const { customer } = route.params;

  const purchaseHistory = [
    { id: 1, item: 'Diamond Pendant Necklace', date: '2024-03-01', amount: 8500 },
    { id: 2, item: 'Silk Evening Gown', date: '2024-02-15', amount: 2850 },
    { id: 3, item: 'Cashmere Sweater', date: '2024-01-28', amount: 1450 },
    { id: 4, item: 'Classic Stiletto Pumps', date: '2024-01-10', amount: 1290 },
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
        <Text style={styles.headerTitle}>Client Profile</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{customer.avatar}</Text>
          </View>
          <Text style={styles.customerName}>{customer.name}</Text>
          <View style={[
            styles.tierBadge,
            customer.tier === 'Platinum' && styles.tierPlatinum,
            customer.tier === 'Gold' && styles.tierGold,
          ]}>
            <Ionicons name="diamond" size={12} color={customer.tier === 'Platinum' ? '#424242' : '#F57C00'} />
            <Text style={[
              styles.tierText,
              customer.tier === 'Platinum' && styles.tierTextPlatinum,
              customer.tier === 'Gold' && styles.tierTextGold,
            ]}>{customer.tier} Member</Text>
          </View>

          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="call" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="mail" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="chatbubble" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactBtn, styles.contactBtnOutline]}>
              <Ionicons name="calendar" size={20} color={COLORS.gold} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color={COLORS.gray} />
              <Text style={styles.infoText}>{customer.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={18} color={COLORS.gray} />
              <Text style={styles.infoText}>{customer.phone}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${customer.totalSpent.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{purchaseHistory.length}</Text>
            <Text style={styles.statLabel}>Purchases</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {new Date(customer.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
            <Text style={styles.statLabel}>Last Visit</Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.prefRow}>
            {customer.preferences.map((pref, index) => (
              <View key={index} style={styles.prefTag}>
                <Text style={styles.prefText}>{pref}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <TouchableOpacity>
              <Ionicons name="add-circle-outline" size={22} color={COLORS.gold} />
            </TouchableOpacity>
          </View>
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>{customer.notes}</Text>
          </View>
        </View>

        {/* Purchase History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Purchase History</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {purchaseHistory.map((purchase) => (
            <View key={purchase.id} style={styles.purchaseItem}>
              <View style={styles.purchaseIcon}>
                <Ionicons name="bag-check" size={18} color={COLORS.gold} />
              </View>
              <View style={styles.purchaseInfo}>
                <Text style={styles.purchaseItem}>{purchase.item}</Text>
                <Text style={styles.purchaseDate}>
                  {new Date(purchase.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <Text style={styles.purchaseAmount}>${purchase.amount.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="gift" size={22} color="#1976D2" />
              </View>
              <Text style={styles.actionText}>Send Gift</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="sparkles" size={22} color="#388E3C" />
              </View>
              <Text style={styles.actionText}>Recommend</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="calendar" size={22} color="#F57C00" />
              </View>
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#FCE4EC' }]}>
                <Ionicons name="heart" size={22} color="#E91E63" />
              </View>
              <Text style={styles.actionText}>Wishlist</Text>
            </TouchableOpacity>
          </View>
        </View>

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 20,
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
    fontWeight: '500',
    color: COLORS.black,
  },
  moreBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: SIZES.padding,
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.white,
  },
  customerName: {
    fontSize: 22,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 8,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.beige,
    gap: 6,
    marginBottom: 20,
  },
  tierPlatinum: {
    backgroundColor: '#E8E8E8',
  },
  tierGold: {
    backgroundColor: '#FFF8E1',
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
  },
  tierTextPlatinum: {
    color: '#424242',
  },
  tierTextGold: {
    color: '#F57C00',
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contactBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactBtnOutline: {
    backgroundColor: COLORS.beige,
  },
  section: {
    marginHorizontal: SIZES.padding,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    ...SHADOWS.light,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.black,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SIZES.padding,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.gray,
  },
  prefRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  prefTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.beigeDark,
  },
  prefText: {
    fontSize: 13,
    color: COLORS.black,
  },
  notesCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    ...SHADOWS.light,
  },
  notesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  purchaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 10,
    ...SHADOWS.light,
  },
  purchaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  purchaseName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  purchaseDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  purchaseAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gold,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.black,
  },
});

export default CustomerDetailScreen;
