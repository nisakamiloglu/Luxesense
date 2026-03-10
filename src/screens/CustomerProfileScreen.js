import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { customerProfile, purchaseHistory, aiRecommendations } from '../constants/mockData';
import Header from '../components/Header';
import Card from '../components/Card';

const CustomerProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Header
        title="Client Profile"
        subtitle="Isabella Rossi"
        rightIcon="create-outline"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>IR</Text>
              </View>
              <View style={styles.tierBadge}>
                <Ionicons name="diamond" size={12} color={COLORS.gold} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{customerProfile.name}</Text>
              <Text style={styles.tierText}>{customerProfile.tier}</Text>
              <Text style={styles.memberText}>Member since {customerProfile.memberSince}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{customerProfile.totalSpend}</Text>
              <Text style={styles.statLabel}>Total Spend</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{purchaseHistory.length}</Text>
              <Text style={styles.statLabel}>Purchases</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Years</Text>
            </View>
          </View>
        </Card>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.tagsContainer}>
            {customerProfile.preferences.map((pref, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{pref}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI Recommendations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={18} color={COLORS.gold} />
              <Text style={styles.sectionTitle}>AI Recommendations</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recommendationsScroll}
          >
            {aiRecommendations.map((item) => (
              <Card key={item.id} style={styles.recommendationCard}>
                <View style={styles.recommendationImage}>
                  <Ionicons name="gift-outline" size={32} color={COLORS.gold} />
                </View>
                <Text style={styles.recommendationName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.recommendationPrice}>{item.price}</Text>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>{item.match} Match</Text>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Purchase History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Purchase History</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {purchaseHistory.slice(0, 4).map((purchase) => (
            <Card key={purchase.id} style={styles.purchaseCard}>
              <View style={styles.purchaseIcon}>
                <Ionicons
                  name={
                    purchase.category === 'Bags' ? 'bag-outline' :
                    purchase.category === 'Jewelry' ? 'diamond-outline' :
                    'shirt-outline'
                  }
                  size={20}
                  color={COLORS.gold}
                />
              </View>
              <View style={styles.purchaseInfo}>
                <Text style={styles.purchaseItem}>{purchase.item}</Text>
                <Text style={styles.purchaseDate}>{purchase.date}</Text>
              </View>
              <Text style={styles.purchasePrice}>{purchase.price}</Text>
            </Card>
          ))}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Notes</Text>
          <Card style={styles.notesCard}>
            <Text style={styles.notesText}>{customerProfile.notes}</Text>
            <View style={styles.notesMeta}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.gray} />
              <Text style={styles.notesMetaText}>
                Anniversary: {customerProfile.anniversaryDate}
              </Text>
            </View>
          </Card>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.gold,
  },
  tierBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.black,
  },
  tierText: {
    fontSize: SIZES.body3,
    color: COLORS.gold,
    fontWeight: '600',
    marginTop: 4,
  },
  memberText: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.black,
  },
  statLabel: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.cardBorder,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 12,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
    paddingHorizontal: SIZES.padding,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: SIZES.body3,
    color: COLORS.gold,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.padding,
    gap: 8,
  },
  tag: {
    backgroundColor: COLORS.beige,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    fontSize: SIZES.body3,
    color: COLORS.charcoal,
    fontWeight: '500',
  },
  recommendationsScroll: {
    paddingLeft: SIZES.padding,
  },
  recommendationCard: {
    width: 160,
    marginRight: 12,
    padding: 12,
  },
  recommendationImage: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.beige,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationName: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  recommendationPrice: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
    marginBottom: 8,
  },
  matchBadge: {
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  matchText: {
    fontSize: SIZES.caption,
    color: COLORS.goldDark,
    fontWeight: '600',
  },
  purchaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: 8,
    padding: 14,
  },
  purchaseIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  purchaseItem: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  purchaseDate: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    marginTop: 2,
  },
  purchasePrice: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  notesCard: {
    marginHorizontal: SIZES.padding,
  },
  notesText: {
    fontSize: SIZES.body2,
    color: COLORS.charcoal,
    lineHeight: 22,
  },
  notesMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    gap: 6,
  },
  notesMetaText: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
  },
  bottomPadding: {
    height: 40,
  },
});

export default CustomerProfileScreen;
