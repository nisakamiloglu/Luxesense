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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { products, featuredBrands } from '../constants/mockData';

const { width } = Dimensions.get('window');

const banners = [
  {
    id: 1,
    image: require('../images/banner1.webp'),
    titleTop: 'THIS SEASON',
    titleBottom: 'Must-Haves',
    navigateTo: 'Catalog',
  },
  {
    id: 2,
    image: require('../images/banner6.webp'),
    titleTop: "EDITOR'S PICK",
    titleBottom: 'Curated Trends',
    navigateTo: 'Catalog',
  },
  {
    id: 3,
    image: require('../images/hermes1.webp'),
    titleTop: 'SIGNATURE PIECES',
    titleBottom: 'The Essentials',
    navigateTo: 'Catalog',
  },
];

const HomeScreen = ({ navigation }) => {
  const { user, getCartCount } = useApp();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const scrollRef = useRef(null);
  const bannerRef = useRef(null);
  useScrollToTop(scrollRef);

  const onBannerScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 28));
    setActiveBanner(slideIndex);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Catalog', { searchQuery });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.goodMorning');
    if (hour < 17) return t('home.goodAfternoon');
    return t('home.goodEvening');
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
        {/* Category Icons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {[
            { id: 'clothing', icon: 'shirt-outline', label: t('catalog.clothing') },
            { id: 'bags', icon: 'bag-handle-outline', label: t('catalog.bags') },
            { id: 'shoes', icon: 'footsteps-outline', label: t('catalog.shoes') },
            { id: 'jewelry', icon: 'diamond-outline', label: t('catalog.jewelry') },
            { id: 'watches', icon: 'watch-outline', label: t('catalog.watches') },
            { id: 'accessories', icon: 'glasses-outline', label: t('catalog.accessories') },
          ].map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryPill}
              onPress={() => navigation.navigate('Catalog', { selectedCategory: cat.id })}
            >
              <Ionicons name={cat.icon} size={16} color={COLORS.gold} />
              <Text style={styles.categoryPillText}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Hero Banner Slider */}
        <View style={styles.bannerContainer}>
          <ScrollView
            ref={bannerRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={onBannerScroll}
            scrollEventThrottle={16}
            snapToInterval={width - 28}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.bannerScrollContent}
          >
            {banners.map((banner) => (
              <TouchableOpacity
                key={banner.id}
                style={styles.heroBanner}
                onPress={() => navigation.navigate(banner.navigateTo)}
                activeOpacity={0.9}
              >
                <Image
                  source={banner.image}
                  style={styles.heroBannerImage}
                  resizeMode="cover"
                />
                <View style={styles.heroBannerOverlay}>
                  <Text style={styles.heroBannerTitle}>{banner.titleTop}</Text>
                  <Text style={styles.heroBannerTitleAccent}>{banner.titleBottom}</Text>
                  <View style={styles.heroBannerLine} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Pagination Dots */}
          <View style={styles.paginationDots}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeBanner === index && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Brands */}
        <View style={[styles.section, styles.sectionLight]}>
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

        {/* Trending Now */}
        <View style={[styles.section, styles.sectionDark]}>
          <View style={[styles.sectionHeader, { paddingLeft: 36 }]}>
            <Text style={styles.sectionTitle}>{t('home.trendingNow')}</Text>
          </View>
          {products.slice(6, 11).map((product) => (
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
  // Category Pills
  categoriesScroll: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: SIZES.padding,
    gap: 10,
    flexDirection: 'row',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    gap: 6,
    ...SHADOWS.light,
  },
  categoryPillText: {
    fontSize: 13,
    color: COLORS.black,
    fontWeight: '500',
  },
  // Hero Banner Slider
  bannerContainer: {
    marginBottom: 8,
  },
  bannerScrollContent: {
    paddingHorizontal: SIZES.padding,
  },
  heroBanner: {
    width: width - 40,
    height: 200,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginRight: 12,
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroBannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBannerTitle: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '400',
    letterSpacing: 6,
  },
  heroBannerTitleAccent: {
    fontSize: 36,
    color: COLORS.white,
    fontWeight: '200',
    letterSpacing: 4,
    fontStyle: 'italic',
    marginTop: 4,
  },
  heroBannerLine: {
    width: 50,
    height: 1,
    backgroundColor: COLORS.gold,
    marginTop: 20,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.beigeDark,
  },
  dotActive: {
    backgroundColor: COLORS.gold,
    width: 24,
  },
  // Section Title Row
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // AI Card
  aiCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: 20,
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
  // Sections
  section: {
    marginBottom: 24,
    paddingVertical: 20,
  },
  sectionLight: {
    backgroundColor: COLORS.white,
  },
  sectionDark: {
    backgroundColor: COLORS.beige,
    marginHorizontal: -SIZES.padding,
    paddingHorizontal: 0,
    paddingBottom: 30,
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
  // Brand Cards
  brandCard: {
    width: 240,
    height: 200,
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
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  brandName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  brandCount: {
    fontSize: 12,
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
  // Trending
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 36,
    marginBottom: 10,
    padding: 10,
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
    backgroundColor: 'rgba(255, 253, 245, 0.92)',
    borderRadius: 30,
    paddingRight: 20,
    borderWidth: 1,
    borderColor: COLORS.goldLight,
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
    color: COLORS.black,
  },
});

export default HomeScreen;
