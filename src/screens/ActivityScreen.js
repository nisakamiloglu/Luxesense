import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { advisorAppointments } from '../constants/mockData';

const URGENCY_COLOR = { high: COLORS.gold, medium: '#8B7355', low: '#A0A0A0' };
const URGENCY_LABEL = { high: 'PRIORITY', medium: 'FOLLOW UP', low: 'INFO' };

const ActivityScreen = ({ navigation }) => {
  const { assignedCustomers } = useApp();
  const [tab, setTab] = useState('tasks'); // 'tasks' | 'schedule'
  const [templateModal, setTemplateModal] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [selectedDate, setSelectedDate] = useState('Today');

  // Tasks
  const allTasks = assignedCustomers
    .flatMap(c => (c.alerts || []).map(a => ({ ...a, customer: c })))
    .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.urgency] - { high: 0, medium: 1, low: 2 }[b.urgency]));

  const grouped = {
    high:   allTasks.filter(t => t.urgency === 'high'),
    medium: allTasks.filter(t => t.urgency === 'medium'),
    low:    allTasks.filter(t => t.urgency === 'low'),
  };

  const openModal = (task) => {
    setMessageText(task.template || '');
    setTemplateModal({ customer: task.customer, alert: task });
  };

  const handleSend = () => {
    const { customer } = templateModal;
    setTemplateModal(null);
    navigation.navigate('AdvisorChat', {
      customer: { name: customer.name, avatar: customer.avatar },
      conversationId: customer.id,
      prefillMessage: messageText,
    });
  };

  // Schedule
  const dates = ['Today', 'Tomorrow', 'Mar 6', 'Mar 7', 'Mar 8'];
  const appointments = advisorAppointments.filter(a => a.date === selectedDate);

  const urgentCount = grouped.high.length;

  const TaskGroup = ({ urgency, tasks }) => {
    if (tasks.length === 0) return null;
    const color = URGENCY_COLOR[urgency];
    return (
      <View style={styles.group}>
        <View style={styles.groupHeader}>
          <View style={[styles.groupDot, { backgroundColor: color }]} />
          <Text style={[styles.groupLabel, { color }]}>{URGENCY_LABEL[urgency]}</Text>
          <Text style={[styles.groupCount, { color }]}>{tasks.length}</Text>
        </View>
        {tasks.map((task, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.taskCard, { borderLeftColor: color }]}
            onPress={() => task.urgency !== 'low'
              ? openModal(task)
              : navigation.navigate('CustomerDetail', { customer: task.customer })
            }
            activeOpacity={0.78}
          >
            <View style={styles.taskTop}>
              <View style={styles.taskAvatar}>
                <Text style={styles.taskAvatarText}>{task.customer.avatar}</Text>
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.taskName}>{task.customer.name}</Text>
                <Text style={styles.taskMessage} numberOfLines={2}>{task.message}</Text>
              </View>
              <View style={[styles.scoreRing, { borderColor: color }]}>
                <Text style={[styles.scoreNum, { color }]}>
                  {(task.customer.cviScore ?? 0).toFixed(1)}
                </Text>
              </View>
            </View>
            {task.urgency !== 'low' && (
              <Text style={[styles.tapHint, { color }]}>Tap to reply →</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        {urgentCount > 0 && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentBadgeText}>{urgentCount} urgent</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'tasks' && styles.tabBtnActive]}
          onPress={() => setTab('tasks')}
        >
          <Text style={[styles.tabText, tab === 'tasks' && styles.tabTextActive]}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'schedule' && styles.tabBtnActive]}
          onPress={() => setTab('schedule')}
        >
          <Text style={[styles.tabText, tab === 'schedule' && styles.tabTextActive]}>Schedule</Text>
        </TouchableOpacity>
      </View>

      {tab === 'tasks' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <TaskGroup urgency="high"   tasks={grouped.high}   />
          <TaskGroup urgency="medium" tasks={grouped.medium} />
          <TaskGroup urgency="low"    tasks={grouped.low}    />
          <View style={{ height: 100 }} />
        </ScrollView>
      ) : (
        <View style={styles.scheduleContainer}>
          {/* Date Picker */}
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datePicker}
          >
            {dates.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.dateChip, selectedDate === d && styles.dateChipActive]}
                onPress={() => setSelectedDate(d)}
              >
                <Text style={[styles.dateChipText, selectedDate === d && styles.dateChipTextActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {appointments.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="calendar-outline" size={44} color={COLORS.beigeDark} />
                <Text style={styles.emptyText}>No appointments</Text>
              </View>
            ) : appointments.map((apt, i) => (
              <View key={i} style={styles.aptCard}>
                <View style={styles.aptTime}>
                  <Text style={styles.aptTimeText}>{apt.time}</Text>
                </View>
                <View style={styles.aptBody}>
                  <Text style={styles.aptCustomer}>{apt.customerName}</Text>
                  <Text style={styles.aptType}>{apt.type}</Text>
                  <Text style={styles.aptLocation}>{apt.location}</Text>
                </View>
              </View>
            ))}
            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      )}

      {/* Message Modal */}
      <Modal
        visible={!!templateModal}
        transparent animationType="slide"
        onRequestClose={() => setTemplateModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Text style={styles.modalName}>
                  {templateModal?.customer?.name?.split(' ')[0]}
                </Text>
                <Text style={styles.modalAlert} numberOfLines={2}>
                  {templateModal?.alert?.message}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setTemplateModal(null)}>
                <Ionicons name="close" size={22} color={COLORS.black} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.messageInput}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.profileLink}
                onPress={() => {
                  setTemplateModal(null);
                  navigation.navigate('CustomerDetail', { customer: templateModal.customer });
                }}
              >
                <Text style={styles.profileLinkText}>View Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <Ionicons name="send" size={15} color={COLORS.white} />
                <Text style={styles.sendBtnText}>Open in Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: SIZES.padding, paddingTop: 60, paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '500', color: COLORS.black },
  urgentBadge: {
    backgroundColor: COLORS.gold, paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 12,
  },
  urgentBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.white },

  tabs: {
    flexDirection: 'row', marginHorizontal: SIZES.padding,
    marginBottom: 16, backgroundColor: COLORS.white,
    borderRadius: 12, padding: 4, ...SHADOWS.light,
  },
  tabBtn: {
    flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10,
  },
  tabBtnActive: { backgroundColor: COLORS.black },
  tabText: { fontSize: 14, fontWeight: '500', color: COLORS.gray },
  tabTextActive: { color: COLORS.white },

  scroll: { paddingTop: 4 },

  group: { marginBottom: 8 },
  groupHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SIZES.padding, marginBottom: 8, gap: 8,
  },
  groupDot: { width: 7, height: 7, borderRadius: 4 },
  groupLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, flex: 1 },
  groupCount: { fontSize: 11, fontWeight: '700' },

  taskCard: {
    marginHorizontal: SIZES.padding, marginBottom: 10,
    padding: 14, backgroundColor: COLORS.white,
    borderRadius: SIZES.radius, borderLeftWidth: 3, ...SHADOWS.light,
  },
  taskTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  taskAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center',
  },
  taskAvatarText: { fontSize: 13, fontWeight: '600', color: COLORS.white },
  taskInfo: { flex: 1 },
  taskName: { fontSize: 14, fontWeight: '500', color: COLORS.black, marginBottom: 3 },
  taskMessage: { fontSize: 12, color: COLORS.gray, lineHeight: 17 },
  scoreRing: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, justifyContent: 'center', alignItems: 'center',
  },
  scoreNum: { fontSize: 14, fontWeight: '700' },
  tapHint: { fontSize: 11, fontWeight: '600', textAlign: 'right', marginTop: 10 },

  // Schedule
  scheduleContainer: { flex: 1 },
  datePicker: { paddingHorizontal: SIZES.padding, paddingBottom: 12, gap: 8 },
  dateChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: COLORS.white, borderRadius: 20, ...SHADOWS.light,
  },
  dateChipActive: { backgroundColor: COLORS.black },
  dateChipText: { fontSize: 13, fontWeight: '500', color: COLORS.black },
  dateChipTextActive: { color: COLORS.white },

  aptCard: {
    flexDirection: 'row',
    marginHorizontal: SIZES.padding, marginBottom: 10,
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, ...SHADOWS.light,
    overflow: 'hidden',
  },
  aptTime: {
    width: 80, backgroundColor: COLORS.gold,
    justifyContent: 'center', alignItems: 'center', padding: 12,
  },
  aptTimeText: { fontSize: 13, fontWeight: '600', color: COLORS.white, textAlign: 'center' },
  aptBody: { flex: 1, padding: 14 },
  aptCustomer: { fontSize: 14, fontWeight: '500', color: COLORS.black },
  aptType: { fontSize: 12, color: COLORS.gray, marginTop: 3 },
  aptLocation: { fontSize: 11, color: COLORS.gold, marginTop: 3 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 14, color: COLORS.gray },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: SIZES.padding, paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16,
  },
  modalName: { fontSize: 17, fontWeight: '600', color: COLORS.black, marginBottom: 4 },
  modalAlert: { fontSize: 12, color: COLORS.gray, lineHeight: 17 },
  messageInput: {
    borderWidth: 1, borderColor: COLORS.beigeDark, borderRadius: 12,
    padding: 14, fontSize: 14, color: COLORS.black, lineHeight: 22,
    minHeight: 110, marginBottom: 14, backgroundColor: COLORS.cream,
  },
  modalActions: { flexDirection: 'row', gap: 10 },
  profileLink: {
    flex: 1, height: 48, justifyContent: 'center', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.beigeDark,
  },
  profileLinkText: { fontSize: 13, color: COLORS.black },
  sendBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.black, height: 48, borderRadius: 12, gap: 8,
  },
  sendBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.white },
});

export default ActivityScreen;
