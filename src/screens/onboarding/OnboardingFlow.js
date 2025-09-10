import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import ProgressBar from '../components/UI/ProgressBar';
import HeightPicker from '../components/UI/HeightPicker';

import {
  COLORS,
  ONBOARDING_STEPS,
  MOTIVATIONS,
  BARRIERS,
  GENDER_OPTIONS,
  DEFAULT_VALUES,
  SUBSCRIPTION_PLANS
} from '../utils/constants';

const { width, height } = Dimensions.get('window');

export default function OnboardingFlow({
  onComplete,
  onAuthRequired,
  initialData = {},
  onBack
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const totalSteps = 14; // Fixed number of steps

  const updateData = (key, value) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    // In a real app, you would save to AsyncStorage for persistence
    // AsyncStorage.setItem('onboardingData', JSON.stringify(newData));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      onBack && onBack();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await onComplete(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to save your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressHeader}>
      <View style={styles.stepCounter}>
        <Text style={styles.stepCounterText}>
          {currentStep}/{totalSteps} STEPS
        </Text>
      </View>
      <ProgressBar
        progress={(currentStep / totalSteps) * 100}
        height={4}
        style={styles.progressBar}
      />
    </View>
  );

  const renderHeightStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What's your current height?</Text>
      <HeightPicker
        value={data.height || DEFAULT_VALUES.HEIGHT_FT}
        onChange={(value, unit) => updateData('height', value)}
        style={styles.heightPicker}
      />
      <Button
        title="Continue"
        onPress={nextStep}
        style={styles.continueButton}
      />
    </View>
  );

  const renderAgeStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>How old are you?</Text>
      <View style={styles.ageContainer}>
        <Text style={styles.ageDisplay}>{data.age || DEFAULT_VALUES.AGE}</Text>
        <Text style={styles.ageUnit}>years old</Text>
      </View>
      <View style={styles.ageControls}>
        <TouchableOpacity
          style={styles.ageButton}
          onPress={() => updateData('age', Math.max(10, (data.age || DEFAULT_VALUES.AGE) - 1))}
        >
          <Text style={styles.ageButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.ageButton}
          onPress={() => updateData('age', Math.min(50, (data.age || DEFAULT_VALUES.AGE) + 1))}
        >
          <Text style={styles.ageButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Button
        title="Continue"
        onPress={nextStep}
        style={styles.continueButton}
      />
    </View>
  );

  const renderGenderStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select your gender</Text>
      <View style={styles.optionsContainer}>
        {GENDER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionCard,
              data.gender === option.value && styles.optionCardSelected
            ]}
            onPress={() => updateData('gender', option.value)}
          >
            <Text style={styles.optionEmoji}>
              {option.value === 'male' ? '👨' : option.value === 'female' ? '👩' : '👤'}
            </Text>
            <Text style={[
              styles.optionText,
              data.gender === option.value && styles.optionTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        title="Continue"
        onPress={nextStep}
        style={styles.continueButton}
        disabled={!data.gender}
      />
    </View>
  );

  const renderDreamHeightStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What's your dream height?</Text>
      <HeightPicker
        value={data.dreamHeight || DEFAULT_VALUES.DREAM_HEIGHT_CM}
        onChange={(value, unit) => updateData('dreamHeight', value)}
        style={styles.heightPicker}
      />
      <Button
        title="Continue"
        onPress={nextStep}
        style={styles.continueButton}
      />
    </View>
  );

  const renderMotivationStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What's your motivation?</Text>
      <ScrollView style={styles.scrollableOptions}>
        {MOTIVATIONS.map((motivation) => (
          <TouchableOpacity
            key={motivation.value}
            style={[
              styles.motivationCard,
              data.motivation === motivation.value && styles.motivationCardSelected
            ]}
            onPress={() => updateData('motivation', motivation.value)}
          >
            <Text style={styles.motivationEmoji}>
              {motivation.value === 'confidence' ? '⭐' :
               motivation.value === 'dating' ? '❤️' :
               motivation.value === 'sports' ? '🏃' :
               motivation.value === 'career' ? '💼' :
               motivation.value === 'health' ? '💚' : '🔸'}
            </Text>
            <View style={styles.motivationContent}>
              <Text style={[
                styles.motivationTitle,
                data.motivation === motivation.value && styles.motivationTitleSelected
              ]}>
                {motivation.label}
              </Text>
              <Text style={styles.motivationDescription}>
                {motivation.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button
        title="Continue"
        onPress={nextStep}
        style={styles.continueButton}
      />
    </View>
  );

  const renderBarriersStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>What are your main barriers?</Text>
      <Text style={styles.stepSubtitle}>Select up to 3 that apply to you</Text>
      <ScrollView style={styles.scrollableOptions}>
        {BARRIERS.map((barrier) => {
          const isSelected = data.barriers?.includes(barrier.value);
          return (
            <TouchableOpacity
              key={barrier.value}
              style={[
                styles.barrierCard,
                isSelected && styles.barrierCardSelected
              ]}
              onPress={() => {
                const currentBarriers = data.barriers || [];
                let newBarriers;
                if (isSelected) {
                  newBarriers = currentBarriers.filter(b => b !== barrier.value);
                } else {
                  if (currentBarriers.length < 3) {
                    newBarriers = [...currentBarriers, barrier.value];
                  } else {
                    return; // Don't allow more than 3
                  }
                }
                updateData('barriers', newBarriers);
              }}
            >
              <Text style={styles.barrierEmoji}>
                {barrier.value === 'sleep' ? '🌙' :
                 barrier.value === 'nutrition' ? '🍎' :
                 barrier.value === 'posture' ? '🧍' :
                 barrier.value === 'exercise' ? '💪' :
                 barrier.value === 'stress' ? '😰' : '⚠️'}
              </Text>
              <View style={styles.barrierContent}>
                <Text style={[
                  styles.barrierTitle,
                  isSelected && styles.barrierTitleSelected
                ]}>
                  {barrier.label}
                </Text>
                <Text style={styles.barrierDescription}>
                  {barrier.description}
                </Text>
              </View>
              {isSelected && (
                <Text style={styles.selectedCheck}>✓</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Button
        title="Continue"
        onPress={nextStep}
        style={styles.continueButton}
        disabled={!data.barriers?.length}
      />
    </View>
  );

  const renderPromoCodeStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Have a referral code?</Text>
      <Text style={styles.stepSubtitle}>Enter it below to unlock special benefits</Text>

      <TextInput
        style={styles.promoInput}
        placeholder="Enter referral code"
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        value={data.promoCode || ''}
        onChangeText={(text) => updateData('promoCode', text.toUpperCase())}
        autoCapitalize="characters"
      />

      <View style={styles.skipContainer}>
        <Button
          title="Skip for now"
          variant="text"
          onPress={nextStep}
        />
        <Button
          title="Continue"
          onPress={nextStep}
          style={styles.continueButton}
        />
      </View>
    </View>
  );

  const renderAIPredictionTeaser = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>See your potential height</Text>
      <View style={styles.teaserCard}>
        <Text style={styles.teaserEmoji}>🤖</Text>
        <Text style={styles.teaserTitle}>AI Height Prediction</Text>
        <Text style={styles.teaserDescription}>
          Our AI analyzes your data to predict your maximum potential height based on:
        </Text>
        <View style={styles.teaserFeatures}>
          <Text style={styles.teaserFeature}>• Current height and age</Text>
          <Text style={styles.teaserFeature}>• Genetic factors</Text>
          <Text style={styles.teaserFeature}>• Growth patterns</Text>
          <Text style={styles.teaserFeature}>• Lifestyle habits</Text>
        </View>
        <View style={styles.predictionPreview}>
          <Text style={styles.predictionText}>Potential Height:</Text>
          <Text style={styles.predictionValue}>6'2" - 6'4"</Text>
          <Text style={styles.predictionNote}>Unlock full report in premium</Text>
        </View>
      </View>
      <Button
        title="Continue"
        onPress={nextStep}
        style={styles.continueButton}
      />
    </View>
  );

  const renderGrowthBlockersTeaser = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>We found 3 issues holding you back</Text>
      <View style={styles.blockersContainer}>
        <View style={styles.blockerItem}>
          <Text style={styles.blockerSeverity}>🔴 HIGH</Text>
          <Text style={styles.blockerTitle}>Sleep Quality Issues</Text>
          <Text style={styles.blockerDescription}>
            Your sleep schedule is affecting growth hormone production
          </Text>
        </View>
        <View style={styles.blockerItem}>
          <Text style={styles.blockerSeverity}>🟡 MEDIUM</Text>
          <Text style={styles.blockerTitle}>Posture Improvement Needed</Text>
          <Text style={styles.blockerDescription}>
            Poor posture is compressing your spine by up to 1.5 inches
          </Text>
        </View>
        <View style={styles.blockerItem}>
          <Text style={styles.blockerSeverity}>🟡 MEDIUM</Text>
          <Text style={styles.blockerTitle}>Nutritional Habits Suboptimal</Text>
          <Text style={styles.blockerDescription}>
            Key nutrients for growth are missing from your diet
          </Text>
        </View>
      </View>
      <Button
        title="Get My Personalized Plan"
        onPress={nextStep}
        style={styles.continueButton}
      />
    </View>
  );

  const renderNotificationPermission = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Stay on track with reminders</Text>
      <Text style={styles.stepSubtitle}>
        Get daily reminders for habits that boost your height potential
      </Text>

      <View style={styles.notificationCard}>
        <Text style={styles.notificationEmoji}>🔔</Text>
        <Text style={styles.notificationTitle}>Smart Reminders</Text>
        <View style={styles.notificationFeatures}>
          <Text style={styles.notificationFeature}>• Sleep time reminders</Text>
          <Text style={styles.notificationFeature}>• Posture check-ins</Text>
          <Text style={styles.notificationFeature}>• Stretching sessions</Text>
          <Text style={styles.notificationFeature}>• Daily tips & motivation</Text>
        </View>
      </View>

      <View style={styles.notificationButtons}>
        <Button
          title="Enable Notifications"
          onPress={nextStep}
          style={styles.continueButton}
        />
        <Button
          title="Skip for now"
          variant="text"
          onPress={nextStep}
        />
      </View>
    </View>
  );

  const renderAccountCreation = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Ready to get started?</Text>
      <Text style={styles.stepSubtitle}>
        Your personalized growth plan is ready. Create an account to save your progress and access all features.
      </Text>

      <View style={styles.authButtons}>
        <Button
          title="Create Account"
          onPress={() => onAuthRequired()}
          style={styles.continueButton}
        />
        <Button
          title="Continue as Guest"
          variant="text"
          onPress={nextStep}
        />
      </View>
    </View>
  );

  const renderPaywall = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Your Personalized Growth Plan is Ready</Text>
      <Text style={styles.stepSubtitle}>
        Unlock your full height potential with our premium features
      </Text>

      <View style={styles.plansContainer}>
        <View style={[styles.planCard, styles.popularPlan]}>
          <Text style={styles.popularBadge}>MOST POPULAR</Text>
          <Text style={styles.planName}>{SUBSCRIPTION_PLANS.ANNUAL.name}</Text>
          <View style={styles.planPricing}>
            <Text style={styles.planPrice}>
              {SUBSCRIPTION_PLANS.ANNUAL.currency}{SUBSCRIPTION_PLANS.ANNUAL.price}
            </Text>
            <Text style={styles.planPeriod}>/{SUBSCRIPTION_PLANS.ANNUAL.period}</Text>
          </View>
          <Text style={styles.planSavings}>Save {SUBSCRIPTION_PLANS.ANNUAL.savings}%</Text>
          <Text style={styles.planOriginalPrice}>
            Usually {SUBSCRIPTION_PLANS.ANNUAL.currency}{SUBSCRIPTION_PLANS.ANNUAL.originalPrice}
          </Text>
        </View>

        <View style={styles.planCard}>
          <Text style={styles.planName}>{SUBSCRIPTION_PLANS.MONTHLY.name}</Text>
          <View style={styles.planPricing}>
            <Text style={styles.planPrice}>
              {SUBSCRIPTION_PLANS.MONTHLY.currency}{SUBSCRIPTION_PLANS.MONTHLY.price}
            </Text>
            <Text style={styles.planPeriod}>/{SUBSCRIPTION_PLANS.MONTHLY.period}</Text>
          </View>
        </View>
      </View>

      <View style={styles.trialNotice}>
        <Text style={styles.trialText}>3-day free trial • Cancel anytime</Text>
      </View>

      <Button
        title="Start Free Trial"
        onPress={nextStep}
        style={styles.continueButton}
      />

      <Button
        title="Continue with Free Version"
        variant="text"
        onPress={nextStep}
      />
    </View>
  );

  const renderCompletionStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.completionEmoji}>🎉</Text>
      <Text style={styles.stepTitle}>Welcome to PeakHeight!</Text>
      <Text style={styles.stepSubtitle}>
        Your personalized growth journey starts now
      </Text>

      <View style={styles.completionFeatures}>
        <Text style={styles.completionFeature}>✓ Personalized growth plan created</Text>
        <Text style={styles.completionFeature}>✓ Daily habits configured</Text>
        <Text style={styles.completionFeature}>✓ Progress tracking enabled</Text>
        <Text style={styles.completionFeature}>✓ AI insights activated</Text>
      </View>

      <Button
        title="Go to Dashboard"
        onPress={handleComplete}
        style={styles.continueButton}
        loading={loading}
      />
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderHeightStep();
      case 2: return renderAgeStep();
      case 3: return renderGenderStep();
      case 4: return renderHeightStep(); // Parents height
      case 5: return renderDreamHeightStep();
      case 6: return renderMotivationStep();
      case 7: return renderBarriersStep();
      case 8: return renderPromoCodeStep();
      case 9: return renderAIPredictionTeaser();
      case 10: return renderGrowthBlockersTeaser();
      case 11: return renderNotificationPermission();
      case 12: return renderAccountCreation();
      case 13: return renderPaywall();
      case 14: return renderCompletionStep();
      default: return null;
    }
  };

    return (
    <SafeAreaView style={styles.container}>
      {renderProgressBar()}

      <TouchableOpacity style={styles.backButton} onPress={prevStep}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  progressHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  stepCounter: {
    marginBottom: 10,
  },
  stepCounterText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  stepContent: {
    alignItems: 'center',
    minHeight: height - 200,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 36,
  },
  stepSubtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  continueButton: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 20,
  },
  heightPicker: {
    flex: 1,
    justifyContent: 'center',
  },
  ageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ageDisplay: {
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  ageUnit: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
  },
  ageControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 40,
  },
  ageButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '20',
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  optionTextSelected: {
    color: COLORS.PRIMARY,
  },
  scrollableOptions: {
    width: '100%',
    maxHeight: 400,
    marginBottom: 20,
  },
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  motivationCardSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '20',
  },
  motivationEmoji: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  motivationContent: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  motivationTitleSelected: {
    color: COLORS.PRIMARY,
  },
  motivationDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  barrierCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  barrierCardSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '20',
  },
  barrierEmoji: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  barrierContent: {
    flex: 1,
  },
  barrierTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  barrierTitleSelected: {
    color: COLORS.PRIMARY,
  },
  barrierDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  selectedCheck: {
    fontSize: 18,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  promoInput: {
    width: '100%',
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: 30,
  },
  skipContainer: {
    width: '100%',
    gap: 12,
  },
  teaserCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  teaserEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  teaserTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  teaserDescription: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  teaserFeatures: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  teaserFeature: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
  },
  predictionPreview: {
    backgroundColor: COLORS.PRIMARY + '20',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  predictionText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  predictionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 4,
  },
  predictionNote: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
  },
  blockersContainer: {
    width: '100%',
    marginBottom: 30,
  },
  blockerItem: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  blockerSeverity: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  blockerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  blockerDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  notificationCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  notificationEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  notificationFeatures: {
    alignSelf: 'stretch',
  },
  notificationFeature: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
  },
  notificationButtons: {
    width: '100%',
    gap: 12,
  },
  authButtons: {
    width: '100%',
    gap: 12,
    marginTop: 20,
  },
  plansContainer: {
    width: '100%',
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  popularPlan: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '10',
  },
  popularBadge: {
    backgroundColor: COLORS.PRIMARY,
    color: COLORS.BACKGROUND,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  planPeriod: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  planSavings: {
    fontSize: 14,
    color: COLORS.SUCCESS,
    fontWeight: '600',
    marginBottom: 4,
  },
  planOriginalPrice: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textDecorationLine: 'line-through',
  },
  trialNotice: {
    marginBottom: 20,
  },
  trialText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  completionEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  completionFeatures: {
    width: '100%',
    marginBottom: 40,
  },
  completionFeature: {
    fontSize: 16,
    color: COLORS.SUCCESS,
    marginBottom: 8,
    textAlign: 'center',
  },
});
