// Onboarding14.js (Page 14 - Testimonial page and Rating pop up)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

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

        <View style={styles.testimonialCard}>
          <View style={styles.testimonialHeader}>
            <Image
              source={require('../../../assets/peakheight-logo.jpg')}
              style={styles.avatar}
            />
            <View style={styles.testimonialHeaderText}>
              <Text style={styles.testimonialName}>Michael, 17</Text>
              <Text style={styles.testimonialResult}>+2.3 inches in 8 months</Text>
            </View>
          </View>

          <Text style={styles.testimonialQuote}>
            "I was always the shortest in my class. After following the PeakHeight program for 8 months, I grew over 2 inches. The posture exercises and sleep recommendations made the biggest difference."
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
          onPress={() => setRatingModalVisible(true)}
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
                  <AntDesign
                    name={rating <= selectedRating ? "star" : "staro"}
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
                onPress={() => setRatingModalVisible(false)}
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
    backgroundColor: '#0A0F1D', // Deep navy base
    paddingTop: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#2A2F3E', // Darker gray
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#3B5FE3', // Cobalt accent
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#AAAAAA',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Playfair Display-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 32,
    letterSpacing: -0.5, // Tighter letter-spacing for headlines
  },
  testimonialCard: {
    backgroundColor: '#1A1F2D', // Slightly lighter than background
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D9D9D9', // Platinum gray
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
    color: '#3B5FE3', // Cobalt accent
  },
  testimonialQuote: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
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
    color: '#3B5FE3', // Cobalt accent
  },
  buttonContainer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#3B5FE3', // Cobalt accent
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#0A0F1D', // Deep navy base
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: '#D9D9D9', // Platinum gray
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
    borderColor: '#D9D9D9', // Platinum gray
    borderRadius: 8,
  },
  modalSecondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalPrimaryButton: {
    flex: 1,
    backgroundColor: '#3B5FE3', // Cobalt accent
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  modalPrimaryButtonDisabled: {
    backgroundColor: '#2A2F3E', // Darker gray
  },
  modalPrimaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default Onboarding14;
