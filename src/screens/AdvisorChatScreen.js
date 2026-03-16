import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

// Mock messages data
const mockMessages = {
  1: [
    { id: 1, text: 'Hi! Is the Birkin 25 in Gold available?', sender: 'customer', time: '2:30 PM' },
    { id: 2, text: 'Yes, we have it in stock! Would you like me to reserve it for you?', sender: 'advisor', time: '2:32 PM' },
    { id: 3, text: 'That would be perfect, thank you!', sender: 'customer', time: '2:35 PM' },
  ],
  2: [
    { id: 1, text: 'I need something special for the Met Gala', sender: 'customer', time: '10:00 AM' },
    { id: 2, text: 'I have the perfect Cartier pieces in mind! Can we schedule a viewing?', sender: 'advisor', time: '10:05 AM' },
    { id: 3, text: 'Yes, tomorrow at 3pm works for me', sender: 'customer', time: '10:10 AM' },
    { id: 4, text: "Perfect! I'll prepare a selection for you", sender: 'advisor', time: '10:12 AM' },
  ],
  3: [
    { id: 1, text: 'When will the new Rolex collection arrive?', sender: 'customer', time: '11:00 AM' },
    { id: 2, text: "We expect them next week. I'll notify you immediately!", sender: 'advisor', time: '11:05 AM' },
  ],
  4: [
    { id: 1, text: 'Do you have the Dior Book Tote in blue?', sender: 'customer', time: '2:00 PM' },
    { id: 2, text: 'Yes! We have the Blue Oblique. Would you like to see it?', sender: 'advisor', time: '2:05 PM' },
  ],
  5: [
    { id: 1, text: 'Thanks for helping me find the Submariner!', sender: 'customer', time: '3:00 PM' },
    { id: 2, text: 'My pleasure! Let me know if you need anything else.', sender: 'advisor', time: '3:05 PM' },
  ],
};

const quickReplies = [
  "I'll check availability for you",
  "Would you like to schedule a viewing?",
  "I can reserve that for you",
  "Let me send you more details",
];

const AdvisorChatScreen = ({ navigation, route }) => {
  const { customer, conversationId } = route.params;
  const [messages, setMessages] = useState(mockMessages[conversationId] || []);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom on load
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: text.trim(),
      sender: 'advisor',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item, index }) => {
    const isAdvisor = item.sender === 'advisor';
    const showAvatar = index === 0 || messages[index - 1]?.sender !== item.sender;

    return (
      <View style={[styles.messageRow, isAdvisor && styles.messageRowAdvisor]}>
        {!isAdvisor && showAvatar && (
          <View style={styles.messageAvatar}>
            <Text style={styles.messageAvatarText}>{customer.avatar}</Text>
          </View>
        )}
        {!isAdvisor && !showAvatar && <View style={styles.avatarPlaceholder} />}

        <View style={styles.messageContent}>
          <View style={[
            styles.messageBubble,
            isAdvisor ? styles.messageBubbleAdvisor : styles.messageBubbleCustomer
          ]}>
            <Text style={[styles.messageText, isAdvisor && styles.messageTextAdvisor]}>
              {item.text}
            </Text>
          </View>
          <Text style={[styles.messageTime, isAdvisor && styles.messageTimeAdvisor]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{customer.avatar}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{customer.name}</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="call-outline" size={22} color={COLORS.gold} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-vertical" size={22} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Quick Replies */}
      <View style={styles.quickRepliesContainer}>
        <FlatList
          horizontal
          data={quickReplies}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.quickReplyBtn}
              onPress={() => sendMessage(item)}
            >
              <Text style={styles.quickReplyText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRepliesList}
        />
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachBtn}>
          <Ionicons name="add-circle-outline" size={28} color={COLORS.gold} />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.gray}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[styles.sendBtn, inputText.trim() && styles.sendBtnActive]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() ? COLORS.white : COLORS.gray}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.beigeDark,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.black,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: SIZES.padding,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  messageRowAdvisor: {
    flexDirection: 'row-reverse',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageAvatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  avatarPlaceholder: {
    width: 32,
    marginRight: 8,
  },
  messageContent: {
    maxWidth: '75%',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  messageBubbleCustomer: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    ...SHADOWS.light,
  },
  messageBubbleAdvisor: {
    backgroundColor: COLORS.gold,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 20,
  },
  messageTextAdvisor: {
    color: COLORS.white,
  },
  messageTime: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 4,
  },
  messageTimeAdvisor: {
    textAlign: 'right',
  },
  quickRepliesContainer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
    paddingVertical: 8,
  },
  quickRepliesList: {
    paddingHorizontal: SIZES.padding,
    gap: 8,
  },
  quickReplyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: COLORS.beige,
    borderRadius: 16,
    marginRight: 8,
  },
  quickReplyText: {
    fontSize: 13,
    color: COLORS.black,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    paddingBottom: 34,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
  },
  attachBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: COLORS.beige,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    maxHeight: 100,
  },
  input: {
    fontSize: 15,
    color: COLORS.black,
    maxHeight: 80,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.beigeDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: COLORS.gold,
  },
});

export default AdvisorChatScreen;
