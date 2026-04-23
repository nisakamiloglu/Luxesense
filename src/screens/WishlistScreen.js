import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '@react-navigation/native';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');
const CARD_W = (width - 20 * 2 - 12) / 2;

const WishlistScreen = ({ navigation }) => {
  const { wishlist, toggleWishlist, getCartCount, products } = useApp();
  const { t } = useTranslation();
  const listRef = useRef(null);
  useScrollToTop(listRef);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const renderProduct = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.productCard, { marginLeft: index % 2 === 0 ? 20 : 12 }]}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={styles.productImage}
        />
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggleWishlist(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="heart" size={18} color="#E53935" />
        </TouchableOpacity>
        {item.onSale && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>SALE</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.brandName}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>${item.price.toLocaleString()}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>${item.originalPrice.toLocaleString()}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('wishlist.title')}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="bag-outline" size={22} color="#1A1A1A" />
            {getCartCount() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getCartCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {wishlistProducts.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="heart-outline" size={52} color="#C4C4C4" />
          </View>
          <Text style={styles.emptyTitle}>{t('wishlist.emptyWishlist')}</Text>
          <Text style={styles.emptySubtitle}>{t('wishlist.emptyWishlistSubtitle')}</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.shopBtnText}>{t('wishlist.startShopping')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.itemCount}>
            {wishlistProducts.length} {t('common.items')}
          </Text>
          <FlatList
            ref={listRef}
            data={wishlistProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.productsContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#1A1A1A',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  itemCount: {
    fontSize: 13,
    color: '#8A8A8A',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  // Product grid
  productsContainer: {
    paddingRight: 20,
    paddingBottom: 100,
  },
  productCard: {
    width: CARD_W,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_W * 1.25,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saleBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  saleBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  productInfo: {
    marginTop: 10,
    paddingHorizontal: 2,
  },
  brandName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8A8A8A',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  originalPrice: {
    fontSize: 12,
    color: '#8A8A8A',
    textDecorationLine: 'line-through',
  },
  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8A8A8A',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  shopBtn: {
    paddingHorizontal: 36,
    paddingVertical: 15,
    backgroundColor: '#1A1A1A',
    borderRadius: 28,
  },
  shopBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
});

export default WishlistScreen;
