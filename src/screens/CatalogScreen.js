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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { categories, brands, priceRanges } from '../constants/mockData';

const { width } = Dimensions.get('window');
const CARD_W = (width - 20 * 2 - 12) / 2;

const CATEGORY_IMAGES = {
  clothing: require('../images/Banner/banner2.webp'),
  bags: require('../images/Hermes/birkin.webp'),
  shoes: require('../images/Banner/banner4.webp'),
  jewelry: require('../images/Banner/jewelry.webp'),
  watches: require('../images/Banner/banner5.webp'),
  accessories: require('../images/Hermes/twilly.webp'),
};

// Helper to determine initial gender from params
const getInitialGender = (params) => {
  if (params?.selectedCategory) {
    return ['watches'].includes(params.selectedCategory) ? 'men' : 'women';
  }
  if (params?.selectedBrand) {
    return 'women';
  }
  return null;
};

const CatalogScreen = ({ navigation, route }) => {
  const { toggleWishlist, isInWishlist, getCartCount, products } = useApp();
  const { t } = useTranslation();

  const [selectedGender, setSelectedGender] = useState(() => getInitialGender(route?.params));
  const [activeCategory, setActiveCategory] = useState(() => route?.params?.selectedCategory || 'all');
  const [activeBrand, setActiveBrand] = useState(() => route?.params?.selectedBrand || 'all');
  const [activePriceRange, setActivePriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const listRef = useRef(null);
  useScrollToTop(listRef);

  const womenProducts = products.filter(p =>
    ['bags', 'jewelry', 'accessories'].includes(p.category)
  );

  const menProducts = products.filter(p =>
    ['watches'].includes(p.category) ||
    (p.category === 'accessories' && p.brand === 'HERMÈS')
  );

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.openFilter) {
        if (!selectedGender) setSelectedGender('women');
        setShowFilterModal(true);
        navigation.setParams({ openFilter: undefined });
      }
      if (route?.params?.selectedBrand) {
        setActiveBrand(route.params.selectedBrand);
        if (!selectedGender) setSelectedGender('women');
      }
      if (route?.params?.selectedCategory) {
        setActiveCategory(route.params.selectedCategory);
        if (!selectedGender) {
          setSelectedGender(['watches'].includes(route.params.selectedCategory) ? 'men' : 'women');
        }
      }
    }, [route?.params?.openFilter, route?.params?.selectedBrand, route?.params?.selectedCategory])
  );

  const currentProducts = selectedGender === 'women' ? womenProducts : menProducts;

  const filteredProducts = currentProducts.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesBrand = activeBrand === 'all' || product.brand === activeBrand;
    const matchesSearch =
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

  const activeFiltersCount = [
    activeBrand !== 'all',
    activePriceRange !== 'all',
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setActiveBrand('all');
    setActivePriceRange('all');
    setSortBy('featured');
    setActiveCategory('all');
  };

  const handleBackToGender = () => {
    setSelectedGender(null);
    clearAllFilters();
    setSearchQuery('');
  };

  // Visible categories for current gender
  const visibleCategories = categories.filter(cat => {
    if (selectedGender === 'women') {
      return ['all', 'bags', 'jewelry', 'accessories'].includes(cat.id);
    }
    return ['all', 'watches', 'accessories'].includes(cat.id);
  });

  // Category cards (exclude 'all')
  const categoryCards = visibleCategories.filter(cat => cat.id !== 'all');

  const showCategoryCards = activeCategory === 'all' && searchQuery.length === 0;

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
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isInWishlist(item.id) ? 'heart' : 'heart-outline'}
            size={18}
            color={isInWishlist(item.id) ? '#E53935' : '#1A1A1A'}
          />
        </TouchableOpacity>
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

  const renderCategoryCard = (cat) => {
    const img = CATEGORY_IMAGES[cat.id];
    const count = currentProducts.filter(p => p.category === cat.id).length;
    return (
      <TouchableOpacity
        key={cat.id}
        style={styles.categoryCard}
        onPress={() => setActiveCategory(cat.id)}
        activeOpacity={0.88}
      >
        {img && (
          <Image source={img} style={styles.categoryCardImage} />
        )}
        <View style={styles.categoryCardOverlay} />
        <View style={styles.categoryCardText}>
          <Text style={styles.categoryCardName}>{cat.name.toUpperCase()}</Text>
          <Text style={styles.categoryCardCount}>{count} items</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Gender Selection Screen
  if (!selectedGender) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore</Text>
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

        <View style={styles.genderContainer}>
          <Text style={styles.genderSubtitle}>SHOP BY</Text>
          <View style={styles.bannersWrapper}>
            <TouchableOpacity
              style={styles.genderBanner}
              onPress={() => setSelectedGender('women')}
              activeOpacity={0.9}
            >
              <Image
                source={require('../images/Banner/banner2.webp')}
                style={styles.genderBannerImage}
                resizeMode="cover"
              />
              <View style={styles.genderBannerOverlay}>
                <Text style={styles.genderBannerLabel}>COLLECTION</Text>
                <Text style={styles.genderBannerTitle}>Women</Text>
                <View style={styles.genderBannerLine} />
                <Text style={styles.genderBannerCount}>{womenProducts.length} items</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.genderBanner}
              onPress={() => setSelectedGender('men')}
              activeOpacity={0.9}
            >
              <Image
                source={require('../images/Banner/banner4.webp')}
                style={styles.genderBannerImage}
                resizeMode="cover"
              />
              <View style={styles.genderBannerOverlay}>
                <Text style={styles.genderBannerLabel}>COLLECTION</Text>
                <Text style={styles.genderBannerTitle}>Men</Text>
                <View style={styles.genderBannerLine} />
                <Text style={styles.genderBannerCount}>{menProducts.length} items</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Product Listing Screen
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBackToGender}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.iconBtn, activeFiltersCount > 0 && styles.iconBtnActive]}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={activeFiltersCount > 0 ? '#fff' : '#1A1A1A'}
            />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#8A8A8A" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('common.search')}
            placeholderTextColor="#8A8A8A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#8A8A8A" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {visibleCategories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.tabPill, activeCategory === cat.id && styles.tabPillActive]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text style={[styles.tabText, activeCategory === cat.id && styles.tabTextActive]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Active filter chips */}
      {(activeBrand !== 'all' || activePriceRange !== 'all') && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activeChipsScroll}
          contentContainerStyle={styles.activeChipsContent}
        >
          {activeBrand !== 'all' && (
            <TouchableOpacity
              style={styles.activeChip}
              onPress={() => setActiveBrand('all')}
            >
              <Text style={styles.activeChipText}>
                {brands.find(b => b.id === activeBrand)?.name}
              </Text>
              <Ionicons name="close" size={12} color="#1A1A1A" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}
          {activePriceRange !== 'all' && (
            <TouchableOpacity
              style={styles.activeChip}
              onPress={() => setActivePriceRange('all')}
            >
              <Text style={styles.activeChipText}>
                {priceRanges.find(r => r.id === activePriceRange)?.name}
              </Text>
              <Ionicons name="close" size={12} color="#1A1A1A" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* Category Photo Cards or Product Grid */}
      {showCategoryCards ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.categoryCardsContainer}
        >
          {categoryCards.map(renderCategoryCard)}
        </ScrollView>
      ) : (
        <>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>{filteredProducts.length} items</Text>
          </View>
          <FlatList
            ref={listRef}
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.productsContainer}
            showsVerticalScrollIndicator={false}
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
        </>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Handle Bar */}
            <View style={styles.modalHandle} />

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('common.filter')}</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={22} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Sort By */}
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
                      <Text style={[styles.chipText, sortBy === option.id && styles.chipTextActive]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Brand Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t('catalog.brand')}</Text>
                <View style={styles.chipRow}>
                  {brands.map((brand) => (
                    <TouchableOpacity
                      key={brand.id}
                      style={[styles.chip, activeBrand === brand.id && styles.chipActive]}
                      onPress={() => setActiveBrand(brand.id)}
                    >
                      <Text style={[styles.chipText, activeBrand === brand.id && styles.chipTextActive]}>
                        {brand.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Range */}
              <View style={[styles.filterSection, { borderBottomWidth: 0 }]}>
                <Text style={styles.filterSectionTitle}>{t('catalog.priceRange')}</Text>
                <View style={styles.chipRow}>
                  {priceRanges.map((range) => (
                    <TouchableOpacity
                      key={range.id}
                      style={[styles.chip, activePriceRange === range.id && styles.chipActive]}
                      onPress={() => setActivePriceRange(range.id)}
                    >
                      <Text style={[styles.chipText, activePriceRange === range.id && styles.chipTextActive]}>
                        {range.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.clearBtn} onPress={clearAllFilters}>
                <Text style={styles.clearBtnText}>{t('catalog.clearAll')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyBtnText}>
                  {t('catalog.showResults')} ({filteredProducts.length})
                </Text>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginLeft: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
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
  iconBtnActive: {
    backgroundColor: '#1A1A1A',
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
  filterBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#E53935',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  // Gender banners
  genderContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  genderSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A8A8A',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 20,
  },
  bannersWrapper: {
    flex: 1,
    gap: 14,
  },
  genderBanner: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  genderBannerImage: {
    width: '100%',
    height: '100%',
  },
  genderBannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderBannerLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 4,
    marginBottom: 8,
  },
  genderBannerTitle: {
    fontSize: 40,
    fontWeight: '300',
    color: '#fff',
    letterSpacing: 5,
  },
  genderBannerLine: {
    width: 36,
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 14,
    opacity: 0.6,
  },
  genderBannerCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  // Search
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#1A1A1A',
  },
  // Category tabs
  tabsContainer: {
    marginBottom: 10,
    maxHeight: 48,
  },
  tabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 8,
    alignItems: 'center',
  },
  tabPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
  },
  tabPillActive: {
    backgroundColor: '#1A1A1A',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  tabTextActive: {
    color: '#fff',
  },
  // Active filter chips row
  activeChipsScroll: {
    maxHeight: 40,
    marginBottom: 6,
  },
  activeChipsContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  activeChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  // Category photo cards
  categoryCardsContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 100,
    gap: 12,
  },
  categoryCard: {
    height: 110,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
  },
  categoryCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  categoryCardText: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  categoryCardName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1.5,
  },
  categoryCardCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  // Results
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 13,
    color: '#8A8A8A',
  },
  // Product grid
  productsContainer: {
    paddingRight: 20,
    paddingBottom: 100,
  },
  productCard: {
    width: CARD_W,
    marginRight: 0,
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
  wishlistBtn: {
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1A1A1A',
    marginTop: 16,
  },
  clearFiltersBtn: {
    marginTop: 20,
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: '#1A1A1A',
    borderRadius: 28,
  },
  clearFiltersBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '82%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: '#F5F5F5',
    borderRadius: 28,
  },
  chipActive: {
    backgroundColor: '#1A1A1A',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  chipTextActive: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  clearBtn: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  applyBtn: {
    flex: 2,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 28,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});

export default CatalogScreen;
