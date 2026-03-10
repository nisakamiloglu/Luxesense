import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import {
  performanceMetrics,
  salesByCategory,
  achievements,
  weeklyTrend,
} from '../constants/mockData';
import Header from '../components/Header';
import Card from '../components/Card';

const PerformanceDashboard = () => {
  const maxSales = Math.max(...weeklyTrend.map(d => d.sales));

  return (
    <View style={styles.container}>
      <Header
        title="Performance"
        subtitle="March 2024"
        rightIcon="download-outline"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Monthly Target Card */}
        <Card style={styles.targetCard}>
          <View style={styles.targetHeader}>
            <Text style={styles.targetLabel}>Monthly Sales Target</Text>
            <View style={styles.daysRemaining}>
              <Ionicons name="time-outline" size={14} color={COLORS.gold} />
              <Text style={styles.daysText}>{performanceMetrics.daysRemaining} days left</Text>
            </View>
          </View>

          <View style={styles.targetProgress}>
            <Text style={styles.currentAmount}>{performanceMetrics.currentSales}</Text>
            <Text style={styles.targetAmount}>of {performanceMetrics.monthlyTarget}</Text>
          </View>

          <View style={styles.progressBarLarge}>
            <View style={[
              styles.progressFillLarge,
              { width: `${performanceMetrics.percentComplete}%` }
            ]} />
          </View>

          <View style={styles.targetMeta}>
            <Text style={styles.percentText}>{performanceMetrics.percentComplete}% Complete</Text>
            <Text style={styles.remainingText}>
              ${(500000 - 387500).toLocaleString()} to go
            </Text>
          </View>
        </Card>

        {/* KPIs Grid */}
        <View style={styles.kpiGrid}>
          <Card style={styles.kpiCard}>
            <View style={styles.kpiIcon}>
              <Ionicons name="receipt-outline" size={20} color={COLORS.gold} />
            </View>
            <Text style={styles.kpiValue}>{performanceMetrics.averageTicket}</Text>
            <Text style={styles.kpiLabel}>Avg. Ticket</Text>
          </Card>

          <Card style={styles.kpiCard}>
            <View style={styles.kpiIcon}>
              <Ionicons name="people-outline" size={20} color={COLORS.gold} />
            </View>
            <Text style={styles.kpiValue}>{performanceMetrics.totalClients}</Text>
            <Text style={styles.kpiLabel}>Total Clients</Text>
          </Card>

          <Card style={styles.kpiCard}>
            <View style={styles.kpiIcon}>
              <Ionicons name="repeat-outline" size={20} color={COLORS.gold} />
            </View>
            <Text style={styles.kpiValue}>{performanceMetrics.repeatClients}</Text>
            <Text style={styles.kpiLabel}>Repeat Clients</Text>
          </Card>
        </View>

        {/* Weekly Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <Card style={styles.chartCard}>
            <View style={styles.chartContainer}>
              {weeklyTrend.map((day, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${(day.sales / maxSales) * 100}%`,
                          backgroundColor: day.day === 'Sat' ? COLORS.gold : COLORS.beige
                        }
                      ]}
                    />
                  </View>
                  <Text style={[
                    styles.dayLabel,
                    day.day === 'Sat' && styles.dayLabelActive
                  ]}>{day.day}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <Text style={styles.chartTotal}>
                Weekly Total: ${weeklyTrend.reduce((a, b) => a + b.sales, 0).toLocaleString()}
              </Text>
            </View>
          </Card>
        </View>

        {/* Sales by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales by Category</Text>
          <Card style={styles.categoriesCard}>
            {salesByCategory.map((cat, index) => (
              <View key={index} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{cat.category}</Text>
                  <Text style={styles.categoryAmount}>{cat.amount}</Text>
                </View>
                <View style={styles.categoryBarWrapper}>
                  <View style={styles.categoryBarBg}>
                    <View
                      style={[
                        styles.categoryBarFill,
                        { width: `${cat.percentage}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.categoryPercent}>{cat.percentage}%</Text>
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.achievementsScroll}
          >
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.earned && styles.achievementCardLocked
                ]}
              >
                <View style={[
                  styles.achievementIcon,
                  !achievement.earned && styles.achievementIconLocked
                ]}>
                  <Ionicons
                    name={
                      achievement.icon === 'trophy' ? 'trophy' :
                      achievement.icon === 'star' ? 'star' :
                      achievement.icon === 'award' ? 'ribbon' :
                      'diamond'
                    }
                    size={28}
                    color={achievement.earned ? COLORS.gold : COLORS.gray}
                  />
                </View>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.earned && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={styles.achievementDesc} numberOfLines={2}>
                  {achievement.description}
                </Text>
                {achievement.earned && (
                  <View style={styles.earnedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                    <Text style={styles.earnedText}>Earned</Text>
                  </View>
                )}
              </Card>
            ))}
          </ScrollView>
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
  targetCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: 16,
    backgroundColor: COLORS.black,
    padding: 20,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  targetLabel: {
    fontSize: SIZES.body3,
    color: COLORS.lightGray,
  },
  daysRemaining: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  daysText: {
    fontSize: SIZES.caption,
    color: COLORS.gold,
    fontWeight: '500',
  },
  targetProgress: {
    marginBottom: 16,
  },
  currentAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: -1,
  },
  targetAmount: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
    marginTop: 4,
  },
  progressBarLarge: {
    height: 8,
    backgroundColor: COLORS.charcoal,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFillLarge: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 4,
  },
  targetMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentText: {
    fontSize: SIZES.body3,
    color: COLORS.gold,
    fontWeight: '600',
  },
  remainingText: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
  },
  kpiGrid: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    gap: 10,
    marginBottom: 24,
  },
  kpiCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  kpiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  kpiValue: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.black,
  },
  kpiLabel: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    marginTop: 4,
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
  chartCard: {
    marginHorizontal: SIZES.padding,
    padding: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: 120,
    width: 24,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 8,
  },
  dayLabel: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    fontWeight: '500',
  },
  dayLabelActive: {
    color: COLORS.gold,
    fontWeight: '600',
  },
  chartLegend: {
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    paddingTop: 12,
  },
  chartTotal: {
    fontSize: SIZES.body3,
    color: COLORS.charcoal,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoriesCard: {
    marginHorizontal: SIZES.padding,
    padding: 20,
  },
  categoryRow: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: SIZES.body3,
    color: COLORS.charcoal,
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: SIZES.body3,
    color: COLORS.black,
    fontWeight: '600',
  },
  categoryBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.beige,
    borderRadius: 3,
  },
  categoryBarFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 3,
  },
  categoryPercent: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    width: 32,
    textAlign: 'right',
  },
  achievementsScroll: {
    paddingLeft: SIZES.padding,
  },
  achievementCard: {
    width: 160,
    marginRight: 12,
    padding: 16,
    alignItems: 'center',
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIconLocked: {
    backgroundColor: COLORS.lightGray,
  },
  achievementTitle: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 6,
  },
  achievementTitleLocked: {
    color: COLORS.gray,
  },
  achievementDesc: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 16,
  },
  earnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  earnedText: {
    fontSize: SIZES.caption,
    color: COLORS.success,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

export default PerformanceDashboard;
