import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <Text style={styles.brand}>LUXESENSE</Text>
        <Text style={styles.brandAI}>AI</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>A New Way of Shopping</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  brand: {
    fontSize: 42,
    fontWeight: '300',
    color: COLORS.black,
    letterSpacing: 12,
  },
  brandAI: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.gold,
    letterSpacing: 8,
    marginTop: 4,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.gold,
    marginVertical: 24,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '300',
    color: COLORS.gray,
    letterSpacing: 2,
  },
});

export default SplashScreen;
