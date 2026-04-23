import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const ENG_DOT = { High: COLORS.gold, Mid: '#8B7355', Low: '#C0C0C0' };
const PF_COLOR = { Heavy: COLORS.gold, Regular: '#8B7355', Rare: '#C0C0C0' };

const FILTERS = [
  { key: 'all',          label: 'All'       },
  { key: 'high_priority',label: 'Priority'  },
  { key: 'follow_up',    label: 'Follow Up' },
  { key: 'low_priority', label: 'Low'       },
];

const ScoreRing = ({ score }) => {
  const s = score ?? 0;
  const color = s >= 8 ? COLORS.gold : s >= 5 ? '#8B7355' : '#C0C0C0';
  return (
    <View style={[styles.scoreRing, { borderColor: color }]}>
      <Text style={[styles.scoreNumber, { color }]}>{s.toFixed(1)}</Text>
      <Text style={[styles.scoreMax, { color }]}>/10</Text>
    </View>
  );
};

const CustomersScreen = ({ navigation }) => {
  const { assignedCustomers } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const customers = [...assignedCustomers]
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || c.cviSegment === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => (b.cviScore ?? 0) - (a.cviScore ?? 0));

  const renderItem = ({ item }) => {
    const engColor = ENG_DOT[item.engagementLevel] || '#C0C0C0';
    const pfColor  = PF_COLOR[item.purchaseFrequency] || '#C0C0C0';
    const hasAlert = (item.alerts || []).some(a => a.urgency === 'high');

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CustomerDetail', { customer: item })}
        activeOpacity={0.8}
      >
        <View style={styles.cardMain}>
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.avatar}</Text>
            </View>
            <View style={[styles.engDot, { backgroundColor: engColor }]} />
            {hasAlert && <View style={styles.alertDot} />}
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.lastSeen}>{item.lastSeen}</Text>
            <View style={styles.metricsRow}>
              <View style={[styles.metric, { backgroundColor: engColor + '18' }]}>
                <Text style={[styles.metricText, { color: engColor }]}>
                  {item.engagementLevel}
                </Text>
              </View>
              <View style={[styles.metric, { backgroundColor: pfColor + '18' }]}>
                <Text style={[styles.metricText, { color: pfColor }]}>
                  {item.purchaseFrequency}
                </Text>
              </View>
            </View>
          </View>

          {/* Score */}
          <ScoreRing score={item.cviScore} />
        </View>

        {/* Alert preview */}
        {item.alerts?.[0] && (
          <View style={styles.alertStrip}>
            <Ionicons name="chevron-forward" size={12} color={COLORS.gray} />
            <Text style={styles.alertStripText} numberOfLines={1}>
              {item.alerts[0].message}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Clients</Text>
        <Text style={styles.count}>{assignedCustomers.length}</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients..."
          placeholderTextColor={COLORS.gray}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={customers}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={44} color={COLORS.beigeDark} />
            <Text style={styles.emptyText}>No clients found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.padding, paddingTop: 60, paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '500', color: COLORS.black },
  count: { fontSize: 28, fontWeight: '300', color: COLORS.gray },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SIZES.padding, marginBottom: 12,
    backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    paddingHorizontal: 16, height: 46, gap: 10, ...SHADOWS.light,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.black },

  filterRow: {
    flexDirection: 'row', paddingHorizontal: SIZES.padding,
    marginBottom: 12, gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: COLORS.white, borderRadius: 20, ...SHADOWS.light,
  },
  filterChipActive: { backgroundColor: COLORS.black },
  filterChipText: { fontSize: 12, fontWeight: '500', color: COLORS.black },
  filterChipTextActive: { color: COLORS.white },

  list: { paddingHorizontal: SIZES.padding, paddingBottom: 100 },

  card: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    marginBottom: 12, padding: 16, ...SHADOWS.light,
  },
  cardMain: { flexDirection: 'row', alignItems: 'center' },

  avatarWrap: { position: 'relative', marginRight: 14 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '600', color: COLORS.white },
  engDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 11, height: 11, borderRadius: 6,
    borderWidth: 2, borderColor: COLORS.white,
  },
  alertDot: {
    position: 'absolute', top: -2, right: -2,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.gold, borderWidth: 2, borderColor: COLORS.white,
  },

  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '500', color: COLORS.black },
  lastSeen: { fontSize: 12, color: COLORS.gray, marginTop: 2, marginBottom: 6 },
  metricsRow: { flexDirection: 'row', gap: 6 },
  metric: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  metricText: { fontSize: 11, fontWeight: '600' },

  scoreRing: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, justifyContent: 'center', alignItems: 'center',
  },
  scoreNumber: { fontSize: 18, fontWeight: '700', lineHeight: 20 },
  scoreMax: { fontSize: 9, fontWeight: '500', lineHeight: 11 },

  alertStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 12, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: COLORS.beigeDark,
  },
  alertStripText: { fontSize: 12, color: COLORS.gray, flex: 1 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 14, color: COLORS.gray },
});

export default CustomersScreen;
