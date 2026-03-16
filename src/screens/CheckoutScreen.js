import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, getCartTotal, placeOrder, user } = useApp();
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const scrollViewRef = useRef(null);

  // Scroll to top when step changes
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [activeStep]);

  // Parse user fullName into first and last name
  const getNameParts = () => {
    const fullName = user?.fullName || user?.name || '';
    const parts = fullName.split(' ');
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
    };
  };

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: 'Bağdat Caddesi No: 123',
    apartment: 'Daire 5',
    city: 'İstanbul',
    state: 'Kadıköy',
    zipCode: '34710',
    country: 'Türkiye',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '4242 4242 4242 4242',
    cardName: '',
    expiry: '12/28',
    cvv: '123',
  });

  // Update shipping info when user data is available
  useEffect(() => {
    if (user) {
      const { firstName, lastName } = getNameParts();
      setShippingInfo(prev => ({
        ...prev,
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        phone: user.phone || '',
      }));
      setPaymentInfo(prev => ({
        ...prev,
        cardName: user.fullName || user.name || '',
      }));
    }
  }, [user]);

  const [selectedShipping, setSelectedShipping] = useState('express');

  const shippingOptions = [
    { id: 'standard', name: 'Standard Delivery', time: '5-7 Business Days', price: 0 },
    { id: 'express', name: 'Express Delivery', time: '2-3 Business Days', price: 25 },
    { id: 'overnight', name: 'Overnight Delivery', time: 'Next Business Day', price: 50 },
  ];

  const subtotal = getCartTotal();
  const shippingCost = shippingOptions.find(s => s.id === selectedShipping)?.price || 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shippingCost + tax;

  const steps = ['Shipping', 'Payment', 'Review'];

  const handlePlaceOrder = () => {
    if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiry || !paymentInfo.cvv) {
      Alert.alert('Payment Required', 'Please fill in all payment details');
      setActiveStep(1);
      return;
    }

    const order = placeOrder(shippingInfo, {
      method: selectedShipping,
      cost: shippingCost,
    });

    navigation.replace('OrderSuccess', { order });
  };

  const renderShippingStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Shipping Address</Text>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            value={shippingInfo.firstName}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, firstName: text })}
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={shippingInfo.lastName}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, lastName: text })}
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={shippingInfo.email}
          onChangeText={(text) => setShippingInfo({ ...shippingInfo, email: text })}
          keyboardType="email-address"
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Phone</Text>
        <TextInput
          style={styles.input}
          value={shippingInfo.phone}
          onChangeText={(text) => setShippingInfo({ ...shippingInfo, phone: text })}
          keyboardType="phone-pad"
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Street Address</Text>
        <TextInput
          style={styles.input}
          value={shippingInfo.address}
          onChangeText={(text) => setShippingInfo({ ...shippingInfo, address: text })}
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Apartment, Suite, etc. (optional)</Text>
        <TextInput
          style={styles.input}
          value={shippingInfo.apartment}
          onChangeText={(text) => setShippingInfo({ ...shippingInfo, apartment: text })}
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 2, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>City</Text>
          <TextInput
            style={styles.input}
            value={shippingInfo.city}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, city: text })}
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>State</Text>
          <TextInput
            style={styles.input}
            value={shippingInfo.state}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, state: text })}
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>ZIP Code</Text>
          <TextInput
            style={styles.input}
            value={shippingInfo.zipCode}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, zipCode: text })}
            keyboardType="numeric"
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>Country</Text>
          <TextInput
            style={styles.input}
            value={shippingInfo.country}
            onChangeText={(text) => setShippingInfo({ ...shippingInfo, country: text })}
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>

      <Text style={[styles.stepTitle, { marginTop: 24 }]}>Shipping Method</Text>

      {shippingOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.shippingOption,
            selectedShipping === option.id && styles.shippingOptionActive,
          ]}
          onPress={() => setSelectedShipping(option.id)}
        >
          <View style={styles.radioOuter}>
            {selectedShipping === option.id && <View style={styles.radioInner} />}
          </View>
          <View style={styles.shippingInfo}>
            <Text style={styles.shippingName}>{option.name}</Text>
            <Text style={styles.shippingTime}>{option.time}</Text>
          </View>
          <Text style={styles.shippingPrice}>
            {option.price === 0 ? 'FREE' : `$${option.price}`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPaymentStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Payment Details</Text>

      <View style={styles.cardIcons}>
        <Ionicons name="card" size={32} color={COLORS.gold} />
        <Text style={styles.secureText}>Secure Payment</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.input}
          value={paymentInfo.cardNumber}
          onChangeText={(text) => {
            const formatted = text.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
            setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
          }}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={19}
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          value={paymentInfo.cardName}
          onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cardName: text })}
          placeholder="Name on card"
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            value={paymentInfo.expiry}
            onChangeText={(text) => {
              const formatted = text.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
              setPaymentInfo({ ...paymentInfo, expiry: formatted });
            }}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
            placeholderTextColor={COLORS.gray}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            style={styles.input}
            value={paymentInfo.cvv}
            onChangeText={(text) => setPaymentInfo({ ...paymentInfo, cvv: text })}
            placeholder="123"
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>

      <View style={styles.securityNote}>
        <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
        <Text style={styles.securityText}>
          Your payment information is encrypted and secure
        </Text>
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Order Review</Text>

      {/* Shipping Address Summary */}
      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewLabel}>Shipping Address</Text>
          <TouchableOpacity onPress={() => setActiveStep(0)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.reviewText}>
          {shippingInfo.firstName} {shippingInfo.lastName}
        </Text>
        <Text style={styles.reviewText}>
          {shippingInfo.address}{shippingInfo.apartment ? `, ${shippingInfo.apartment}` : ''}
        </Text>
        <Text style={styles.reviewText}>
          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
        </Text>
        <Text style={styles.reviewText}>{shippingInfo.country}</Text>
      </View>

      {/* Shipping Method Summary */}
      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewLabel}>Shipping Method</Text>
          <TouchableOpacity onPress={() => setActiveStep(0)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.reviewText}>
          {shippingOptions.find(s => s.id === selectedShipping)?.name}
        </Text>
        <Text style={styles.reviewTextMuted}>
          {shippingOptions.find(s => s.id === selectedShipping)?.time}
        </Text>
      </View>

      {/* Payment Summary */}
      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewLabel}>Payment Method</Text>
          <TouchableOpacity onPress={() => setActiveStep(1)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardSummary}>
          <Ionicons name="card" size={20} color={COLORS.gold} />
          <Text style={styles.reviewText}>
            •••• •••• •••• {paymentInfo.cardNumber.slice(-4)}
          </Text>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewLabel}>Order Items ({cartItems.length})</Text>
        {cartItems.map((item) => (
          <View key={item.cartId} style={styles.orderItem}>
            <Text style={styles.orderItemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.orderItemDetails}>
              {item.selectedColor} · {item.selectedSize} · Qty: {item.quantity}
            </Text>
            <Text style={styles.orderItemPrice}>
              ${(item.price * item.quantity).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (activeStep > 0) {
              setActiveStep(activeStep - 1);
            } else {
              navigation.goBack();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('checkout.title')}</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Steps Indicator */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <TouchableOpacity
              style={styles.stepItem}
              onPress={() => index <= activeStep && setActiveStep(index)}
            >
              <View style={[
                styles.stepCircle,
                index <= activeStep && styles.stepCircleActive,
              ]}>
                {index < activeStep ? (
                  <Ionicons name="checkmark" size={14} color={COLORS.white} />
                ) : (
                  <Text style={[
                    styles.stepNumber,
                    index <= activeStep && styles.stepNumberActive,
                  ]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                index <= activeStep && styles.stepLabelActive,
              ]}>
                {step}
              </Text>
            </TouchableOpacity>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepLine,
                index < activeStep && styles.stepLineActive,
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        {activeStep === 0 && renderShippingStep()}
        {activeStep === 1 && renderPaymentStep()}
        {activeStep === 2 && renderReviewStep()}

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>{t('checkout.orderSummary')}</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
            <Text style={styles.summaryValue}>${subtotal.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.shipping')}</Text>
            <Text style={styles.summaryValue}>
              {shippingCost === 0 ? t('cart.freeShipping') : `$${shippingCost}`}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.tax')}</Text>
            <Text style={styles.summaryValue}>${tax.toLocaleString()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{t('cart.total')}</Text>
            <Text style={styles.totalValue}>${total.toLocaleString()}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => {
            if (activeStep < 2) {
              setActiveStep(activeStep + 1);
            } else {
              handlePlaceOrder();
            }
          }}
        >
          <Text style={styles.continueBtnText}>
            {activeStep === 2 ? t('checkout.placeOrder') : t('common.next')}
          </Text>
          <Ionicons
            name={activeStep === 2 ? 'checkmark-circle' : 'arrow-forward'}
            size={20}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.black,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
    paddingBottom: 20,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.beigeDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: COLORS.gold,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
  },
  stepNumberActive: {
    color: COLORS.white,
  },
  stepLabel: {
    fontSize: 11,
    color: COLORS.gray,
  },
  stepLabelActive: {
    color: COLORS.black,
    fontWeight: '500',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.beigeDark,
    marginHorizontal: 8,
    marginBottom: 20,
  },
  stepLineActive: {
    backgroundColor: COLORS.gold,
  },
  stepContent: {
    padding: SIZES.padding,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusSm,
    padding: 14,
    fontSize: 15,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.beigeDark,
  },
  shippingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.beigeDark,
  },
  shippingOptionActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.beige,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gold,
  },
  shippingInfo: {
    flex: 1,
    marginLeft: 14,
  },
  shippingName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
  },
  shippingTime: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  shippingPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gold,
  },
  cardIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  secureText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.beige,
    borderRadius: SIZES.radius,
    marginTop: 8,
    gap: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  reviewSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  editBtn: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '500',
  },
  reviewText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  reviewTextMuted: {
    fontSize: 13,
    color: COLORS.gray,
  },
  cardSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.beigeDark,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  orderItemDetails: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gold,
    marginTop: 4,
  },
  summarySection: {
    margin: SIZES.padding,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.black,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.beigeDark,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.padding,
    paddingBottom: 34,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.beigeDark,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
    gap: 10,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default CheckoutScreen;
