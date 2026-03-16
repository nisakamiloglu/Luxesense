import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

// Mock chat conversations data
const conversations = [
  {
    id: 1,
    customer: {
      name: 'Alexandra Chen',
      avatar: 'AC',
      tier: 'Platinum',
    },
    lastMessage: 'That would be perfect, thank you!',
    lastMessageTime: '2:35 PM',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 2,
    customer: {
      name: 'Sophia Laurent',
      avatar: 'SL',
      tier: 'Platinum',
    },
    lastMessage: 'Yes, tomorrow at 3pm works for me',
    lastMessageTime: 'Yesterday',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 3,
    customer: {
      name: 'Victoria Sterling',
      avatar: 'VS',
      tier: 'Gold',
    },
    lastMessage: "We expect them next week. I'll notify you!",
    lastMessageTime: '11:05 AM',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 4,
    customer: {
      name: 'Emma Rothschild',
      avatar: 'ER',
      tier: 'Gold',
    },
    lastMessage: 'Yes! We have the Blue Oblique.',
    lastMessageTime: '3 days ago',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 5,
    customer: {
      name: 'James Morrison',
      avatar: 'JM',
      tier: 'Silver',
    },
    lastMessage: 'Let me know if you need anything else.',
    lastMessageTime: '1 week ago',
    unreadCount: 0,
    isOnline: false,
  },
];

const AdvisorChatListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'unread' && conv.unreadCount > 0);
    return matchesSearch && matchesFilter;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => navigation.navigate('AdvisorChat', { customer: item.customer, conversationId: item.id })}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.customer.avatar}</Text>
        </View>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.customerName}>{item.customer.name}</Text>
          <Text style={styles.messageTime}>{item.lastMessageTime}</Text>
        </View>
        <View style={styles.conversationFooter}>
          <Text
            style={[styles.lastMessage, item.unreadCount > 0 && styles.lastMessageUnread]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={[
          styles.tierBadge,
          item.customer.tier === 'Platinum' && styles.tierPlatinum,
          item.customer.tier === 'Gold' && styles.tierGold,
        ]}>
          <Text style={[
            styles.tierText,
            item.customer.tier === 'Platinum' && styles.tierTextPlatinum,
            item.customer.tier === 'Gold' && styles.tierTextGold,
          ]}>{item.customer.tier}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        {totalUnread > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{totalUnread} new</Text>
          </View>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'unread' && styles.filterBtnActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
            Unread ({totalUnread})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No conversations found</Text>
          </View>
        }
      />
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
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: COLORS.black,
  },
  headerBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  searchContainer: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    height: 48,
    ...SHADOWS.light,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.black,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
    gap: 12,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    ...SHADOWS.light,
  },
  filterBtnActive: {
    backgroundColor: COLORS.black,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 14,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  messageTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  conversationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: COLORS.gray,
  },
  lastMessageUnread: {
    color: COLORS.black,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: COLORS.beige,
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
  tierTextPlatinum: {
    color: '#424242',
  },
  tierTextGold: {
    color: '#F57C00',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.gray,
    marginTop: 12,
  },
});

export default AdvisorChatListScreen;
