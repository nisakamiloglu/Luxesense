import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Linking,
  Alert,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { getSAResponse } from '../services/groqService';
import { products } from '../constants/mockData';

const ChatScreen = ({ route, navigation }) => {
  const { advisor } = route.params;
  const { user, saChatMessages, setSaChatMessages, language } = useApp();
  const { t } = useTranslation();
  const scrollViewRef = useRef();
  const [message, setMessage] = useState('');

  const getWelcomeMessage = () => {
    return t('chat.welcomeMessage', { name: user.name });
  };

  const messages = saChatMessages.length > 0 ? saChatMessages : [{
    id: 1,
    sender: 'advisor',
    text: getWelcomeMessage(),
    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    read: true,
  }];
  const setMessages = setSaChatMessages;

  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    t('chat.helloHowAreYou'),
    t('chat.needHelpGift'),
    t('chat.newArrivals'),
    t('chat.scheduleAppointment'),
    t('chat.checkOrderStatus'),
    t('chat.hermesAvailable'),
  ];

  // Intelligent response generator
  const getAdvisorResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Greetings
    if (lowerMessage.match(/^(hi|hello|hey|merhaba|selam)$/i)) {
      const greetings = [
        `Hello ${user.name}! 😊 How lovely to hear from you. How are you today?`,
        `Hi there! So nice to chat with you. How can I assist you today?`,
        `Hello! Welcome back to LuxeSense. How may I help you?`,
        `Hey! Great to hear from you. What can I do for you today?`,
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Good morning/evening
    if (lowerMessage.match(/(good morning|günaydın)/i)) {
      return `Good morning, ${user.name}! ☀️ I hope you're having a wonderful start to your day. What brings you to LuxeSense today?`;
    }

    if (lowerMessage.match(/(good evening|good night|iyi akşamlar)/i)) {
      return `Good evening! 🌙 How lovely to hear from you. How can I make your evening even better?`;
    }

    // How are you
    if (lowerMessage.match(/(how are you|how r u|nasılsın|naber|how's it going)/i)) {
      const responses = [
        `I'm doing wonderfully, thank you for asking! 😊 More importantly, how are YOU? Is there something special I can help you find today?`,
        `I'm great, thanks! Just finished helping a client find the perfect Birkin. How can I assist you?`,
        `Very well, thank you! Always happy when I get to chat with valued clients like yourself. What's on your mind?`,
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // User says they're good
    if (lowerMessage.match(/^(i'm good|i'm fine|good|fine|iyiyim|iyi)$/i)) {
      return `Wonderful to hear! 😊 Now, what can I help you discover today? We have some stunning new arrivals I think you'd love.`;
    }

    // Gift help
    if (lowerMessage.match(/(gift|hediye|present|anniversary|birthday|doğum günü|yıldönümü)/i)) {
      return `I'd love to help you find the perfect gift! 🎁 Could you tell me a bit more:\n\n• Who is it for? (partner, parent, friend)\n• What's the occasion?\n• Do you have a budget in mind?\n\nThis will help me curate the perfect options for you.`;
    }

    // New arrivals
    if (lowerMessage.match(/(new arrival|yeni|what's new|new collection|new in)/i)) {
      return `We have some exciting new pieces! ✨\n\n• Hermès just released new Birkin colors\n• The new Cartier Clash collection is stunning\n• Chanel's latest RTW pieces arrived yesterday\n\nWould you like me to arrange a private viewing of any of these? I can reserve items for you.`;
    }

    // Appointment/Schedule
    if (lowerMessage.match(/(appointment|randevu|schedule|book|visit|come in|görüşme)/i)) {
      return `I'd be delighted to arrange a private appointment for you! 📅\n\nOur Paris Flagship store offers:\n• Private shopping suites\n• Complimentary champagne\n• Exclusive preview of new arrivals\n\nWhen would be convenient for you? I have availability this week on Tuesday and Thursday afternoons.`;
    }

    // Order question
    if (lowerMessage.match(/(order|sipariş|delivery|shipping|tracking|kargo)/i)) {
      return `I'd be happy to help with your order! 📦\n\nCould you provide your order number? It starts with "LX" followed by 8 digits.\n\nAlternatively, I can look up your recent orders using your account. Would you like me to do that?`;
    }

    // Price/Cost
    if (lowerMessage.match(/(price|fiyat|cost|how much|kaç para)/i)) {
      return `Of course! Which piece are you interested in? I can provide detailed pricing including:\n\n• Current retail price\n• Any available promotions\n• Payment plan options\n• Tax and shipping estimates\n\nJust let me know the item name or send me a photo!`;
    }

    // Availability/Stock
    if (lowerMessage.match(/(available|availability|stock|in stock|var mı|stok)/i)) {
      return `I can check availability for you right away! Which piece are you looking for?\n\nI have access to inventory across all our boutiques worldwide - Paris, London, Dubai, Milan, and New York. If it exists, I'll find it for you! 😊`;
    }

    // Specific brands - with products
    if (lowerMessage.match(/(hermès|hermes|birkin|kelly)/i)) {
      const hermesProducts = products.filter(p => p.brand === 'HERMÈS').slice(0, 3);
      return {
        text: `Ah, Hermès - excellent taste! 🧡 Here are some pieces I recommend for you:`,
        products: hermesProducts,
      };
    }

    if (lowerMessage.match(/(chanel|classic flap)/i)) {
      const chanelProducts = products.filter(p => p.brand === 'CHANEL').slice(0, 3);
      return {
        text: `CHANEL is always a wonderful choice! Here are our current favorites:`,
        products: chanelProducts,
      };
    }

    if (lowerMessage.match(/(cartier|love bracelet|juste un clou)/i)) {
      const cartierProducts = products.filter(p => p.brand === 'CARTIER').slice(0, 3);
      return {
        text: `Cartier jewelry is such a beautiful choice! 💎 Here are our most popular pieces:`,
        products: cartierProducts,
      };
    }

    if (lowerMessage.match(/(rolex|watch|saat)/i)) {
      const rolexProducts = products.filter(p => p.brand === 'ROLEX').slice(0, 3);
      return {
        text: `Luxury timepieces - excellent! ⌚ Here are some stunning options:`,
        products: rolexProducts,
      };
    }

    if (lowerMessage.match(/(dior|lady dior)/i)) {
      const diorProducts = products.filter(p => p.brand === 'DIOR').slice(0, 3);
      return {
        text: `Dior is absolutely stunning! Here are some pieces you'll love:`,
        products: diorProducts,
      };
    }

    if (lowerMessage.match(/(louis vuitton|lv|vuitton)/i)) {
      const lvProducts = products.filter(p => p.brand === 'LOUIS VUITTON').slice(0, 3);
      return {
        text: `Louis Vuitton - a timeless choice! Here are some recommendations:`,
        products: lvProducts,
      };
    }

    if (lowerMessage.match(/(gucci)/i)) {
      const gucciProducts = products.filter(p => p.brand === 'GUCCI').slice(0, 3);
      return {
        text: `Gucci has some amazing pieces! Take a look:`,
        products: gucciProducts,
      };
    }

    if (lowerMessage.match(/(prada)/i)) {
      const pradaProducts = products.filter(p => p.brand === 'PRADA').slice(0, 3);
      return {
        text: `Prada is always elegant! Here are my recommendations:`,
        products: pradaProducts,
      };
    }

    if (lowerMessage.match(/(bag|çanta|bags)/i)) {
      const bagProducts = products.filter(p => p.category === 'bags').slice(0, 4);
      return {
        text: `We have an amazing bag collection! Here are some favorites:`,
        products: bagProducts,
      };
    }

    if (lowerMessage.match(/(jewelry|mücevher|takı)/i)) {
      const jewelryProducts = products.filter(p => p.category === 'jewelry').slice(0, 4);
      return {
        text: `Our jewelry collection is stunning! Take a look:`,
        products: jewelryProducts,
      };
    }

    if (lowerMessage.match(/(recommend|öneri|suggestion|suggest)/i)) {
      const recommendedProducts = products.slice(0, 4);
      return {
        text: `Based on your preferences, I think you'll love these:`,
        products: recommendedProducts,
      };
    }

    // Thank you
    if (lowerMessage.match(/(thank|thanks|teşekkür|sağol)/i)) {
      const responses = [
        `You're very welcome, ${user.name}! It's always my pleasure to assist you. Don't hesitate to reach out anytime! 😊`,
        `My pleasure! That's what I'm here for. Please let me know if you need anything else.`,
        `Anytime! I'm always here for you. Have a wonderful day! ✨`,
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Bye
    if (lowerMessage.match(/(bye|goodbye|see you|görüşürüz|hoşçakal)/i)) {
      return `Goodbye, ${user.name}! It was lovely chatting with you. 👋\n\nRemember, I'm just a message away whenever you need anything. Take care and see you soon! ✨`;
    }

    // Compliments
    if (lowerMessage.match(/(you're great|you're amazing|helpful|awesome|harika)/i)) {
      return `That's so kind of you! 🥰 It's truly my pleasure to assist clients like yourself. Your satisfaction means everything to me.\n\nIs there anything else I can help you with today?`;
    }

    // Just browsing
    if (lowerMessage.match(/(just browsing|just looking|bakıyorum)/i)) {
      return `Of course! Feel free to browse. 😊\n\nIf you'd like, I can send you our latest lookbook or let you know when new pieces arrive that match your preferences.\n\nYour style profile shows you love Fine Jewelry and Hermès - shall I notify you of any new arrivals in those categories?`;
    }

    // Yes/Okay responses
    if (lowerMessage.match(/^(yes|yeah|sure|okay|ok|evet|tamam|olur)$/i)) {
      return `Perfect! I'll take care of that for you right away. Is there anything specific you'd like me to prioritize? 😊`;
    }

    // No responses
    if (lowerMessage.match(/^(no|nope|hayır|yok)$/i)) {
      return `No problem at all! I'm here whenever you need me. Is there something else I can help you with today?`;
    }

    // Default intelligent responses
    const defaultResponses = [
      `That's a great question! Let me look into that for you. In the meantime, is there anything specific about our collection I can help you with?`,
      `I'd be happy to help with that. Could you give me a few more details so I can assist you better?`,
      `Thank you for reaching out! Let me check on that for you. Is this related to a specific product or order?`,
      `Of course! I want to make sure I give you the best assistance. Could you tell me a bit more about what you're looking for?`,
      `I appreciate you messaging me! To better assist you, could you provide a few more details?`,
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: message.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      read: false,
    };

    setMessages([...messages, newMessage]);
    const userText = message.trim();
    setMessage('');
    setIsTyping(true);

    try {
      // First check if local response has products
      const localResponse = getAdvisorResponse(userText);

      if (localResponse && typeof localResponse === 'object' && localResponse.products) {
        // Local response with products
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'advisor',
          text: localResponse.text,
          products: localResponse.products,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          read: true,
        }]);
      } else {
        // Use Groq AI for SA response
        const response = await getSAResponse(userText, user.name, messages, language);
        setIsTyping(false);

        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'advisor',
          text: response,
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          read: true,
        }]);
      }
    } catch (error) {
      // Fallback to local response
      const response = getAdvisorResponse(userText);
      setIsTyping(false);

      const messageData = {
        id: messages.length + 2,
        sender: 'advisor',
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        read: true,
      };

      if (typeof response === 'object' && response.products) {
        messageData.text = response.text;
        messageData.products = response.products;
      } else {
        messageData.text = response;
      }

      setMessages(prev => [...prev, messageData]);
    }
  };

  const handleQuickReply = (reply) => {
    setMessage(reply);
  };

  const handleCall = () => {
    Alert.alert(
      t('profile.callAdvisor'),
      `${t('profile.call')} ${advisor.name}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.call'), onPress: () => Linking.openURL(`tel:${advisor.phone}`) },
      ]
    );
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Scroll to end when keyboard shows
  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
    return () => keyboardDidShow.remove();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.advisorHeader}>
          <View style={styles.advisorAvatar}>
            <Text style={styles.advisorAvatarText}>{advisor.avatar}</Text>
          </View>
          <View style={styles.advisorInfo}>
            <Text style={styles.advisorName}>{advisor.name}</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>{t('chat.online')}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleCall}>
            <Ionicons name="call-outline" size={22} color={COLORS.gold} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="videocam-outline" size={22} color={COLORS.gold} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Advisor Info Card */}
      <View style={styles.advisorCard}>
        <Ionicons name="shield-checkmark" size={16} color={COLORS.gold} />
        <Text style={styles.advisorCardText}>
          {advisor.role} at {advisor.store}
        </Text>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Divider */}
        <View style={styles.dateDivider}>
          <View style={styles.dateLine} />
          <Text style={styles.dateText}>Today</Text>
          <View style={styles.dateLine} />
        </View>

        {messages.map((msg) => (
          <View key={msg.id}>
            <View
              style={[
                styles.messageWrapper,
                msg.sender === 'user' ? styles.userMessageWrapper : styles.advisorMessageWrapper,
              ]}
            >
              {msg.sender === 'advisor' && (
                <View style={styles.messageAvatar}>
                  <Text style={styles.messageAvatarText}>{advisor.avatar}</Text>
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.advisorBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'user' ? styles.userMessageText : styles.advisorMessageText,
                  ]}
                >
                  {msg.text}
                </Text>
                <View style={styles.messageFooter}>
                  <Text
                    style={[
                      styles.messageTime,
                      msg.sender === 'user' ? styles.userMessageTime : styles.advisorMessageTime,
                    ]}
                  >
                    {msg.time}
                  </Text>
                  {msg.sender === 'user' && (
                    <Ionicons
                      name={msg.read ? 'checkmark-done' : 'checkmark'}
                      size={14}
                      color={msg.read ? COLORS.gold : COLORS.white}
                      style={styles.readIcon}
                    />
                  )}
                </View>
              </View>
            </View>
            {/* Product Cards */}
            {msg.products && msg.products.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.productCardsContainer}
              >
                {msg.products.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.chatProductCard}
                    onPress={() => navigation.navigate('ProductDetails', { product })}
                  >
                    <Image
                      source={typeof product.image === 'string' ? { uri: product.image } : product.image}
                      style={styles.chatProductImage}
                      resizeMode="cover"
                    />
                    <View style={styles.chatProductInfo}>
                      <Text style={styles.chatProductBrand}>{product.brand}</Text>
                      <Text style={styles.chatProductName} numberOfLines={1}>{product.name}</Text>
                      <Text style={styles.chatProductPrice}>${product.price.toLocaleString()}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingWrapper}>
            <View style={styles.messageAvatar}>
              <Text style={styles.messageAvatarText}>{advisor.avatar}</Text>
            </View>
            <View style={styles.typingBubble}>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, styles.typingDot1]} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
            </View>
          </View>
        )}

        {/* Quick Replies */}
        <View style={styles.quickRepliesSection}>
          <Text style={styles.quickRepliesTitle}>{t('chat.quickReplies')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.quickRepliesRow}>
              {quickReplies.map((reply, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickReplyBtn}
                  onPress={() => handleQuickReply(reply)}
                >
                  <Text style={styles.quickReplyText}>{reply}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachBtn}>
          <Ionicons name="add-circle-outline" size={26} color={COLORS.gold} />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={t('chat.typeMessage')}
            placeholderTextColor={COLORS.gray}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.emojiBtn}>
            <Ionicons name="happy-outline" size={22} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.sendBtn, message.trim() && styles.sendBtnActive]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={message.trim() ? COLORS.white : COLORS.gray}
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
    paddingTop: 54,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.beigeDark,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  advisorHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  advisorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  advisorAvatarText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  advisorInfo: {
    marginLeft: 12,
  },
  advisorName: {
    fontSize: 16,
    fontWeight: '600',
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
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    color: COLORS.success,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  advisorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: COLORS.beige,
    gap: 8,
  },
  advisorCardText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SIZES.padding,
    paddingBottom: 100,
  },
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.beigeDark,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.gray,
    marginHorizontal: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '85%',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  advisorMessageWrapper: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageAvatarText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
  },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    maxWidth: '100%',
  },
  userBubble: {
    backgroundColor: COLORS.black,
    borderBottomRightRadius: 4,
  },
  advisorBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    ...SHADOWS.light,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: COLORS.white,
  },
  advisorMessageText: {
    color: COLORS.black,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  messageTime: {
    fontSize: 11,
  },
  userMessageTime: {
    color: 'rgba(255,255,255,0.6)',
  },
  advisorMessageTime: {
    color: COLORS.gray,
  },
  readIcon: {
    marginLeft: 4,
  },
  typingWrapper: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  typingBubble: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...SHADOWS.light,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    opacity: 0.6,
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
  quickRepliesSection: {
    marginTop: 20,
  },
  quickRepliesTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray,
    marginBottom: 10,
  },
  quickRepliesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickReplyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.goldLight,
  },
  quickReplyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
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
    gap: 10,
  },
  attachBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.beige,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.black,
    paddingTop: 0,
    paddingBottom: 0,
    maxHeight: 100,
  },
  emojiBtn: {
    paddingLeft: 8,
    paddingBottom: 2,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: COLORS.gold,
  },
  // Product Cards in Chat
  productCardsContainer: {
    marginLeft: 40,
    marginTop: 8,
    marginBottom: 12,
  },
  chatProductCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  chatProductImage: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.beige,
  },
  chatProductInfo: {
    padding: 10,
  },
  chatProductBrand: {
    fontSize: 10,
    color: COLORS.gray,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  chatProductName: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.black,
    marginTop: 2,
  },
  chatProductPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gold,
    marginTop: 4,
  },
});

export default ChatScreen;
