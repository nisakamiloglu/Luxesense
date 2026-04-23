import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const URGENCY_LABEL = { high: 'HIGH PRIORITY', medium: 'FOLLOW UP', low: 'INFO' };
const URGENCY_COLOR = { high: COLORS.gold, medium: '#8B7355', low: '#A0A0A0' };

const TasksScreen = ({ navigation }) => {
  const { assignedCustomers } = useApp();
  const [templateModal, setTemplateModal] = useState(null);
  const [messageText, setMessageText] = useState('');

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

  const TaskCard = ({ task }) => {
    const color = URGENCY_COLOR[task.urgency];
    const isActionable = task.urgency !== 'low';
    return (
      <TouchableOpacity
        style={[styles.taskCard, { borderLeftColor: color }]}
        onPress={() => isActionable
          ? openModal(task)
          : navigation.navigate('CustomerDetail', { customer: task.customer })
        }
        activeOpacity={0.75}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskAvatar}>
            <Text style={styles.taskAvatarText}>{task.customer.avatar}</Text>
          </View>
          <View style={styles.taskInfo}>
            <Text style={styles.taskCustomer}>{task.customer.name}</Text>
            <Text style={styles.taskLastSeen}>{task.customer.lastSeen}</Text>
          </View>
          <View style={[styles.cviChip, { backgroundColor: color + '18', borderColor: color }]}>
            <Text style={[styles.cviChipText, { color }]}>
              CVI {(task.customer.cviScore || 0).toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={styles.taskMessage}>
          <Ionicons name="information-circle-outline" size={14} color={color} />
          <Text style={styles.taskMessageText}>{task.message}</Text>
        </View>

        {isActionable && (
          <View style={styles.tapHint}>
            <Ionicons name="chatbubble-outline" size={13} color={color} />
            <Text style={[styles.tapHintText, { color }]}>Tap to reply</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const Section = ({ urgency, tasks }) => {
    if (tasks.length === 0) return null;
    const color = URGENCY_COLOR[urgency];
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: color }]} />
          <Text style={[styles.sectionTitle, { color }]}>{URGENCY_LABEL[urgency]}</Text>
          <View style={[styles.sectionCount, { backgroundColor: color + '18' }]}>
            <Text style={[styles.sectionCountText, { color }]}>{tasks.length}</Text>
          </View>
        </View>
        {tasks.map((task, idx) => <TaskCard key={idx} task={task} />)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Today's Tasks</Text>
          <Text style={styles.headerSub}>
            {grouped.high.length} urgent · {grouped.medium.length} follow up
          </Text>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>{allTasks.length}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Section urgency="high" tasks={grouped.high} />
        <Section urgency="medium" tasks={grouped.medium} />
        <Section urgency="low" tasks={grouped.low} />
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Message modal */}
      <Modal
        visible={!!templateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setTemplateModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {templateModal?.customer?.name?.split(' ')[0]}
                </Text>
                <Text style={styles.modalSub}>{templateModal?.alert?.message}</Text>
              </View>
              <TouchableOpacity onPress={() => setTemplateModal(null)}>
                <Ionicons name="close" size={24} color={COLORS.black} />
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
                <Ionicons name="send" size={16} color={COLORS.white} />
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.padding, paddingTop: 60, paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.beigeDark,
  },
  headerTitle: { fontSize: 26, fontWeight: '500', color: COLORS.black },
  headerSub: { fontSize: 13, color: COLORS.gray, marginTop: 4 },
  totalBadge: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center',
  },
  totalBadgeText: { fontSize: 16, fontWeight: '700', color: COLORS.white },

  scroll: { paddingTop: 16 },

  section: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SIZES.padding, marginBottom: 10, gap: 8,
  },
  sectionDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  sectionCount: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  sectionCountText: { fontSize: 11, fontWeight: '700' },

  taskCard: {
    marginHorizontal: SIZES.padding, marginBottom: 10,
    padding: 16, backgroundColor: COLORS.white,
    borderRadius: SIZES.radius, borderLeftWidth: 3, ...SHADOWS.light,
  },
  taskHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  taskAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  taskAvatarText: { fontSize: 14, fontWeight: '600', color: COLORS.white },
  taskInfo: { flex: 1 },
  taskCustomer: { fontSize: 15, fontWeight: '500', color: COLORS.black },
  taskLastSeen: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  cviChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  cviChipText: { fontSize: 10, fontWeight: '700' },

  taskMessage: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: COLORS.beige, padding: 10, borderRadius: 8, marginBottom: 10,
  },
  taskMessageText: { fontSize: 13, color: COLORS.darkGray, flex: 1, lineHeight: 18 },

  tapHint: {
    flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'flex-end',
  },
  tapHintText: { fontSize: 11, fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: SIZES.padding, paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: COLORS.black, marginBottom: 4 },
  modalSub: { fontSize: 12, color: COLORS.gray, lineHeight: 17, maxWidth: '85%' },
  messageInput: {
    borderWidth: 1, borderColor: COLORS.beigeDark, borderRadius: 12,
    padding: 14, fontSize: 14, color: COLORS.black, lineHeight: 22,
    minHeight: 120, marginBottom: 16, backgroundColor: COLORS.cream,
    textAlignVertical: 'top',
  },
  modalActions: { flexDirection: 'row', gap: 12 },
  profileLink: {
    flex: 1, height: 50, justifyContent: 'center', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.beigeDark,
  },
  profileLinkText: { fontSize: 14, color: COLORS.black },
  sendBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.black, height: 50, borderRadius: 12, gap: 8,
  },
  sendBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.white },
});

export default TasksScreen;
