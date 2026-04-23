import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, updateCartQuantity, getCartTotal } = useApp();
  const { t } = useTranslation();

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('cart.myCart')}</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="bag-outline" size={56} color={COLORS.lightGray} />
          </View>
          <Text style={styles.emptyTitle}>{t('cart.emptyCart')}</Text>
          <Text style={styles.emptySubtitle}>{t('cart.emptyCartSubtitle')}</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.shopBtnText}>{t('cart.startShopping')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('cart.myCart')}</Text>
        <Text style={styles.itemCount}>
          {cartItems.length} {t('common.items')}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cart Items */}
        <View style={styles.cartList}>
          {cartItems.map((item, index) => (
            <View
              key={item.cartId}
              style={[styles.cartItem, index === cartItems.length - 1 && { borderBottomWidth: 0 }]}
            >
              <Image
                source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                style={styles.itemImage}
              />
              <View style={styles.itemBody}>
                <View style={styles.itemTopRow}>
                  <View style={styles.itemMeta}>
                    <Text style={styles.itemBrand} numberOfLines={1}>
                      {item.brand}
                    </Text>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemDetails}>
                      {item.selectedColor} · {item.selectedSize}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeFromCart(item.cartId)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close" size={16} color={COLORS.lightGray} />
                  </TouchableOpacity>
                </View>

                <View style={styles.itemBottomRow}>
                  <View style={styles.qtyPill}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={14} color={COLORS.black} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={14} color={COLORS.black} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemPrice}>
                    ${(item.price * item.quantity).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Code */}
        <TouchableOpacity style={styles.promoRow}>
          <Ionicons name="pricetag-outline" size={18} color={COLORS.gold} />
          <Text style={styles.promoText}>Add Promo Code</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.lightGray} />
        </TouchableOpacity>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{t('checkout.orderSummary')}</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
            <View style={styles.dotLine} />
            <Text style={styles.summaryValue}>${subtotal.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.shipping')}</Text>
            <View style={styles.dotLine} />
            <Text style={styles.summaryValueFree}>{t('cart.freeShipping')}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{t('cart.total')}</Text>
            <View style={styles.dotLine} />
            <Text style={styles.totalValue}>${total.toLocaleString()}</Text>
          </View>
        </View>

        <View style={{ height: 160 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomTotalRow}>
          <Text style={styles.bottomTotalLabel}>{t('cart.total')}</Text>
          <Text style={styles.bottomTotalAmount}>${total.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutBtnText}>{t('cart.proceedToCheckout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // ── Header ──────────────────────────────────────────────
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
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: 0.3,
  },
  itemCount: {
    fontSize: 13,
    color: COLORS.gray,
    width: 44,
    textAlign: 'right',
  },

  // ── Scroll ───────────────────────────────────────────────
  scrollContent: {
    paddingTop: 8,
  },

  // ── Cart Items ────────────────────────────────────────────
  cartList: {
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.beigeDark,
    overflow: 'hidden',
    marginTop: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.beigeDark,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: COLORS.beige,
  },
  itemBody: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemMeta: {
    flex: 1,
    marginRight: 8,
  },
  itemBrand: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.gray,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 3,
  },
  itemDetails: {
    fontSize: 12,
    color: COLORS.gray,
  },
  removeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  qtyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.beige,
    borderRadius: 28,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.black,
    minWidth: 24,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.black,
  },

  // ── Promo Row ─────────────────────────────────────────────
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.beigeDark,
    gap: 10,
  },
  promoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
  },

  // ── Order Summary ─────────────────────────────────────────
  summaryCard: {
    marginHorizontal: SIZES.padding,
    marginTop: 12,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.beigeDark,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 18,
    letterSpacing: 0.2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  dotLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.beigeDark,
    borderStyle: 'dotted',
    marginHorizontal: 8,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 13,
    color: COLORS.black,
    fontWeight: '500',
  },
  summaryValueFree: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.beigeDark,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
  },

  // ── Bottom Bar ────────────────────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.padding,
    paddingTop: 16,
    paddingBottom: 36,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
  },
  bottomTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  bottomTotalLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  bottomTotalAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: -0.5,
  },
  checkoutBtn: {
    height: 56,
    backgroundColor: COLORS.black,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.4,
  },

  // ── Empty State ───────────────────────────────────────────
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  emptyIconWrap: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 36,
    lineHeight: 20,
  },
  shopBtn: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    backgroundColor: COLORS.black,
    borderRadius: 28,
  },
  shopBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});

export default CartScreen;
