import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground } from 'react-native';
import { COLORS } from '../constants/theme';

const SplashScreen = ({ navigation }) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 1000, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => navigation.replace('Welcome'), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require('../images/Banner/splash.webp')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: slide }] }]}>
        <Text style={styles.brand}>LUXESENSE</Text>
        <View style={styles.line} />
        <Text style={styles.tagline}>A New Way of Shopping</Text>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.46)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 44,
    fontWeight: '300',
    color: '#fff',
    letterSpacing: 14,
  },
  line: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.gold,
    marginVertical: 28,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.72)',
    letterSpacing: 3,
  },
});

export default SplashScreen;
