import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { advisorAppointments } from '../constants/mockData';

const AdvisorCalendarScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState('Today');

  const dates = ['Today', 'Tomorrow', 'Mar 6', 'Mar 7', 'Mar 8'];

  const filteredAppointments = advisorAppointments.filter(
    (apt) => apt.date === selectedDate
  );

  const getTimeUntil = (time) => {
    // Simple mock - in real app would calculate actual time difference
    if (time === '2:00 PM') return 'In 45 minutes';
    if (time === '4:30 PM') return 'In 3 hours';
    return '';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Calendar</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Date Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateSelector}
        contentContainerStyle={styles.dateSelectorContent}
      >
        {dates.map((date) => (
          <TouchableOpacity
            key={date}
            style={[
              styles.dateBtn,
              selectedDate === date && styles.dateBtnActive,
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text
              style={[
                styles.dateText,
                selectedDate === date && styles.dateTextActive,
              ]}
            >
              {date}
            </Text>
            {advisorAppointments.filter((a) => a.date === date).length > 0 && (
              <View style={[
                styles.dateDot,
                selectedDate === date && styles.dateDotActive,
              ]} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Upcoming Alert */}
        {selectedDate === 'Today' && filteredAppointments.length > 0 && (
          <View style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Ionicons name="time" size={24} color={COLORS.white} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Upcoming Appointment</Text>
              <Text style={styles.alertText}>
                {filteredAppointments[0].customer} - {getTimeUntil(filteredAppointments[0].time)}
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}

        {/* Appointments */}
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
              {/* Time & Type Header */}
              <View style={styles.appointmentHeader}>
                <View style={styles.timeContainer}>
                  <Ionicons name="time-outline" size={16} color={COLORS.gold} />
                  <Text style={styles.appointmentTime}>{appointment.time}</Text>
                  <Text style={styles.appointmentDuration}>({appointment.duration})</Text>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{appointment.type}</Text>
                </View>
              </View>

              {/* Customer Info */}
              <View style={styles.customerRow}>
                <View style={styles.customerAvatar}>
                  <Text style={styles.avatarText}>{appointment.avatar}</Text>
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{appointment.customer}</Text>
                  <Text style={styles.customerNote}>{appointment.notes}</Text>
                </View>
              </View>

              {/* Interests */}
              <View style={styles.interestsSection}>
                <Text style={styles.interestsLabel}>Interested In:</Text>
                <View style={styles.interestsTags}>
                  {appointment.interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* AI Insight */}
              <View style={styles.aiInsightCard}>
                <View style={styles.aiHeader}>
                  <Ionicons name="sparkles" size={16} color={COLORS.gold} />
                  <Text style={styles.aiTitle}>AI INSIGHT</Text>
                </View>
                <Text style={styles.aiText}>{appointment.aiInsight}</Text>
              </View>

              {/* Actions */}
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="call-outline" size={18} color={COLORS.gold} />
                  <Text style={styles.actionText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="mail-outline" size={18} color={COLORS.gold} />
                  <Text style={styles.actionText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="document-text-outline" size={18} color={COLORS.gold} />
                  <Text style={styles.actionText}>Notes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]}>
                  <Ionicons name="bag-outline" size={18} color={COLORS.white} />
                  <Text style={styles.actionTextPrimary}>Prepare</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.goldMuted} />
            </View>
            <Text style={styles.emptyTitle}>No appointments</Text>
            <Text style={styles.emptySubtitle}>
              No appointments scheduled for {selectedDate.toLowerCase()}
            </Text>
          </View>
        )}

        {/* AI Summary */}
        {selectedDate === 'Today' && filteredAppointments.length > 0 && (
          <View style={styles.aiSummaryCard}>
            <View style={styles.aiSummaryHeader}>
              <Ionicons name="sparkles" size={20} color={COLORS.gold} />
              <Text style={styles.aiSummaryTitle}>Today's AI Brief</Text>
            </View>
            <Text style={styles.aiSummaryText}>
              You have {filteredAppointments.length} appointments today. Alexandra Chen is your highest-value
              client visiting today - she's shown strong interest in Hermès Birkin. Victoria Sterling
              is likely ready to purchase a Rolex Datejust based on her browsing patterns.
              Focus on building relationships and understanding their needs.
            </Text>
            <View style={styles.aiTips}>
              <View style={styles.aiTip}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.aiTipText}>Have Birkin 25 Orange ready for Alexandra</Text>
              </View>
              <View style={styles.aiTip}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.aiTipText}>Prepare Rolex comparison for Victoria</Text>
              </View>
              <View style={styles.aiTip}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.aiTipText}>Potential combined sales: $26,050</Text>
              </View>
            </View>
          </View>
        )}

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
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateSelector: {
    maxHeight: 50,
    marginBottom: 16,
  },
  dateSelectorContent: {
    paddingHorizontal: SIZES.padding,
    gap: 10,
  },
  dateBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  dateBtnActive: {
    backgroundColor: COLORS.black,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  dateTextActive: {
    color: COLORS.white,
  },
  dateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
    marginTop: 4,
  },
  dateDotActive: {
    backgroundColor: COLORS.white,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: 16,
    padding: 16,
    backgroundColor: COLORS.gold,
    borderRadius: SIZES.radius,
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
    marginLeft: 14,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  alertText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  appointmentCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: 16,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  appointmentDuration: {
    fontSize: 13,
    color: COLORS.gray,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.beige,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.black,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.black,
  },
  customerNote: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  interestsSection: {
    marginBottom: 16,
  },
  interestsLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
  },
  interestsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.beige,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 12,
    color: COLORS.black,
  },
  aiInsightCard: {
    padding: 14,
    backgroundColor: '#FFFBEB',
    borderRadius: SIZES.radiusSm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    marginBottom: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gold,
    letterSpacing: 1,
  },
  aiText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: COLORS.beige,
    borderRadius: SIZES.radiusSm,
    gap: 6,
  },
  actionBtnPrimary: {
    backgroundColor: COLORS.black,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.black,
  },
  actionTextPrimary: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  aiSummaryCard: {
    marginHorizontal: SIZES.padding,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.goldLight,
    ...SHADOWS.light,
  },
  aiSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  aiSummaryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  aiSummaryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  aiTips: {
    gap: 10,
  },
  aiTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiTipText: {
    fontSize: 13,
    color: COLORS.black,
  },
});

export default AdvisorCalendarScreen;
