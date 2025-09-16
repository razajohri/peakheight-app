// Onboarding14.js (Page 14 - Testimonial page and Rating pop up)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

const Onboarding14 = ({ navigation }) => {
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '93%' }]} />
        </View>
        <Text style={styles.progressText}>14/15</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Success stories</Text>

        <View style={[styles.testimonialCard, styles.firstCard]}>
          <View style={styles.testimonialHeader}>
            <Image
              source={require('../../../assets/peakheight-logo.jpg')}
              style={styles.avatarSmall}
            />
            <View style={styles.testimonialHeaderText}>
              <Text style={styles.testimonialName}>Michael, 17</Text>
              <Text style={styles.testimonialResult}>+2.3 inches in 4 months</Text>
            </View>
          </View>

          <Text style={styles.testimonialQuoteSmall}>
            "PeakHeight helped me add over 2 inches in 4 months. Consistent sleep and posture work made the difference."
          </Text>
        </View>

        <View style={styles.testimonialCard}>
          <View style={styles.testimonialHeader}>
            <Image
              source={require('../../../assets/peakheight-logo.jpg')}
              style={styles.avatar}
            />
            <View style={styles.testimonialHeaderText}>
              <Text style={styles.testimonialName}>Sarah, 16</Text>
              <Text style={styles.testimonialResult}>+1.7 inches in 6 months</Text>
            </View>
          </View>

          <Text style={styles.testimonialQuote}>
            "The nutrition advice and stretching routines helped me grow taller than both my parents. My posture has improved significantly too."
          </Text>
        </View>

        <TouchableOpacity
          style={styles.ratingButton}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setRatingModalVisible(true); }}
        >
          <Text style={styles.ratingButtonText}>Rate the app</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding15')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Rating Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={ratingModalVisible}
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How would you rate PeakHeight?</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  onPress={() => setSelectedRating(rating)}
                >
                  <FontAwesome
                    name={rating <= selectedRating ? "star" : "star-o"}
                    size={32}
                    color={rating <= selectedRating ? "#FFD700" : "#AAAAAA"}
                    style={styles.star}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setRatingModalVisible(false); }}
              >
                <Text style={styles.modalSecondaryButtonText}>Later</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalPrimaryButton,
                  selectedRating === 0 && styles.modalPrimaryButtonDisabled
                ]}
                disabled={selectedRating === 0}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setRatingModalVisible(false);
                  // Handle rating submission
                }}
              >
                <Text style={styles.modalPrimaryButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 4,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#1f1f1f',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  testimonialCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  testimonialHeaderText: {
    flex: 1,
  },
  testimonialName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  testimonialResult: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  testimonialQuote: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  testimonialQuoteSmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  firstCard: {
    paddingVertical: 12,
  },
  ratingButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  ratingButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#9CA3AF',
  },
  buttonContainer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  star: {
    marginHorizontal: 8,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalSecondaryButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    borderRadius: 12,
  },
  modalSecondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalPrimaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  modalPrimaryButtonDisabled: {
    backgroundColor: '#1f1f1f',
    borderColor: '#0a0a0a',
  },
  modalPrimaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#000000',
  },
});

export default Onboarding14;
