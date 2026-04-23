import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
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

const FILTER_TABS = [
  { id: 'all', label: 'Trending' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'jackets', label: 'Jackets' },
  { id: 'bags', label: 'Bags' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'jewelry', label: 'Jewelry' },
  { id: 'watches', label: 'Watches' },
];

const CLOTHING_TABS = ['men', 'women', 'tops', 'bottoms', 'jackets', 'clothing'];

const HomeScreen = ({ navigation }) => {
  const { user, getCartCount, toggleWishlist, isInWishlist, products } = useApp();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeBanner, setActiveBanner] = useState(0);
  const listRef = useRef(null);
  const bannerRef = useRef(null);
  useScrollToTop(listRef);

  const catFilter = CLOTHING_TABS.includes(activeTab) ? 'clothing' : activeTab;

  const filtered = products.filter((p) => {
    const matchCat = catFilter === 'all' || p.category === catFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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
          <TouchableOpacity style={styles.iconBtn}>
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
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews
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
                      <View style={styles.bannerLine} />
                    </View>
                    <TouchableOpacity
                      style={styles.shopNowBtn}
                      onPress={() => navigation.navigate('Shop')}
                    >
                      <Text style={styles.shopNowText}>Shop now →</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.dots}>
                {BANNERS.map((_, i) => (
                  <View key={i} style={[styles.dot, activeBanner === i && styles.dotActive]} />
                ))}
              </View>
            </View>

            {/* Filter Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsWrap} contentContainerStyle={styles.tabsContent}>
              {FILTER_TABS.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.tab, activeTab === t.id && styles.tabActive]}
                  onPress={() => setActiveTab(t.id)}
                >
                  <Text style={[styles.tabText, activeTab === t.id && styles.tabTextActive]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Brands */}
            <View style={styles.brandsSection}>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>{t('home.brands')}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                  <Text style={styles.seeAll}>Show All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {featuredBrands.map((b) => (
                  <TouchableOpacity
                    key={b.id}
                    style={styles.brandCard}
                    onPress={() => navigation.navigate('Shop', { selectedBrand: b.id })}
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

            {/* Top Trends header */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>
                {activeTab === 'all' ? 'Top Trends' : FILTER_TABS.find(f => f.id === activeTab)?.label}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
                <Text style={styles.seeAll}>Show All</Text>
              </TouchableOpacity>
            </View>
          </>
        }
      />

      {/* AI Stylist FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AIStylist')} activeOpacity={0.85}>
        <View style={styles.fabInner}><Ionicons name="sparkles" size={22} color="#fff" /></View>
        <Text style={styles.fabText}>{t('home.aiStylist')}</Text>
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
  logo: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', letterSpacing: 4 },
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
  bannerLine: { width: 44, height: 1, backgroundColor: COLORS.gold, marginTop: 16 },
  shopNowBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shopNowText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#DDD' },
  dotActive: { backgroundColor: '#1A1A1A', width: 20, borderRadius: 3 },
  // Tabs
  tabsWrap: { marginBottom: 20, maxHeight: 44 },
  tabsContent: { paddingHorizontal: SIZES.padding, gap: 8, alignItems: 'center' },
  tab: { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 20, backgroundColor: '#F5F0EB' },
  tabActive: { backgroundColor: '#1A1A1A' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#666' },
  tabTextActive: { color: '#fff' },
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
  brandCard: { width: 130, height: 160, marginLeft: SIZES.padding, borderRadius: 12, overflow: 'hidden' },
  brandImg: { width: '100%', height: '100%' },
  brandOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  brandName: { fontSize: 12, fontWeight: '700', color: '#fff', letterSpacing: 1.5 },
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingRight: 18,
    borderWidth: 1,
    borderColor: '#E8E0D8',
    ...SHADOWS.medium,
  },
  fabInner: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center' },
  fabText: { marginLeft: 10, fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
});

export default HomeScreen;
