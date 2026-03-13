import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product: rawProduct } = route.params;
  const { addToCart, toggleWishlist, isInWishlist, addToRecentlyViewed } = useApp();
  const { t } = useTranslation();
  const { showSuccess, showWarning } = useToast();

  // Add default values for missing properties
  const product = {
    ...rawProduct,
    colors: rawProduct.colors || ['#1A1A1A'],
    colorNames: rawProduct.colorNames || [rawProduct.color || 'Default'],
    sizes: rawProduct.sizes || ['One Size'],
    stores: rawProduct.stores || [{ name: 'Paris Flagship', stock: 3 }, { name: 'London Boutique', stock: 2 }],
    sku: rawProduct.sku || `LX-${rawProduct.id}`,
    stockCount: rawProduct.stockCount || 5,
    collection: rawProduct.collection || 'Classic Collection',
  };

  // Track recently viewed
  useEffect(() => {
    addToRecentlyViewed(rawProduct);
  }, [rawProduct.id]);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showStores, setShowStores] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showCartModal, setShowCartModal] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes[0] !== 'One Size') {
      showWarning('Select Size', 'Please select a size before adding to cart');
      return;
    }
    addToCart(
      product,
      product.colorNames[selectedColor],
      selectedSize || product.sizes[0],
      quantity
    );
    setShowCartModal(true);
  };

  const handleContinueShopping = () => {
    setShowCartModal(false);
    navigation.goBack();
  };

  const handleGoToCart = () => {
    setShowCartModal(false);
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => toggleWishlist(product.id)}
          >
            <Ionicons
              name={isInWishlist(product.id) ? 'heart' : 'heart-outline'}
              size={24}
              color={isInWishlist(product.id) ? COLORS.error : COLORS.black}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="share-outline" size={24} color={COLORS.black} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <Image source={typeof product.image === 'string' ? { uri: product.image } : product.image} style={styles.productImage} />

        <View style={styles.content}>
          {/* Brand & Name */}
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.collection}>{product.collection}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toLocaleString()}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                ${product.originalPrice.toLocaleString()}
              </Text>
            )}
            {product.onSale && (
              <View style={styles.saleBadge}>
                <Text style={styles.saleBadgeText}>
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </Text>
              </View>
            )}
          </View>

          {/* SKU & Stock */}
          <View style={styles.stockRow}>
            <Text style={styles.sku}>SKU: {product.sku}</Text>
            <View style={styles.stockIndicator}>
              <View style={[styles.stockDot, { backgroundColor: product.inStock ? COLORS.success : COLORS.error }]} />
              <Text style={styles.stockText}>
                {product.inStock ? `In Stock (${product.stockCount} left)` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('product.color')}</Text>
            <View style={styles.colorsRow}>
              {product.colors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorBtn,
                    { backgroundColor: color },
                    selectedColor === index && styles.colorBtnActive,
                  ]}
                  onPress={() => setSelectedColor(index)}
                >
                  {selectedColor === index && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={color === '#1A1A1A' || color === '#8B0000' ? COLORS.white : COLORS.black}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.selectedLabel}>Selected: {product.colorNames[selectedColor]}</Text>
          </View>

          {/* Size Selection */}
          {product.sizes[0] !== 'One Size' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('product.size')}</Text>
                <TouchableOpacity>
                  <Text style={styles.sizeGuide}>Size Guide</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sizesRow}>
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeBtn,
                      selectedSize === size && styles.sizeBtnActive,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === size && styles.sizeTextActive,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('cart.quantity')}</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <Ionicons name="remove" size={20} color={COLORS.black} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={COLORS.black} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Store Availability */}
          <TouchableOpacity
            style={styles.storesCard}
            onPress={() => setShowStores(!showStores)}
          >
            <View style={styles.storesHeader}>
              <Ionicons name="location-outline" size={22} color={COLORS.gold} />
              <View style={styles.storesInfo}>
                <Text style={styles.storesTitle}>{t('product.storeAvailability')}</Text>
                <Text style={styles.storesSubtitle}>
                  Available in {product.stores.length} stores
                </Text>
              </View>
              <Ionicons
                name={showStores ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.gray}
              />
            </View>
            {showStores && (
              <View style={styles.storesList}>
                {product.stores.map((store, index) => (
                  <View key={index} style={styles.storeItem}>
                    <Text style={styles.storeName}>{store.name}</Text>
                    <Text style={styles.storeStock}>{store.stock} in stock</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('product.description')}</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.wishlistBtnLarge}
          onPress={() => toggleWishlist(product.id)}
        >
          <Ionicons
            name={isInWishlist(product.id) ? 'heart' : 'heart-outline'}
            size={24}
            color={isInWishlist(product.id) ? COLORS.error : COLORS.black}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
        >
          <Ionicons name="bag-outline" size={20} color={COLORS.white} />
          <Text style={styles.addToCartText}>{t('product.addToCart')}</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Added Modal */}
      <Modal
        visible={showCartModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCartModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cartModal}>
            <View style={styles.cartModalIcon}>
              <Ionicons name="checkmark-circle" size={56} color={COLORS.gold} />
            </View>
            <Text style={styles.cartModalTitle}>Added to Cart!</Text>
            <Text style={styles.cartModalMessage}>
              {product.name} has been added to your bag
            </Text>

            <View style={styles.cartModalButtons}>
              <TouchableOpacity
                style={styles.continueShoppingBtn}
                onPress={handleContinueShopping}
              >
                <Ionicons name="arrow-back" size={18} color={COLORS.black} />
                <Text style={styles.continueShoppingText}>Continue Shopping</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.goToCartBtn}
                onPress={handleGoToCart}
              >
                <Ionicons name="bag" size={18} color={COLORS.white} />
                <Text style={styles.goToCartText}>Go to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 54,
    zIndex: 10,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  productImage: {
    width: '100%',
    height: 420,
    backgroundColor: COLORS.beige,
  },
  content: {
    padding: SIZES.padding,
  },
  brand: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gold,
    letterSpacing: 2,
    marginBottom: 6,
  },
  name: {
    fontSize: 26,
    fontWeight: '500',
    color: COLORS.black,
  },
  collection: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  price: {
    fontSize: 26,
    fontWeight: '600',
    color: COLORS.black,
  },
  originalPrice: {
    fontSize: 18,
    color: COLORS.gray,
    textDecorationLine: 'line-through',
  },
  saleBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
  },
  sku: {
    fontSize: 13,
    color: COLORS.gray,
  },
  stockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 12,
  },
  sizeGuide: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '500',
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorBtnActive: {
    borderColor: COLORS.gold,
  },
  selectedLabel: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 10,
  },
  sizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeBtn: {
    minWidth: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusSm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.beigeDark,
  },
  sizeBtnActive: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  sizeTextActive: {
    color: COLORS.white,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  quantityBtn: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.beigeDark,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
    minWidth: 30,
    textAlign: 'center',
  },
  storesCard: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  storesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storesInfo: {
    flex: 1,
    marginLeft: 12,
  },
  storesTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
  },
  storesSubtitle: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  storesList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
  },
  storeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  storeName: {
    fontSize: 14,
    color: COLORS.black,
  },
  storeStock: {
    fontSize: 14,
    color: COLORS.success,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingBottom: 34,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
    gap: 12,
  },
  wishlistBtnLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
    gap: 10,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  // Cart Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartModal: {
    width: '85%',
    backgroundColor: '#FFF9F0',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  cartModalIcon: {
    marginBottom: 16,
  },
  cartModalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  cartModalMessage: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  cartModalButtons: {
    width: '100%',
    gap: 12,
  },
  continueShoppingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    backgroundColor: COLORS.beige,
    borderRadius: SIZES.radius,
    gap: 8,
  },
  continueShoppingText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
  },
  goToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
    gap: 8,
  },
  goToCartText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default ProductDetailsScreen;
