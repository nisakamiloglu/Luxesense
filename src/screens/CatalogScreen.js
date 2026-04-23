import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { brands, priceRanges } from '../constants/mockData';

const { width } = Dimensions.get('window');
const CARD_W = (width - 20 * 2 - 12) / 2;

const WOMEN_CATEGORIES = [
  { id: 'clothing', name: 'Clothing', image: require('../images/Banner/banner2.webp') },
  { id: 'bags', name: 'Bags', image: require('../images/Hermes/birkin.webp') },
  { id: 'jewelry', name: 'Fine Jewelry', image: require('../images/Banner/jewelry.webp') },
  { id: 'accessories', name: 'Accessories', image: require('../images/Hermes/twilly.webp') },
];

const MEN_CATEGORIES = [
  { id: 'watches', name: 'Watches', image: require('../images/Banner/banner5.webp') },
  { id: 'accessories', name: 'Accessories', image: require('../images/Hermes/twilly.webp') },
];

const FILTER_TABS = [
  { id: 'all', label: 'Everything' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'bags', label: 'Bags' },
  { id: 'jewelry', label: 'Jewelry' },
  { id: 'watches', label: 'Watches' },
  { id: 'accessories', label: 'Accessories' },
];

const getCategoryName = (id) => {
  const all = [...WOMEN_CATEGORIES, ...MEN_CATEGORIES];
  return all.find(c => c.id === id)?.name || id;
};

