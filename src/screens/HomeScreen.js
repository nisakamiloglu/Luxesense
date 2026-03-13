import React, { useState, useCallback, memo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { products, aiRecommendations, featuredBrands } from '../constants/mockData';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'bags', name: 'Bags', icon: 'bag-outline' },
  { id: 'shoes', name: 'Shoes', icon: 'footsteps-outline' },
  { id: 'jewelry', name: 'Jewelry', icon: 'diamond-outline' },
  { id: 'watches', name: 'Watches', icon: 'watch-outline' },
  { id: 'tops', name: 'Tops', icon: 'shirt-outline' },
  { id: 'jackets', name: 'Jackets', icon: 'snow-outline' },
];

const HomeScreen = ({ navigation }) => {
  const { user, getCartCount } = useApp();
  const { t } = useTranslation();
  const [currentRec, setCurrentRec] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef(null);
  useScrollToTop(scrollRef);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.goodMorning');
    if (hour < 17) return t('home.goodAfternoon');
    return t('home.goodEvening');
  };

  const recommendation = aiRecommendations[currentRec];

  const dismissRecommendation = () => {
    if (currentRec < aiRecommendations.length - 1) {
      setCurrentRec(currentRec + 1);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Catalog', { searchQuery });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
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
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => navigation.navigate('Catalog')}
        >
          <Ionicons name="options-outline" size={20} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* New Collection Banner */}
        <TouchableOpacity
          style={styles.bannerContainer}
          onPress={() => navigation.navigate('Catalog')}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800' }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerSubtitle}>2024</Text>
            <Text style={styles.bannerTitle}>New Collection</Text>
            <View style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>{t('home.newArrivals')}</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.black} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('catalog.allProducts')}</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => navigation.navigate('Catalog', { selectedCategory: category.id })}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={category.icon} size={24} color={COLORS.gold} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Brands */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.brands')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Catalog')}>
              <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredBrands.map((brand) => (
              <TouchableOpacity
                key={brand.id}
                style={styles.brandCard}
                onPress={() => navigation.navigate('Catalog', { selectedBrand: brand.id })}
              >
                <Image
                  source={typeof brand.image === 'string' ? { uri: brand.image } : brand.image}
                  style={styles.brandImage}
                  resizeMode="cover"
                />
                <View style={styles.brandOverlay}>
                  <Text style={styles.brandName}>{brand.name}</Text>
                  <Text style={styles.brandCount}>{brand.itemCount} {t('common.items')}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Explore the Collection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.newArrivals')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Catalog')}>
              <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products.slice(0, 6).map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductDetails', { product })}
              >
                <Image
                  source={typeof product.image === 'string' ? { uri: product.image } : product.image}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                {product.onSale && (
                  <View style={styles.saleBadge}>
                    <Text style={styles.saleBadgeText}>SALE</Text>
                  </View>
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productBrand}>{product.brand}</Text>
                  <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>
                      ${product.price.toLocaleString()}
                    </Text>
                    {product.originalPrice && (
                      <Text style={styles.originalPrice}>
                        ${product.originalPrice.toLocaleString()}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* AI Recommendation Card */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <View style={styles.aiTitleRow}>
              <Ionicons name="sparkles" size={18} color={COLORS.gold} />
              <Text style={styles.aiTitle}>{t('home.aiRecommendation')}</Text>
            </View>
            <TouchableOpacity onPress={dismissRecommendation}>
              <Ionicons name="close" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
          <Text style={styles.aiMessage}>{recommendation.message}</Text>
          <TouchableOpacity
            style={styles.aiProductCard}
            onPress={() => navigation.navigate('ProductDetails', { product: recommendation.product })}
          >
            <Image
              source={typeof recommendation.product.image === 'string' ? { uri: recommendation.product.image } : recommendation.product.image}
              style={styles.aiProductImage}
              resizeMode="cover"
            />
            <View style={styles.aiProductInfo}>
              <Text style={styles.aiProductName}>{recommendation.product.name}</Text>
              <Text style={styles.aiProductPrice}>
                ${recommendation.product.price.toLocaleString()}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gold} />
          </TouchableOpacity>
        </View>

        {/* Trending Now */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.trendingNow')}</Text>
          </View>
          {products.slice(6, 8).map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.trendingCard}
              onPress={() => navigation.navigate('ProductDetails', { product })}
            >
              <Image
                source={typeof product.image === 'string' ? { uri: product.image } : product.image}
                style={styles.trendingImage}
                resizeMode="cover"
              />
              <View style={styles.trendingInfo}>
                <Text style={styles.trendingBrand}>{product.brand}</Text>
                <Text style={styles.trendingName}>{product.name}</Text>
                <Text style={styles.trendingPrice}>
                  ${product.price.toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.trendingBtn}
                onPress={() => navigation.navigate('ProductDetails', { product })}
              >
                <Ionicons name="arrow-forward" size={18} color={COLORS.gold} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating AI Stylist Button */}
      <TouchableOpacity
        style={styles.aiStylistBtn}
        onPress={() => navigation.navigate('AIStylist')}
      >
        <View style={styles.aiStylistInner}>
          <Ionicons name="sparkles" size={24} color={COLORS.white} />
        </View>
        <Text style={styles.aiStylistText}>{t('home.aiStylist')}</Text>
      </TouchableOpacity>
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
  greeting: {
    fontSize: 14,
    color: COLORS.gray,
  },
  userName: {
    fontSize: 26,
    fontWeight: '500',
    color: COLORS.black,
    marginTop: 4,
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
  // Search Bar
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
  // Banner
  bannerContainer: {
    marginHorizontal: SIZES.padding,
    height: 200,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: 24,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: '600',
    letterSpacing: 2,
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: COLORS.white,
    marginTop: 4,
    marginBottom: 16,
  },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  bannerBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.black,
  },
  // Categories
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.padding,
    gap: 12,
  },
  categoryItem: {
    width: (width - SIZES.padding * 2 - 24) / 3,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.black,
  },
  // Sections
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.black,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '500',
  },
  // Brand Cards (narrower and taller)
  brandCard: {
    width: 150,
    height: 220,
    marginLeft: SIZES.padding,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  brandImage: {
    width: '100%',
    height: '100%',
  },
  brandOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  brandName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  brandCount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  // Product Cards
  productCard: {
    width: 160,
    marginLeft: SIZES.padding,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.beige,
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saleBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
  },
  productInfo: {
    marginTop: 10,
  },
  productBrand: {
    fontSize: 11,
    color: COLORS.gray,
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gold,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.gray,
    textDecorationLine: 'line-through',
  },
  // AI Card
  aiCard: {
    marginHorizontal: SIZES.padding,
    marginTop: 24,
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.goldLight,
    ...SHADOWS.light,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gold,
    letterSpacing: 1,
  },
  aiMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  aiProductCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.beige,
    borderRadius: SIZES.radiusSm,
  },
  aiProductImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.beigeDark,
  },
  aiProductInfo: {
    flex: 1,
    marginLeft: 12,
  },
  aiProductName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  aiProductPrice: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '500',
    marginTop: 2,
  },
  // Trending
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  trendingImage: {
    width: 70,
    height: 70,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.beige,
  },
  trendingInfo: {
    flex: 1,
    marginLeft: 14,
  },
  trendingBrand: {
    fontSize: 11,
    color: COLORS.gray,
    letterSpacing: 0.5,
  },
  trendingName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
    marginTop: 2,
  },
  trendingPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gold,
    marginTop: 4,
  },
  trendingBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // AI Stylist Button
  aiStylistBtn: {
    position: 'absolute',
    bottom: 24,
    right: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 30,
    paddingRight: 20,
    ...SHADOWS.medium,
  },
  aiStylistInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiStylistText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default HomeScreen;
