import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useApp } from '../context/AppContext';

// Auth Screens
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

// Customer Screens
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AIStylistScreen from '../screens/AIStylistScreen';
import ChatScreen from '../screens/ChatScreen';

// Advisor Screens
import AdvisorDashboardScreen from '../screens/AdvisorDashboardScreen';
import CustomersScreen from '../screens/CustomersScreen';
import CustomerDetailScreen from '../screens/CustomerDetailScreen';
import AdvisorCalendarScreen from '../screens/AdvisorCalendarScreen';
import AdvisorPurchaseHistoryScreen from '../screens/AdvisorPurchaseHistoryScreen';
import AdvisorChatListScreen from '../screens/AdvisorChatListScreen';
import AdvisorChatScreen from '../screens/AdvisorChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Customer Tab Navigator
const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Catalog':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Wishlist':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.beigeDark,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 28,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Catalog" component={CatalogScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Advisor Tab Navigator
const AdvisorTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Customers':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'History':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'Messages':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.beigeDark,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 28,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdvisorDashboardScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="History" component={AdvisorPurchaseHistoryScreen} />
      <Tab.Screen name="Messages" component={AdvisorChatListScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isLoggedIn, isLoading, userType } = useApp();

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.cream }}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  // Determine initial route based on auth state
  const getInitialRoute = () => {
    if (isLoggedIn) {
      return userType === 'advisor' ? 'AdvisorTabs' : 'MainTabs';
    }
    return 'Landing';
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={getInitialRoute()}
    >
      {/* Auth Flow */}
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Customer Flow */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="MainTabs" component={CustomerTabs} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="AIStylist" component={AIStylistScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />

      {/* Advisor Flow */}
      <Stack.Screen name="AdvisorTabs" component={AdvisorTabs} />
      <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
      <Stack.Screen name="AdvisorChat" component={AdvisorChatScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
