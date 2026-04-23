import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// How notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async () => {
  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'LuxeSense',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#C9A962',
    });
  }

  return finalStatus;
};

// ── Notification Templates ──────────────────────────────────────

// Customer-facing
export const CUSTOMER_NOTIFICATIONS = {
  welcome: (name) => ({
    title: `Welcome to LuxeSense, ${name}! ✨`,
    body: 'Your personalised luxury experience begins now. Explore pieces curated just for you.',
  }),
  profileReady: (profile) => ({
    title: `Your ${profile} profile is ready 👑`,
    body: 'We\'ve curated your collection based on your taste. Swipe to explore.',
  }),
  newArrivals: (profile) => ({
    title: 'New arrivals just for you 🛍️',
    body: `Fresh pieces selected for your ${profile} taste have just landed.`,
  }),
  cartAbandoned: (itemName) => ({
    title: 'Still thinking about it? 💭',
    body: `${itemName} is waiting in your cart. Limited stock — don't miss it.`,
  }),
  wishlistBack: (itemName) => ({
    title: 'Good news! 🎉',
    body: `${itemName} from your wishlist is back in stock.`,
  }),
  loyaltyUpgrade: (tier) => ({
    title: `You've reached ${tier} status! 🏆`,
    body: tier === 'Platinum'
      ? 'Congratulations! You now have access to exclusive Platinum privileges.'
      : `Welcome to ${tier}! Enjoy your new benefits and exclusive access.`,
  }),
  birthday: (name) => ({
    title: `Happy Birthday, ${name}! 🎂`,
    body: 'Treat yourself today — a special gift is waiting for you in the app.',
  }),
  exclusiveAccess: () => ({
    title: 'Private sale — 24 hours only 👑',
    body: 'You\'ve been granted early access to our exclusive members\' sale.',
  }),
  styleInsight: () => ({
    title: 'Your weekly style edit is ready 💎',
    body: 'We\'ve selected 5 pieces your stylist thinks you\'ll love.',
  }),
  lisUpgrade: (from, to) => ({
    title: `Your taste is evolving! 📈`,
    body: `You've moved from ${from} to ${to} profile. Explore your updated collection.`,
  }),
};

// Advisor-facing
export const ADVISOR_NOTIFICATIONS = {
  clientWishlist: (clientName, itemName) => ({
    title: `${clientName} is interested 🔔`,
    body: `She just wishlisted "${itemName}" — now might be a great time to reach out.`,
  }),
  clientCartAbandon: (clientName) => ({
    title: `Follow up with ${clientName} ⚡️`,
    body: 'She left items in her cart. A personal touch could close the sale.',
  }),
  clientBirthday: (clientName, days) => ({
    title: `${clientName}'s birthday in ${days} days 🎂`,
    body: 'Prepare a curated gift selection to surprise her.',
  }),
  clientProfileUpgrade: (clientName, profile) => ({
    title: `${clientName} upgraded to ${profile}! 📈`,
    body: 'Her LIS score increased — time to offer premium recommendations.',
  }),
  clientInactive: (clientName) => ({
    title: `${clientName} hasn't visited in a while 💌`,
    body: 'A personalised message could bring her back.',
  }),
  newSaleOpportunity: (clientName) => ({
    title: `High intent signal from ${clientName} 🎯`,
    body: 'She\'s been browsing intensively — perfect moment to connect.',
  }),
};

// ── Schedule / Send helpers ─────────────────────────────────────

export const scheduleLocalNotification = async ({ title, body, delaySeconds = 1, data = {} }) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data, sound: true },
      trigger: delaySeconds <= 1 ? null : { seconds: delaySeconds },
    });
  } catch (_) {}
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
