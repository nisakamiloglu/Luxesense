import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { featuredBrands } from '../constants/mockData';

const { width } = Dimensions.get('window');
const CARD_W = (width - SIZES.padding * 2 - 12) / 2;

const BANNERS = [
  { id: 1, image: require('../images/Banner/banner1.webp'), top: 'THIS SEASON', bottom: 'Must-Haves' },
  { id: 2, image: require('../images/Banner/banner6.webp'), top: "EDITOR'S PICK", bottom: 'Curated Trends' },
  { id: 3, image: require('../images/Hermes/hermes1.webp'), top: 'SIGNATURE', bottom: 'The Essentials' },
];

const HomeScreen = ({ navigation }) => {
  const { user, getCartCount, toggleWishlist, isInWishlist, products, recentlyViewed } = useApp();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const listRef = useRef(null);
  const bannerRef = useRef(null);
  useScrollToTop(listRef);

  const getPersonalizedProducts = () => {
    const quizBrands = user.quizBrands;
    const quizBudgetMax = user.quizBudgetMax;

    let base = products;

    // Apply search filter
    if (search) {
      base = base.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Personalize by quiz brand selections
    if (quizBrands && quizBrands.length > 0) {
      const brandFiltered = base.filter(p =>
        quizBrands.some(b => p.brand.toUpperCase() === b)
      );

      if (brandFiltered.length > 0) {
        // Sort: budget-appropriate products first, rest after
        if (quizBudgetMax) {
          return [
            ...brandFiltered.filter(p => p.price <= quizBudgetMax),
            ...brandFiltered.filter(p => p.price > quizBudgetMax),
          ].slice(0, 8);
        }
        return brandFiltered.slice(0, 8);
      }
    }

    return base.slice(0, 8);
  };

  const filtered = getPersonalizedProducts();

  const onBannerScroll = (e) => {
    setActiveBanner(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const renderProduct = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.productCard, { marginLeft: index % 2 === 0 ? 0 : 12 }]}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      activeOpacity={0.9}
    >
      <View style={styles.imgBox}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={styles.productImg}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.heart} onPress={() => toggleWishlist(item.id)}>
          <Ionicons
            name={isInWishlist(item.id) ? 'heart' : 'heart-outline'}
            size={18}
            color={isInWishlist(item.id) ? '#E53935' : '#1A1A1A'}
          />
        </TouchableOpacity>
        {item.onSale && <View style={styles.saleBadge}><Text style={styles.saleBadgeText}>SALE</Text></View>}
      </View>
      <View style={styles.productMeta}>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price.toLocaleString()}</Text>
          {item.originalPrice && <Text style={styles.oldPrice}>${item.originalPrice.toLocaleString()}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>LUXESENSE</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="bag-outline" size={22} color="#1A1A1A" />
            {getCartCount() > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{getCartCount()}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#AAA" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Product"
            placeholderTextColor="#AAA"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => search.trim() && navigation.navigate('Shop', { searchQuery: search })}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#AAA" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={filtered}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={21}
        removeClippedSubviews={false}
        ListHeaderComponent={
          <>
            {/* Banner */}
            <View style={styles.bannerWrap}>
              <ScrollView
                ref={bannerRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onBannerScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
              >
                {BANNERS.map((b) => (
                  <TouchableOpacity
                    key={b.id}
                    style={styles.banner}
                    onPress={() => navigation.navigate('Shop')}
                    activeOpacity={0.92}
                  >
                    <Image source={b.image} style={styles.bannerImg} resizeMode="cover" />
                    <View style={styles.bannerOverlay}>
                      <Text style={styles.bannerTop}>{b.top}</Text>
                      <Text style={styles.bannerBottom}>{b.bottom}</Text>
                      <TouchableOpacity
                        style={styles.shopNowBtn}
                        onPress={() => navigation.navigate('Shop')}
                      >
                        <Text style={styles.shopNowText}>Shop now →</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.dots}>
                {BANNERS.map((_, i) => (
                  <View key={i} style={[styles.dot, activeBanner === i && styles.dotActive]} />
                ))}
              </View>
            </View>

            {/* Brands */}
            <View style={styles.brandsSection}>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>{t('home.brands')}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                  <Text style={styles.seeAll}>Show All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SIZES.padding, gap: 12 }}>
                {featuredBrands.map((b) => (
                  <TouchableOpacity
                    key={b.id}
                    style={styles.brandCard}
                    onPress={() => navigation.navigate('Shop', { selectedBrand: b.id, fromHome: true })}
                  >
                    <Image
                      source={typeof b.image === 'string' ? { uri: b.image } : b.image}
                      style={styles.brandImg}
                      resizeMode="cover"
                    />
                    <View style={styles.brandOverlay}>
                      <Text style={styles.brandName}>{b.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Picked for you header */}
            <Text style={styles.youMayLike}>
              {user.quizBrands && user.quizBrands.length > 0 ? 'Picked for you' : 'New Arrivals'}
            </Text>
          </>
        }
      />

      {/* AI Stylist FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AIStylist')} activeOpacity={0.85}>
        <Ionicons name="sparkles" size={22} color={COLORS.gold} />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 12,
  },
  logo: { fontSize: 24, fontWeight: '300', color: '#1A1A1A', letterSpacing: 5 },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F0EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#1A1A1A',
    borderRadius: 7,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  searchWrap: { paddingHorizontal: SIZES.padding, marginBottom: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F0EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },
  listContent: { paddingHorizontal: SIZES.padding, paddingBottom: 100 },
  // Banner
  bannerWrap: { marginBottom: 20, marginHorizontal: -SIZES.padding },
  banner: {
    width: width,
    height: 240,
    overflow: 'hidden',
  },
  bannerImg: { width: '100%', height: '100%' },
  bannerOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.36)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTop: { fontSize: 11, color: '#fff', letterSpacing: 5, fontWeight: '500' },
  bannerBottom: { fontSize: 30, color: '#fff', fontWeight: '300', fontStyle: 'italic', letterSpacing: 2, marginTop: 4 },
  bannerLine: { width: 0, height: 0 },
  shopNowBtn: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shopNowText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#DDD' },
  dotActive: { backgroundColor: '#1A1A1A', width: 20, borderRadius: 3 },
  youMayLike: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 14,
    textAlign: 'left',
  },
  // Notifications modal
  notifBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  notifSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  notifHandle: { width: 36, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  notifTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  notifCard: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', gap: 14, alignItems: 'center' },
  notifImgWrap: { width: 72, height: 90, borderRadius: 10, overflow: 'hidden', backgroundColor: '#F5F0EB' },
  notifImg: { width: '100%', height: '100%' },
  notifInfo: { flex: 1, gap: 4 },
  notifLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  notifLabel: { fontSize: 9, fontWeight: '700', color: COLORS.gold, letterSpacing: 1.2 },
  notifBrowsed: { fontSize: 12, color: '#888' },
  notifSuggested: { fontSize: 13, fontWeight: '500', color: '#1A1A1A' },
  notifPrice: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  // Brands
  brandsSection: { marginBottom: 24, marginHorizontal: -SIZES.padding },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  seeAll: { fontSize: 13, color: '#888', fontWeight: '500' },
  brandCard: { width: 130, height: 160, borderRadius: 12, overflow: 'hidden' },
  brandImg: { width: '100%', height: '100%' },
  brandOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(245,240,235,0.88)',
  },
  brandName: { fontSize: 12, fontWeight: '700', color: '#1A1A1A', letterSpacing: 0.5 },
  // Product Grid
  productCard: { width: CARD_W, marginBottom: 20 },
  imgBox: { width: '100%', height: CARD_W * 1.3, borderRadius: 14, overflow: 'hidden', backgroundColor: '#F5F0EB' },
  productImg: { width: '100%', height: '100%' },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  saleBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  saleBadgeText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  productMeta: { marginTop: 10 },
  productBrand: { fontSize: 10, fontWeight: '700', color: '#999', letterSpacing: 0.5, textTransform: 'uppercase' },
  productName: { fontSize: 14, fontWeight: '500', color: '#1A1A1A', marginTop: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  price: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  oldPrice: { fontSize: 12, color: '#AAA', textDecorationLine: 'line-through' },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: SIZES.padding,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(245,240,235,0.92)',
    borderWidth: 1,
    borderColor: '#E8E0D8',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
});

export default HomeScreen;
