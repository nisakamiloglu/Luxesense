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
  Animated,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { products } from '../constants/mockData';
import { useApp } from '../context/AppContext';
import { getAIResponse as getGroqResponse } from '../services/groqService';

const AIStylistScreen = ({ navigation }) => {
  const { user, recentlyViewed, aiStylistMessages, setAiStylistMessages, language } = useApp();
  const { t } = useTranslation();

  const getWelcomeMessage = () => {
    return t('aiStylist.welcomeMessage', { name: user?.name || 'there' });
  };

  const messages = aiStylistMessages.length > 0 ? aiStylistMessages : [{
    id: 1,
    type: 'ai',
    text: getWelcomeMessage(),
    timestamp: new Date(),
  }];
  const setMessages = setAiStylistMessages;
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    occasion: null,
    budget: null,
    style: null,
    preferredBrands: [],
    recentTopics: [],
  });
  const scrollViewRef = useRef();

  // Scroll to end when keyboard shows
  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
    return () => keyboardDidShow.remove();
  }, []);

  const quickPrompts = [
    { icon: 'sparkles-outline', text: t('aiStylist.styleQuiz') },
    { icon: 'gift-outline', text: t('aiStylist.findGift') },
    { icon: 'shirt-outline', text: t('aiStylist.buildOutfit') },
    { icon: 'diamond-outline', text: t('aiStylist.investmentPieces') },
  ];

  const styleQuizQuestions = [
    "Let's discover your style! First, what best describes your everyday look?\n\n1️⃣ Classic & Timeless\n2️⃣ Bold & Trendy\n3️⃣ Minimalist & Modern\n4️⃣ Romantic & Feminine\n5️⃣ Edgy & Avant-garde",
    "What's your go-to color palette?\n\n1️⃣ Neutrals (black, white, beige)\n2️⃣ Earth tones (camel, olive, rust)\n3️⃣ Jewel tones (emerald, sapphire, ruby)\n4️⃣ Pastels (blush, lavender, mint)\n5️⃣ Bold colors (red, cobalt, fuchsia)",
    "Which fashion icon inspires you most?\n\n1️⃣ Audrey Hepburn - Timeless elegance\n2️⃣ Coco Chanel - Classic Parisian\n3️⃣ Grace Kelly - Royal sophistication\n4️⃣ Rihanna - Bold & fearless\n5️⃣ Victoria Beckham - Modern minimalist",
  ];

  const getProductsByCategory = (category, limit = 3) => {
    return products.filter(p => p.category === category).slice(0, limit);
  };

  const getProductsByBrand = (brand, limit = 3) => {
    return products.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase())).slice(0, limit);
  };

  const getProductsByPriceRange = (min, max, limit = 4) => {
    return products.filter(p => p.price >= min && p.price <= max).slice(0, limit);
  };

  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    const context = { ...conversationContext };

    // Style Quiz
    if (lowerMessage.includes('style quiz') || lowerMessage.includes('stil testi') || lowerMessage.includes('my style')) {
      context.recentTopics.push('style_quiz');
      setConversationContext(context);
      return {
        text: styleQuizQuestions[0],
        products: null,
        isQuiz: true,
        followUp: "Just reply with the number of your choice!",
      };
    }

    // Quiz answers (1-5)
    if (/^[1-5]$/.test(userMessage.trim()) && context.recentTopics.includes('style_quiz')) {
      const styleResults = {
        '1': { style: 'Classic', brands: ['HERMÈS', 'CHANEL', 'CARTIER'], products: [products[1], products[5], products[24]] },
        '2': { style: 'Bold', brands: ['GUCCI', 'VALENTINO GARAVANI', 'BOTTEGA VENETA'], products: [products[19], products[52], products[22]] },
        '3': { style: 'Minimalist', brands: ['THE ROW', 'BOTTEGA VENETA', 'LORO PIANA'], products: [products[55], products[22], products[59]] },
        '4': { style: 'Romantic', brands: ['DIOR', 'VAN CLEEF & ARPELS', 'VALENTINO GARAVANI'], products: [products[13], products[29], products[53]] },
        '5': { style: 'Avant-garde', brands: ['PRADA', 'BOTTEGA VENETA', 'AUDEMARS PIGUET'], products: [products[18], products[23], products[40]] },
      };
      const result = styleResults[userMessage.trim()];
      context.style = result.style;
      context.preferredBrands = result.brands;
      setConversationContext(context);

      return {
        text: `Based on your choices, you have a ${result.style} style! 🎨\n\nYou'd love brands like ${result.brands.join(', ')}.\n\nHere are some perfect pieces for you:`,
        products: result.products,
        followUp: "Would you like me to suggest a complete outfit, or shall we explore a specific category?",
      };
    }

    // Gift recommendations with follow-up questions
    if (lowerMessage.includes('gift') || lowerMessage.includes('hediye') || lowerMessage.includes('present')) {
      if (lowerMessage.includes('her') || lowerMessage.includes('wife') || lowerMessage.includes('girlfriend') || lowerMessage.includes('mother') || lowerMessage.includes('kadın')) {
        return {
          text: "Finding the perfect gift for her! 💝 These are universally beloved pieces that any woman would treasure:",
          products: [products[24], products[29], products[34]], // Love Bracelet, Alhambra, Tiffany
          followUp: "What's your budget range? I can refine my suggestions:\n• Under $2,000\n• $2,000 - $5,000\n• $5,000 - $10,000\n• $10,000+",
        };
      }
      if (lowerMessage.includes('him') || lowerMessage.includes('husband') || lowerMessage.includes('boyfriend') || lowerMessage.includes('father') || lowerMessage.includes('erkek')) {
        return {
          text: "Finding the perfect gift for him! 🎁 These are sophisticated pieces any man would appreciate:",
          products: [products[35], products[44], products[64]], // Submariner, Speedmaster, Belt
          followUp: "Is this for a special occasion? Anniversary, birthday, or 'just because'? I can tailor my suggestions!",
        };
      }
      return {
        text: "I'd love to help you find the perfect gift! 🎁 Who are you shopping for?",
        products: null,
        followUp: "• For her (wife, girlfriend, mother, sister)\n• For him (husband, boyfriend, father, brother)\n• For yourself (you deserve it! 💎)",
      };
    }

    // Budget-based recommendations
    if (lowerMessage.includes('under') || lowerMessage.includes('budget') || lowerMessage.includes('altında') || lowerMessage.includes('affordable')) {
      if (lowerMessage.includes('1000') || lowerMessage.includes('1,000') || lowerMessage.includes('1k')) {
        return {
          text: "Great choices under $1,000! These entry-level luxury pieces offer exceptional value:",
          products: getProductsByPriceRange(0, 1000, 4),
          followUp: "Would you like to see accessories, shoes, or jewelry in this range?",
        };
      }
      if (lowerMessage.includes('5000') || lowerMessage.includes('5,000') || lowerMessage.includes('5k')) {
        return {
          text: "Beautiful options under $5,000! This range offers incredible quality and timeless design:",
          products: getProductsByPriceRange(1000, 5000, 4),
          followUp: "These pieces are perfect investment starters. Want me to focus on bags, jewelry, or accessories?",
        };
      }
      if (lowerMessage.includes('10000') || lowerMessage.includes('10,000') || lowerMessage.includes('10k')) {
        return {
          text: "Exquisite pieces under $10,000! At this level, you're investing in true luxury:",
          products: getProductsByPriceRange(5000, 10000, 4),
          followUp: "These are statement pieces that will last a lifetime. Any specific category interests you?",
        };
      }
    }

    // Outfit building
    if (lowerMessage.includes('outfit') || lowerMessage.includes('kombin') || lowerMessage.includes('look') || lowerMessage.includes('build')) {
      return {
        text: "Let's build the perfect outfit! 👗✨ What's the occasion?\n\n• 💼 Business meeting\n• 🍸 Cocktail party\n• 💒 Wedding guest\n• 🌴 Vacation\n• 🎭 Gala / Red carpet\n• ☕ Casual brunch",
        products: null,
        followUp: "Just tell me the occasion and I'll curate a complete look from head to toe!",
      };
    }

    // Business/Work outfits
    if (lowerMessage.includes('business') || lowerMessage.includes('work') || lowerMessage.includes('office') || lowerMessage.includes('meeting') || lowerMessage.includes('iş')) {
      return {
        text: "Power dressing for success! 💼 Here's a sophisticated business look:\n\n👜 Bag: Structured & Professional\n👗 Outfit: Tailored elegance\n⌚ Watch: Statement of success\n👠 Shoes: Confident & polished",
        products: [products[16], products[36], products[46], products[60]], // Prada Galleria, Submariner, So Kate, Silk Blouse
        followUp: "This combination projects confidence and authority. Want me to suggest alternatives in a different price range?",
      };
    }

    // Wedding/Event
    if (lowerMessage.includes('wedding') || lowerMessage.includes('düğün') || lowerMessage.includes('cocktail') || lowerMessage.includes('party')) {
      return {
        text: "Making an entrance! 🥂 Here's a stunning event look:\n\n👗 The Dress: Show-stopping elegance\n👠 Shoes: Crystal-embellished perfection\n💎 Jewelry: Tasteful sparkle\n👜 Clutch: The finishing touch",
        products: [products[53], products[48], products[29], products[5]], // Valentino Gown, Hangisi, Alhambra, Chanel Classic
        followUp: "This look is perfect for making memories! Would you like to see different color options?",
      };
    }

    // Red Carpet / Gala
    if (lowerMessage.includes('gala') || lowerMessage.includes('red carpet') || lowerMessage.includes('black tie')) {
      return {
        text: "Red carpet ready! 🌟 This is how you make headlines:\n\n👗 Gown: Haute couture drama\n💎 Jewelry: Statement pieces\n👠 Heels: Sky-high glamour\n👜 Clutch: Jeweled perfection",
        products: [products[53], products[27], products[32], products[45]], // Valentino Gown, Panthère, Magic Alhambra, So Kate
        followUp: "This ensemble is worth over $40,000 - true investment dressing! Want to explore more affordable alternatives?",
      };
    }

    // Investment pieces
    if (lowerMessage.includes('investment') || lowerMessage.includes('yatırım') || lowerMessage.includes('value') || lowerMessage.includes('appreciate')) {
      return {
        text: "Smart luxury investing! 📈 These pieces historically appreciate in value:\n\n1️⃣ Hermès Birkin - The ultimate investment bag (7-14% annual appreciation)\n2️⃣ Rolex Submariner - Waitlist-only, strong secondary market\n3️⃣ Cartier Love Bracelet - Timeless, always in demand\n4️⃣ Patek Philippe Nautilus - The holy grail",
        products: [products[0], products[35], products[24], products[42]], // Birkin, Submariner, Love Bracelet, Nautilus
        followUp: "These aren't just beautiful - they're financial assets. Which interests you most?",
      };
    }

    // Brand-specific queries
    const brandKeywords = {
      'hermès': ['hermes', 'hermès', 'birkin', 'kelly', 'constance'],
      'chanel': ['chanel', 'classic flap', 'boy bag', '2.55'],
      'louis vuitton': ['louis vuitton', 'lv', 'neverfull', 'speedy'],
      'dior': ['dior', 'lady dior', 'saddle', 'book tote'],
      'cartier': ['cartier', 'love bracelet', 'juste un clou', 'trinity', 'panthère'],
      'rolex': ['rolex', 'submariner', 'datejust', 'daytona', 'day-date'],
      'van cleef': ['van cleef', 'arpels', 'alhambra', 'perlée'],
      'gucci': ['gucci', 'marmont', 'jackie', 'dionysus'],
      'prada': ['prada', 'galleria', 're-edition', 'cleo'],
    };

    for (const [brand, keywords] of Object.entries(brandKeywords)) {
      if (keywords.some(kw => lowerMessage.includes(kw))) {
        const brandProducts = getProductsByBrand(brand, 4);
        const brandInfo = {
          'hermès': "Hermès - The pinnacle of French luxury since 1837. Each Birkin takes 48 hours of hand-stitching by a single artisan.",
          'chanel': "CHANEL - Coco's legacy lives on. The Classic Flap has increased 70% in value over 5 years.",
          'cartier': "Cartier - The King of Jewelers since 1847. Love Bracelet symbolizes eternal commitment.",
          'rolex': "Rolex - The crown jewel of watchmaking. Most models have waitlists of 2-5 years.",
          'louis vuitton': "Louis Vuitton - Since 1854, the ultimate symbol of travel and luxury.",
          'van cleef': "Van Cleef & Arpels - Parisian poetry in gold since 1906. The Alhambra is a symbol of luck.",
          'gucci': "Gucci - Italian glamour reinvented. Bold, eclectic, and unapologetically luxurious.",
          'prada': "Prada - Intellectual fashion from Milan. Where innovation meets tradition.",
          'dior': "Dior - New Look, eternal elegance. The Lady Dior was Princess Diana's favorite.",
        };
        return {
          text: `${brandInfo[brand] || `Exploring ${brand.toUpperCase()}:`}\n\nHere are the most coveted pieces:`,
          products: brandProducts,
          followUp: `Would you like to know about ${brand.toUpperCase()}'s history, sizing, or care instructions?`,
        };
      }
    }

    // Category queries
    if (lowerMessage.includes('bag') || lowerMessage.includes('çanta') || lowerMessage.includes('purse') || lowerMessage.includes('handbag')) {
      return {
        text: "Designer bags are the cornerstone of any luxury wardrobe! 👜 Here are the most iconic:",
        products: getProductsByCategory('bags', 4),
        followUp: "Looking for something specific? Crossbody, tote, clutch, or shoulder bag?",
      };
    }

    if (lowerMessage.includes('watch') || lowerMessage.includes('saat') || lowerMessage.includes('timepiece')) {
      return {
        text: "Fine timepieces - where art meets engineering! ⌚ The most prestigious watches:",
        products: getProductsByCategory('watches', 4),
        followUp: "Are you drawn to sports watches, dress watches, or something versatile for everyday?",
      };
    }

    if (lowerMessage.includes('jewelry') || lowerMessage.includes('mücevher') || lowerMessage.includes('jewel')) {
      return {
        text: "Fine jewelry - treasures that tell your story! 💎 These are investment pieces:",
        products: getProductsByCategory('jewelry', 4),
        followUp: "Prefer gold, rose gold, or white gold? Or shall I show you pieces with precious stones?",
      };
    }

    if (lowerMessage.includes('shoe') || lowerMessage.includes('ayakkabı') || lowerMessage.includes('heel') || lowerMessage.includes('pump')) {
      return {
        text: "Designer shoes - where comfort meets couture! 👠 The most iconic styles:",
        products: getProductsByCategory('shoes', 4),
        followUp: "What heel height works for you? I can suggest everything from kitten heels to statement stilettos.",
      };
    }

    // Size and fit questions
    if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerMessage.includes('beden') || lowerMessage.includes('measure')) {
      return {
        text: "Perfect fit is everything! 📏 Here's a quick guide:\n\n👜 BAGS:\n• Birkin 25: Petite, evening\n• Birkin 30: Most popular, everyday\n• Birkin 35: Spacious, travel\n\n⌚ WATCHES:\n• 36mm: Classic, elegant\n• 40mm: Modern standard\n• 42mm+: Bold statement\n\n💍 RINGS (EU sizes):\n• Measure at end of day\n• Allow for swelling\n\n👠 SHOES:\n• Designer shoes run small\n• Go up half size for Louboutins",
        products: null,
        followUp: "Which item would you like specific sizing advice for?",
      };
    }

    // Care and maintenance
    if (lowerMessage.includes('care') || lowerMessage.includes('maintain') || lowerMessage.includes('clean') || lowerMessage.includes('bakım')) {
      return {
        text: "Protecting your investment! 🛡️ Here are expert care tips:\n\n👜 LEATHER BAGS:\n• Store stuffed with tissue\n• Keep in dust bag\n• Avoid direct sunlight\n• Condition every 6 months\n\n💎 JEWELRY:\n• Remove before swimming\n• Clean with soft cloth\n• Store separately\n• Professional cleaning yearly\n\n⌚ WATCHES:\n• Service every 5 years\n• Avoid magnets\n• Wind regularly if automatic",
        products: null,
        followUp: "Want specific care instructions for a particular brand or material?",
      };
    }

    // Trending / New
    if (lowerMessage.includes('trend') || lowerMessage.includes('new') || lowerMessage.includes('yeni') || lowerMessage.includes('popular') || lowerMessage.includes('hot')) {
      return {
        text: "What's trending in luxury right now! 🔥\n\n1️⃣ Quiet Luxury - The Row, Loro Piana\n2️⃣ Gold jewelry layering - Cartier, VCA\n3️⃣ Statement watches - AP Royal Oak\n4️⃣ Return of the clutch - Bottega Veneta",
        products: [products[55], products[24], products[40], products[22]], // The Row, Love Bracelet, Royal Oak, Bottega
        followUp: "Want to explore any of these trends in detail?",
      };
    }

    // Personalized based on recently viewed
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('öner') || lowerMessage.includes('for me')) {
      if (recentlyViewed && recentlyViewed.length > 0) {
        const lastViewed = recentlyViewed[0];
        const similar = products.filter(p =>
          (p.category === lastViewed.category || p.brand === lastViewed.brand) &&
          p.id !== lastViewed.id
        ).slice(0, 3);
        return {
          text: `Based on your interest in ${lastViewed.brand} ${lastViewed.name}, you might love these:`,
          products: similar.length > 0 ? similar : getProductsByCategory(lastViewed.category, 3),
          followUp: "Would you like to see more from this brand or explore similar styles?",
        };
      }
    }

    // Greetings - Multiple variations
    if (lowerMessage.match(/^(hi|hello|hey|merhaba|selam)$/i)) {
      const greetings = [
        `Hello! 👋 How are you doing today? I'm so excited to help you discover something beautiful!`,
        `Hey there! 😊 Welcome back! How can I make your day more luxurious?`,
        `Hi! 💫 Great to see you! What brings you to LuxeSense today?`,
        `Hello, ${user?.name || 'gorgeous'}! ✨ Ready to explore some stunning pieces together?`,
      ];
      return {
        text: greetings[Math.floor(Math.random() * greetings.length)],
        products: null,
        followUp: "Feel free to ask me anything - style advice, gift ideas, outfit suggestions, or just browse together!",
      };
    }

    // Good morning/evening greetings
    if (lowerMessage.match(/(good morning|günaydın|goodmorning)/i)) {
      return {
        text: `Good morning, ${user?.name || 'sunshine'}! ☀️ What a beautiful day to discover something special. How are you feeling today?`,
        products: null,
        followUp: "Shall we start with some inspiration or do you have something specific in mind?",
      };
    }

    if (lowerMessage.match(/(good evening|good night|iyi akşamlar|iyi geceler)/i)) {
      return {
        text: `Good evening! 🌙 How lovely to see you. Perfect time to browse some beautiful pieces. How can I help you tonight?`,
        products: null,
        followUp: "Looking for something special for an evening out, or just browsing?",
      };
    }

    // How are you responses
    if (lowerMessage.match(/(how are you|how r u|nasılsın|naber|how's it going|what's up|ne haber)/i)) {
      const responses = [
        `I'm wonderful, thank you for asking! 😊 Even better now that I get to help you shop. How are YOU doing today?`,
        `I'm doing great! 💫 Always excited when I get to chat about beautiful things. How can I help you today?`,
        `Fantastic! ✨ Ready to help you find something amazing. What's on your mind?`,
        `I'm excellent, thanks! 🌟 More importantly, how can I make YOUR day better?`,
      ];
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        products: null,
        followUp: "What would you like to explore today? Bags, jewelry, watches, or something else?",
      };
    }

    // User says they're good/fine
    if (lowerMessage.match(/^(i'm good|i'm fine|i'm great|im good|im fine|good|fine|iyiyim|iyi)/i)) {
      return {
        text: `That's wonderful to hear! 😊 Now let's find something that'll make you feel even better!\n\nWhat catches your interest today?`,
        products: products.slice(0, 4),
        followUp: "✨ Style quiz\n🎁 Gift ideas\n👗 Build an outfit\n💎 Investment pieces",
      };
    }

    // Bye/goodbye
    if (lowerMessage.match(/(bye|goodbye|see you|görüşürüz|hoşçakal|have a good)/i)) {
      return {
        text: `Goodbye! 👋 It was lovely chatting with you. Come back anytime - I'll be here with more beautiful suggestions!\n\nHave a wonderful day! ✨💫`,
        products: null,
        followUp: null,
      };
    }

    // What can you do / help
    if (lowerMessage.match(/(what can you do|help me|ne yapabilirsin|yardım|how can you help)/i)) {
      return {
        text: `I'm your personal AI stylist! Here's everything I can help you with:\n\n✨ **Style Quiz** - Discover your unique style\n🎁 **Gift Finder** - Perfect gifts for anyone\n👗 **Outfit Builder** - Complete looks for any occasion\n💎 **Investment Advice** - Pieces that appreciate in value\n📏 **Size Guide** - Find your perfect fit\n🛡️ **Care Tips** - Protect your luxury items\n🔥 **Trending Now** - What's hot in luxury`,
        products: null,
        followUp: "Just type what you're looking for, or try one of the options above!",
      };
    }

    // Who are you
    if (lowerMessage.match(/(who are you|kimsin|what are you|sen kimsin)/i)) {
      return {
        text: `I'm your personal AI Stylist at LuxeSense! 🤖✨\n\nI'm powered by fashion intelligence and trained on luxury brands, styling tips, and the latest trends. Think of me as your 24/7 personal shopper who never gets tired!\n\nI can help you discover pieces that match your style, find perfect gifts, and even teach you about luxury fashion history.`,
        products: null,
        followUp: "Ready to explore? Just tell me what you're looking for!",
      };
    }

    // Compliments to AI
    if (lowerMessage.match(/(you're great|you're amazing|you're helpful|awesome|love you|harikasın|çok iyi)/i)) {
      return {
        text: `Aww, you're too kind! 🥰 That really means a lot to me. I love helping you discover beautiful things!\n\nNow, let me return the favor - what can I help you find next?`,
        products: products.slice(0, 3),
        followUp: "Something tells me you have great taste... 💫",
      };
    }

    // Thank you
    if (lowerMessage.match(/(thank|thanks|teşekkür|sağol)/i)) {
      const thankResponses = [
        "You're so welcome! 🌟 It's been my pleasure helping you. Is there anything else you'd like to explore?",
        "Anytime! 💫 That's what I'm here for. Shall we look at something else?",
        "My pleasure! 😊 Don't hesitate to ask if you need more help!",
        "You're welcome! ✨ Remember, I'm always here for more style advice whenever you need it!",
      ];
      return {
        text: thankResponses[Math.floor(Math.random() * thankResponses.length)],
        products: null,
        followUp: "Anything else catching your eye today?",
      };
    }

    // Bored / Just browsing
    if (lowerMessage.match(/(bored|just browsing|just looking|bakıyorum|sıkıldım|nothing specific)/i)) {
      return {
        text: `Perfect! 😊 Let me inspire you with some stunning pieces that are trending right now:`,
        products: [products[0], products[24], products[35], products[5]],
        followUp: "Sometimes the best discoveries happen when you're just browsing! Anything catching your eye?",
      };
    }

    // Price question
    if (lowerMessage.match(/(how much|price|fiyat|kaç para|cost)/i)) {
      return {
        text: `Great question! Our collection ranges from accessible luxury to haute couture:\n\n💫 Entry Level: Under $1,000\n✨ Mid Range: $1,000 - $5,000\n💎 Premium: $5,000 - $15,000\n👑 Ultra Luxury: $15,000+\n\nWhat's your comfort zone?`,
        products: null,
        followUp: "I can show you beautiful pieces at any price point!",
      };
    }

    // Default response with suggestions
    return {
      text: "I'd love to help you with that! To give you the best recommendations, could you tell me more about:\n\n🎯 What's the occasion?\n💰 Do you have a budget in mind?\n❤️ Any brands you love?\n👤 Is this for you or a gift?",
      products: products.slice(0, 4),
      followUp: "Or try these quick options:\n• 'Style quiz' - Discover your style\n• 'Investment pieces' - Best value\n• 'Build an outfit' - Complete looks\n• 'Trending now' - What's hot",
    };
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Use Groq AI for response
      const aiText = await getGroqResponse(currentInput, messages, language);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: aiText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Fallback to local response
      const aiResponse = getAIResponse(currentInput);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: aiResponse.text,
        products: aiResponse.products,
        followUp: aiResponse.followUp,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }
    setIsTyping(false);
  };

  const handleQuickPrompt = async (prompt) => {
    setInputText(prompt);

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: prompt,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setInputText('');

    try {
      // Use Groq AI for response
      const aiText = await getGroqResponse(prompt, messages, language);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: aiText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Fallback to local response
      const aiResponse = getAIResponse(prompt);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: aiResponse.text,
        products: aiResponse.products,
        followUp: aiResponse.followUp,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }
    setIsTyping(false);
  };

  const renderMessage = (message) => {
    if (message.type === 'user') {
      return (
        <View key={message.id} style={styles.userMessageContainer}>
          <View style={styles.userMessage}>
            <Text style={styles.userMessageText}>{message.text}</Text>
          </View>
        </View>
      );
    }

    return (
      <View key={message.id} style={styles.aiMessageContainer}>
        <View style={styles.aiAvatar}>
          <Ionicons name="sparkles" size={20} color={COLORS.gold} />
        </View>
        <View style={styles.aiMessageContent}>
          <View style={styles.aiMessage}>
            <Text style={styles.aiMessageText}>{message.text}</Text>
          </View>

          {message.products && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.productScroll}
            >
              {message.products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => navigation.navigate('ProductDetails', { product })}
                >
                  <Image source={typeof product.image === 'string' ? { uri: product.image } : product.image} style={styles.productImage} />
                  <Text style={styles.productBrand}>{product.brand}</Text>
                  <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                  <Text style={styles.productPrice}>${product.price.toLocaleString()}</Text>
                  <View style={styles.viewBtn}>
                    <Text style={styles.viewBtnText}>{t('common.view')}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {message.followUp && (
            <View style={styles.followUpContainer}>
              <Text style={styles.followUpText}>{message.followUp}</Text>
            </View>
          )}
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
        <View style={styles.headerCenter}>
          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={18} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>{t('aiStylist.title')}</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.headerSubtitle}>{t('aiStylist.alwaysOnline')}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => {
            setMessages([{
              id: 1,
              type: 'ai',
              text: t('aiStylist.freshStart', { name: user?.name || 'there' }),
              timestamp: new Date(),
            }]);
            setConversationContext({
              occasion: null,
              budget: null,
              style: null,
              preferredBrands: [],
              recentTopics: [],
            });
          }}
        >
          <Ionicons name="refresh-outline" size={20} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(renderMessage)}

        {isTyping && (
          <View style={styles.aiMessageContainer}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={20} color={COLORS.gold} />
            </View>
            <View style={styles.typingIndicator}>
              <View style={[styles.typingDot, styles.typingDot1]} />
              <View style={[styles.typingDot, styles.typingDot2]} />
              <View style={[styles.typingDot, styles.typingDot3]} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <View style={styles.quickPromptsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickPrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickPrompt}
                onPress={() => handleQuickPrompt(prompt.text)}
              >
                <Ionicons name={prompt.icon} size={18} color={COLORS.gold} />
                <Text style={styles.quickPromptText}>{prompt.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={t('aiStylist.placeholder')}
            placeholderTextColor={COLORS.gray}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, inputText.trim() && styles.sendBtnActive]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? COLORS.white : COLORS.gray}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.disclaimer}>{t('aiStylist.disclaimer')}</Text>
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
    justifyContent: 'space-between',
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
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.black,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SIZES.padding,
    paddingBottom: 20,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  userMessage: {
    maxWidth: '80%',
    backgroundColor: COLORS.black,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userMessageText: {
    fontSize: 15,
    color: COLORS.white,
    lineHeight: 22,
  },
  aiMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.goldLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  aiMessageContent: {
    flex: 1,
  },
  aiMessage: {
    maxWidth: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...SHADOWS.light,
  },
  aiMessageText: {
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 24,
  },
  productScroll: {
    marginTop: 12,
  },
  productCard: {
    width: 150,
    marginRight: 12,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 10,
    ...SHADOWS.light,
  },
  productImage: {
    width: '100%',
    height: 130,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.beige,
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.gray,
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.black,
    marginTop: 2,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gold,
    marginTop: 4,
  },
  viewBtn: {
    marginTop: 8,
    paddingVertical: 6,
    backgroundColor: COLORS.beige,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.black,
  },
  followUpContainer: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.goldLight,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
  },
  followUpText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
    ...SHADOWS.light,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gold,
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
  quickPromptsContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 12,
  },
  quickPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginRight: 10,
    gap: 8,
    ...SHADOWS.light,
  },
  quickPromptText: {
    fontSize: 13,
    color: COLORS.black,
    fontWeight: '500',
  },
  inputContainer: {
    padding: SIZES.padding,
    paddingBottom: 34,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.beige,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.black,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.beigeDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendBtnActive: {
    backgroundColor: COLORS.gold,
  },
  disclaimer: {
    fontSize: 11,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default AIStylistScreen;
