import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../locales/i18n';
import { getProducts as fetchProductsAPI } from '../services/api';
import { getProductImage } from '../constants/imageMap';
import { products as mockProducts } from '../constants/mockData';
import {
  registerForPushNotifications,
  scheduleLocalNotification,
  CUSTOMER_NOTIFICATIONS,
} from '../services/notificationService';
import { getAdvisorCustomers, ingestLIRABatch } from '../services/api';

// ── ES KPI scoring helpers ────────────────────────────────────────────────────
function kpiTier(value, high, mid) {
  if (value >= high) return 1.0;
  if (value >= mid)  return 0.4;
  return 0.0;
}

// Weighted ES formula → scaled to 0–7
export function computeES({ sessionMinutes, appOpens, productViews, wishlistConversionRate, advisorAcceptanceRate }) {
  const raw = kpiTier(sessionMinutes, 15, 5)    * 0.25
            + kpiTier(appOpens, 5, 2)            * 0.20
            + kpiTier(productViews, 5, 1)         * 0.20
            + kpiTier(wishlistConversionRate, 0.5, 0.15) * 0.15
            + kpiTier(advisorAcceptanceRate, 0.4, 0.15)  * 0.20;
  return parseFloat((raw * 7).toFixed(2));
}

// CVI = ES + PF (0–10), with segment
export function computeCVI(esScore, pfScore) {
  const cvi = Math.min(parseFloat((esScore + pfScore).toFixed(2)), 10);
  let segment = 'low_priority';
  if (cvi >= 8) segment = 'high_priority';
  else if (cvi >= 5) segment = 'follow_up';
  return { cviScore: cvi, cviSegment: segment };
}

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // 'customer' or 'advisor'
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false); // Track if user just registered


  // ── ES KPI tracking (local, flushed to backend on session end) ────────────
  const [sessionMinutes, setSessionMinutes] = useState(0);     // today total
  const [appOpens, setAppOpens] = useState(0);                 // today total
  const [productViews, setProductViews] = useState(0);         // today total
  const [wishlistAdds, setWishlistAdds] = useState(0);         // all-time local count
  const [wishlistPurchases, setWishlistPurchases] = useState(0); // all-time local count
  const [advisorRecs, setAdvisorRecs] = useState({ shown: 0, accepted: 0 });

  // ── PF tracking (rolling 30-day purchase timestamps) ──────────────────────
  const [purchaseTimestamps, setPurchaseTimestamps] = useState([]);

  // ── CVI state (computed from ES + PF) ────────────────────────────────────
  const [cviScore, setCviScore] = useState(0);
  const [cviSegment, setCviSegment] = useState('low_priority');

  // ── Session tracking ──────────────────────────────────────────────────────
  const sessionStartRef = useRef(Date.now());
  const appStateRef = useRef(AppState.currentState);
  const pendingEventsRef = useRef([]); // buffer events to batch-flush

  // Customer user state
  const [user, setUser] = useState({
    id: null,
    name: '',
    fullName: '',
    email: '',
    phone: '',
    tier: 'Silver',
    memberSince: new Date().getFullYear().toString(),
    totalSpent: 0,
    loyaltyPoints: 0,
    avatar: null,
  });

  // Sales Advisor state
  const [advisor, setAdvisor] = useState({
    id: 1,
    name: 'Isabelle',
    fullName: 'Isabelle Moreau',
    email: 'isabelle@luxesense.com',
    role: 'Senior Sales Advisor',
    store: 'Paris Flagship',
    employeeId: 'LX-2847',
    avatar: null,
    // Sales targets
    monthlyTarget: 150000,
    currentSales: 127500,
    clientsServed: 48,
    averageTicket: 2656,
    conversionRate: 68,
    // Performance
    ranking: 2,
    totalAdvisors: 12,
    commission: 8925,
  });

  // Assigned customers for advisor (with mock LIS intelligence data)
  const [assignedCustomers] = useState([
    {
      id: 1,
      name: 'Alexandra Chen',
      email: 'alexandra.chen@email.com',
      phone: '+1 (555) 123-4567',
      tier: 'Platinum',
      totalSpent: 284500,
      lastVisit: '2024-03-01',
      lastPurchase: 'Diamond Pendant Necklace',
      preferences: ['Fine Jewelry', 'Evening Wear'],
      birthday: 'May 12',
      notes: [
        'Double espresso with oat milk',
        'Lactose intolerant - no dairy',
        'Prefers private appointments',
        'Anniversary also in May',
      ],
      avatar: 'AC',
      esScore: 6.5, pfScore: 3, pfLabel: 'Heavy', cviScore: 9.5, cviSegment: 'high_priority',
      engagementLevel: 'High', dailyMinutes: 28, monthlyPurchases: 4, purchaseFrequency: 'Heavy',
      lastSeen: 'Active now',
      alerts: [
        { type: 'hot_view', message: 'Viewed Hermès Birkin 3x this week', urgency: 'high', template: "Alexandra, I've been thinking of you — the Birkin 25 in Noir just came in. Would you like a private preview?" },
        { type: 'cart_abandon', message: 'Cart abandon: Diamond Tennis Bracelet ($18,500)', urgency: 'high', template: "I noticed you were exploring the diamond bracelet. I'd love to share some details — it's truly exceptional in person." },
      ],
    },
    {
      id: 2,
      name: 'Victoria Sterling',
      email: 'victoria.s@email.com',
      phone: '+1 (555) 234-5678',
      tier: 'Gold',
      totalSpent: 156000,
      lastVisit: '2024-02-28',
      lastPurchase: 'Cashmere Trench Coat',
      preferences: ['Outerwear', 'Accessories'],
      birthday: 'September 3',
      notes: [
        'Strawberry tart is her favorite!',
        'Sparkling water only',
        'Interested in Rolex collection',
        'Husband collects vintage watches',
      ],
      avatar: 'VS',
      esScore: 4.2, pfScore: 2, pfLabel: 'Regular', cviScore: 6.2, cviSegment: 'follow_up',
      engagementLevel: 'High', dailyMinutes: 14, monthlyPurchases: 2, purchaseFrequency: 'Regular',
      lastSeen: '2 hours ago',
      alerts: [
        { type: 'birthday', message: 'Birthday in 12 days — curate a gift selection', urgency: 'medium', template: "Victoria, your birthday is coming up and I've put together a small selection I think you'll adore. May I share?" },
        { type: 'hot_view', message: 'Wishlisted Rolex Datejust ($8,100)', urgency: 'medium', template: "I saw the Datejust caught your eye — we have a beautiful two-tone piece just arrived. Worth a closer look?" },
      ],
    },
    {
      id: 3,
      name: 'Sophia Laurent',
      email: 'sophia.l@email.com',
      phone: '+1 (555) 345-6789',
      tier: 'Platinum',
      totalSpent: 312000,
      lastVisit: '2024-02-25',
      lastPurchase: 'Emerald Drop Earrings',
      preferences: ['Fine Jewelry', 'Handbags'],
      birthday: 'January 28',
      notes: [
        'Cappuccino, no sugar',
        'Rose macarons are a must',
        'VIP - Met Gala attendee',
        'Loves emeralds and sapphires',
      ],
      avatar: 'SL',
      esScore: 7.0, pfScore: 3, pfLabel: 'Heavy', cviScore: 10.0, cviSegment: 'high_priority',
      engagementLevel: 'High', dailyMinutes: 32, monthlyPurchases: 5, purchaseFrequency: 'Heavy',
      lastSeen: '15 min ago',
      alerts: [
        { type: 'hot_view', message: 'Browsed 5 fine jewelry items — active right now', urgency: 'high', template: "Sophia, I've been curating something for you — a piece I think belongs in your collection. Are you free for a call?" },
        { type: 'profile_upgrade', message: 'LIS score reached Premium — high conversion window', urgency: 'high', template: "Your eye for exceptional pieces is showing — I have something very special set aside for you." },
      ],
    },
    {
      id: 4,
      name: 'Emma Rothschild',
      email: 'emma.r@email.com',
      phone: '+1 (555) 456-7890',
      tier: 'Gold',
      totalSpent: 98500,
      lastVisit: '2024-02-20',
      lastPurchase: 'Silk Evening Gown',
      preferences: ['Evening Wear', 'Shoes'],
      birthday: 'April 15',
      notes: [
        'Green tea only, no coffee',
        'Chocolate truffles lover',
        'Favorite colors: burgundy & black',
        'Size 38 in shoes',
      ],
      avatar: 'ER',
      esScore: 0.8, pfScore: 0, pfLabel: 'Rare', cviScore: 0.8, cviSegment: 'low_priority',
      engagementLevel: 'Low', dailyMinutes: 0, monthlyPurchases: 0, purchaseFrequency: 'Rare',
      lastSeen: '14 days ago',
      alerts: [
        { type: 'inactive', message: 'No activity for 14 days — re-engage now', urgency: 'medium', template: "Emma, I've been thinking of you. I've set aside a few pieces that feel very you — may I share?" },
        { type: 'hot_view', message: '3 wishlisted items waiting — no purchase', urgency: 'low', template: "Your wishlist has been patiently waiting. Shall we revisit it together?" },
      ],
    },
    {
      id: 5,
      name: 'Charlotte Windsor',
      email: 'charlotte.w@email.com',
      phone: '+1 (555) 567-8901',
      tier: 'Silver',
      totalSpent: 45000,
      lastVisit: '2024-02-15',
      lastPurchase: 'Cashmere Sweater',
      preferences: ['Knitwear', 'Casual Wear'],
      birthday: 'November 22',
      notes: [
        'Hot chocolate, extra whipped cream',
        'Vegan - offer fruit platter',
        'New client, high potential',
        'Loves cashmere and silk',
      ],
      avatar: 'CW',
      esScore: 2.8, pfScore: 2, pfLabel: 'Regular', cviScore: 4.8, cviSegment: 'low_priority',
      engagementLevel: 'Mid', dailyMinutes: 7, monthlyPurchases: 1, purchaseFrequency: 'Regular',
      lastSeen: 'Today',
      alerts: [
        { type: 'new_client', message: 'New client — perfect moment for first contact', urgency: 'medium', template: "Charlotte, welcome — I'm Isabelle, your personal advisor at LuxeSense. I'd love to learn about your taste and find pieces you'll truly love." },
        { type: 'hot_view', message: 'Browsed cashmere category 5 times this week', urgency: 'low', template: "I noticed you have a love for cashmere — we just received a beautiful new collection I think you'd adore." },
      ],
    },
  ]);

  // Products from database
  const [products, setProducts] = useState(mockProducts);
  const [productsLoading, setProductsLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const data = await fetchProductsAPI();
      if (data.success && data.products?.length > 0) {
        const enriched = data.products.map((p) => ({
          ...p,
          id: p._id,
          image: getProductImage(p.imageKey),
        }));
        setProducts(enriched);
      }
    } catch (_) {
      // keep mockProducts as fallback
    } finally {
      setProductsLoading(false);
    }
  };

  // Cart state
  const [cartItems, setCartItems] = useState([]);

  // Wishlist state
  const [wishlist, setWishlist] = useState([]);

  // Orders state
  const [orders, setOrders] = useState([]);

  // Recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Chat messages (persist until logout)
  const [aiStylistMessages, setAiStylistMessages] = useState([]);
  const [saChatMessages, setSaChatMessages] = useState([]);

  // Language state
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  // Load saved auth state and products on app start
  useEffect(() => {
    loadAuthState();
    loadProducts();
  }, []);

  // ── AppState listener — session tracking + event flush ──────────────────
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        if (appStateRef.current === 'active' && sessionStartRef.current) {
          const durationMinutes = (Date.now() - sessionStartRef.current) / 60000;
          setSessionMinutes(prev => prev + durationMinutes);

          // Queue session_end event for batch flush
          pendingEventsRef.current.push({
            eventType: 'session_end',
            metadata: { durationMinutes: parseFloat(durationMinutes.toFixed(2)) },
            occurredAt: new Date().toISOString(),
          });

          // Flush pending events to backend
          flushEvents();
          sessionStartRef.current = null;
        }
      } else if (nextState === 'active') {
        sessionStartRef.current = Date.now();
        // Track app open
        setAppOpens(prev => prev + 1);
        pendingEventsRef.current.push({
          eventType: 'app_open',
          metadata: {},
          occurredAt: new Date().toISOString(),
        });
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [token]);

  // Flush queued events to backend (no-op if not logged in)
  const flushEvents = async () => {
    if (!token || pendingEventsRef.current.length === 0) return;
    const batch = [...pendingEventsRef.current];
    pendingEventsRef.current = [];
    try {
      await ingestLIRABatch(batch, token);
    } catch (_) {
      // re-queue on failure
      pendingEventsRef.current = [...batch, ...pendingEventsRef.current];
    }
  };

  // ── LIRA computed scores (local estimates, backend is authoritative) ──────
  const getLocalES = () => {
    const wishlistConversionRate = wishlistAdds > 0 ? wishlistPurchases / wishlistAdds : 0;
    const advisorAcceptanceRate  = advisorRecs.shown > 0 ? advisorRecs.accepted / advisorRecs.shown : 0;
    return computeES({ sessionMinutes, appOpens, productViews, wishlistConversionRate, advisorAcceptanceRate });
  };

  const getLocalPF = () => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const count = purchaseTimestamps.filter(ts => ts >= cutoff).length;
    if (count >= 3) return { pfScore: 3, pfLabel: 'Heavy' };
    if (count >= 1) return { pfScore: 2, pfLabel: 'Regular' };
    return { pfScore: 0, pfLabel: 'Rare' };
  };

  const getLocalCVI = () => {
    const es = getLocalES();
    const { pfScore } = getLocalPF();
    return computeCVI(es, pfScore);
  };

  // Engagement level label derived from session minutes (for SA display)
  const getEngagementLevel = () => {
    if (sessionMinutes >= 15) return 'High';
    if (sessionMinutes >= 5)  return 'Mid';
    return 'Low';
  };

  const loadAuthState = async () => {
    try {
      const [savedAuth] = await Promise.all([
        AsyncStorage.getItem('authState'),
      ]);
      if (savedAuth) {
        const { savedToken, savedUserType, savedUser } = JSON.parse(savedAuth);
        setToken(savedToken);
        setUserType(savedUserType);
        setUser(prev => ({ ...prev, ...savedUser }));
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log('Error loading auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuthState = async (authToken, type, userData) => {
    try {
      await AsyncStorage.setItem('authState', JSON.stringify({
        savedToken: authToken,
        savedUserType: type,
        savedUser: userData,
      }));
    } catch (error) {
      console.log('Error saving auth state:', error);
    }
  };

  const clearAuthState = async () => {
    try {
      await AsyncStorage.removeItem('authState');
    } catch (error) {
      console.log('Error clearing auth state:', error);
    }
  };

  // Push notification registration
  const initNotifications = async () => {
    await registerForPushNotifications();
  };

  // Real advisor customers (loaded from backend when advisor logs in)
  const [liveAdvisorCustomers, setLiveAdvisorCustomers] = useState(null);

  const loadAdvisorCustomers = async (authToken) => {
    try {
      const data = await getAdvisorCustomers(authToken);
      if (data.success && data.customers?.length > 0) {
        setLiveAdvisorCustomers(data.customers);
      }
    } catch (_) {}
  };


  // ── Event tracking helpers ────────────────────────────────────────────────
  const queueEvent = (eventType, metadata = {}) => {
    pendingEventsRef.current.push({
      eventType, metadata, occurredAt: new Date().toISOString(),
    });
  };

  const trackProductView = (productId, timeSpentSeconds, productPrice = 0) => {
    if (timeSpentSeconds >= 10) {
      setProductViews(prev => prev + 1);
      queueEvent('product_view', { productId, timeSpentSeconds, productPrice });
    }
  };

  const trackCheckoutAbandon = () => {
    const notif = CUSTOMER_NOTIFICATIONS.cartAbandoned('your selection');
    scheduleLocalNotification({ ...notif, delaySeconds: 1800 });
  };

  const trackCartDwell = (seconds) => {
    // Informational — no score impact, logged for SA context
    if (seconds >= 120) queueEvent('product_view', { context: 'cart_dwell', durationSeconds: seconds });
  };

  const trackPriceFilterHigh = () => {
    queueEvent('product_view', { context: 'high_price_filter' });
  };

  const trackAIStylistMessage = (message) => {
    queueEvent('chat_initiated', { message: message.substring(0, 120) });
  };

  const trackStoreAvailabilityOpen = () => {
    queueEvent('product_view', { context: 'store_availability' });
  };

  const trackSizeColorSelect = () => {
    queueEvent('product_view', { context: 'size_color_select' });
  };

  const trackAdvisorRecommendationAccepted = () => {
    setAdvisorRecs(prev => ({ ...prev, accepted: prev.accepted + 1 }));
    queueEvent('advisor_recommendation_accepted', {});
  };

  const getPurchaseFrequency = () => getLocalPF().pfLabel;

  const getLPTier = () => {
    const pts = user.loyaltyPoints;
    if (pts >= 7500) return 'Platinum';
    if (pts >= 2500) return 'Gold';
    return 'Silver';
  };


  // Auth functions
  const login = (type, userData = null, authToken = null, newUser = false) => {
    setIsLoggedIn(true);
    setUserType(type);
    setIsNewUser(newUser);
    if (authToken) setToken(authToken);
    initNotifications();
    // Load real customers if advisor
    if (type === 'advisor' && authToken) {
      loadAdvisorCustomers(authToken);
    }

    const userInfo = {
      id: userData?.id,
      name: userData?.name?.split(' ')[0] || userData?.name || '',
      fullName: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
    };

    if (userData) {
      if (type === 'customer') {
        setUser(prev => ({ ...prev, ...userInfo }));
      } else {
        setAdvisor(prev => ({
          ...prev,
          ...userInfo,
          employeeId: userData.employeeId || '',
          store: userData.storeLocation || '',
        }));
      }
    }

    // Save auth state to AsyncStorage
    saveAuthState(authToken, type, userInfo);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setToken(null);
    setUser({
      id: null,
      name: '',
      fullName: '',
      email: '',
      phone: '',
      tier: 'Silver',
      memberSince: new Date().getFullYear().toString(),
      totalSpent: 0,
      loyaltyPoints: 0,
      avatar: null,
    });
    setSessionMinutes(0);
    setAppOpens(0);
    setProductViews(0);
    setWishlistAdds(0);
    setWishlistPurchases(0);
    setAdvisorRecs({ shown: 0, accepted: 0 });
    setPurchaseTimestamps([]);
    setCviScore(0);
    setCviSegment('low_priority');
    pendingEventsRef.current = [];
    clearAuthState();
    setAiStylistMessages([]);
    setSaChatMessages([]);
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Cart functions
  const addToCart = (product, selectedColor, selectedSize, quantity = 1) => {
    const existingIndex = cartItems.findIndex(
      item => item.id === product.id &&
              item.selectedColor === selectedColor &&
              item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      setCartItems([...cartItems, {
        ...product,
        selectedColor,
        selectedSize,
        quantity,
        cartId: Date.now(),
      }]);
    }
  };

  const removeFromCart = (cartId) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.cartId === cartId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Wishlist functions
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Recently viewed functions
  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => p.id !== product.id);
      // Add to beginning and limit to 10 items
      return [product, ...filtered].slice(0, 10);
    });
  };

  // Order functions
  const placeOrder = (shippingInfo, shipping) => {
    const orderNumber = `LX${Date.now().toString().slice(-8)}`;
    const subtotal = getCartTotal();
    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + (shipping?.cost || 0) + tax;

    const newOrder = {
      id: Date.now(),
      orderNumber,
      items: [...cartItems],
      total,
      shippingInfo,
      shipping,
      status: 'processing',
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toISOString(),
    };
    setOrders([newOrder, ...orders]);

    // Track purchase timestamp for rolling 30-day PF window
    const now = Date.now();
    setPurchaseTimestamps(prev => [...prev.filter(ts => ts >= now - 30 * 24 * 60 * 60 * 1000), now]);

    // Queue purchase event for backend
    queueEvent('purchase', { total, orderNumber });

    // Update user's totalSpent and loyaltyPoints, fire tier upgrade notification
    const earnedPoints = Math.floor(total / 10);
    setUser(prev => {
      const oldTier = prev.loyaltyPoints >= 7500 ? 'Platinum' : prev.loyaltyPoints >= 2500 ? 'Gold' : 'Silver';
      const newPoints = prev.loyaltyPoints + earnedPoints;
      const newTier = newPoints >= 7500 ? 'Platinum' : newPoints >= 2500 ? 'Gold' : 'Silver';
      if (newTier !== oldTier) {
        const notif = CUSTOMER_NOTIFICATIONS.loyaltyUpgrade(newTier);
        scheduleLocalNotification({ ...notif, delaySeconds: 2 });
      }
      return { ...prev, totalSpent: prev.totalSpent + total, loyaltyPoints: newPoints };
    });

    clearCart();
    return newOrder;
  };

  return (
    <AppContext.Provider value={{
      // Products
      products,
      productsLoading,
      loadProducts,

      // Auth
      isLoggedIn,
      isLoading,
      userType,
      token,
      isNewUser,
      login,
      logout,

      // User
      user,
      setUser,
      getGreeting,

      // Advisor
      advisor,
      setAdvisor,
      assignedCustomers: liveAdvisorCustomers || assignedCustomers, // real data takes priority
      liveAdvisorCustomers,

      // Cart
      cartItems,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartTotal,
      getCartCount,

      // Wishlist
      wishlist,
      toggleWishlist,
      isInWishlist,

      // Orders
      orders,
      placeOrder,

      // Recently Viewed
      recentlyViewed,
      addToRecentlyViewed,

      // Chat Messages
      aiStylistMessages,
      setAiStylistMessages,
      saChatMessages,
      setSaChatMessages,

      // Language
      language,
      changeLanguage,

      // Loyalty
      getLPTier,

      // LIRA — ES / PF / CVI (local estimates)
      sessionMinutes,
      appOpens,
      productViews,
      getLocalES,
      getLocalPF,
      getLocalCVI,
      cviScore,
      cviSegment,
      getEngagementLevel,
      getPurchaseFrequency,

      // Event tracking
      trackProductView,
      trackCheckoutAbandon,
      trackCartDwell,
      trackPriceFilterHigh,
      trackAIStylistMessage,
      trackStoreAvailabilityOpen,
      trackSizeColorSelect,
      trackAdvisorRecommendationAccepted,
      flushEvents,

      // Notifications
      initNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
