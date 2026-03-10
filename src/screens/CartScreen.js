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
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
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
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('cart.myCart')}</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="bag-outline" size={64} color={COLORS.goldMuted} />
          </View>
          <Text style={styles.emptyTitle}>{t('cart.emptyCart')}</Text>
          <Text style={styles.emptySubtitle}>
            {t('cart.emptyCartSubtitle')}
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('Catalog')}
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
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('cart.myCart')}</Text>
        <Text style={styles.itemCount}>{cartItems.length} {t('common.items')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.cartItems}>
          {cartItems.map((item) => (
            <View key={item.cartId} style={styles.cartItem}>
              <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemDetails}>
                  {item.selectedColor} · {item.selectedSize}
                </Text>
                <Text style={styles.itemPrice}>
                  ${item.price.toLocaleString()}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={16} color={COLORS.black} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={16} color={COLORS.black} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeFromCart(item.cartId)}
                >
                  <Ionicons name="trash-outline" size={18} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Code */}
        <View style={styles.promoSection}>
          <TouchableOpacity style={styles.promoBtn}>
            <Ionicons name="pricetag-outline" size={20} color={COLORS.gold} />
            <Text style={styles.promoText}>Add Promo Code</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>{t('checkout.orderSummary')}</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
            <Text style={styles.summaryValue}>${subtotal.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.shipping')}</Text>
            <Text style={styles.summaryValueGreen}>{t('cart.freeShipping')}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{t('cart.total')}</Text>
            <Text style={styles.totalValue}>${total.toLocaleString()}</Text>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>{t('cart.total')}</Text>
          <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutBtnText}>{t('cart.proceedToCheckout')}</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.black,
  },
  itemCount: {
    fontSize: 14,
    color: COLORS.gray,
    width: 44,
    textAlign: 'right',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.gray,
    marginBottom: 32,
  },
  shopBtn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
  },
  shopBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  cartItems: {
    padding: SIZES.padding,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    ...SHADOWS.light,
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.beige,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gold,
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.beige,
    borderRadius: SIZES.radiusSm,
    padding: 4,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
    minWidth: 28,
    textAlign: 'center',
  },
  removeBtn: {
    padding: 8,
  },
  promoSection: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  promoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  promoText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.black,
    marginLeft: 12,
  },
  summarySection: {
    margin: SIZES.padding,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.black,
  },
  summaryValueGreen: {
    fontSize: 14,
    color: COLORS.success,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.beigeDark,
    marginVertical: 12,
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.padding,
    paddingBottom: 34,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.black,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
    gap: 10,
  },
  checkoutBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default CartScreen;
