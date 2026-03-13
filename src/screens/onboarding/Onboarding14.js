// Onboarding14.js (Page 14 - Testimonial page and Rating pop up)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Platform, Linking, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS 
} from '../../utils/onboardingConstants';

const Onboarding14 = ({ navigation }) => {
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  
  

  // App Store configuration
  const APP_STORE_CONFIG = {
    isLive: true, // ✅ App is now live!
    iosAppId: '6752793377', // ✅ Your actual App Store ID
    androidPackageName: 'com.peakheight.app', // Your package name
  };

  // Handle rating submission
  const handleRatingSubmission = async (rating) => {
    if (!APP_STORE_CONFIG.isLive) {
      Alert.alert(
        'Coming Soon!',
        'Thank you for your feedback! The app will be available on the App Store soon.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (rating >= 4) {
      // High rating - direct to App Store
      const appStoreUrl = Platform.OS === 'ios'
        ? `https://apps.apple.com/app/id${APP_STORE_CONFIG.iosAppId}?action=write-review`
        : `https://play.google.com/store/apps/details?id=${APP_STORE_CONFIG.androidPackageName}`;

      try {
        await Linking.openURL(appStoreUrl);
      } catch (error) {
        Alert.alert('Error', 'Could not open App Store. Please try again later.');
      }
    } else {
      // Low rating - show feedback form or contact
      Alert.alert(
        'We Value Your Feedback',
        'We\'re sorry to hear that. Please contact us at support@peakheight.app to help us improve.',
        [{ text: 'OK' }]
      );
    }
  };

  // Open rating popup right after page mounts (only if app is live)
  useEffect(() => {
    if (APP_STORE_CONFIG.isLive) {
      const timer = setTimeout(() => {
        setRatingModalVisible(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 1000); // Reduced delay for faster popup
      return () => clearTimeout(timer);
    }
  }, []);

  const reviews = [
    {
      id: 'mark',
      name: 'Mark Michael',
      handle: '@michaelmark',
      text: 'The daily reminders are a game changer. Makes it so much easier to stay consistent with exercise.',
      avatar: require('../../../assets/testimonial-mark.webp'),
    },
    {
      id: 'mo',
      name: 'Mo Daiyoub',
      handle: '@baby_mo',
      text: "Didn't think an app could motivate me like this.",
      avatar: require('../../../assets/testimonial-mo.webp'),
    },
    {
      id: 'seva',
      name: 'Seva Jaenen',
      handle: '@s.jaenen04',
      text: 'Really impressed with how smooth the app is.',
      avatar: require('../../../assets/testimonial-seva.webp'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      {/* No progress header - this page doesn't count toward onboarding steps */}

      <View style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Leave a Rating</Text>
          <Text style={styles.subtitle}>This helps us bring you more of what you love</Text>
        </View>

        <View style={styles.reviewsList}>
          {reviews.map((r, idx) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewCardInner}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.reviewCardGlow}
                  pointerEvents="none"
                />
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewHeaderLeft}>
                    <Image source={r.avatar} style={styles.reviewAvatar} />
                    <View>
                      <Text style={styles.reviewName}>{r.name}</Text>
                      <Text style={styles.reviewHandle}>{r.handle}</Text>
                    </View>
                  </View>
                  <View style={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesome
                        key={star}
                        name="star"
                        size={13}
                        color="#FFD700"
                        style={styles.reviewStar}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>"{r.text}"</Text>
              </View>
            </View>
          ))}
        </View>

      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={() => navigation.navigate('Onboarding15')}
        />
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

            <View style={styles.modalStarsContainer}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedRating(rating);
                    if (rating === 5) {
                      // Auto-submit 5-star rating
                      setRatingModalVisible(false);
                      handleRatingSubmission(5);
                    }
                  }}
                >
                  <FontAwesome
                    name={rating <= selectedRating ? "star" : "star-o"}
                    size={32}
                    color={rating <= selectedRating ? "#FFD700" : "#AAAAAA"}
                    style={styles.modalStar}
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
                  handleRatingSubmission(selectedRating);
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
    backgroundColor: ONBOARDING_COLORS.BACKGROUND,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    paddingTop: 0,
  },
  headerSection: {
    marginBottom: 28,
    paddingTop: 0,
    alignItems: 'center',
  },
  title: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    fontSize: 15,
    textAlign: 'center',
  },
  reviewsList: {
    flex: 1,
    gap: 4,
  },
  reviewCard: {
    borderRadius: 24,
    padding: 3,
    shadowColor: '#7C7C7C',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.38,
    shadowRadius: 36,
    elevation: 16,
  },
  reviewCardInner: {
    borderRadius: 22,
    backgroundColor: '#050505',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  reviewCardGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    opacity: 0.35,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reviewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  reviewName: {
    fontWeight: '600',
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  reviewHandle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#9CA3AF',
  },
  reviewStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewStar: {
    marginRight: 2,
  },
  reviewText: {
    fontSize: 15,
    color: '#E5E7EB',
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
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
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
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
  modalStarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  modalStar: {
    marginHorizontal: 8,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalSecondaryButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  modalSecondaryButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#9CA3AF',
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
