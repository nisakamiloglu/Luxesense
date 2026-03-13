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
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const FeedbackScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [ratings, setRatings] = useState({
    overall: 0,
    quality: 0,
    service: 0,
    delivery: 0,
  });
  const [review, setReview] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const feedbackTags = [
    'Fast Delivery',
    'Great Quality',
    'Excellent Service',
    'Beautiful Packaging',
    'As Described',
    'Will Buy Again',
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
      Alert.alert('Rating Required', 'Please provide an overall rating');
      return;
    }
    Alert.alert(
      'Thank You!',
      'Your feedback has been submitted successfully.',
      [
        {
          text: 'Continue Shopping',
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
        <Text style={styles.headerTitle}>Rate Your Experience</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipBtn}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Overall Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>How was your overall experience?</Text>
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
            {ratings.overall === 0 && 'Tap to rate'}
            {ratings.overall === 1 && 'Poor'}
            {ratings.overall === 2 && 'Fair'}
            {ratings.overall === 3 && 'Good'}
            {ratings.overall === 4 && 'Very Good'}
            {ratings.overall === 5 && 'Excellent'}
          </Text>
        </View>

        {/* Detailed Ratings */}
        <View style={styles.detailedSection}>
          <Text style={styles.sectionTitle}>Rate specific aspects</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingCategory}>Product Quality</Text>
            {renderStars('quality', ratings.quality)}
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingCategory}>Customer Service</Text>
            {renderStars('service', ratings.service)}
          </View>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingCategory}>Delivery Experience</Text>
            {renderStars('delivery', ratings.delivery)}
          </View>
        </View>

        {/* Quick Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>What did you love?</Text>
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
          <Text style={styles.sectionTitle}>Write a review (optional)</Text>
          <View style={styles.reviewInput}>
            <TextInput
              style={styles.textArea}
              placeholder="Share your experience with this order..."
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
          <Text style={styles.submitBtnText}>Submit Feedback</Text>
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
