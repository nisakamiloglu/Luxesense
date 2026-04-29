import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const TYPE_ICON = {
  ai:      { name: 'sparkles',            color: COLORS.gold },
  stock:   { name: 'alert-circle-outline', color: '#E53935' },
  sale:    { name: 'pricetag-outline',     color: '#43A047' },
  new:     { name: 'bag-add-outline',      color: '#1565C0' },
  order:   { name: 'checkmark-circle-outline', color: '#43A047' },
  tip:     { name: 'bulb-outline',         color: COLORS.gold },
};

const NotificationsScreen = ({ navigation }) => {
  const { wishlist, products, recentlyViewed } = useApp();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const buildNotifications = () => {
    const list = [];

    // Stock alerts for wishlist items
    wishlistProducts.slice(0, 2).forEach((p, i) => {
      list.push({
        id: `stock_${p.id}`,
        type: 'stock',
        title: 'Low Stock Alert',
        body: `${p.brand} ${p.name} — only a few left. Don't miss out.`,
        cta: 'View Item',
        product: p,
        time: `${i + 1}m ago`,
      });
    });

    // AI recommendations based on recently viewed
    const viewed = recentlyViewed.length > 0 ? recentlyViewed : products.slice(0, 3);
    viewed.slice(0, 3).forEach((browsed, i) => {
      const suggested =
        products.find(p => p.id !== browsed.id && p.brand === browsed.brand) ||
        products[(i + 4) % products.length];
      if (!suggested) return;
      list.push({
        id: `ai_${browsed.id}`,
        type: 'ai',
        title: 'AI Recommendation',
        body: `You browsed ${browsed.brand} ${browsed.name}. You might love: ${suggested.brand} ${suggested.name}.`,
        cta: 'Explore',
        product: suggested,
        time: `${(i + 1) * 15}m ago`,
      });
    });

    // Sale notifications
    const onSale = products.filter(p => p.onSale).slice(0, 2);
    onSale.forEach((p, i) => {
      list.push({
        id: `sale_${p.id}`,
        type: 'sale',
        title: 'Price Drop',
        body: `${p.brand} ${p.name} is now on sale. Save ${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%.`,
        cta: 'Shop Now',
        product: p,
        time: `${i + 1}h ago`,
      });
    });

    // New arrivals
    products.slice(6, 8).forEach((p, i) => {
      list.push({
        id: `new_${p.id}`,
        type: 'new',
        title: 'New Arrival',
        body: `${p.brand} just dropped a new piece: ${p.name}. Be the first to explore.`,
        cta: 'See It',
        product: p,
        time: `${i + 2}h ago`,
      });
    });

    // Style tips
    list.push({
      id: 'tip_1',
      type: 'tip',
      title: 'Style Tip',
      body: 'Complete your look — your AI Stylist has curated a full outfit based on your wishlist.',
      cta: 'Open AI Stylist',
      product: null,
      time: '3h ago',
    });

    list.push({
      id: 'tip_2',
      type: 'tip',
      title: 'Style Tip',
      body: 'Pair a structured blazer with wide-leg trousers for an effortlessly polished look this season.',
      cta: 'Discover',
      product: null,
      time: '5h ago',
    });

    // Order update
    list.push({
      id: 'order_1',
      type: 'order',
      title: 'Order Update',
      body: 'Your recent order has been confirmed and is being prepared for shipment.',
      cta: 'Track Order',
      product: null,
      time: '1d ago',
    });

    return list;
  };

  const notifications = buildNotifications();
  const icon = (type) => TYPE_ICON[type] || TYPE_ICON.tip;

  const handleCta = (item) => {
    if (item.type === 'tip' && item.id === 'tip_1') {
      navigation.navigate('AIStylist');
    } else if (item.product) {
      navigation.navigate('ProductDetails', { product: item.product });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={() => handleCta(item)}>
      <View style={[styles.iconWrap, { backgroundColor: icon(item.type).color + '18' }]}>
        <Ionicons name={icon(item.type).name} size={20} color={icon(item.type).color} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardTime}>{item.time}</Text>
        </View>
        <Text style={styles.cardText}>{item.body}</Text>
        {item.product && (
          <View style={styles.productRow}>
            <Image
              source={typeof item.product.image === 'string' ? { uri: item.product.image } : item.product.image}
              style={styles.productThumb}
              resizeMode="cover"
            />
            <View style={styles.productMeta}>
              <Text style={styles.productBrand}>{item.product.brand}</Text>
              <Text style={styles.productName} numberOfLines={1}>{item.product.name}</Text>
              <Text style={styles.productPrice}>${item.product.price.toLocaleString()}</Text>
            </View>
          </View>
        )}
        <Text style={[styles.cta, { color: icon(item.type).color }]}>{item.cta} →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F0EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  list: { padding: SIZES.padding },
  separator: { height: 1, backgroundColor: '#F5F5F5' },
  card: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  cardTime: { fontSize: 11, color: '#BBB' },
  cardText: { fontSize: 13, color: '#555', lineHeight: 19, marginBottom: 10 },
  productRow: { flexDirection: 'row', gap: 10, backgroundColor: '#F5F0EB', borderRadius: 12, padding: 10, marginBottom: 10 },
  productThumb: { width: 52, height: 64, borderRadius: 8, backgroundColor: '#E8E0D8' },
  productMeta: { flex: 1, justifyContent: 'center' },
  productBrand: { fontSize: 9, fontWeight: '700', color: '#999', letterSpacing: 0.5, textTransform: 'uppercase' },
  productName: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginTop: 2 },
  productPrice: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', marginTop: 4 },
  cta: { fontSize: 12, fontWeight: '700' },
});

export default NotificationsScreen;
