import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const ONBOARDING = [
  {
    id: 0,
    type: 'hero',
    image: require('../images/Banner/banner2.webp'),
  },
  {
    id: 1,
    type: 'grid',
    images: [
      require('../images/Banner/banner2.webp'),
      require('../images/Hermes/birkin.webp'),
      require('../images/Banner/banner5.webp'),
      require('../images/Chanel/boybag.webp'),
    ],
    title: 'Shop the most modern essentials',
  },
  {
    id: 2,
    type: 'swipe',
    image: require('../images/Banner/banner4.webp'),
    title: 'Swipe to browse',
    subtitle: 'Discover products by swiping from one category to another',
  },
  {
    id: 3,
    type: 'favourites',
    image: require('../images/Banner/banner3.jpg.webp'),
    title: 'Shop your favourites',
    subtitle: 'Personalise your shopping experience by following your top brands',
  },
];

const LandingScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { login } = useApp();
  const [step, setStep] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fade, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(btnFade, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleGuestLogin = () => {
    login('customer', { id: 'guest', name: 'Misafir', email: 'guest@luxesense.com' }, null);
    navigation.replace('MainTabs');
  };

  const next = () => {
    if (step < ONBOARDING.length - 1) setStep(step + 1);
    else navigation.navigate('Login');
  };

  const current = ONBOARDING[step];

  if (step === 0) {
    return (
      <ImageBackground source={current.image} style={styles.heroContainer} resizeMode="cover">
        <View style={styles.heroOverlay} />
        <Animated.View style={[styles.heroCenter, { opacity: fade }]}>
          <Text style={styles.heroBrand}>LUXESENSE</Text>
          <Text style={styles.heroAI}>AI</Text>
        </Animated.View>
        <Animated.View style={[styles.heroBottom, { opacity: btnFade }]}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Register')} activeOpacity={0.85}>
            <Ionicons name="mail-outline" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>Sign up with Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate('Login')} activeOpacity={0.85}>
            <Text style={styles.outlineBtnText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGuestLogin} style={styles.guestBtn}>
            <Text style={styles.guestBtnText}>{t('landing.browseAsGuest')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    );
  }

  if (current.type === 'grid') {
    return (
      <View style={styles.gridScreen}>
        <View style={styles.grid4}>
          {current.images.map((img, i) => (
            <Image key={i} source={img} style={styles.grid4Image} resizeMode="cover" />
          ))}
        </View>
        <View style={styles.bottomCard}>
          <Text style={styles.brandSmall}>LUXESENSE AI</Text>
          <Text style={styles.onboardTitle}>{current.title}</Text>
          <TouchableOpacity style={styles.darkBtn} onPress={next} activeOpacity={0.85}>
            <Text style={styles.darkBtnText}>Start Shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.alreadyText}>Already have an account? <Text style={styles.alreadyLink}>Log In</Text></Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dots}>
          {ONBOARDING.map((_, i) => (
            <View key={i} style={[styles.dot, styles.dotDark, i === step && styles.dotActiveDark]} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <ImageBackground source={current.image} style={styles.heroContainer} resizeMode="cover">
      <View style={styles.heroOverlay} />
      <View style={styles.onboardContent}>
        <Text style={styles.onboardTitle2}>{current.title}</Text>
        {current.subtitle ? <Text style={styles.onboardSubtitle}>{current.subtitle}</Text> : null}
        {current.type === 'swipe' && (
          <View style={styles.swipeIndicator}>
            <View style={styles.swipeLine} />
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
          </View>
        )}
      </View>
      <View style={styles.heroBottom}>
        <TouchableOpacity style={styles.primaryBtn} onPress={next} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Start Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.alreadyTextLight}>Already have an account? <Text style={styles.alreadyLinkLight}>Log In</Text></Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dots}>
        {ONBOARDING.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  heroContainer: { flex: 1 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  heroCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBrand: {
    fontSize: 42,
    fontWeight: '300',
    color: '#fff',
    letterSpacing: 12,
  },
  heroAI: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.gold,
    letterSpacing: 8,
    marginTop: 6,
  },
  heroBottom: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 60,
    gap: 12,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: '#1A1A1A',
    borderRadius: 28,
    gap: 10,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },
  outlineBtn: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  outlineBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  guestBtnText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textDecorationLine: 'underline',
  },
  dots: {
    position: 'absolute',
    bottom: 140,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 20,
  },
  dotDark: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  dotActiveDark: {
    backgroundColor: '#1A1A1A',
    width: 20,
  },
  gridScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  grid4: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: height * 0.55,
  },
  grid4Image: {
    width: width / 2,
    height: '50%',
  },
  bottomCard: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 28,
    gap: 12,
  },
  brandSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gold,
    letterSpacing: 3,
  },
  onboardTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 32,
    marginBottom: 4,
  },
  darkBtn: {
    height: 56,
    backgroundColor: '#1A1A1A',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  darkBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  alreadyText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#888',
  },
  alreadyLink: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  onboardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.padding,
    paddingBottom: 24,
  },
  onboardTitle2: {
    fontSize: 30,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 36,
    marginBottom: 10,
  },
  onboardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
  },
  swipeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  swipeLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  alreadyTextLight: {
    textAlign: 'center',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  alreadyLinkLight: {
    color: '#fff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LandingScreen;
