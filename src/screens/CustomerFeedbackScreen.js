import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { feedbackQuestions, experienceTags, recentFeedback } from '../constants/mockData';
import Header from '../components/Header';
import Card from '../components/Card';

const CustomerFeedbackScreen = () => {
  const [ratings, setRatings] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');

  const handleRating = (questionId, rating) => {
    setRatings(prev => ({ ...prev, [questionId]: rating }));
  };

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const renderStars = (questionId, currentRating = 0) => {
    const savedRating = ratings[questionId] || 0;
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRating(questionId, star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= savedRating ? 'star' : 'star-outline'}
              size={28}
              color={star <= savedRating ? COLORS.gold : COLORS.lightGray}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Feedback"
        subtitle="Customer Experience"
        rightIcon="analytics-outline"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Survey Form */}
        <View style={styles.section}>
          <View style={styles.surveyHeader}>
            <Text style={styles.sectionTitle}>Rate Your Experience</Text>
            <View style={styles.clientBadge}>
              <Ionicons name="person" size={12} color={COLORS.gold} />
              <Text style={styles.clientBadgeText}>Isabella Rossi</Text>
            </View>
          </View>

          <Card style={styles.surveyCard}>
            {feedbackQuestions.map((question, index) => (
              <View
                key={question.id}
                style={[
                  styles.questionRow,
                  index !== feedbackQuestions.length - 1 && styles.questionDivider
                ]}
              >
                <Text style={styles.questionText}>{question.question}</Text>
                {renderStars(question.id)}
              </View>
            ))}
          </Card>
        </View>

        {/* Experience Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe Your Experience</Text>
          <Text style={styles.sectionSubtitle}>Select all that apply</Text>

          <View style={styles.tagsContainer}>
            {experienceTags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tag,
                  selectedTags.includes(tag.id) && styles.tagSelected
                ]}
                onPress={() => toggleTag(tag.id)}
              >
                {selectedTags.includes(tag.id) && (
                  <Ionicons name="checkmark" size={14} color={COLORS.gold} />
                )}
                <Text style={[
                  styles.tagText,
                  selectedTags.includes(tag.id) && styles.tagTextSelected
                ]}>
                  {tag.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Comments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Comments</Text>
          <Card style={styles.commentCard}>
            <TextInput
              style={styles.commentInput}
              placeholder="Share more about your experience..."
              placeholderTextColor={COLORS.gray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
            />
          </Card>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>

        {/* Recent Feedback */}
        <View style={styles.section}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Feedback</Text>
            <View style={styles.avgRating}>
              <Ionicons name="star" size={16} color={COLORS.gold} />
              <Text style={styles.avgRatingText}>4.8</Text>
            </View>
          </View>

          {recentFeedback.map((feedback) => (
            <Card key={feedback.id} style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <View style={styles.feedbackClient}>
                  <View style={styles.feedbackAvatar}>
                    <Text style={styles.feedbackAvatarText}>
                      {feedback.client.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.feedbackClientName}>{feedback.client}</Text>
                    <Text style={styles.feedbackDate}>{feedback.date}</Text>
                  </View>
                </View>
                <View style={styles.feedbackRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= feedback.rating ? 'star' : 'star-outline'}
                      size={14}
                      color={star <= feedback.rating ? COLORS.gold : COLORS.lightGray}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.feedbackComment}>{feedback.comment}</Text>
            </Card>
          ))}
        </View>

        {/* Stats Summary */}
        <View style={styles.section}>
          <Card style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Total Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Average Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </Card>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  surveyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
    paddingHorizontal: SIZES.padding,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
  },
  clientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.beige,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  clientBadgeText: {
    fontSize: SIZES.caption,
    color: COLORS.charcoal,
    fontWeight: '500',
  },
  surveyCard: {
    marginHorizontal: SIZES.padding,
    padding: 0,
    overflow: 'hidden',
  },
  questionRow: {
    padding: 20,
  },
  questionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  questionText: {
    fontSize: SIZES.body2,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.padding,
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 6,
  },
  tagSelected: {
    backgroundColor: COLORS.beige,
    borderColor: COLORS.gold,
  },
  tagText: {
    fontSize: SIZES.body3,
    color: COLORS.charcoal,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: COLORS.goldDark,
  },
  commentCard: {
    marginHorizontal: SIZES.padding,
    padding: 4,
  },
  commentInput: {
    fontSize: SIZES.body2,
    color: COLORS.black,
    padding: 12,
    minHeight: 100,
  },
  submitButton: {
    marginHorizontal: SIZES.padding,
    backgroundColor: COLORS.black,
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.white,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: 12,
  },
  avgRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avgRatingText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.charcoal,
  },
  feedbackCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
    padding: 16,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  feedbackClient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feedbackAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackAvatarText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.gold,
  },
  feedbackClientName: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.black,
  },
  feedbackDate: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    marginTop: 2,
  },
  feedbackRating: {
    flexDirection: 'row',
    gap: 2,
  },
  feedbackComment: {
    fontSize: SIZES.body2,
    color: COLORS.charcoal,
    lineHeight: 22,
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: SIZES.padding,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.black,
  },
  statLabel: {
    fontSize: SIZES.caption,
    color: COLORS.gray,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.cardBorder,
    marginVertical: 4,
  },
  bottomPadding: {
    height: 40,
  },
});

export default CustomerFeedbackScreen;
