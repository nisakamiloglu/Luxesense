import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product: rawProduct } = route.params;
  const { addToCart, toggleWishlist, isInWishlist, addToRecentlyViewed, trackProductView } = useApp();
  const { t } = useTranslation();
  const { showSuccess, showWarning } = useToast();
  const viewStartRef = React.useRef(Date.now());

  // Add default values for missing properties
  const product = {
    ...rawProduct,
    colors: rawProduct.colors || ['#1A1A1A'],
    colorNames: rawProduct.colorNames || [rawProduct.color || 'Default'],
    sizes: rawProduct.sizes || ['One Size'],
    stores: rawProduct.stores || [
      { name: 'Paris Flagship', stock: 3 },
      { name: 'London Boutique', stock: 2 },
    ],
    sku: rawProduct.sku || `LX-${rawProduct.id}`,
    stockCount: rawProduct.stockCount || 5,
    collection: rawProduct.collection || 'Classic Collection',
  };

  // Track recently viewed + 30s view timer for LIS behavioral signal
  useEffect(() => {
    addToRecentlyViewed(rawProduct);
    viewStartRef.current = Date.now();
    return () => {
      const elapsed = (Date.now() - viewStartRef.current) / 1000;
      trackProductView(rawProduct.id, elapsed);
    };
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

  const discountPct = product.onSale && product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Full-screen product image */}
        <View style={styles.imageWrap}>
          <Image
            source={typeof product.image === 'string' ? { uri: product.image } : product.image}
            style={styles.productImage}
            resizeMode="cover"
          />

          {/* Floating header (absolute) */}
          <View style={styles.floatingHeader}>
            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.black} />
            </TouchableOpacity>

            <View style={styles.floatingRight}>
              <TouchableOpacity
                style={styles.floatingBtn}
                onPress={() => toggleWishlist(product.id)}
              >
                <Ionicons
                  name={isInWishlist(product.id) ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isInWishlist(product.id) ? COLORS.error : COLORS.black}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.floatingBtn}>
                <Ionicons name="share-outline" size={20} color={COLORS.black} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sale badge over image */}
          {product.onSale && (
            <View style={styles.imageSaleBadge}>
              <Text style={styles.imageSaleBadgeText}>−{discountPct}%</Text>
            </View>
          )}
        </View>

        {/* White content area */}
        <View style={styles.content}>
          {/* Brand */}
          <Text style={styles.brand}>{product.brand}</Text>

          {/* Name */}
          <Text style={styles.name}>{product.name}</Text>

          {/* Price row */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toLocaleString()}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                ${product.originalPrice.toLocaleString()}
              </Text>
            )}
            {product.onSale && (
              <View style={styles.saleBadge}>
                <Text style={styles.saleBadgeText}>SALE</Text>
              </View>
            )}
          </View>

          {/* SKU + Stock row */}
          <View style={styles.metaRow}>
            <Text style={styles.skuText}>SKU: {product.sku}</Text>
            <View style={styles.stockRow}>
              <View
                style={[
                  styles.stockDot,
                  { backgroundColor: product.inStock ? COLORS.success : COLORS.error },
                ]}
              />
              <Text style={styles.stockText}>
                {product.inStock ? `${product.stockCount} left` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {/* Thin divider */}
          <View style={styles.divider} />

          {/* Color selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{t('product.color')}</Text>
              <Text style={styles.selectedLabel}>{product.colorNames[selectedColor]}</Text>
            </View>
            <View style={styles.colorsRow}>
              {product.colors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedColor === index && styles.colorCircleActive,
                  ]}
                  onPress={() => setSelectedColor(index)}
                >
                  {selectedColor === index && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={color === '#1A1A1A' || color === '#8B0000' ? COLORS.white : COLORS.black}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Size selection */}
          {product.sizes[0] !== 'One Size' && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>{t('product.size')}</Text>
                <TouchableOpacity>
                  <Text style={styles.sizeGuideText}>Size Guide</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sizesRow}>
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizePill,
                      selectedSize === size && styles.sizePillActive,
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
            <View style={styles.qtyPill}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <Ionicons name="remove" size={18} color={COLORS.black} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={18} color={COLORS.black} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Store Availability collapsible */}
          <TouchableOpacity
            style={styles.storesCard}
            onPress={() => setShowStores(!showStores)}
            activeOpacity={0.75}
          >
            <View style={styles.storesHeader}>
              <Ionicons name="location-outline" size={20} color={COLORS.gold} />
              <View style={styles.storesInfo}>
                <Text style={styles.storesTitle}>{t('product.storeAvailability')}</Text>
                <Text style={styles.storesSubtitle}>
                  Available in {product.stores.length} stores
                </Text>
              </View>
              <Ionicons
                name={showStores ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={COLORS.gray}
              />
            </View>
            {showStores && (
              <View style={styles.storesList}>
                {product.stores.map((store, index) => (
                  <View
                    key={index}
                    style={[
                      styles.storeItem,
                      index < product.stores.length - 1 && styles.storeItemBorder,
                    ]}
                  >
                    <Text style={styles.storeName}>{store.name}</Text>
                    <Text style={styles.storeStock}>{store.stock} in stock</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>

          {/* Description */}
          {product.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('product.description')}</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          ) : null}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(product.id)}
        >
          <Ionicons
            name={isInWishlist(product.id) ? 'heart' : 'heart-outline'}
            size={22}
            color={isInWishlist(product.id) ? COLORS.error : COLORS.black}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addToBagBtn}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Ionicons name="bag-outline" size={18} color={COLORS.white} />
          <Text style={styles.addToBagText}>{t('product.addToCart')}</Text>
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
            {/* Checkmark */}
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={32} color={COLORS.white} />
            </View>

            <Text style={styles.cartModalTitle}>Added to Bag</Text>
            <Text style={styles.cartModalMessage}>
              {product.name} has been added to your bag
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handleContinueShopping}
              >
                <Text style={styles.continueBtnText}>Continue Shopping</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.goToCartBtn}
                onPress={handleGoToCart}
              >
                <Text style={styles.goToCartText}>Go to Bag</Text>
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
    backgroundColor: COLORS.white,
  },

  // ── Image ────────────────────────────────────────────────
  imageWrap: {
    position: 'relative',
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: 440,
    backgroundColor: COLORS.beige,
  },

  // ── Floating Header ───────────────────────────────────────
  floatingHeader: {
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
  floatingBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingRight: {
    flexDirection: 'row',
    gap: 10,
  },
  imageSaleBadge: {
    position: 'absolute',
    bottom: 16,
    left: SIZES.padding,
    backgroundColor: COLORS.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 28,
  },
  imageSaleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  // ── Content ───────────────────────────────────────────────
  content: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 24,
    backgroundColor: COLORS.white,
  },
  brand: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.gray,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    lineHeight: 30,
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  price: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: -0.5,
  },
  originalPrice: {
    fontSize: 16,
    color: COLORS.lightGray,
    textDecorationLine: 'line-through',
  },
  saleBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 28,
  },
  saleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  skuText: {
    fontSize: 12,
    color: COLORS.lightGray,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.beigeDark,
    marginBottom: 8,
  },

  // ── Sections ──────────────────────────────────────────────
  section: {
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.black,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  selectedLabel: {
    fontSize: 13,
    color: COLORS.gray,
  },
  sizeGuideText: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: '500',
  },

  // ── Color Circles ─────────────────────────────────────────
  colorsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleActive: {
    borderWidth: 3,
    borderColor: COLORS.black,
  },

  // ── Size Pills ────────────────────────────────────────────
  sizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizePill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: COLORS.beige,
    borderRadius: 28,
    alignItems: 'center',
  },
  sizePillActive: {
    backgroundColor: COLORS.black,
  },
  sizeText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.black,
  },
  sizeTextActive: {
    color: COLORS.white,
  },

  // ── Quantity ──────────────────────────────────────────────
  qtyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.beige,
    borderRadius: 28,
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 4,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
    minWidth: 32,
    textAlign: 'center',
  },

  // ── Store Availability ────────────────────────────────────
  storesCard: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.beige,
    borderRadius: 12,
  },
  storesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storesInfo: {
    flex: 1,
  },
  storesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  storesSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  storesList: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
  },
  storeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
  },
  storeItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.beigeDark,
  },
  storeName: {
    fontSize: 13,
    color: COLORS.black,
  },
  storeStock: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '500',
  },

  // ── Description ───────────────────────────────────────────
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  // ── Bottom Bar ────────────────────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 14,
    paddingBottom: 36,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
    gap: 12,
  },
  wishlistBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToBagBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: COLORS.black,
    borderRadius: 28,
    gap: 8,
  },
  addToBagText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.3,
  },

  // ── Cart Modal ────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  cartModal: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cartModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  cartModalMessage: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  modalActions: {
    width: '100%',
    gap: 10,
  },
  continueBtn: {
    height: 52,
    backgroundColor: COLORS.beige,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  goToCartBtn: {
    height: 52,
    backgroundColor: COLORS.black,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goToCartText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default ProductDetailsScreen;
