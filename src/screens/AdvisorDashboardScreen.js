import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const ENG_DOT = { High: COLORS.gold, Mid: '#8B7355', Low: '#C0C0C0' };

const ScoreBadge = ({ score }) => {
  const s = score ?? 0;
  const color = s >= 8 ? COLORS.gold : s >= 5 ? '#8B7355' : '#C0C0C0';
  return (
    <View style={[styles.scoreBadge, { borderColor: color }]}>
      <Text style={[styles.scoreNum, { color }]}>{s.toFixed(1)}</Text>
    </View>
  );
};

const AdvisorDashboardScreen = ({ navigation }) => {
  const { advisor, assignedCustomers, getGreeting, logout } = useApp();

  const progress = Math.min((advisor.currentSales / advisor.monthlyTarget) * 100, 100);

  const topClients = [...assignedCustomers]
    .sort((a, b) => (b.cviScore ?? 0) - (a.cviScore ?? 0))
    .slice(0, 3);

  const urgentCount = assignedCustomers
    .flatMap(c => c.alerts || [])
    .filter(a => a.urgency === 'high').length;

  const appointments = [
    { id: 1, customer: 'Charlotte Windsor', time: 'Today, 3:00 PM',     type: 'Consultation'     },
    { id: 2, customer: 'Victoria Sterling', time: 'Tomorrow, 11:00 AM', type: 'Watch Viewing'    },
    { id: 3, customer: 'Alexandra Chen',    time: 'Mar 5, 2:00 PM',     type: 'Private Shopping' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.name}>{advisor.name}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Activity')}>
            <Ionicons name="flash-outline" size={22} color={COLORS.black} />
            {urgentCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{urgentCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => { logout(); navigation.replace('Landing'); }}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.black} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Sales Target */}
        <View style={styles.targetCard}>
          <View style={styles.targetTop}>
            <Text style={styles.targetLabel}>Monthly Target</Text>
            <View style={styles.rankChip}>
              <Ionicons name="trophy" size={12} color={COLORS.gold} />
              <Text style={styles.rankText}>#{advisor.ranking} of {advisor.totalAdvisors}</Text>
            </View>
          </View>
          <View style={styles.targetNums}>
            <Text style={styles.currentSales}>${advisor.currentSales.toLocaleString()}</Text>
            <Text style={styles.targetAmount}>/ ${advisor.monthlyTarget.toLocaleString()}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.targetBottom}>
            <Text style={styles.progressPct}>{progress.toFixed(0)}% achieved</Text>
            <Text style={styles.remaining}>
              ${(advisor.monthlyTarget - advisor.currentSales).toLocaleString()} remaining
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[
            { icon: 'people',      value: advisor.clientsServed,                       label: 'Clients'    },
            { icon: 'cash',        value: `$${advisor.averageTicket.toLocaleString()}`, label: 'Avg Ticket' },
            { icon: 'trending-up', value: `${advisor.conversionRate}%`,                label: 'Conversion' },
          ].map(s => (
            <View key={s.label} style={styles.statCard}>
              <Ionicons name={s.icon} size={16} color={COLORS.gold} style={{ marginBottom: 6 }} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Top Clients */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Top Clients</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Clients')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {topClients.map(c => {
            const engColor = ENG_DOT[c.engagementLevel] || '#C0C0C0';
            return (
              <TouchableOpacity
                key={c.id}
                style={styles.clientRow}
                onPress={() => navigation.navigate('CustomerDetail', { customer: c })}
              >
                <View style={styles.clientAvatarWrap}>
                  <View style={styles.clientAvatar}>
                    <Text style={styles.clientAvatarText}>{c.avatar}</Text>
                  </View>
                  <View style={[styles.clientEngDot, { backgroundColor: engColor }]} />
                </View>
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{c.name}</Text>
                  <Text style={styles.clientSub}>
                    {c.engagementLevel} · {c.purchaseFrequency} · {c.lastSeen}
                  </Text>
                </View>
                <ScoreBadge score={c.cviScore} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {appointments.map(apt => (
            <View key={apt.id} style={styles.aptCard}>
              <View style={styles.aptLeft}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.gold} />
                <Text style={styles.aptTime}>{apt.time}</Text>
              </View>
              <View style={styles.aptRight}>
                <Text style={styles.aptCustomer}>{apt.customer}</Text>
                <Text style={styles.aptType}>{apt.type}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.padding, paddingTop: 60, paddingBottom: 20,
  },
  greeting: { fontSize: 13, color: COLORS.gray },
  name: { fontSize: 26, fontWeight: '500', color: COLORS.black, marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.light,
  },
  badge: {
    position: 'absolute', top: -2, right: -2,
    minWidth: 17, height: 17, borderRadius: 9,
    backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { fontSize: 9, fontWeight: '800', color: COLORS.white },

  targetCard: {
    marginHorizontal: SIZES.padding, marginBottom: 14,
    padding: 20, backgroundColor: COLORS.black, borderRadius: SIZES.radius,
    ...SHADOWS.medium,
  },
  targetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  targetLabel: { fontSize: 12, color: '#999', letterSpacing: 0.5 },
  rankChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(201,169,98,0.18)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10,
  },
  rankText: { fontSize: 11, fontWeight: '600', color: COLORS.gold },
  targetNums: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  currentSales: { fontSize: 30, fontWeight: '600', color: COLORS.white },
  targetAmount: { fontSize: 14, color: '#666', marginLeft: 8 },
  progressBar: {
    height: 5, backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 3, marginBottom: 10, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 3 },
  targetBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  progressPct: { fontSize: 11, color: COLORS.gold },
  remaining: { fontSize: 11, color: '#666' },

  statsRow: {
    flexDirection: 'row', paddingHorizontal: SIZES.padding, gap: 10, marginBottom: 20,
  },
  statCard: {
    flex: 1, padding: 14, backgroundColor: COLORS.white,
    borderRadius: SIZES.radius, alignItems: 'center', ...SHADOWS.light,
  },
  statValue: { fontSize: 15, fontWeight: '600', color: COLORS.black },
  statLabel: { fontSize: 10, color: COLORS.gray, marginTop: 2 },

  section: { marginBottom: 20 },
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.padding, marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '500', color: COLORS.black },
  seeAll: { fontSize: 13, color: COLORS.gold, fontWeight: '500' },

  clientRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SIZES.padding, marginBottom: 10,
    padding: 14, backgroundColor: COLORS.white,
    borderRadius: SIZES.radius, ...SHADOWS.light,
  },
  clientAvatarWrap: { position: 'relative', marginRight: 12 },
  clientAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center',
  },
  clientAvatarText: { fontSize: 14, fontWeight: '600', color: COLORS.white },
  clientEngDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 11, height: 11, borderRadius: 6,
    borderWidth: 2, borderColor: COLORS.white,
  },
  clientInfo: { flex: 1 },
  clientName: { fontSize: 14, fontWeight: '500', color: COLORS.black },
  clientSub: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  scoreBadge: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 2, justifyContent: 'center', alignItems: 'center',
  },
  scoreNum: { fontSize: 16, fontWeight: '700' },

  aptCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SIZES.padding, marginBottom: 8,
    padding: 14, backgroundColor: COLORS.white,
    borderRadius: SIZES.radius, gap: 14, ...SHADOWS.light,
  },
  aptLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 130 },
  aptTime: { fontSize: 11, color: COLORS.gold, fontWeight: '500' },
  aptRight: { flex: 1 },
  aptCustomer: { fontSize: 14, fontWeight: '500', color: COLORS.black },
  aptType: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
});

export default AdvisorDashboardScreen;
