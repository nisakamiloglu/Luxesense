import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { stockLocations, transferOptions, productDetails } from '../constants/mockData';
import Header from '../components/Header';
import Card from '../components/Card';

const StockAvailabilityScreen = ({ navigation }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock':
        return COLORS.success;
      case 'low_stock':
        return COLORS.warning;
      case 'out_of_stock':
        return COLORS.error;
      default:
        return COLORS.gray;
    }
  };

  const getStatusText = (status, stock) => {
    switch (status) {
      case 'in_stock':
        return `${stock} in stock`;
      case 'low_stock':
        return `${stock} left`;
      case 'out_of_stock':
        return 'Out of stock';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Stock Availability"
        subtitle="Hermès Birkin 25"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Summary */}
        <Card style={styles.productSummary}>
          <View style={styles.productImage}>
            <Ionicons name="bag-outline" size={36} color={COLORS.gold} />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{productDetails.name}</Text>
            <Text style={styles.productVariant}>Noir / Size 25</Text>
            <Text style={styles.productPrice}>{productDetails.price}</Text>
          </View>
        </Card>

        {/* Current Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Location</Text>
          <Card style={styles.locationCard}>
            <View style={styles.locationIcon}>
              <Ionicons name="location" size={20} color={COLORS.gold} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>Fifth Avenue Flagship</Text>
              <Text style={styles.locationAddress}>725 5th Ave, New York, NY</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Nearby Boutiques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Boutiques</Text>

          {stockLocations.map((location) => (
            <Card key={location.id} style={styles.boutiqueCard}>
              <View style={styles.boutiqueLeft}>
                <View style={[
                  styles.stockIndicator,
                  { backgroundColor: getStatusColor(location.status) }
                ]} />
                <View style={styles.boutiqueInfo}>
                  <Text style={styles.boutiqueName}>{location.boutique}</Text>
                  <Text style={styles.boutiqueDistance}>{location.distance}</Text>
                </View>
              </View>
              <View style={styles.boutiqueRight}>
                <Text style={[
                  styles.stockStatus,
                  { color: getStatusColor(location.status) }
                ]}>
                  {getStatusText(location.status, location.stock)}
                </Text>
                {location.status !== 'out_of_stock' && (
                  <TouchableOpacity style={styles.reserveSmallButton}>
                    <Text style={styles.reserveSmallText}>Reserve</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          ))}
        </View>

        {/* Transfer Options */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="swap-horizontal" size={20} color={COLORS.gold} />
            <Text style={styles.sectionTitle}>Transfer Options</Text>
          </View>

          {transferOptions.map((option) => (
            <Card key={option.id} style={styles.transferCard}>
              <View style={styles.transferInfo}>
                <Text style={styles.transferFrom}>From {option.from}</Text>
                <View style={styles.transferMeta}>
                  <Ionicons name="time-outline" size={14} color={COLORS.gray} />
                  <Text style={styles.transferEta}>ETA: {option.eta}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.requestButton}>
                <Text style={styles.requestButtonText}>Request</Text>
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* Notification Option */}
        <View style={styles.section}>
          <Card style={styles.notifyCard}>
            <View style={styles.notifyIcon}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.gold} />
            </View>
            <View style={styles.notifyInfo}>
              <Text style={styles.notifyTitle}>Get Notified</Text>
              <Text style={styles.notifySubtitle}>
                Receive alerts when this item becomes available at nearby locations
              </Text>
            </View>
            <TouchableOpacity style={styles.notifyToggle}>
              <View style={styles.toggleTrack}>
                <View style={styles.toggleThumb} />
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Worldwide Search */}
        <TouchableOpacity style={styles.worldwideSearch}>
          <Ionicons name="globe-outline" size={22} color={COLORS.gold} />
          <Text style={styles.worldwideText}>Search Worldwide Availability</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
        </TouchableOpacity>

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
  productSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: 24,
    padding: 16,
  },
  productImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  productVariant: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
    marginTop: 4,
  },
  productPrice: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.charcoal,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
    paddingHorizontal: SIZES.padding,
    marginBottom: 12,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    padding: 16,
  },
  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
    marginLeft: 14,
  },
  locationName: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  locationAddress: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    marginTop: 2,
  },
  changeText: {
    fontSize: SIZES.body3,
    color: COLORS.gold,
    fontWeight: '500',
  },
  boutiqueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SIZES.padding,
    marginBottom: 10,
    padding: 16,
  },
  boutiqueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stockIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  boutiqueInfo: {
    flex: 1,
  },
  boutiqueName: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  boutiqueDistance: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    marginTop: 2,
  },
  boutiqueRight: {
    alignItems: 'flex-end',
  },
  stockStatus: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    marginBottom: 6,
  },
  reserveSmallButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: COLORS.beige,
    borderRadius: 14,
  },
  reserveSmallText: {
    fontSize: SIZES.caption,
    fontWeight: '600',
    color: COLORS.charcoal,
  },
  transferCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SIZES.padding,
    marginBottom: 10,
    padding: 16,
  },
  transferInfo: {
    flex: 1,
  },
  transferFrom: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  transferMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  transferEta: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
  },
  requestButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.black,
    borderRadius: 20,
  },
  requestButtonText: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.white,
  },
  notifyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    padding: 16,
  },
  notifyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifyInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 12,
  },
  notifyTitle: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  notifySubtitle: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    marginTop: 4,
    lineHeight: 18,
  },
  notifyToggle: {
    padding: 4,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignSelf: 'flex-end',
  },
  worldwideSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 12,
  },
  worldwideText: {
    flex: 1,
    fontSize: SIZES.body2,
    fontWeight: '500',
    color: COLORS.charcoal,
  },
  bottomPadding: {
    height: 40,
  },
});

export default StockAvailabilityScreen;
