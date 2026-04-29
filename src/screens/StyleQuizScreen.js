import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, ScrollView, StatusBar, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useApp } from '../context/AppContext';

const BRAND_SCORES = {
  'HERMÈS':        5,
  'CARTIER':       5,
  'ROLEX':         5,
  'CHANEL':        4,
  'DIOR':          3,
  'LOUIS VUITTON': 3,
  'GUCCI':         2,
  'PRADA':         2,
};

const ALL_BRANDS = Object.keys(BRAND_SCORES);

const QUESTIONS = [
  {
    id: 1,
    type: 'multi',
    question: 'Which brands do you shop the most?',
    subtitle: 'Select all that apply',
    options: ALL_BRANDS.map(b => ({ key: b, label: b })),
  },
  {
    id: 2,
    type: 'single',
    question: 'How often do you shop for luxury?',
    subtitle: 'Think about the past year',
    options: [
      { key: 'freq_5', score: 5, label: 'Several times a year',          hint: 'Luxury is a lifestyle' },
      { key: 'freq_4', score: 4, label: 'A few times a year',             hint: 'Curated and intentional' },
      { key: 'freq_3', score: 3, label: 'Once or twice a year',           hint: 'Special moments' },
      { key: 'freq_2', score: 2, label: 'Only for special occasions',     hint: 'Milestone purchases' },
      { key: 'freq_1', score: 1, label: "I'm just beginning to explore",  hint: 'New to luxury' },
    ],
  },
  {
    id: 3,
    type: 'single',
    question: 'How would you describe your personal style?',
    subtitle: 'Choose the one that resonates most',
    options: [
      { key: 'style_5', score: 5, label: 'Classic and timeless',           hint: 'Hermès, Cartier' },
      { key: 'style_4', score: 4, label: 'Modern and minimal',             hint: 'Celine, Bottega' },
      { key: 'style_3', score: 3, label: 'Bold and expressive',            hint: 'Gucci, Dior' },
      { key: 'style_2', score: 2, label: 'Effortlessly casual',            hint: 'Off-duty chic' },
      { key: 'style_1', score: 1, label: 'Still discovering my aesthetic', hint: 'Open to all' },
    ],
  },
  {
    id: 4,
    type: 'single',
    question: 'How often would you like to hear about new arrivals?',
    subtitle: 'We will tailor your notifications accordingly',
    options: [
      { key: 'notif_daily',   score: 5, label: 'As soon as they drop',        hint: 'Every day',     notifPref: 'daily' },
      { key: 'notif_weekly',  score: 4, label: 'A few times a week',           hint: '2–3× weekly',   notifPref: 'weekly' },
      { key: 'notif_once',    score: 3, label: 'Once a week',                  hint: 'Weekly digest', notifPref: 'weekly' },
      { key: 'notif_monthly', score: 2, label: 'Monthly',                      hint: 'Once a month',  notifPref: 'monthly' },
      { key: 'notif_rare',    score: 1, label: 'Only for very special pieces', hint: 'Rarely',        notifPref: 'rarely' },
    ],
  },
  {
    id: 5,
    type: 'single',
    question: "What's your typical budget for a luxury purchase?",
    subtitle: 'An honest answer helps us recommend the right pieces',
    options: [
      { key: 'budget_5', score: 5, label: '$10,000 and above', hint: 'Ultra premium' },
      { key: 'budget_4', score: 4, label: '$5,000 – $10,000',  hint: 'High luxury' },
      { key: 'budget_3', score: 3, label: '$2,000 – $5,000',   hint: 'Accessible luxury' },
      { key: 'budget_2', score: 2, label: '$500 – $2,000',     hint: 'Entry luxury' },
      { key: 'budget_1', score: 1, label: 'Under $500',        hint: 'Gifting range' },
    ],
  },
  {
    id: 6,
    type: 'single',
    question: 'When investing in a piece, what matters most to you?',
    subtitle: 'This shapes the recommendations you will see',
    options: [
      { key: 'val_5',  score: 5, label: 'Its long-term investment value',         hint: 'Asset mindset' },
      { key: 'val_4',  score: 4, label: 'Exceptional craftsmanship and heritage', hint: 'Artisan quality' },
      { key: 'val_4b', score: 4, label: 'Exclusivity and rarity',                 hint: 'One of a kind' },
      { key: 'val_3',  score: 3, label: 'Personal expression and originality',    hint: 'My signature' },
      { key: 'val_2',  score: 2, label: 'A meaningful reward for a milestone',    hint: 'Celebrating me' },
    ],
  },
];

const getLISProfileFromScore = (score) => {
  if (score >= 22) return 'Premium';
  if (score >= 12) return 'Selective';
  return 'Explorer';
};

