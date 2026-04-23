import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, ScrollView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';

// Brand scoring by avg price point
const BRAND_SCORES = {
  'HERMÈS':       5,
  'CARTIER':      5,
  'ROLEX':        5,
  'CHANEL':       4,
  'DIOR':         3,
  'LOUIS VUITTON':3,
  'GUCCI':        2,
  'PRADA':        2,
};

const ALL_BRANDS = Object.keys(BRAND_SCORES);

const QUESTIONS = [
  {
    id: 1,
    type: 'multi',
    question: 'Which brands do you shop the most?',
    subtitle: 'Select all that apply',
    options: ALL_BRANDS.map(b => ({ key: b, label: b.charAt(0) + b.slice(1).toLowerCase().replace('È', 'è').replace('Ë', 'ë') })),
  },
  {
    id: 2,
    type: 'single',
    question: 'How often do you shop for luxury?',
    subtitle: 'Think about the past year',
    options: [
      { key: 'freq_5', score: 5, label: 'Several times a year' },
      { key: 'freq_4', score: 4, label: 'A few times a year' },
      { key: 'freq_3', score: 3, label: 'Once or twice a year' },
      { key: 'freq_2', score: 2, label: 'Only for special occasions' },
      { key: 'freq_1', score: 1, label: "I'm just beginning to explore" },
    ],
  },
  {
    id: 3,
    type: 'single',
    question: 'How would you describe your personal style?',
    subtitle: 'Choose the one that resonates most',
    options: [
      { key: 'style_5', score: 5, label: 'Classic and timeless' },
      { key: 'style_4', score: 4, label: 'Modern and minimal' },
      { key: 'style_3', score: 3, label: 'Bold and expressive' },
      { key: 'style_2', score: 2, label: 'Effortlessly casual' },
      { key: 'style_1', score: 1, label: 'Still discovering my aesthetic' },
    ],
  },
  {
    id: 4,
    type: 'single',
    question: 'How often would you like to hear about new arrivals?',
    subtitle: 'We will tailor your notifications accordingly',
    options: [
      { key: 'notif_daily',   score: 5, label: 'As soon as they drop',     notifPref: 'daily' },
      { key: 'notif_weekly',  score: 4, label: 'A few times a week',        notifPref: 'weekly' },
      { key: 'notif_once',    score: 3, label: 'Once a week',               notifPref: 'weekly' },
      { key: 'notif_monthly', score: 2, label: 'Monthly',                   notifPref: 'monthly' },
      { key: 'notif_rare',    score: 1, label: 'Only for very special pieces', notifPref: 'rarely' },
    ],
  },
  {
    id: 5,
    type: 'single',
    question: "What's your typical budget for a luxury purchase?",
    subtitle: 'An honest answer helps us recommend the right pieces',
    options: [
      { key: 'budget_5', score: 5, label: '$10,000 and above' },
      { key: 'budget_4', score: 4, label: '$5,000 – $10,000' },
      { key: 'budget_3', score: 3, label: '$2,000 – $5,000' },
      { key: 'budget_2', score: 2, label: '$500 – $2,000' },
      { key: 'budget_1', score: 1, label: 'Under $500' },
    ],
  },
  {
    id: 6,
    type: 'single',
    question: 'When investing in a piece, what matters most to you?',
    subtitle: 'This shapes the recommendations you will see',
    options: [
      { key: 'val_5', score: 5, label: 'Its long-term investment value' },
      { key: 'val_4', score: 4, label: 'Exceptional craftsmanship and heritage' },
      { key: 'val_4b', score: 4, label: 'Exclusivity and rarity' },
      { key: 'val_3', score: 3, label: 'Personal expression and originality' },
      { key: 'val_2', score: 2, label: 'A meaningful reward for a milestone' },
    ],
  },
];

// Max possible score: 30 (6 questions × 5 pts)
// LIRA segments: Premium 22-30, Selective 12-21, Explorer 0-11
const getLISProfileFromScore = (score) => {
  if (score >= 22) return 'Premium';
  if (score >= 12) return 'Selective';
  return 'Explorer';
};

