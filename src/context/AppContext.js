import React, { createContext, useContext, useState } from 'react';
import i18n from '../locales/i18n';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // 'customer' or 'advisor'
  const [token, setToken] = useState(null);

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

  // Assigned customers for advisor
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
      notes: 'Prefers private appointments. Anniversary in May.',
      avatar: 'AC',
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
      notes: 'Interested in new watch collection.',
      avatar: 'VS',
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
      notes: 'VIP client. Attending Met Gala - needs statement pieces.',
      avatar: 'SL',
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
      notes: 'Birthday next month. Loves burgundy and black.',
      avatar: 'ER',
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
      notes: 'New client. Potential for upgrade to Gold tier.',
      avatar: 'CW',
    },
  ]);

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

  // Auth functions
  const login = (type, userData = null, authToken = null) => {
    setIsLoggedIn(true);
    setUserType(type);
    if (authToken) setToken(authToken);
    if (userData) {
      if (type === 'customer') {
        setUser(prev => ({
          ...prev,
          id: userData.id,
          name: userData.name?.split(' ')[0] || userData.name,
          fullName: userData.name,
          email: userData.email,
          phone: userData.phone || '',
        }));
      } else {
        setAdvisor(prev => ({
          ...prev,
          id: userData.id,
          name: userData.name?.split(' ')[0] || userData.name,
          fullName: userData.name,
          email: userData.email,
          employeeId: userData.employeeId || '',
          store: userData.storeLocation || '',
        }));
      }
    }
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
    // Clear chat messages on logout
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
    clearCart();
    return newOrder;
  };

  return (
    <AppContext.Provider value={{
      // Auth
      isLoggedIn,
      userType,
      token,
      login,
      logout,

      // User
      user,
      setUser,
      getGreeting,

      // Advisor
      advisor,
      setAdvisor,
      assignedCustomers,

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
