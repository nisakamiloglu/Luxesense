import React, { useState } from 'react';
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

const FeedbackScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const order = route?.params?.order || { orderNumber: 'N/A' };
  const [ratings, setRatings] = useState({
    overall: 0,
    quality: 0,
    service: 0,
    delivery: 0,
  });
  const [review, setReview] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const feedbackTags = [
    t('feedback.fastDelivery'),
    t('feedback.greatQuality'),
    t('feedback.excellentService'),
    t('feedback.beautifulPackaging'),
    t('feedback.asDescribed'),
    t('feedback.willBuyAgain'),
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const renderStars = (category, rating) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRatings({ ...ratings, [category]: star })}
        >
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={32}
            color={star <= rating ? COLORS.gold : COLORS.lightGray}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const handleSubmit = () => {
    if (ratings.overall === 0) {
      Alert.alert(t('feedback.ratingRequired'), t('feedback.pleaseProvideRating'));
      return;
    }
    Alert.alert(
      t('feedback.thankYou'),
      t('feedback.feedbackSubmitted'),
      [
        {
          text: t('feedback.continueShopping'),
          onPress: () => navigation.navigate('MainTabs'),
        },
      ]
    );
  };

  const handleSkip = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 44 }} />
        <Text style={styles.headerTitle}>{t('feedback.title')}</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipBtn}>{t('feedback.skip')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Overall Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>{t('feedback.overallExperience')}</Text>
          <View style={styles.mainStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRatings({ ...ratings, overall: star })}
              >
                <Ionicons
                  name={star <= ratings.overall ? 'star' : 'star-outline'}
                  size={44}
                  color={star <= ratings.overall ? COLORS.gold : COLORS.lightGray}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingLabel}>
            {ratings.overall === 0 && t('feedback.tapToRate')}
            {ratings.overall === 1 && t('feedback.poor')}
            {ratings.overall === 2 && t('feedback.fair')}
            {ratings.overall === 3 && t('feedback.good')}
            {ratings.overall === 4 && t('feedback.veryGood')}
            {ratings.overall === 5 && t('feedback.excellent')}
          </Text>
        </View>

        {/* Detailed Ratings */}
        <View style={styles.detailedSection}>
          <Text style={styles.sectionTitle}>{t('feedback.rateAspects')}</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingCategory}>{t('feedback.productQuality')}</Text>
            {renderStars('quality', ratings.quality)}
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingCategory}>{t('feedback.customerService')}</Text>
            {renderStars('service', ratings.service)}
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingCategory}>{t('feedback.deliveryExperience')}</Text>
            {renderStars('delivery', ratings.delivery)}
          </View>
        </View>

        {/* Quick Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>{t('feedback.whatDidYouLove')}</Text>
          <View style={styles.tagsContainer}>
            {feedbackTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.tagSelected,
                ]}
                onPress={() => toggleTag(tag)}
              >
                {selectedTags.includes(tag) && (
                  <Ionicons name="checkmark" size={14} color={COLORS.white} />
                )}
                <Text
                  style={[
                    styles.tagText,
                    selectedTags.includes(tag) && styles.tagTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Written Review */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>{t('feedback.writeReview')}</Text>
          <View style={styles.reviewInput}>
            <TextInput
              style={styles.textArea}
              placeholder={t('feedback.placeholder')}
              placeholderTextColor={COLORS.gray}
              multiline
              numberOfLines={4}
              value={review}
              onChangeText={setReview}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>{t('feedback.submit')}</Text>
          <Ionicons name="send" size={18} color={COLORS.white} />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
  },
  skipBtn: {
    fontSize: 15,
    color: COLORS.gray,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    marginHorizontal: SIZES.padding,
    backgroundColor: '#E8F5E9',
    borderRadius: SIZES.radius,
    marginBottom: 24,
  },
  orderText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.success,
  },
  ratingSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: 20,
    ...SHADOWS.light,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 20,
  },
  mainStars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 15,
    color: COLORS.gold,
    fontWeight: '500',
  },
  detailedSection: {
    marginHorizontal: SIZES.padding,
    marginBottom: 20,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 16,
  },
  ratingRow: {
    marginBottom: 16,
  },
  ratingCategory: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  tagsSection: {
    marginHorizontal: SIZES.padding,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.beigeDark,
    gap: 6,
  },
  tagSelected: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  tagText: {
    fontSize: 13,
    color: COLORS.black,
  },
  tagTextSelected: {
    color: COLORS.white,
    fontWeight: '500',
  },
  reviewSection: {
    marginHorizontal: SIZES.padding,
  },
  reviewInput: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    ...SHADOWS.light,
  },
  textArea: {
    fontSize: 15,
    color: COLORS.black,
    minHeight: 100,
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
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
    gap: 10,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default FeedbackScreen;
