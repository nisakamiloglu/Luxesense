import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { collections, newArrivals, categories } from '../constants/mockData';
import Header from '../components/Header';
import Card from '../components/Card';

const ProductShowcaseScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        title="Products"
        subtitle="Explore Collections"
        rightIcon="filter-outline"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={COLORS.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products, collections..."
              placeholderTextColor={COLORS.gray}
            />
          </View>
          <TouchableOpacity style={styles.scanButton}>
            <Ionicons name="qr-code-outline" size={20} color={COLORS.gold} />
          </TouchableOpacity>
        </View>

        {/* Collections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Collections</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.collectionsScroll}
          >
            {collections.map((collection) => (
              <TouchableOpacity key={collection.id} style={styles.collectionCard}>
                <View style={styles.collectionImage}>
                  <Ionicons
                    name={
                      collection.image === 'spring' ? 'flower-outline' :
                      collection.image === 'couture' ? 'shirt-outline' :
                      collection.image === 'jewelry' ? 'diamond-outline' :
                      'bag-outline'
                    }
                    size={32}
                    color={COLORS.gold}
                  />
                </View>
                <Text style={styles.collectionName}>{collection.name}</Text>
                <Text style={styles.collectionItems}>{collection.items} items</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <View style={styles.categoryIcon}>
                  <Ionicons
                    name={
                      category.name === 'Handbags' ? 'bag-outline' :
                      category.name === 'Watches' ? 'watch-outline' :
                      category.name === 'Jewelry' ? 'diamond-outline' :
                      category.name === 'Ready-to-Wear' ? 'shirt-outline' :
                      category.name === 'Shoes' ? 'footsteps-outline' :
                      'glasses-outline'
                    }
                    size={22}
                    color={COLORS.gold}
                  />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* New Arrivals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.newArrivalsHeader}>
              <Text style={styles.sectionTitle}>New Arrivals</Text>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {newArrivals.map((product) => (
            <TouchableOpacity
              key={product.id}
              onPress={() => navigation.navigate('ProductDetails')}
            >
              <Card style={styles.productCard}>
                <View style={styles.productImage}>
                  <Ionicons
                    name={
                      product.category === 'Bags' ? 'bag-outline' :
                      'watch-outline'
                    }
                    size={28}
                    color={COLORS.gold}
                  />
                </View>
                <View style={styles.productInfo}>
                  <View style={styles.productHeader}>
                    <Text style={styles.productCategory}>{product.category}</Text>
                    {product.isNew && (
                      <View style={styles.newIndicator}>
                        <Text style={styles.newIndicatorText}>New</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                </View>
                <TouchableOpacity style={styles.productAction}>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
                </TouchableOpacity>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Banner */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.featuredBanner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerLabel}>EXCLUSIVE</Text>
              <Text style={styles.bannerTitle}>Spring Preview</Text>
              <Text style={styles.bannerSubtitle}>
                Be the first to discover the new collection
              </Text>
              <View style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Explore Now</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.gold} />
              </View>
            </View>
            <View style={styles.bannerDecor}>
              <Ionicons name="sparkles" size={64} color="rgba(201, 169, 98, 0.2)" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: 24,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: SIZES.body2,
    color: COLORS.black,
  },
  scanButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
  },
  seeAll: {
    fontSize: SIZES.body3,
    color: COLORS.gold,
    fontWeight: '500',
  },
  newArrivalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  collectionsScroll: {
    paddingLeft: SIZES.padding,
  },
  collectionCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  collectionImage: {
    width: '100%',
    height: 80,
    backgroundColor: COLORS.beige,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  collectionName: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  collectionItems: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.padding,
    gap: 10,
  },
  categoryItem: {
    width: '31%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    color: COLORS.charcoal,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    marginTop: 2,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: 10,
    padding: 12,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 14,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  newIndicator: {
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  newIndicatorText: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.goldDark,
  },
  productName: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: SIZES.body3,
    color: COLORS.charcoal,
    fontWeight: '500',
  },
  productAction: {
    padding: 8,
  },
  featuredBanner: {
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerContent: {
    zIndex: 1,
  },
  bannerLabel: {
    fontSize: SIZES.caption,
    color: COLORS.gold,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: SIZES.body3,
    color: COLORS.lightGray,
    marginBottom: 16,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerButtonText: {
    fontSize: SIZES.body3,
    color: COLORS.gold,
    fontWeight: '600',
  },
  bannerDecor: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  bottomPadding: {
    height: 40,
  },
});

export default ProductShowcaseScreen;
