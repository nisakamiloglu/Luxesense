import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, Alert, Linking, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { products } from '../constants/mockData';

const ENG_COLOR = { High: COLORS.gold, Mid: '#8B7355', Low: '#C0C0C0' };
const PF_COLOR  = { Heavy: COLORS.gold, Regular: '#8B7355', Rare: '#C0C0C0' };

const ScoreRing = ({ score }) => {
  const s = score ?? 0;
  const color = s >= 8 ? COLORS.gold : s >= 5 ? '#8B7355' : '#C0C0C0';
  return (
    <View style={[styles.scoreRing, { borderColor: color }]}>
      <Text style={[styles.scoreNum, { color }]}>{s.toFixed(1)}</Text>
      <Text style={[styles.scoreMax, { color }]}>/10</Text>
    </View>
  );
};

const getRecentActivity = (customer) => {
  const items = [];
  if (customer.lastSeen) items.push({ icon: 'phone-portrait-outline', text: `App open · ${customer.lastSeen}`, color: COLORS.gold });
  if (customer.dailyMinutes > 0) items.push({ icon: 'time-outline', text: `${customer.dailyMinutes} min in-app today`, color: COLORS.gold });
  if (customer.lastPurchase) items.push({ icon: 'bag-check-outline', text: `Purchased: ${customer.lastPurchase}`, color: '#8B7355' });
  (customer.alerts || []).forEach(a => {
    const icons = { hot_view: 'eye-outline', cart_abandon: 'cart-outline', birthday: 'gift-outline', inactive: 'moon-outline', new_client: 'person-add-outline', profile_upgrade: 'trending-up-outline', wishlist: 'heart-outline' };
    items.push({ icon: icons[a.type] || 'pulse-outline', text: a.message, color: '#8B7355' });
  });
  return items.slice(0, 5);
};

