import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { products } from '../constants/mockData';

// Mock customer purchase history data
const customerPurchases = [
  {
    id: 1,
    customer: {
      name: 'Alexandra Chen',
      avatar: 'AC',
      tier: 'Platinum',
      email: 'alexandra@email.com',
    },
    purchases: [
      { product: products[0], date: '2024-03-14', price: 11400 }, // Birkin
      { product: products[26], date: '2024-02-28', price: 8850 }, // Juste un Clou
    ],
    totalSpent: 20250,
    aiRecommendation: {
      product: products[3], // Constance
      reason: 'Alexandra loves Hermès bags. The Constance would complete her collection.',
    },
  },
  {
    id: 2,
    customer: {
      name: 'Victoria Sterling',
      avatar: 'VS',
      tier: 'Gold',
      email: 'victoria@email.com',
    },
    purchases: [
      { product: products[31], date: '2024-03-12', price: 8550 }, // Datejust
      { product: products[6], date: '2024-02-15', price: 7800 }, // Boy Bag
    ],
    totalSpent: 16350,
    aiRecommendation: {
      product: products[32], // Submariner
      reason: 'Victoria is interested in Rolex. The Submariner matches her sporty-chic style.',
    },
  },
  {
    id: 3,
    customer: {
      name: 'Sophia Laurent',
      avatar: 'SL',
      tier: 'Platinum',
      email: 'sophia@email.com',
    },
    purchases: [
      { product: products[27], date: '2024-03-10', price: 7650 }, // Love Bracelet
      { product: products[11], date: '2024-03-01', price: 6100 }, // Lady Dior
      { product: products[41], date: '2024-02-20', price: 650 }, // Carré Scarf
    ],
    totalSpent: 14400,
    aiRecommendation: {
      product: products[29], // Panthère Ring
      reason: 'Sophia collects Cartier jewelry. The Panthère Ring would be a statement piece for her.',
    },
  },
  {
    id: 4,
    customer: {
      name: 'Emma Rothschild',
      avatar: 'ER',
      tier: 'Gold',
      email: 'emma@email.com',
    },
    purchases: [
      { product: products[12], date: '2024-03-08', price: 4100 }, // Saddle Bag
      { product: products[5], date: '2024-02-25', price: 220 }, // Twilly
    ],
    totalSpent: 4320,
    aiRecommendation: {
      product: products[13], // Book Tote
      reason: 'Emma loves Dior. The Book Tote is perfect for her casual everyday style.',
    },
  },
  {
    id: 5,
    customer: {
      name: 'James Morrison',
      avatar: 'JM',
      tier: 'Silver',
      email: 'james@email.com',
    },
    purchases: [
      { product: products[32], date: '2024-03-05', price: 10250 }, // Submariner
    ],
    totalSpent: 10250,
    aiRecommendation: {
      product: products[34], // GMT-Master II
      reason: 'James is a watch enthusiast. The GMT-Master II would be his next investment piece.',
    },
  },
];