const StyleQuizScreen = ({ navigation }) => {
  const { completeStyleQuiz } = useApp();
  const [step, setStep] = useState(0); // 0=intro, 1-6=questions, 7=result
  const [brandSelections, setBrandSelections] = useState([]); // multi-select for Q1
  const [scoreAccum, setScoreAccum] = useState(0);
  const [notifPref, setNotifPref] = useState('weekly');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const totalSteps = QUESTIONS.length;
  const currentQ = QUESTIONS[step - 1];

  const transition = (cb) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      cb();
      Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
    });
  };

  const toggleBrand = (brand) => {
    setBrandSelections(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleBrandNext = () => {
    const brandScore = brandSelections.length === 0
      ? 1
      : Math.round(brandSelections.reduce((sum, b) => sum + BRAND_SCORES[b], 0) / brandSelections.length);
    setScoreAccum(prev => prev + brandScore);
    transition(() => setStep(2));
  };

  const handleSingleAnswer = (option) => {
    const newScore = scoreAccum + option.score;
    if (option.notifPref) setNotifPref(option.notifPref);

    if (step < totalSteps) {
      setScoreAccum(newScore);
      transition(() => setStep(step + 1));
    } else {
      // Last question
      const profile = getLISProfileFromScore(newScore);
      transition(async () => {
        setStep(totalSteps + 1);
        await completeStyleQuiz(newScore, profile, notifPref);
      });
    }
  };

  const handleSkip = async () => {
    await completeStyleQuiz(0, 'Explorer', 'weekly');
    navigation.replace('MainTabs');
  };

  const handleFinish = () => {
    navigation.replace('MainTabs');
  };

  const progress = step > 0 && step <= totalSteps ? step / totalSteps : step > totalSteps ? 1 : 0;

  // ── Intro ─────────────────────────────────────────────
  if (step === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Animated.View style={[styles.introContent, { opacity: fadeAnim }]}>
          <Text style={styles.introLabel}>LUXESENSE</Text>
          <Text style={styles.introTitle}>A Few Quick{'\n'}Questions</Text>
          <View style={styles.goldLine} />
          <Text style={styles.introSubtitle}>
            Help us understand your taste so we can make your experience truly personal — from the pieces we surface to the way your advisor reaches out.
          </Text>
          <View style={styles.pillRow}>
            {['6 Questions', '3 Minutes', 'Personalised'].map(t => (
              <View key={t} style={styles.pill}>
                <Text style={styles.pillText}>{t}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.startBtn} onPress={() => transition(() => setStep(1))}>
            <Text style={styles.startBtnText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // ── Thank You / Result ────────────────────────────────
  if (step > totalSteps) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.thankYouContent}>
          <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={36} color={COLORS.gold} />
            </View>
            <Text style={styles.thankYouTitle}>Thank you for sharing.</Text>
            <View style={styles.goldLine} />
            <Text style={styles.thankYouBody}>
              We will use your answers to personalise your shopping experience — from the pieces we recommend to how your advisor reaches out.
            </Text>
            <Text style={styles.thankYouSub}>
              Your curated selection is ready.
            </Text>
            <TouchableOpacity style={styles.startBtn} onPress={handleFinish}>
              <Text style={styles.startBtnText}>Start Exploring</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  // ── Q1: Multi-select brands ──────────────────────────
  if (currentQ.type === 'multi') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{step} / {totalSteps}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.questionScroll} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.questionNumber}>Question {step}</Text>
            <Text style={styles.questionText}>{currentQ.question}</Text>
            <Text style={styles.questionSubtitle}>{currentQ.subtitle}</Text>

            <View style={styles.brandGrid}>
              {currentQ.options.map(opt => {
                const selected = brandSelections.includes(opt.key);
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[styles.brandChip, selected && styles.brandChipSelected]}
                    onPress={() => toggleBrand(opt.key)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.brandChipText, selected && styles.brandChipTextSelected]}>
                      {opt.label}
                    </Text>
                    {selected && (
                      <Ionicons name="checkmark" size={14} color={COLORS.white} style={{ marginLeft: 6 }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.nextBtn, brandSelections.length === 0 && styles.nextBtnDisabled]}
              onPress={handleBrandNext}
            >
              <Text style={styles.nextBtnText}>
                {brandSelections.length === 0 ? 'Skip this one' : 'Continue'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // ── Single-select questions ──────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{step} / {totalSteps}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.questionScroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.questionNumber}>Question {step}</Text>
          <Text style={styles.questionText}>{currentQ.question}</Text>
          <Text style={styles.questionSubtitle}>{currentQ.subtitle}</Text>

          {currentQ.options.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={styles.optionCard}
              onPress={() => handleSingleAnswer(opt)}
              activeOpacity={0.75}
            >
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.lightGray} />
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // Intro
  introContent: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 100,
    paddingBottom: 50,
  },
  introLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAA',
    letterSpacing: 4,
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -1,
    lineHeight: 46,
    marginBottom: 20,
  },
  goldLine: {
    width: 32,
    height: 2,
    backgroundColor: COLORS.gold,
    marginBottom: 20,
  },
  introSubtitle: {
    fontSize: 15,
    color: '#888',
    lineHeight: 24,
    marginBottom: 36,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 48,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#F5F0EB',
    borderRadius: 20,
  },
  pillText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    height: 56,
    borderRadius: 28,
    gap: 10,
    marginBottom: 16,
  },
  startBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },
  skipBtn: {
    alignItems: 'center',
    padding: 12,
  },
  skipText: {
    fontSize: 14,
    color: '#AAA',
    textDecorationLine: 'underline',
  },

  // Progress
  progressContainer: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 60,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: '#F0EDE8',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#AAA',
    fontWeight: '500',
    minWidth: 36,
    textAlign: 'right',
  },

  // Question
  questionScroll: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 28,
    paddingBottom: 40,
  },
  questionNumber: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.gold,
    letterSpacing: 3,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 32,
  },

  // Single option cards
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F0EB',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
  },

  // Multi-select brand chips
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },
  brandChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#F5F0EB',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  brandChipSelected: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  brandChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  brandChipTextSelected: {
    color: '#fff',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    height: 56,
    borderRadius: 28,
    gap: 10,
    marginTop: 8,
  },
  nextBtnDisabled: {
    backgroundColor: '#CCCCCC',
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },

  // Thank You screen
  thankYouContent: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F5F0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  thankYouTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  thankYouBody: {
    fontSize: 15,
    color: '#888',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  thankYouSub: {
    fontSize: 13,
    color: '#AAA',
    textAlign: 'center',
    marginBottom: 48,
  },
});

export default StyleQuizScreen;
