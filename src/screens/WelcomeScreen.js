import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';

const WelcomeScreen = ({ navigation }) => {
  const { user, getGreeting, isNewUser } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.name}>{user.name}</Text>

        <View style={styles.divider} />

        {isNewUser ? (
          <>
            <Text style={styles.subtitle}>Welcome to your</Text>
            <Text style={styles.subtitleBold}>personal luxury experience</Text>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Welcome back to your</Text>
            <Text style={styles.subtitleBold}>personal luxury experience</Text>
          </>
        )}
      </Animated.View>

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() => navigation.replace('MainTabs')}
        activeOpacity={0.8}
      >
        <Text style={styles.continueBtnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  content: {
    alignItems: 'center',
    marginBottom: 60,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '300',
    color: COLORS.gray,
    letterSpacing: 1,
  },
  name: {
    fontSize: 36,
    fontWeight: '400',
    color: COLORS.black,
    letterSpacing: 2,
    marginTop: 8,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: COLORS.gold,
    marginVertical: 32,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '300',
    color: COLORS.gray,
    letterSpacing: 0.5,
  },
  subtitleBold: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.black,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  continueBtn: {
    position: 'absolute',
    bottom: 60,
    paddingVertical: 16,
    paddingHorizontal: 48,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.white,
    letterSpacing: 1,
  },
});

export default WelcomeScreen;