const CustomerDetailScreen = ({ route, navigation }) => {
  const { customer } = route.params;

  const [showGiftModal, setShowGiftModal]         = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [noteInput, setNoteInput]                 = useState('');
  const [actionNotes, setActionNotes]             = useState([
    { id: 1, text: 'Called to inform about new Hermès arrivals. Very interested, follow up next week.', date: 'Mar 1, 2024' },
    { id: 2, text: 'Sent birthday gift recommendation via chat. Awaiting response.', date: 'Feb 28, 2024' },
  ]);

  const recentActivity = getRecentActivity(customer);

  const addNote = () => {
    if (!noteInput.trim()) return;
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setActionNotes(prev => [{ id: Date.now(), text: noteInput.trim(), date }, ...prev]);
    setNoteInput('');
  };

  const giftOptions = [
    { id: 1, name: 'Luxury Gift Box',   icon: 'gift',    description: 'Curated selection of premium items' },
    { id: 2, name: 'Thank You Card',    icon: 'mail',    description: 'Personalized handwritten card'       },
    { id: 3, name: 'Birthday Surprise', icon: 'balloon', description: 'Special birthday package'           },
    { id: 4, name: 'VIP Experience',    icon: 'diamond', description: 'Exclusive shopping experience'      },
  ];

  const scheduleOptions = [
    { id: 1, name: 'Private Shopping',     icon: 'bag-handle', duration: '2 hours'   },
    { id: 2, name: 'Style Consultation',   icon: 'sparkles',   duration: '1 hour'    },
    { id: 3, name: 'Jewelry Viewing',      icon: 'diamond',    duration: '1.5 hours' },
    { id: 4, name: 'Watch Consultation',   icon: 'watch',      duration: '1 hour'    },
  ];

  const customerWishlist = products.slice(0, 4);

  const engColor = ENG_COLOR[customer.engagementLevel] || '#C0C0C0';
  const pfColor  = PF_COLOR[customer.purchaseFrequency] || '#C0C0C0';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Client Profile</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileTop}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{customer.avatar}</Text>
                </View>
                <View style={[styles.engDot, { backgroundColor: engColor }]} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.customerEmail}>{customer.email}</Text>
                {customer.birthday && (
                  <View style={styles.birthdayPill}>
                    <Ionicons name="gift-outline" size={12} color={COLORS.gold} />
                    <Text style={styles.birthdayText}>{customer.birthday}</Text>
                  </View>
                )}
              </View>
              <ScoreRing score={customer.cviScore} />
            </View>

            {/* Contact buttons */}
            <View style={styles.contactRow}>
              <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL(`tel:${customer.phone}`)}>
                <Ionicons name="call" size={18} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL(`mailto:${customer.email}`)}>
                <Ionicons name="mail" size={18} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactBtn} onPress={() => navigation.navigate('AdvisorChat', {
                customer: { name: customer.name, avatar: customer.avatar },
                conversationId: customer.id,
              })}>
                <Ionicons name="chatbubble" size={18} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.contactBtn, styles.contactBtnLight]} onPress={() => setShowScheduleModal(true)}>
                <Ionicons name="calendar" size={18} color={COLORS.gold} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.contactBtn, styles.contactBtnLight]} onPress={() => setShowGiftModal(true)}>
                <Ionicons name="gift" size={18} color={COLORS.gold} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Behavioral Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Behavioral Overview</Text>
            <View style={styles.behavioralCard}>
              <View style={styles.behavRow}>
                <View style={styles.behavItem}>
                  <Text style={styles.behavLabel}>Engagement</Text>
                  <View style={[styles.behavBadge, { backgroundColor: engColor + '18' }]}>
                    <View style={[styles.behavDot, { backgroundColor: engColor }]} />
                    <Text style={[styles.behavValue, { color: engColor }]}>{customer.engagementLevel || '—'}</Text>
                  </View>
                  {customer.dailyMinutes > 0 && (
                    <Text style={styles.behavSub}>{customer.dailyMinutes} min today</Text>
                  )}
                </View>
                <View style={styles.behavDivider} />
                <View style={styles.behavItem}>
                  <Text style={styles.behavLabel}>Purchases</Text>
                  <View style={[styles.behavBadge, { backgroundColor: pfColor + '18' }]}>
                    <Text style={[styles.behavValue, { color: pfColor }]}>{customer.purchaseFrequency || '—'}</Text>
                  </View>
                  {customer.monthlyPurchases != null && (
                    <Text style={styles.behavSub}>{customer.monthlyPurchases}x this month</Text>
                  )}
                </View>
                <View style={styles.behavDivider} />
                <View style={styles.behavItem}>
                  <Text style={styles.behavLabel}>Total Spent</Text>
                  <Text style={styles.behavBig}>${(customer.totalSpent / 1000).toFixed(0)}k</Text>
                  <Text style={styles.behavSub}>all time</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityCard}>
                {recentActivity.map((item, i) => (
                  <View key={i} style={[styles.activityRow, i < recentActivity.length - 1 && styles.activityRowBorder]}>
                    <View style={[styles.activityIconWrap, { backgroundColor: item.color + '18' }]}>
                      <Ionicons name={item.icon} size={14} color={item.color} />
                    </View>
                    <Text style={styles.activityText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.prefRow}>
              {customer.preferences.map((p, i) => (
                <View key={i} style={styles.prefTag}>
                  <Text style={styles.prefText}>{p}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Personal Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Notes</Text>
            <View style={styles.notesCard}>
              {(customer.notes || []).map((note, i) => (
                <View key={i} style={styles.noteItem}>
                  <Text style={styles.noteBullet}>·</Text>
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setShowWishlistModal(true)}>
                <Ionicons name="heart-outline" size={20} color={COLORS.gold} />
                <Text style={styles.actionBtnText}>Wishlist</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ProductDetails', { product: products[0], recommendFor: customer.name })}>
                <Ionicons name="sparkles-outline" size={20} color={COLORS.gold} />
                <Text style={styles.actionBtnText}>Recommend</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setShowScheduleModal(true)}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.gold} />
                <Text style={styles.actionBtnText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Action Notes</Text>

            {/* Add note input */}
            <View style={styles.noteInputWrap}>
              <TextInput
                style={styles.noteInput}
                placeholder="Add a note about your last interaction..."
                placeholderTextColor={COLORS.gray}
                value={noteInput}
                onChangeText={setNoteInput}
                multiline
              />
              <TouchableOpacity
                style={[styles.noteAddBtn, !noteInput.trim() && styles.noteAddBtnDisabled]}
                onPress={addNote}
                disabled={!noteInput.trim()}
              >
                <Ionicons name="add" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {/* Notes list */}
            {actionNotes.map(note => (
              <View key={note.id} style={styles.actionNoteCard}>
                <View style={styles.actionNoteHeader}>
                  <View style={styles.actionNoteDot} />
                  <Text style={styles.actionNoteDate}>{note.date}</Text>
                </View>
                <Text style={styles.actionNoteText}>{note.text}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Gift Modal */}
        <Modal visible={showGiftModal} animationType="slide" transparent onRequestClose={() => setShowGiftModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Send Gift</Text>
                <TouchableOpacity onPress={() => setShowGiftModal(false)}>
                  <Ionicons name="close" size={22} color={COLORS.black} />
                </TouchableOpacity>
              </View>
              {giftOptions.map(g => (
                <TouchableOpacity key={g.id} style={styles.modalOption} onPress={() => {
                  setShowGiftModal(false);
                  Alert.alert('Gift Scheduled', `"${g.name}" will be prepared for ${customer.name}.`);
                }}>
                  <View style={styles.modalOptionIcon}>
                    <Ionicons name={g.icon} size={18} color={COLORS.gold} />
                  </View>
                  <View style={styles.modalOptionInfo}>
                    <Text style={styles.modalOptionTitle}>{g.name}</Text>
                    <Text style={styles.modalOptionDesc}>{g.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Schedule Modal */}
        <Modal visible={showScheduleModal} animationType="slide" transparent onRequestClose={() => setShowScheduleModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Schedule Appointment</Text>
                <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                  <Ionicons name="close" size={22} color={COLORS.black} />
                </TouchableOpacity>
              </View>
              {scheduleOptions.map(o => (
                <TouchableOpacity key={o.id} style={styles.modalOption} onPress={() => {
                  setShowScheduleModal(false);
                  Alert.alert('Appointment Requested', `${o.name} (${o.duration}) for ${customer.name}.`);
                }}>
                  <View style={styles.modalOptionIcon}>
                    <Ionicons name={o.icon} size={18} color={COLORS.gold} />
                  </View>
                  <View style={styles.modalOptionInfo}>
                    <Text style={styles.modalOptionTitle}>{o.name}</Text>
                    <Text style={styles.modalOptionDesc}>{o.duration}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Wishlist Modal */}
        <Modal visible={showWishlistModal} animationType="slide" transparent onRequestClose={() => setShowWishlistModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Wishlist</Text>
                <TouchableOpacity onPress={() => setShowWishlistModal(false)}>
                  <Ionicons name="close" size={22} color={COLORS.black} />
                </TouchableOpacity>
              </View>
              {customerWishlist.map(item => (
                <TouchableOpacity key={item.id} style={styles.modalOption} onPress={() => {
                  setShowWishlistModal(false);
                  navigation.navigate('ProductDetails', { product: item });
                }}>
                  <View style={styles.modalOptionIcon}>
                    <Ionicons name="bag-handle" size={18} color={COLORS.gold} />
                  </View>
                  <View style={styles.modalOptionInfo}>
                    <Text style={styles.modalOptionTitle}>{item.name}</Text>
                    <Text style={styles.modalOptionDesc}>{item.brand} · ${item.price.toLocaleString()}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.padding, paddingTop: 60, paddingBottom: 16,
  },
  headerTitle: { fontSize: 17, fontWeight: '500', color: COLORS.black },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center',
    ...SHADOWS.light,
  },

  // Profile card
  profileCard: {
    marginHorizontal: SIZES.padding, marginBottom: 20,
    backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    padding: 16, ...SHADOWS.light,
  },
  profileTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarWrap: { position: 'relative', marginRight: 14 },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '600', color: COLORS.white },
  engDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: COLORS.white,
  },
  profileInfo: { flex: 1 },
  customerName: { fontSize: 17, fontWeight: '600', color: COLORS.black },
  customerEmail: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  birthdayPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 6, alignSelf: 'flex-start',
    backgroundColor: '#FDF8EE', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  birthdayText: { fontSize: 11, color: COLORS.gold, fontWeight: '500' },

  scoreRing: {
    width: 54, height: 54, borderRadius: 27,
    borderWidth: 2, justifyContent: 'center', alignItems: 'center',
  },
  scoreNum: { fontSize: 17, fontWeight: '700', lineHeight: 18 },
  scoreMax: { fontSize: 9, fontWeight: '500', lineHeight: 11 },

  contactRow: { flexDirection: 'row', gap: 10 },
  contactBtn: {
    flex: 1, height: 42, borderRadius: 10,
    backgroundColor: COLORS.black, justifyContent: 'center', alignItems: 'center',
  },
  contactBtnLight: { backgroundColor: COLORS.beige },

  // Sections
  section: { marginHorizontal: SIZES.padding, marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.black, marginBottom: 10 },

  // Behavioral
  behavioralCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 16, ...SHADOWS.light,
  },
  behavRow: { flexDirection: 'row', alignItems: 'flex-start' },
  behavItem: { flex: 1, alignItems: 'center', gap: 6 },
  behavDivider: { width: 1, height: 60, backgroundColor: COLORS.beigeDark },
  behavLabel: { fontSize: 10, color: COLORS.gray, letterSpacing: 0.3, textTransform: 'uppercase' },
  behavBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  behavDot: { width: 6, height: 6, borderRadius: 3 },
  behavValue: { fontSize: 12, fontWeight: '700' },
  behavBig: { fontSize: 17, fontWeight: '700', color: COLORS.black },
  behavSub: { fontSize: 10, color: COLORS.gray },

  // Recent Activity
  activityCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, ...SHADOWS.light, overflow: 'hidden',
  },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  activityRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.beigeDark },
  activityIconWrap: {
    width: 30, height: 30, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center',
  },
  activityText: { fontSize: 13, color: COLORS.black, flex: 1, lineHeight: 18 },

  // Preferences
  prefRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  prefTag: {
    paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: COLORS.white, borderRadius: 20,
    borderWidth: 1, borderColor: COLORS.beigeDark, ...SHADOWS.light,
  },
  prefText: { fontSize: 13, color: COLORS.black },

  // Personal notes
  notesCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 14, ...SHADOWS.light,
  },
  noteItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  noteBullet: { fontSize: 18, color: COLORS.gold, marginRight: 8, lineHeight: 20 },
  noteText: { fontSize: 13, color: COLORS.darkGray, flex: 1, lineHeight: 20 },

  // Quick Actions
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, padding: 14, backgroundColor: COLORS.white,
    borderRadius: SIZES.radius, alignItems: 'center', gap: 6, ...SHADOWS.light,
  },
  actionBtnText: { fontSize: 12, fontWeight: '500', color: COLORS.black },

  // Action Notes
  noteInputWrap: {
    flexDirection: 'row', gap: 10, marginBottom: 14, alignItems: 'flex-end',
  },
  noteInput: {
    flex: 1, minHeight: 52, maxHeight: 100,
    backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 13, color: COLORS.black, lineHeight: 19,
    borderWidth: 1, borderColor: COLORS.beigeDark,
    textAlignVertical: 'top',
  },
  noteAddBtn: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center',
  },
  noteAddBtnDisabled: { backgroundColor: COLORS.beigeDark },
  actionNoteCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    padding: 14, marginBottom: 8, ...SHADOWS.light,
  },
  actionNoteHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  actionNoteDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.gold,
  },
  actionNoteDate: { fontSize: 11, color: COLORS.gray },
  actionNoteText: { fontSize: 13, color: COLORS.black, lineHeight: 20 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: SIZES.padding, paddingBottom: 40, maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: COLORS.beigeDark,
  },
  modalTitle: { fontSize: 17, fontWeight: '500', color: COLORS.black },
  modalOption: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.beigeDark,
  },
  modalOptionIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.beige, justifyContent: 'center', alignItems: 'center',
  },
  modalOptionInfo: { flex: 1, marginLeft: 12 },
  modalOptionTitle: { fontSize: 14, fontWeight: '500', color: COLORS.black },
  modalOptionDesc: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
});

export default CustomerDetailScreen;
