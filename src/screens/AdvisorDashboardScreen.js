import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const AdvisorDashboardScreen = ({ navigation }) => {
  const { advisor, assignedCustomers, getGreeting, logout } = useApp();

  const progressPercentage = (advisor.currentSales / advisor.monthlyTarget) * 100;

  const recentActivities = [
    { id: 1, type: 'sale', customer: 'Alexandra Chen', amount: 8500, item: 'Diamond Pendant', time: '2 hours ago' },
    { id: 2, type: 'appointment', customer: 'Victoria Sterling', time: '3 hours ago', note: 'Watch collection viewing' },
    { id: 3, type: 'sale', customer: 'Sophia Laurent', amount: 12800, item: 'Emerald Earrings', time: '5 hours ago' },
    { id: 4, type: 'followup', customer: 'Emma Rothschild', time: 'Yesterday', note: 'Birthday gift suggestions' },
  ];

  const upcomingAppointments = [
    { id: 1, customer: 'Charlotte Windsor', time: 'Today, 3:00 PM', type: 'Consultation' },
    { id: 2, customer: 'Victoria Sterling', time: 'Tomorrow, 11:00 AM', type: 'Watch Viewing' },
    { id: 3, customer: 'Alexandra Chen', time: 'Mar 5, 2:00 PM', type: 'Private Shopping' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.advisorName}>{advisor.name}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.black} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              logout();
              navigation.replace('Landing');
            }}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.black} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Sales Target Card */}
        <View style={styles.targetCard}>
          <View style={styles.targetHeader}>
            <Text style={styles.targetTitle}>Monthly Sales Target</Text>
            <View style={styles.rankBadge}>
              <Ionicons name="trophy" size={14} color={COLORS.gold} />
              <Text style={styles.rankText}>#{advisor.ranking} of {advisor.totalAdvisors}</Text>
            </View>
          </View>

          <View style={styles.targetProgress}>
            <View style={styles.targetNumbers}>
              <Text style={styles.currentSales}>${advisor.currentSales.toLocaleString()}</Text>
              <Text style={styles.targetAmount}>of ${advisor.monthlyTarget.toLocaleString()}</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(progressPercentage, 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>{progressPercentage.toFixed(0)}% achieved</Text>
          </View>

          <View style={styles.targetRemaining}>
            <Text style={styles.remainingLabel}>Remaining to target</Text>
            <Text style={styles.remainingAmount}>
              ${(advisor.monthlyTarget - advisor.currentSales).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="people" size={20} color="#1976D2" />
            </View>
            <Text style={styles.statValue}>{advisor.clientsServed}</Text>
            <Text style={styles.statLabel}>Clients Served</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="cash" size={20} color="#388E3C" />
            </View>
            <Text style={styles.statValue}>${advisor.averageTicket.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Avg. Ticket</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="trending-up" size={20} color="#F57C00" />
            </View>
            <Text style={styles.statValue}>{advisor.conversionRate}%</Text>
            <Text style={styles.statLabel}>Conversion</Text>
          </View>
        </View>

        {/* Commission Card */}
        <View style={styles.commissionCard}>
          <View style={styles.commissionIcon}>
            <Ionicons name="wallet" size={24} color={COLORS.gold} />
          </View>
          <View style={styles.commissionInfo}>
            <Text style={styles.commissionLabel}>Estimated Commission</Text>
            <Text style={styles.commissionAmount}>${advisor.commission.toLocaleString()}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingAppointments.map((apt) => (
            <TouchableOpacity key={apt.id} style={styles.appointmentCard}>
              <View style={styles.appointmentTime}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.gold} />
                <Text style={styles.appointmentTimeText}>{apt.time}</Text>
              </View>
              <Text style={styles.appointmentCustomer}>{apt.customer}</Text>
              <View style={styles.appointmentType}>
                <Text style={styles.appointmentTypeText}>{apt.type}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* My Clients Quick Access */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Clients</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Customers')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {assignedCustomers.slice(0, 4).map((customer) => (
              <TouchableOpacity
                key={customer.id}
                style={styles.clientCard}
                onPress={() => navigation.navigate('CustomerDetail', { customer })}
              >
                <View style={styles.clientAvatar}>
                  <Text style={styles.clientAvatarText}>{customer.avatar}</Text>
                </View>
                <Text style={styles.clientName} numberOfLines={1}>{customer.name.split(' ')[0]}</Text>
                <View style={[
                  styles.tierBadge,
                  customer.tier === 'Platinum' && styles.tierPlatinum,
                  customer.tier === 'Gold' && styles.tierGold,
                ]}>
                  <Text style={styles.tierText}>{customer.tier}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[
                styles.activityIcon,
                activity.type === 'sale' && styles.activitySale,
                activity.type === 'appointment' && styles.activityAppointment,
                activity.type === 'followup' && styles.activityFollowup,
              ]}>
                <Ionicons
                  name={
                    activity.type === 'sale' ? 'bag-check' :
                    activity.type === 'appointment' ? 'calendar' : 'chatbubble'
                  }
                  size={16}
                  color={COLORS.white}
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityCustomer}>{activity.customer}</Text>
                {activity.type === 'sale' ? (
                  <Text style={styles.activityDetail}>
                    Purchased {activity.item} - ${activity.amount.toLocaleString()}
                  </Text>
                ) : (
                  <Text style={styles.activityDetail}>{activity.note}</Text>
                )}
              </View>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.gray,
  },
  advisorName: {
    fontSize: 26,
    fontWeight: '500',
    color: COLORS.black,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
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
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  targetCard: {
    margin: SIZES.padding,
    padding: 20,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
    ...SHADOWS.medium,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  targetTitle: {
    fontSize: 14,
    color: COLORS.lightGray,
    letterSpacing: 0.5,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 98, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gold,
  },
  targetProgress: {
    marginBottom: 20,
  },
  targetNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  currentSales: {
    fontSize: 32,
    fontWeight: '600',
    color: COLORS.white,
  },
  targetAmount: {
    fontSize: 16,
    color: COLORS.gray,
    marginLeft: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.gold,
  },
  targetRemaining: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  remainingLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  remainingAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 4,
    textAlign: 'center',
  },
  commissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  commissionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commissionInfo: {
    flex: 1,
    marginLeft: 14,
  },
  commissionLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  commissionAmount: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.gold,
    marginTop: 2,
  },
  section: {
    marginTop: 8,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
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
  appointmentCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  appointmentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  appointmentTimeText: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '500',
  },
  appointmentCustomer: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 8,
  },
  appointmentType: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: COLORS.beige,
    borderRadius: 4,
  },
  appointmentTypeText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  clientCard: {
    alignItems: 'center',
    marginLeft: SIZES.padding,
    width: 80,
  },
  clientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  clientName: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 4,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: COLORS.beige,
    borderRadius: 4,
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
    padding: 14,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activitySale: {
    backgroundColor: COLORS.success,
  },
  activityAppointment: {
    backgroundColor: '#1976D2',
  },
  activityFollowup: {
    backgroundColor: COLORS.gold,
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityCustomer: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  activityDetail: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    color: COLORS.gray,
  },
});

export default AdvisorDashboardScreen;
