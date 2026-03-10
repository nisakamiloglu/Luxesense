import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const CustomersScreen = ({ navigation }) => {
  const { assignedCustomers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('all');

  const tiers = ['all', 'Platinum', 'Gold', 'Silver'];

  const filteredCustomers = assignedCustomers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'all' || customer.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const renderCustomer = ({ item }) => (
    <TouchableOpacity
      style={styles.customerCard}
      onPress={() => navigation.navigate('CustomerDetail', { customer: item })}
    >
      <View style={styles.customerHeader}>
        <View style={styles.customerAvatar}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.customerEmail}>{item.email}</Text>
        </View>
        <View style={[
          styles.tierBadge,
          item.tier === 'Platinum' && styles.tierPlatinum,
          item.tier === 'Gold' && styles.tierGold,
          item.tier === 'Silver' && styles.tierSilver,
        ]}>
          <Text style={[
            styles.tierText,
            item.tier === 'Platinum' && styles.tierTextPlatinum,
            item.tier === 'Gold' && styles.tierTextGold,
          ]}>{item.tier}</Text>
        </View>
      </View>

      <View style={styles.customerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={styles.statValue}>${item.totalSpent.toLocaleString()}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Last Visit</Text>
          <Text style={styles.statValue}>
            {new Date(item.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Last Purchase</Text>
          <Text style={styles.statValue} numberOfLines={1}>{item.lastPurchase}</Text>
        </View>
      </View>

      <View style={styles.customerPreferences}>
        {item.preferences.map((pref, index) => (
          <View key={index} style={styles.prefTag}>
            <Text style={styles.prefText}>{pref}</Text>
          </View>
        ))}
      </View>

      <View style={styles.customerActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="call-outline" size={18} color={COLORS.gold} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="mail-outline" size={18} color={COLORS.gold} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="calendar-outline" size={18} color={COLORS.gold} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]}>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Clients</Text>
        <Text style={styles.clientCount}>{assignedCustomers.length} assigned</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients..."
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tier Filter */}
      <View style={styles.filterContainer}>
        {tiers.map((tier) => (
          <TouchableOpacity
            key={tier}
            style={[
              styles.filterBtn,
              filterTier === tier && styles.filterBtnActive,
            ]}
            onPress={() => setFilterTier(tier)}
          >
            <Text style={[
              styles.filterText,
              filterTier === tier && styles.filterTextActive,
            ]}>
              {tier === 'all' ? 'All' : tier}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Customers List */}
      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomer}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No clients found</Text>
          </View>
        }
      />
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
  clientCount: {
    fontSize: 14,
    color: COLORS.gray,
  },
  searchContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    height: 48,
    ...SHADOWS.light,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.black,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
    gap: 10,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    ...SHADOWS.light,
  },
  filterBtnActive: {
    backgroundColor: COLORS.black,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.black,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100,
  },
  customerCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.light,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  customerInfo: {
    flex: 1,
    marginLeft: 14,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  customerEmail: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: COLORS.beige,
  },
  tierPlatinum: {
    backgroundColor: '#E8E8E8',
  },
  tierGold: {
    backgroundColor: '#FFF8E1',
  },
  tierSilver: {
    backgroundColor: '#F5F5F5',
  },
  tierText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gray,
  },
  tierTextPlatinum: {
    color: '#424242',
  },
  tierTextGold: {
    color: '#F57C00',
  },
  customerStats: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.beigeDark,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.black,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.beigeDark,
  },
  customerPreferences: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  prefTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: COLORS.beige,
    borderRadius: 4,
  },
  prefText: {
    fontSize: 11,
    color: COLORS.gray,
  },
  customerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnPrimary: {
    backgroundColor: COLORS.black,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.gray,
    marginTop: 12,
  },
});

export default CustomersScreen;
