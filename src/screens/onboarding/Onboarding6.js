// Onboarding6.js (Page 6 - How tall are your parents?)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import HapticFeedback from '../../utils/hapticFeedback';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS,
  ONBOARDING_BORDER_RADIUS 
} from '../../utils/onboardingConstants';

const Onboarding6 = ({ navigation, data, updateData }) => {
  const [measurementSystem, setMeasurementSystem] = useState(data.parentMeasurementSystem || 'imperial'); // 'imperial' or 'metric'
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const modalScale = React.useRef(new Animated.Value(0)).current;
  const modalOpacity = React.useRef(new Animated.Value(0)).current;

  // Imperial - Default: Both 0'0"
  const [fatherFeet, setFatherFeet] = useState(data.fatherFeet || 0);
  const [fatherInches, setFatherInches] = useState(data.fatherInches || 0);
  const [motherFeet, setMotherFeet] = useState(data.motherFeet || 0);
  const [motherInches, setMotherInches] = useState(data.motherInches || 0);

  // Metric - Default: Both 0cm
  const [fatherCm, setFatherCm] = useState(data.fatherCm || 0);
  const [motherCm, setMotherCm] = useState(data.motherCm || 0);

  // Initialize default values if not set
  useEffect(() => {
    if (!data.fatherFeet && !data.fatherCm) {
      // Set defaults to 0
      const defaultFatherFeet = 0;
      const defaultFatherInches = 0;
      const defaultMotherFeet = 0;
      const defaultMotherInches = 0;
      
      const fatherHeightInCm = (defaultFatherFeet * 30.48) + (defaultFatherInches * 2.54);
      const motherHeightInCm = (defaultMotherFeet * 30.48) + (defaultMotherInches * 2.54);
      
      updateData({
        fatherFeet: defaultFatherFeet,
        fatherInches: defaultFatherInches,
        motherFeet: defaultMotherFeet,
        motherInches: defaultMotherInches,
        parentHeightFather: fatherHeightInCm,
        parentHeightMother: motherHeightInCm,
        parentMeasurementSystem: 'imperial'
      });
    }
  }, []);

  // Show info modal when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setInfoModalVisible(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Animate modal in
      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const closeInfoModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInfoModalVisible(false);
    
    // Reset animation values immediately
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const updateParentHeights = () => {
    if (measurementSystem === 'imperial') {
      const fatherHeightInCm = (fatherFeet * 30.48) + (fatherInches * 2.54);
      const motherHeightInCm = (motherFeet * 30.48) + (motherInches * 2.54);
      updateData({
        fatherFeet,
        fatherInches,
        motherFeet,
        motherInches,
        parentHeightFather: fatherHeightInCm,
        parentHeightMother: motherHeightInCm,
        parentMeasurementSystem: measurementSystem
      });
    } else {
      const fatherHeightInFeet = Math.floor(fatherCm / 30.48);
      const fatherHeightInInches = Math.round((fatherCm % 30.48) / 2.54);
      const motherHeightInFeet = Math.floor(motherCm / 30.48);
      const motherHeightInInches = Math.round((motherCm % 30.48) / 2.54);
      updateData({
        fatherCm,
        motherCm,
        parentHeightFather: fatherCm,
        parentHeightMother: motherCm,
        fatherFeet: fatherHeightInFeet,
        fatherInches: fatherHeightInInches,
        motherFeet: motherHeightInFeet,
        motherInches: motherHeightInInches,
        parentMeasurementSystem: measurementSystem
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={7} 
        onBack={() => navigation.goBack()} 
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>How tall are your parents?</Text>
          </View>

          <View
            style={styles.segmentContainer}
          >
            <TouchableOpacity
              style={[
                styles.segmentButton,
                measurementSystem === 'imperial' && styles.segmentButtonActive
              ]}
              onPress={async () => {
                try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
                setMeasurementSystem('imperial');
              }}
            >
              <Text style={[
                styles.segmentButtonText,
                measurementSystem === 'imperial' && styles.segmentButtonTextActive
              ]}>Imperial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentButton,
                measurementSystem === 'metric' && styles.segmentButtonActive
              ]}
              onPress={async () => {
                try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
                setMeasurementSystem('metric');
              }}
            >
              <Text style={[
                styles.segmentButtonText,
                measurementSystem === 'metric' && styles.segmentButtonTextActive
              ]}>Metric</Text>
            </TouchableOpacity>
          </View>

          <View
            style={styles.inputSection}
          >
            <Text style={styles.sectionTitle}>Father's height</Text>

            {measurementSystem === 'imperial' ? (
              <View>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Feet</Text>
                  <View style={styles.sliderValueContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={7}
                      step={1}
                      value={fatherFeet}
                      onValueChange={(value) => {
                        HapticFeedback.selection();
                        setFatherFeet(value);
                        updateParentHeights();
                      }}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#1f1f1f"
                      thumbTintColor="#FFFFFF"
                    />
                    <Text style={styles.sliderValue}>{fatherFeet} ft</Text>
                  </View>
                </View>

                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Inches</Text>
                  <View style={styles.sliderValueContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={11}
                      step={1}
                      value={fatherInches}
                      onValueChange={(value) => {
                        HapticFeedback.selection();
                        setFatherInches(value);
                        updateParentHeights();
                      }}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#1f1f1f"
                      thumbTintColor="#FFFFFF"
                    />
                    <Text style={styles.sliderValue}>{fatherInches} in</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Centimeters</Text>
                <View style={styles.sliderValueContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={220}
                    step={1}
                    value={fatherCm}
                      onValueChange={(value) => {
                        HapticFeedback.selection();
                        setFatherCm(value);
                        updateParentHeights();
                      }}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#1f1f1f"
                    thumbTintColor="#FFFFFF"
                  />
                  <Text style={styles.sliderValue}>{fatherCm} cm</Text>
                </View>
              </View>
            )}
          </View>

          <View
            style={styles.inputSection}
          >
            <Text style={styles.sectionTitle}>Mother's height</Text>

            {measurementSystem === 'imperial' ? (
              <View>
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Feet</Text>
                  <View style={styles.sliderValueContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={6}
                      step={1}
                      value={motherFeet}
                      onValueChange={(value) => {
                        HapticFeedback.selection();
                        setMotherFeet(value);
                        updateParentHeights();
                      }}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#1f1f1f"
                      thumbTintColor="#FFFFFF"
                    />
                    <Text style={styles.sliderValue}>{motherFeet} ft</Text>
                  </View>
                </View>

                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Inches</Text>
                  <View style={styles.sliderValueContainer}>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={11}
                      step={1}
                      value={motherInches}
                      onValueChange={(value) => {
                        HapticFeedback.selection();
                        setMotherInches(value);
                        updateParentHeights();
                      }}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#1f1f1f"
                      thumbTintColor="#FFFFFF"
                    />
                    <Text style={styles.sliderValue}>{motherInches} in</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Centimeters</Text>
                <View style={styles.sliderValueContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={190}
                    step={1}
                    value={motherCm}
                      onValueChange={(value) => {
                        HapticFeedback.selection();
                        setMotherCm(value);
                        updateParentHeights();
                      }}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#1f1f1f"
                    thumbTintColor="#FFFFFF"
                  />
                  <Text style={styles.sliderValue}>{motherCm} cm</Text>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={async () => {
              try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
              updateParentHeights();
              // Clear parent height fields and proceed
              updateData({
                parentHeightFather: null,
                parentHeightMother: null,
                fatherFeet: null,
                fatherInches: null,
                motherFeet: null,
                motherInches: null,
                fatherCm: null,
                motherCm: null,
                parentMeasurementSystem: measurementSystem
              });
              navigation.navigate('Onboarding7');
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.skipButtonText}>I don't know</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={async () => {
            // Check if heights are set (not 0 or null)
            const fatherHeightSet = measurementSystem === 'imperial' 
              ? (fatherFeet > 0 || fatherInches > 0)
              : (fatherCm > 0);
            const motherHeightSet = measurementSystem === 'imperial'
              ? (motherFeet > 0 || motherInches > 0)
              : (motherCm > 0);

            if (!fatherHeightSet || !motherHeightSet) {
              Alert.alert(
                'Parents\' Heights Required',
                'Please enter both your father\'s and mother\'s heights, or click "I don\'t know" to skip.',
                [{ text: 'OK', style: 'default' }]
              );
              return;
            }

            try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
            updateParentHeights();
            navigation.navigate('Onboarding7');
          }}
        />
      </View>

      {/* Info Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={closeInfoModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeInfoModal}
        >
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                opacity: modalOpacity,
                transform: [{ scale: modalScale }]
              }
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalContent}
              >
                {/* Decorative background circle */}
                <View style={styles.modalDecorativeCircle} />
                
                <LinearGradient
                  colors={['#000000', '#1a1a1a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalIconContainer}
                >
                  <Ionicons name="people" size={40} color="#FFFFFF" />
                </LinearGradient>
                
                <Text style={styles.modalTitle}>" Why we ask about your parents height? "</Text>
                
                <Text style={styles.modalText}>
                  Telling us your parents' height helps us understand your genetic potential and create a more accurate growth plan tailored specifically to you.
                </Text>
                
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={closeInfoModal}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#000000', '#1a1a1a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.modalButtonGradient}
                  >
                    <Text style={styles.modalButtonText}>Got it</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ONBOARDING_COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ONBOARDING_SPACING.MD,
  },
  contentContainer: {
    paddingHorizontal: ONBOARDING_SPACING.PAGE_HORIZONTAL,
    paddingTop: ONBOARDING_SPACING.XS,
  },
  titleContainer: {
    marginBottom: ONBOARDING_SPACING.MD,
  },
  title: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 28,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    textAlign: 'center',
    marginBottom: ONBOARDING_SPACING.MD,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginBottom: ONBOARDING_SPACING.MD,
    borderRadius: ONBOARDING_BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: ONBOARDING_COLORS.BORDER,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: ONBOARDING_SPACING.SM + 4,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: ONBOARDING_COLORS.SURFACE_ELEVATED,
  },
  segmentButtonText: {
    ...ONBOARDING_TYPOGRAPHY.BODY,
    fontSize: 16,
  },
  segmentButtonTextActive: {
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: ONBOARDING_SPACING.LG,
  },
  sectionTitle: {
    ...ONBOARDING_TYPOGRAPHY.BODY,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sliderContainer: {
    marginBottom: ONBOARDING_SPACING.SM + 4,
  },
  sliderLabel: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    fontSize: 14,
    marginBottom: ONBOARDING_SPACING.SM,
  },
  sliderValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 32,
  },
  sliderValue: {
    ...ONBOARDING_TYPOGRAPHY.OPTION_TEXT,
    fontSize: 16,
    width: 60,
    textAlign: 'right',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: ONBOARDING_SPACING.SM,
    paddingHorizontal: ONBOARDING_SPACING.LG,
    marginTop: -10,
  },
  skipButtonText: {
    ...ONBOARDING_TYPOGRAPHY.BODY,
    fontSize: 16,
    color: ONBOARDING_COLORS.TEXT_SECONDARY,
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: ONBOARDING_SPACING.LG,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
  },
  modalContent: {
    borderRadius: 28,
    padding: ONBOARDING_SPACING.LG + 12,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalDecorativeCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    top: -80,
    right: -80,
  },
  modalIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ONBOARDING_SPACING.LG + 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  modalTitle: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: ONBOARDING_SPACING.MD + 4,
    textAlign: 'center',
    color: '#000000',
    letterSpacing: -0.5,
  },
  modalText: {
    ...ONBOARDING_TYPOGRAPHY.BODY,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: ONBOARDING_SPACING.LG + 12,
    color: '#475569',
    fontWeight: '500',
  },
  modalButton: {
    width: '100%',
    marginTop: ONBOARDING_SPACING.SM,
    borderRadius: ONBOARDING_BORDER_RADIUS.BUTTON,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalButtonGradient: {
    paddingVertical: ONBOARDING_SPACING.BUTTON_PADDING_VERTICAL,
    paddingHorizontal: ONBOARDING_SPACING.BUTTON_PADDING_HORIZONTAL,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  modalButtonText: {
    ...ONBOARDING_TYPOGRAPHY.BUTTON_TEXT,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default Onboarding6;
