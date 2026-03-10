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
  advisorProfile,
  dailyPerformance,
  upcomingAppointments,
  nextBestActions,
} from '../constants/mockData';
import Header from '../components/Header';
import Card from '../components/Card';

const SalesAdvisorDashboard = () => {
  const progressPercent = (parseFloat(dailyPerformance.sales.replace(/[$,]/g, '')) /
    parseFloat(dailyPerformance.target.replace(/[$,]/g, ''))) * 100;

  return (
    <View style={styles.container}>
      <Header
        title="Good Morning"
        subtitle={advisorProfile.name}
        rightIcon="notifications-outline"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Performance Card */}
        <Card style={styles.performanceCard}>
          <View style={styles.performanceHeader}>
            <Text style={styles.performanceTitle}>Today's Performance</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
          </View>

          <View style={styles.salesContainer}>
            <Text style={styles.salesAmount}>{dailyPerformance.sales}</Text>
            <Text style={styles.salesTarget}>of {dailyPerformance.target} target</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.gold} />
              <Text style={styles.statNumber}>
                {dailyPerformance.completedAppointments}/{dailyPerformance.appointments}
              </Text>
              <Text style={styles.statLabel}>Appointments</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="trending-up-outline" size={20} color={COLORS.success} />
              <Text style={styles.statNumber}>{dailyPerformance.conversionRate}</Text>
              <Text style={styles.statLabel}>Conversion</Text>
            </View>
          </View>
        </Card>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity>
              <Ionicons name="add-circle-outline" size={24} color={COLORS.gold} />
            </TouchableOpacity>
          </View>

          {upcomingAppointments.map((apt) => (
            <Card key={apt.id} style={styles.appointmentCard}>
              <View style={styles.appointmentTime}>
                <Text style={styles.timeText}>{apt.time}</Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.clientName}>{apt.client}</Text>
                <Text style={styles.appointmentType}>{apt.type}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                apt.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending
              ]}>
                <Text style={[
                  styles.statusText,
                  apt.status === 'confirmed' ? styles.statusTextConfirmed : styles.statusTextPending
                ]}>
                  {apt.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Next Best Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.aiHeader}>
              <Ionicons name="bulb" size={20} color={COLORS.gold} />
              <Text style={styles.sectionTitle}>Next Best Actions</Text>
            </View>
          </View>

          {nextBestActions.map((action) => (
            <Card key={action.id} style={styles.actionCard}>
              <View style={[
                styles.priorityIndicator,
                action.priority === 'high' ? styles.priorityHigh :
                action.priority === 'medium' ? styles.priorityMedium : styles.priorityLow
              ]} />
              <View style={styles.actionContent}>
                <Text style={styles.actionText}>{action.action}</Text>
                <View style={styles.actionMeta}>
                  <Ionicons name="person-outline" size={12} color={COLORS.gray} />
                  <Text style={styles.actionClient}>{action.client}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.gold} />
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="qr-code-outline" size={24} color={COLORS.gold} />
              </View>
              <Text style={styles.quickActionText}>Scan Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="person-add-outline" size={24} color={COLORS.gold} />
              </View>
              <Text style={styles.quickActionText}>New Client</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="gift-outline" size={24} color={COLORS.gold} />
              </View>
              <Text style={styles.quickActionText}>Reserve Item</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="chatbubble-outline" size={24} color={COLORS.gold} />
              </View>
              <Text style={styles.quickActionText}>Send Message</Text>
            </TouchableOpacity>
          </View>
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
  performanceCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: 24,
    backgroundColor: COLORS.black,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceTitle: {
    fontSize: SIZES.body2,
    color: COLORS.lightGray,
    fontWeight: '500',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 124, 89, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  liveText: {
    fontSize: SIZES.caption,
    color: COLORS.success,
    fontWeight: '600',
  },
  salesContainer: {
    marginBottom: 16,
  },
  salesAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: -1,
  },
  salesTarget: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.charcoal,
    borderRadius: 3,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.charcoal,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 8,
  },
  statLabel: {
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
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: 8,
    padding: 14,
  },
  appointmentTime: {
    backgroundColor: COLORS.beige,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timeText: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.charcoal,
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  clientName: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  appointmentType: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: 'rgba(74, 124, 89, 0.15)',
  },
  statusPending: {
    backgroundColor: 'rgba(212, 168, 83, 0.15)',
  },
  statusText: {
    fontSize: SIZES.caption,
    fontWeight: '600',
  },
  statusTextConfirmed: {
    color: COLORS.success,
  },
  statusTextPending: {
    color: COLORS.warning,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: 8,
    padding: 14,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  priorityHigh: {
    backgroundColor: COLORS.error,
  },
  priorityMedium: {
    backgroundColor: COLORS.warning,
  },
  priorityLow: {
    backgroundColor: COLORS.info,
  },
  actionContent: {
    flex: 1,
  },
  actionText: {
    fontSize: SIZES.body2,
    color: COLORS.black,
    lineHeight: 20,
  },
  actionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  actionClient: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
  },
  actionButton: {
    padding: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.padding,
    gap: 12,
  },
  quickActionItem: {
    width: '47%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    color: COLORS.charcoal,
  },
  bottomPadding: {
    height: 40,
  },
});

export default SalesAdvisorDashboard;
