import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const OrderSuccessScreen = ({ route, navigation }) => {
  const order = route?.params?.order || {
    orderNumber: 'N/A',
    trackingNumber: 'N/A',
    items: [],
    total: 0,
    shipping: { method: 'standard' },
  };

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const estimatedDelivery = () => {
    const today = new Date();
    let days = 5;
    if (order.shipping.method === 'express') days = 3;
    if (order.shipping.method === 'overnight') days = 1;

    const delivery = new Date(today.setDate(today.getDate() + days));
    return delivery.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Animation */}
        <View style={styles.successSection}>
          <Animated.View
            style={[
              styles.successCircle,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Ionicons name="checkmark" size={48} color={COLORS.white} />
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.successTitle}>Order Confirmed!</Text>
            <Text style={styles.successSubtitle}>
              Thank you for your purchase
            </Text>
          </Animated.View>
        </View>

        {/* Order Number */}
        <Animated.View style={[styles.orderCard, { opacity: fadeAnim }]}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderLabel}>Order Number</Text>
            <TouchableOpacity style={styles.copyBtn}>
              <Ionicons name="copy-outline" size={18} color={COLORS.gold} />
            </TouchableOpacity>
          </View>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDate}>
            Placed on {new Date(order.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </Animated.View>

        {/* Tracking Info */}
        <Animated.View style={[styles.trackingCard, { opacity: fadeAnim }]}>
          <View style={styles.trackingHeader}>
            <Ionicons name="location-outline" size={24} color={COLORS.gold} />
            <View style={styles.trackingInfo}>
              <Text style={styles.trackingLabel}>Tracking Number</Text>
              <Text style={styles.trackingNumber}>{order.trackingNumber}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.deliveryInfo}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.gray} />
            <View style={styles.deliveryDetails}>
              <Text style={styles.deliveryLabel}>Estimated Delivery</Text>
              <Text style={styles.deliveryDate}>{estimatedDelivery()}</Text>
            </View>
          </View>

          <View style={styles.deliveryInfo}>
            <Ionicons name="cube-outline" size={20} color={COLORS.gray} />
            <View style={styles.deliveryDetails}>
              <Text style={styles.deliveryLabel}>Shipping Method</Text>
              <Text style={styles.deliveryDate}>
                {order.shipping.method === 'standard' && 'Standard Delivery'}
                {order.shipping.method === 'express' && 'Express Delivery'}
                {order.shipping.method === 'overnight' && 'Overnight Delivery'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Shipping Address */}
        <Animated.View style={[styles.addressCard, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>Shipping Address</Text>
          <Text style={styles.addressText}>
            {order.shippingInfo.firstName} {order.shippingInfo.lastName}
          </Text>
          <Text style={styles.addressText}>
            {order.shippingInfo.address}
            {order.shippingInfo.apartment && `, ${order.shippingInfo.apartment}`}
          </Text>
          <Text style={styles.addressText}>
            {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
          </Text>
          <Text style={styles.addressText}>{order.shippingInfo.country}</Text>
        </Animated.View>

        {/* Order Items */}
        <Animated.View style={[styles.itemsCard, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>Order Items ({order.items.length})</Text>
          {order.items.map((item) => (
            <View key={item.cartId} style={styles.orderItem}>
              <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemDetails}>
                  {item.selectedColor} · {item.selectedSize}
                </Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {order.shipping.cost === 0 ? 'FREE' : `$${order.shipping.cost}`}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>
              ${Math.round(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.08).toLocaleString()}
            </Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 8 }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${order.total.toLocaleString()}</Text>
          </View>
        </Animated.View>

        {/* Email Confirmation */}
        <Animated.View style={[styles.emailNote, { opacity: fadeAnim }]}>
          <Ionicons name="mail-outline" size={20} color={COLORS.gray} />
          <Text style={styles.emailText}>
            A confirmation email has been sent to{'\n'}
            <Text style={styles.emailAddress}>{order.shippingInfo.email}</Text>
          </Text>
        </Animated.View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Ionicons name="bag-outline" size={20} color={COLORS.black} />
          <Text style={styles.trackBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('Feedback', { order })}
        >
          <Text style={styles.continueBtnText}>Rate Experience</Text>
          <Ionicons name="star" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    paddingTop: 80,
  },
  successSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  successCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '500',
    color: COLORS.black,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
  },
  orderCard: {
    margin: SIZES.padding,
    marginTop: 0,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderLabel: {
    fontSize: 13,
    color: COLORS.gray,
    letterSpacing: 0.5,
  },
  copyBtn: {
    padding: 4,
  },
  orderNumber: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.gold,
    letterSpacing: 1,
    marginTop: 8,
  },
  orderDate: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 6,
  },
  trackingCard: {
    margin: SIZES.padding,
    marginTop: 0,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  trackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingInfo: {
    marginLeft: 14,
  },
  trackingLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.beigeDark,
    marginVertical: 16,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryDetails: {
    marginLeft: 12,
  },
  deliveryLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  deliveryDate: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '500',
    marginTop: 2,
  },
  addressCard: {
    margin: SIZES.padding,
    marginTop: 0,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  itemsCard: {
    margin: SIZES.padding,
    marginTop: 0,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  orderItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.beigeDark,
  },
  itemImage: {
    width: 60,
    height: 75,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.beige,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  itemDetails: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  itemQty: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gold,
    alignSelf: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.black,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  emailNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    padding: 16,
    backgroundColor: COLORS.beige,
    borderRadius: SIZES.radius,
    gap: 12,
  },
  emailText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.gray,
    lineHeight: 20,
  },
  emailAddress: {
    color: COLORS.black,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: SIZES.padding,
    paddingBottom: 34,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
    gap: 12,
  },
  trackBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: COLORS.beige,
    borderRadius: SIZES.radius,
    gap: 8,
  },
  trackBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
  },
  continueBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
    gap: 8,
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default OrderSuccessScreen;