const StyleQuizScreen = ({ navigation }) => {
  const { completeStyleQuiz } = useApp();
  const [step, setStep]                      = useState(0);
  const [brandSelections, setBrandSelections] = useState([]);
  const [scoreAccum, setScoreAccum]          = useState(0);
  const [notifPref, setNotifPref]            = useState('weekly');
  const [selectedOption, setSelectedOption]  = useState(null);
  const [selectedBudgetKey, setSelectedBudgetKey] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const totalSteps = QUESTIONS.length;
  const currentQ   = QUESTIONS[step - 1];
  const progress   = step > 0 && step <= totalSteps ? step / totalSteps : step > totalSteps ? 1 : 0;

  const transition = (cb) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => {
      cb();
      setSelectedOption(null);
      Animated.timing(fadeAnim, { toValue: 1, duration: 260, useNativeDriver: true }).start();
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
    setSelectedOption(option.key);
    const newScore = scoreAccum + option.score;
    if (option.notifPref) setNotifPref(option.notifPref);

    // Capture budget selection (Q5)
    if (step === 5) setSelectedBudgetKey(option.key);

    if (step < totalSteps) {
      setScoreAccum(newScore);
      setTimeout(() => transition(() => setStep(step + 1)), 180);
    } else {
      const profile = getLISProfileFromScore(newScore);
      const budgetKey = step === 5 ? option.key : selectedBudgetKey;
      setTimeout(() => transition(async () => {
        setStep(totalSteps + 1);
        await completeStyleQuiz(newScore, profile, notifPref, brandSelections, budgetKey);
      }), 180);
    }
  };

  const handleSkip = async () => {
    await completeStyleQuiz(0, 'Explorer', 'weekly');
    navigation.replace('MainTabs');
  };

  // ── Intro ──────────────────────────────────────────────
  if (step === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Animated.View style={[styles.introWrap, { opacity: fadeAnim }]}>
          <View style={styles.introTop}>
            <Text style={styles.introEyebrow}>LUXESENSE</Text>
            <Text style={styles.introTitle}>A Few Quick{'\n'}Questions</Text>
            <View style={styles.goldLine} />
            <Text style={styles.introSubtitle}>
              Help us understand your taste so we can make your experience truly personal — from the pieces we surface to the way your advisor reaches out.
            </Text>
          </View>

          <View style={styles.pillRow}>
            {[
              { icon: 'list-outline',        label: '6 Questions' },
              { icon: 'time-outline',        label: '3 Minutes' },
              { icon: 'lock-closed-outline', label: 'Private' },
            ].map(p => (
              <View key={p.label} style={styles.pill}>
                <Ionicons name={p.icon} size={13} color={COLORS.gold} />
                <Text style={styles.pillText}>{p.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.introActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => transition(() => setStep(1))} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={handleSkip}>
              <Text style={styles.ghostBtnText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── Result ─────────────────────────────────────────────
  if (step > totalSteps) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Animated.View style={[styles.resultWrap, { opacity: fadeAnim }]}>
          <View style={styles.resultIconWrap}>
            <Ionicons name="checkmark" size={32} color={COLORS.gold} />
          </View>
          <Text style={styles.resultTitle}>Thank you{'\n'}for sharing.</Text>
          <View style={styles.goldLine} />
          <Text style={styles.resultDesc}>
            We will use your answers to personalise your shopping experience — from the pieces we recommend to how your advisor reaches out.
          </Text>
          <View style={styles.resultHints}>
            {[
              { icon: 'bag-outline',      text: 'Personalised product feed' },
              { icon: 'person-outline',   text: 'Matched advisor outreach' },
              { icon: 'sparkles-outline', text: 'Curated recommendations' },
            ].map(h => (
              <View key={h.text} style={styles.resultHintRow}>
                <View style={styles.resultHintIcon}>
                  <Ionicons name={h.icon} size={14} color={COLORS.gold} />
                </View>
                <Text style={styles.resultHintText}>{h.text}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.primaryBtn, { marginTop: 32 }]}
            onPress={() => navigation.replace('MainTabs')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Start Exploring</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── Progress bar (shared) ──────────────────────────────
  const ProgressBar = () => (
    <View style={styles.progressWrap}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressLabel}>{step} / {totalSteps}</Text>
    </View>
  );

  // ── Q1: Brand list ─────────────────────────────────────
  if (currentQ.type === 'multi') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ProgressBar />
        <ScrollView contentContainerStyle={styles.qScroll} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.qStep}>Question {step}</Text>
            <Text style={styles.qTitle}>{currentQ.question}</Text>
            <Text style={styles.qSub}>{currentQ.subtitle}</Text>

            <View style={styles.brandList}>
              {currentQ.options.map(opt => {
                const sel = brandSelections.includes(opt.key);
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[styles.brandRow, sel && styles.brandRowSel]}
                    onPress={() => toggleBrand(opt.key)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.brandRowText, sel && styles.brandRowTextSel]}>
                      {opt.label}
                    </Text>
                    <View style={[styles.brandCheck, sel && styles.brandCheckSel]}>
                      {sel && <Ionicons name="checkmark" size={13} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, brandSelections.length === 0 && styles.primaryBtnMuted]}
              onPress={handleBrandNext}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {brandSelections.length === 0 ? 'Skip this one' : `Continue (${brandSelections.length} selected)`}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Single-select questions ────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ProgressBar />
      <ScrollView contentContainerStyle={styles.qScroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.qStep}>Question {step}</Text>
          <Text style={styles.qTitle}>{currentQ.question}</Text>
          <Text style={styles.qSub}>{currentQ.subtitle}</Text>

          <View style={styles.optionList}>
            {currentQ.options.map(opt => {
              const active = selectedOption === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.optionCard, active && styles.optionCardActive]}
                  onPress={() => handleSingleAnswer(opt)}
                  activeOpacity={0.75}
                >
                  <View style={styles.optionBody}>
                    <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                      {opt.label}
                    </Text>
                    {opt.hint && (
                      <Text style={styles.optionHint}>{opt.hint}</Text>
                    )}
                  </View>
                  <View style={[styles.optionRadio, active && styles.optionRadioActive]}>
                    {active && <View style={styles.optionRadioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  // ── Intro ──
  introWrap: {
    flex: 1, paddingHorizontal: SIZES.padding,
    paddingTop: 40, paddingBottom: 36, justifyContent: 'space-between',
  },
  introTop: { flex: 1, justifyContent: 'center' },
  introEyebrow: {
    fontSize: 11, fontWeight: '700', color: '#AAAAAA',
    letterSpacing: 4, marginBottom: 24,
  },
  introTitle: {
    fontSize: 34, fontWeight: '500', color: '#1A1A1A',
    letterSpacing: -0.5, lineHeight: 42, marginBottom: 20,
  },
  goldLine: { width: 32, height: 2, backgroundColor: COLORS.gold, marginBottom: 20 },
  introSubtitle: { fontSize: 15, color: '#888', lineHeight: 24, maxWidth: '90%' },
  pillRow: { flexDirection: 'row', gap: 8, marginVertical: 32 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#F5F0EB', borderRadius: 20,
  },
  pillText: { fontSize: 12, color: '#888', fontWeight: '500' },
  introActions: { gap: 10 },

  // ── Buttons ──
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1A1A1A', height: 56, borderRadius: 14, gap: 10,
  },
  primaryBtnMuted: { backgroundColor: '#CCCCCC' },
  primaryBtnText: { fontSize: 15, fontWeight: '600', color: '#fff', letterSpacing: 0.2 },
  ghostBtn: { alignItems: 'center', paddingVertical: 14 },
  ghostBtnText: { fontSize: 14, color: '#AAAAAA', textDecorationLine: 'underline' },

  // ── Progress ──
  progressWrap: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SIZES.padding, paddingTop: 16, paddingBottom: 8, gap: 12,
  },
  progressTrack: {
    flex: 1, height: 3, backgroundColor: '#F0EDE8',
    borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.gold, borderRadius: 2 },
  progressLabel: { fontSize: 12, color: '#AAAAAA', fontWeight: '500', minWidth: 32, textAlign: 'right' },

  // ── Question body ──
  qScroll: { paddingHorizontal: SIZES.padding, paddingTop: 24, paddingBottom: 48 },
  qStep: { fontSize: 11, fontWeight: '500', color: COLORS.gold, letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' },
  qTitle: { fontSize: 22, fontWeight: '500', color: '#1A1A1A', lineHeight: 30, marginBottom: 6 },
  qSub:   { fontSize: 13, color: '#AAAAAA', marginBottom: 28 },

  // ── Brand list ──
  brandList: { gap: 0, marginBottom: 28, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#F0EDE8' },
  brandRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 16,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0EDE8',
  },
  brandRowSel: { backgroundColor: '#FAF8F5' },
  brandRowText:    { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  brandRowTextSel: { color: '#1A1A1A' },
  brandCheck: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#DDDDDD',
    justifyContent: 'center', alignItems: 'center',
  },
  brandCheckSel: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },

  // ── Single options ──
  optionList: { gap: 10 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F0EB', borderRadius: 14,
    paddingHorizontal: 18, paddingVertical: 16, gap: 12,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  optionCardActive: { backgroundColor: '#fff', borderColor: COLORS.gold },
  optionBody: { flex: 1 },
  optionLabel:       { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  optionLabelActive: { color: '#1A1A1A' },
  optionHint:        { fontSize: 11, color: '#AAAAAA', marginTop: 3 },
  optionRadio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: '#CCCCCC',
    justifyContent: 'center', alignItems: 'center',
  },
  optionRadioActive: { borderColor: COLORS.gold },
  optionRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.gold },

  // ── Result ──
  resultWrap: {
    flex: 1, paddingHorizontal: SIZES.padding,
    paddingTop: 72, paddingBottom: 44, alignItems: 'center',
  },
  resultIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#F5F0EB',
    justifyContent: 'center', alignItems: 'center', marginBottom: 28,
  },
  resultTitle: {
    fontSize: 30, fontWeight: '500', color: '#1A1A1A',
    letterSpacing: -0.3, lineHeight: 38, textAlign: 'center', marginBottom: 20,
  },
  resultDesc: {
    fontSize: 14, color: '#888', lineHeight: 22,
    textAlign: 'center', marginBottom: 32, paddingHorizontal: 8,
  },
  resultHints: { width: '100%', gap: 10 },
  resultHintRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F5F0EB', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  resultHintIcon: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  resultHintText: { fontSize: 13, fontWeight: '500', color: '#1A1A1A' },
});

export default StyleQuizScreen;