const CatalogScreen = ({ navigation, route }) => {
  const { toggleWishlist, isInWishlist, getCartCount, products } = useApp();
  const { t } = useTranslation();

  const [activeCategory, setActiveCategory] = useState(() => route?.params?.selectedCategory || 'all');
  const [activeBrand, setActiveBrand] = useState(() => route?.params?.selectedBrand || 'all');
  const [activePriceRange, setActivePriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [openSection, setOpenSection] = useState(null); // 'women' | 'men' | null
  const listRef = useRef(null);
  useScrollToTop(listRef);

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.selectedBrand) {
        setActiveBrand(route.params.selectedBrand);
        setActiveCategory('all');
        navigation.setParams({ selectedBrand: undefined });
      }
      if (route?.params?.selectedCategory) {
        setActiveCategory(route.params.selectedCategory);
        setActiveBrand('all');
        navigation.setParams({ selectedCategory: undefined });
      }
    }, [route?.params?.selectedBrand, route?.params?.selectedCategory])
  );

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesBrand = activeBrand === 'all' || product.brand === activeBrand;
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const priceRange = priceRanges.find(r => r.id === activePriceRange);
    const matchesPrice = !priceRange || (product.price >= priceRange.min && product.price <= priceRange.max);
    return matchesCategory && matchesBrand && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_low': return a.price - b.price;
      case 'price_high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const isExploreView = activeCategory === 'all' && activeBrand === 'all' && !searchQuery;

  const getPageTitle = () => {
    if (activeBrand !== 'all') return brands.find(b => b.id === activeBrand)?.name || activeBrand;
    if (activeCategory !== 'all') return getCategoryName(activeCategory);
    return 'All Products';
  };

  const handleBack = () => {
    setActiveCategory('all');
    setActiveBrand('all');
    setSearchQuery('');
    setActivePriceRange('all');
    setSortBy('featured');
  };

  const clearAllFilters = () => {
    setActiveBrand('all');
    setActivePriceRange('all');
    setSortBy('featured');
    setActiveCategory('all');
  };

  const selectCategory = (catId) => {
    setActiveCategory(catId);
    setOpenSection(null);
  };

  const renderProduct = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.productCard, { marginLeft: index % 2 === 0 ? 20 : 12 }]}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      activeOpacity={0.88}
    >
      <View style={styles.imageContainer}>
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={styles.productImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isInWishlist(item.id) ? 'heart' : 'heart-outline'}
            size={16}
            color={isInWishlist(item.id) ? '#E53935' : '#1A1A1A'}
          />
        </TouchableOpacity>
        {item.onSale && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>SALE</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.brandLabel}>{item.brand}</Text>
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

  // ── EXPLORE VIEW ──────────────────────────────────────────
  if (isExploreView) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.exploreHeader}>
          <Text style={styles.exploreTitle}>Explore</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="bag-outline" size={22} color="#1A1A1A" />
            {getCartCount() > 0 && (
              <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{getCartCount()}</Text></View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.accordionContainer}>
          {/* ── WOMEN'S ──────────────────── */}
          <TouchableOpacity
            style={styles.genderCard}
            onPress={() => setOpenSection(openSection === 'women' ? null : 'women')}
            activeOpacity={0.9}
          >
            <Image source={require('../images/Banner/banner2.webp')} style={styles.genderCardImg} resizeMode="cover" />
            <View style={styles.genderCardOverlay} />
            <View style={styles.genderCardContent}>
              <Text style={styles.genderCardSub}>COLLECTION</Text>
              <Text style={styles.genderCardTitle}>Women's</Text>
            </View>
            <View style={styles.genderCardChevron}>
              <Ionicons
                name={openSection === 'women' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="rgba(255,255,255,0.85)"
              />
            </View>
          </TouchableOpacity>

          {openSection === 'women' && (
            <View style={styles.subGrid}>
              {WOMEN_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.subCard}
                  onPress={() => selectCategory(cat.id)}
                  activeOpacity={0.88}
                >
                  <Image source={cat.image} style={styles.subCardImg} resizeMode="cover" />
                  <View style={styles.subCardOverlay} />
                  <Text style={styles.subCardName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── MEN'S ────────────────────── */}
          <TouchableOpacity
            style={styles.genderCard}
            onPress={() => setOpenSection(openSection === 'men' ? null : 'men')}
            activeOpacity={0.9}
          >
            <Image source={require('../images/Banner/banner4.webp')} style={styles.genderCardImg} resizeMode="cover" />
            <View style={styles.genderCardOverlay} />
            <View style={styles.genderCardContent}>
              <Text style={styles.genderCardSub}>COLLECTION</Text>
              <Text style={styles.genderCardTitle}>Men's</Text>
            </View>
            <View style={styles.genderCardChevron}>
              <Ionicons
                name={openSection === 'men' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="rgba(255,255,255,0.85)"
              />
            </View>
          </TouchableOpacity>

          {openSection === 'men' && (
            <View style={styles.subGrid}>
              {MEN_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.subCard}
                  onPress={() => selectCategory(cat.id)}
                  activeOpacity={0.88}
                >
                  <Image source={cat.image} style={styles.subCardImg} resizeMode="cover" />
                  <View style={styles.subCardOverlay} />
                  <Text style={styles.subCardName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  // ── PRODUCT LISTING VIEW ──────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.listHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowFilterModal(true)}>
            <Ionicons name="options-outline" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="bag-outline" size={22} color="#1A1A1A" />
            {getCartCount() > 0 && (
              <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{getCartCount()}</Text></View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabPill, activeCategory === tab.id && styles.tabPillActive]}
            onPress={() => setActiveCategory(tab.id)}
          >
            <Text style={[styles.tabText, activeCategory === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        ref={listRef}
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{getPageTitle()}</Text>
            <Text style={styles.sectionCount}>{filteredProducts.length} items found</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#C4C4C4" />
            <Text style={styles.emptyTitle}>{t('catalog.noProducts')}</Text>
            <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearAllFilters}>
              <Text style={styles.clearFiltersBtnText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal visible={showFilterModal} animationType="slide" transparent onRequestClose={() => setShowFilterModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('common.filter')}</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={22} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t('catalog.sortBy')}</Text>
                <View style={styles.chipRow}>
                  {[
                    { id: 'featured', label: t('catalog.popular') },
                    { id: 'price_low', label: t('catalog.priceLowHigh') },
                    { id: 'price_high', label: t('catalog.priceHighLow') },
                    { id: 'name', label: 'Name' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[styles.chip, sortBy === option.id && styles.chipActive]}
                      onPress={() => setSortBy(option.id)}
                    >
                      <Text style={[styles.chipText, sortBy === option.id && styles.chipTextActive]}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t('catalog.brand')}</Text>
                <View style={styles.chipRow}>
                  {brands.map((brand) => (
                    <TouchableOpacity
                      key={brand.id}
                      style={[styles.chip, activeBrand === brand.id && styles.chipActive]}
                      onPress={() => setActiveBrand(brand.id)}
                    >
                      <Text style={[styles.chipText, activeBrand === brand.id && styles.chipTextActive]}>{brand.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={[styles.filterSection, { borderBottomWidth: 0 }]}>
                <Text style={styles.filterSectionTitle}>{t('catalog.priceRange')}</Text>
                <View style={styles.chipRow}>
                  {priceRanges.map((range) => (
                    <TouchableOpacity
                      key={range.id}
                      style={[styles.chip, activePriceRange === range.id && styles.chipActive]}
                      onPress={() => setActivePriceRange(range.id)}
                    >
                      <Text style={[styles.chipText, activePriceRange === range.id && styles.chipTextActive]}>{range.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearBtn} onPress={clearAllFilters}>
                <Text style={styles.clearBtnText}>{t('catalog.clearAll')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilterModal(false)}>
                <Text style={styles.applyBtnText}>{t('catalog.showResults')} ({filteredProducts.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // ── Explore Header ──────────────────────────────────────
  exploreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  exploreTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },

  // ── Accordion / Gender cards ────────────────────────────
  accordionContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  genderCard: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  genderCardImg: {
    width: '100%',
    height: '100%',
  },
  genderCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  genderCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 22,
  },
  genderCardSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 3,
    marginBottom: 5,
  },
  genderCardTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  genderCardChevron: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },

  // ── Sub-category grid ───────────────────────────────────
  subGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 4,
  },
  subCard: {
    width: (width - 40 - 10) / 2,
    height: 110,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  subCardImg: {
    width: '100%',
    height: '100%',
  },
  subCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  subCardName: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },

  // ── List Header ─────────────────────────────────────────
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
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
  cartBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },

  // ── Filter Tabs ─────────────────────────────────────────
  tabsContainer: {
    maxHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
  },
  tabPill: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 28,
    backgroundColor: '#F2F2F2',
  },
  tabPillActive: { backgroundColor: '#1A1A1A' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#555' },
  tabTextActive: { color: '#fff', fontWeight: '600' },

  // ── Section Header ──────────────────────────────────────
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  sectionCount: { fontSize: 13, color: '#999', marginTop: 4 },

  // ── Product Grid ────────────────────────────────────────
  productsContainer: { paddingRight: 20, paddingBottom: 100 },
  productCard: { width: CARD_W, marginBottom: 24 },
  imageContainer: {
    width: '100%',
    height: CARD_W * 1.35,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  productImage: { width: '100%', height: '100%' },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saleBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  saleBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  productInfo: { marginTop: 10, paddingHorizontal: 2 },
  brandLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#AAA',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  productName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  productPrice: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  originalPrice: { fontSize: 12, color: '#AAA', textDecorationLine: 'line-through' },

  // ── Empty State ─────────────────────────────────────────
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 17, fontWeight: '500', color: '#1A1A1A', marginTop: 16 },
  clearFiltersBtn: { marginTop: 20, paddingHorizontal: 28, paddingVertical: 14, backgroundColor: '#1A1A1A', borderRadius: 28 },
  clearFiltersBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },

  // ── Filter Modal ────────────────────────────────────────
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, height: '82%' },
  modalHandle: { width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  filterSection: { paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  filterSectionTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 14, letterSpacing: 0.3 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 9, backgroundColor: '#F5F5F5', borderRadius: 28 },
  chipActive: { backgroundColor: '#1A1A1A' },
  chipText: { fontSize: 13, fontWeight: '500', color: '#1A1A1A' },
  chipTextActive: { color: '#fff' },
  modalFooter: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 34, gap: 12, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  clearBtn: { flex: 1, height: 52, justifyContent: 'center', alignItems: 'center', borderRadius: 28, borderWidth: 1.5, borderColor: '#1A1A1A' },
  clearBtnText: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  applyBtn: { flex: 2, height: 52, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 28 },
  applyBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

export default CatalogScreen;