const AdvisorPurchaseHistoryScreen = ({ navigation }) => {
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  const periods = [
    { id: 'all', label: 'All Time' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  const toggleExpand = (customerId) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  const renderPurchaseItem = (purchase, index) => (
    <View key={index} style={styles.purchaseItem}>
      <Image
        source={typeof purchase.product.image === 'string' ? { uri: purchase.product.image } : purchase.product.image}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.purchaseInfo}>
        <Text style={styles.productBrand}>{purchase.product.brand}</Text>
        <Text style={styles.productName}>{purchase.product.name}</Text>
        <Text style={styles.purchaseDate}>
          {new Date(purchase.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
      </View>
      <Text style={styles.productPrice}>${purchase.price.toLocaleString()}</Text>
    </View>
  );

  const renderCustomerCard = ({ item }) => {
    const isExpanded = expandedCustomer === item.id;

    return (
      <View style={styles.customerCard}>
        {/* Customer Header */}
        <TouchableOpacity
          style={styles.customerHeader}
          onPress={() => toggleExpand(item.id)}
        >
          <View style={styles.customerAvatar}>
            <Text style={styles.avatarText}>{item.customer.avatar}</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.customer.name}</Text>
            <Text style={styles.customerEmail}>{item.customer.email}</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={[
              styles.tierBadge,
              item.customer.tier === 'Platinum' && styles.tierPlatinum,
              item.customer.tier === 'Gold' && styles.tierGold,
            ]}>
              <Text style={[
                styles.tierText,
                item.customer.tier === 'Platinum' && styles.tierTextPlatinum,
                item.customer.tier === 'Gold' && styles.tierTextGold,
              ]}>{item.customer.tier}</Text>
            </View>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.gray}
            />
          </View>
        </TouchableOpacity>

        {/* Summary Stats */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Purchases</Text>
            <Text style={styles.summaryValue}>{item.purchases.length}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>${item.totalSpent.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Last Purchase</Text>
            <Text style={styles.summaryValue}>
              {new Date(item.purchases[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Recent Purchases */}
            <Text style={styles.sectionTitle}>Recent Purchases</Text>
            {item.purchases.map((purchase, index) => renderPurchaseItem(purchase, index))}

            {/* AI Recommendation */}
            <View style={styles.aiRecommendation}>
              <View style={styles.aiHeader}>
                <Ionicons name="sparkles" size={18} color={COLORS.gold} />
                <Text style={styles.aiTitle}>AI RECOMMENDATION</Text>
              </View>
              <View style={styles.aiContent}>
                <Image
                  source={typeof item.aiRecommendation.product.image === 'string'
                    ? { uri: item.aiRecommendation.product.image }
                    : item.aiRecommendation.product.image}
                  style={styles.aiProductImage}
                  resizeMode="cover"
                />
                <View style={styles.aiProductInfo}>
                  <Text style={styles.aiProductBrand}>{item.aiRecommendation.product.brand}</Text>
                  <Text style={styles.aiProductName}>{item.aiRecommendation.product.name}</Text>
                  <Text style={styles.aiProductPrice}>
                    ${item.aiRecommendation.product.price.toLocaleString()}
                  </Text>
                </View>
              </View>
              <Text style={styles.aiReason}>{item.aiRecommendation.reason}</Text>
              <TouchableOpacity
                style={styles.suggestBtn}
                onPress={() => navigation.navigate('ProductDetails', { product: item.aiRecommendation.product })}
              >
                <Text style={styles.suggestBtnText}>View Product</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Purchase History</Text>
        <Text style={styles.headerSubtitle}>{customerPurchases.length} customers</Text>
      </View>

      {/* Period Filter */}
      <View style={styles.filterContainer}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.filterBtn,
              filterPeriod === period.id && styles.filterBtnActive,
            ]}
            onPress={() => setFilterPeriod(period.id)}
          >
            <Text style={[
              styles.filterText,
              filterPeriod === period.id && styles.filterTextActive,
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Customer List */}
      <FlatList
        data={customerPurchases}
        renderItem={renderCustomerCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    gap: 10,
    marginBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
    fontSize: 16,
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
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  tierText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.gray,
  },
  tierTextPlatinum: {
    color: '#424242',
  },
  tierTextGold: {
    color: '#F57C00',
  },
  summaryRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: COLORS.beigeDark,
    backgroundColor: COLORS.white,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    color: COLORS.gray,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.black,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.beigeDark,
  },
  expandedContent: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: COLORS.beigeDark,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  purchaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.beigeDark,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.beige,
  },
  purchaseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productBrand: {
    fontSize: 10,
    color: COLORS.gray,
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.black,
    marginTop: 2,
  },
  purchaseDate: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gold,
  },
  aiRecommendation: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.beige,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.goldLight,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gold,
    letterSpacing: 1,
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiProductImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  aiProductInfo: {
    flex: 1,
    marginLeft: 12,
  },
  aiProductBrand: {
    fontSize: 10,
    color: COLORS.gray,
    letterSpacing: 0.5,
  },
  aiProductName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
    marginTop: 2,
  },
  aiProductPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gold,
    marginTop: 4,
  },
  aiReason: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  suggestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    paddingVertical: 12,
    borderRadius: SIZES.radiusSm,
    gap: 8,
  },
  suggestBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
  },
});

export default AdvisorPurchaseHistoryScreen;
