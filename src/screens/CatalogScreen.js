import React, { useState, useEffect, useCallback, useRef } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useScrollToTop } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { products, categories, brands, priceRanges } from '../constants/mockData';

const CatalogScreen = ({ navigation, route }) => {
  const { toggleWishlist, isInWishlist, getCartCount } = useApp();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBrand, setActiveBrand] = useState('all');
  const [activePriceRange, setActivePriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const listRef = useRef(null);
  useScrollToTop(listRef);

  // Update brand when screen is focused and has selectedBrand param
  useFocusEffect(
    useCallback(() => {
      if (route?.params?.selectedBrand) {
        setActiveBrand(route.params.selectedBrand);
      }
    }, [route?.params?.selectedBrand])
  );

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesBrand = activeBrand === 'all' || product.brand === activeBrand;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const priceRange = priceRanges.find(r => r.id === activePriceRange);
    const matchesPrice = !priceRange || (product.price >= priceRange.min && product.price <= priceRange.max);

    return matchesCategory && matchesBrand && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
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
  };

  const renderProduct = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.productCard, { marginLeft: index % 2 === 0 ? SIZES.padding : 8 }]}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <View style={styles.imageContainer}>
        <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.productImage} />
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => toggleWishlist(item.id)}
        >
          <Ionicons
            name={isInWishlist(item.id) ? 'heart' : 'heart-outline'}
            size={20}
            color={isInWishlist(item.id) ? COLORS.error : COLORS.black}
          />
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
        <Text style={styles.headerTitle}>{t('common.catalog')}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="bag-outline" size={24} color={COLORS.black} />
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
          <Ionicons name="search-outline" size={20} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('common.search')}
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, activeFiltersCount > 0 && styles.filterBtnActive]}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFiltersCount > 0 ? COLORS.white : COLORS.black}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryBtn,
              activeCategory === category.id && styles.categoryBtnActive,
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Ionicons
              name={category.icon}
              size={18}
              color={activeCategory === category.id ? COLORS.white : COLORS.black}
            />
            <Text
              style={[
                styles.categoryText,
                activeCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Active Filters Display */}
      {(activeBrand !== 'all' || activePriceRange !== 'all') && (
        <View style={styles.activeFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activeBrand !== 'all' && (
              <TouchableOpacity
                style={styles.activeFilterChip}
                onPress={() => setActiveBrand('all')}
              >
                <Text style={styles.activeFilterText}>
                  {brands.find(b => b.id === activeBrand)?.name}
                </Text>
                <Ionicons name="close" size={14} color={COLORS.gold} />
              </TouchableOpacity>
            )}
            {activePriceRange !== 'all' && (
              <TouchableOpacity
                style={styles.activeFilterChip}
                onPress={() => setActivePriceRange('all')}
              >
                <Text style={styles.activeFilterText}>
                  {priceRanges.find(p => p.id === activePriceRange)?.name}
                </Text>
                <Ionicons name="close" size={14} color={COLORS.gold} />
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredProducts.length} {t('catalog.items')}</Text>
      </View>

      {/* Products Grid */}
      <FlatList
        ref={listRef}
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={COLORS.goldMuted} />
            <Text style={styles.emptyTitle}>{t('catalog.noProducts')}</Text>
            <Text style={styles.emptyText}>{t('common.filter')}</Text>
            <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearAllFilters}>
              <Text style={styles.clearFiltersBtnText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('common.filter')}</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Sort By */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t('catalog.sortBy')}</Text>
                <View style={styles.sortOptions}>
                  {[
                    { id: 'featured', label: t('catalog.popular') },
                    { id: 'price_low', label: t('catalog.priceLowHigh') },
                    { id: 'price_high', label: t('catalog.priceHighLow') },
                    { id: 'name', label: t('catalog.newest') },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.sortOption,
                        sortBy === option.id && styles.sortOptionActive,
                      ]}
                      onPress={() => setSortBy(option.id)}
                    >
                      <Text
                        style={[
                          styles.sortOptionText,
                          sortBy === option.id && styles.sortOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {sortBy === option.id && (
                        <Ionicons name="checkmark" size={18} color={COLORS.white} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Brand Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t('catalog.brand')}</Text>
                <View style={styles.brandGrid}>
                  {brands.map((brand) => (
                    <TouchableOpacity
                      key={brand.id}
                      style={[
                        styles.brandChip,
                        activeBrand === brand.id && styles.brandChipActive,
                      ]}
                      onPress={() => setActiveBrand(brand.id)}
                    >
                      <Text
                        style={[
                          styles.brandChipText,
                          activeBrand === brand.id && styles.brandChipTextActive,
                        ]}
                      >
                        {brand.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{t('catalog.priceRange')}</Text>
                <View style={styles.priceOptions}>
                  {priceRanges.map((range) => (
                    <TouchableOpacity
                      key={range.id}
                      style={[
                        styles.priceOption,
                        activePriceRange === range.id && styles.priceOptionActive,
                      ]}
                      onPress={() => setActivePriceRange(range.id)}
                    >
                      <Text
                        style={[
                          styles.priceOptionText,
                          activePriceRange === range.id && styles.priceOptionTextActive,
                        ]}
                      >
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
    backgroundColor: COLORS.cream,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: COLORS.black,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    height: 48,
    ...SHADOWS.light,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.black,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  filterBtnActive: {
    backgroundColor: COLORS.black,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
  },
  categoriesContainer: {
    marginBottom: 12,
    height: 52,
  },
  categoriesContent: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 10,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    height: 36,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    gap: 6,
    ...SHADOWS.light,
  },
  categoryBtnActive: {
    backgroundColor: COLORS.black,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.black,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  activeFilters: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 12,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.goldLight,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: '500',
  },
  resultsHeader: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 13,
    color: COLORS.gray,
  },
  productsContainer: {
    paddingBottom: 100,
  },
  productCard: {
    flex: 1,
    marginRight: SIZES.padding,
    marginBottom: 20,
    maxWidth: '50%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.beige,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  saleBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  productInfo: {
    marginTop: 12,
  },
  brandName: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.gray,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gold,
  },
  originalPrice: {
    fontSize: 13,
    color: COLORS.gray,
    textDecorationLine: 'line-through',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
  },
  clearFiltersBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
  },
  clearFiltersBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.beigeDark,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.black,
  },
  filterSection: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.beigeDark,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 16,
  },
  sortOptions: {
    gap: 10,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.beige,
    borderRadius: SIZES.radiusSm,
  },
  sortOptionActive: {
    backgroundColor: COLORS.black,
  },
  sortOptionText: {
    fontSize: 14,
    color: COLORS.black,
  },
  sortOptionTextActive: {
    color: COLORS.white,
  },
  brandScroll: {
    gap: 10,
    marginBottom: 10,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  brandChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.beige,
    borderRadius: 20,
  },
  brandChipActive: {
    backgroundColor: COLORS.black,
  },
  brandChipText: {
    fontSize: 13,
    color: COLORS.black,
  },
  brandChipTextActive: {
    color: COLORS.white,
  },
  priceOptions: {
    gap: 10,
  },
  priceOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.beige,
    borderRadius: SIZES.radiusSm,
  },
  priceOptionActive: {
    backgroundColor: COLORS.black,
  },
  priceOptionText: {
    fontSize: 14,
    color: COLORS.black,
  },
  priceOptionTextActive: {
    color: COLORS.white,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: SIZES.padding,
    paddingBottom: 34,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
  },
  clearBtn: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  clearBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
  },
  applyBtn: {
    flex: 2,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default CatalogScreen;
