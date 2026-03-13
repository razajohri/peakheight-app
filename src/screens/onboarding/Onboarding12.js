// Onboarding12.js (Page 12 - Do you smoke or drink alcohol?)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import HapticFeedback from '../../utils/hapticFeedback';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS,
  ONBOARDING_BORDER_RADIUS 
} from '../../utils/onboardingConstants';

const Onboarding12 = ({ navigation, data, updateData }) => {
  const [smokingStatus, setSmokingStatus] = useState(data.smokingStatus || null);
  const [drinkingStatus, setDrinkingStatus] = useState(data.drinkingStatus || null);
  

  const isReadyToContinue = smokingStatus !== null && drinkingStatus !== null;

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={14} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit={true}>Do you smoke or drink alcohol?</Text>
    
        </View>

        <View style={styles.questionsContainer}>
          <View style={styles.questionSection}>
            <View style={styles.questionHeader}>
              <FontAwesome5 name="smoking" size={20} color="#FFFFFF" style={styles.questionIcon} />
              <Text style={styles.questionText}>Do you smoke?</Text>
            </View>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  smokingStatus === true && styles.optionButtonSelected
                ]}
                onPress={() => {
                  HapticFeedback.selection();
                  setSmokingStatus(true);
                  updateData({ smokingStatus: true });
                }}
              >
                <Text style={[
                  styles.optionButtonText,
                  smokingStatus === true && styles.optionButtonTextSelected
                ]}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  styles.optionButtonSecond,
                  smokingStatus === false && styles.optionButtonSelected
                ]}
                onPress={() => {
                  HapticFeedback.selection();
                  setSmokingStatus(false);
                  updateData({ smokingStatus: false });
                }}
              >
                <Text style={[
                  styles.optionButtonText,
                  smokingStatus === false && styles.optionButtonTextSelected
                ]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.questionSection}>
            <View style={styles.questionHeader}>
              <FontAwesome5 name="wine-bottle" size={20} color="#FFFFFF" style={styles.questionIcon} />
              <Text style={styles.questionText}>Do you drink alcohol?</Text>
            </View>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  drinkingStatus === true && styles.optionButtonSelected
                ]}
                onPress={() => {
                  HapticFeedback.selection();
                  setDrinkingStatus(true);
                  updateData({ drinkingStatus: true });
                }}
              >
                <Text style={[
                  styles.optionButtonText,
                  drinkingStatus === true && styles.optionButtonTextSelected
                ]}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  styles.optionButtonSecond,
                  drinkingStatus === false && styles.optionButtonSelected
                ]}
                onPress={() => {
                  HapticFeedback.selection();
                  setDrinkingStatus(false);
                  updateData({ drinkingStatus: false });
                }}
              >
                <Text style={[
                  styles.optionButtonText,
                  drinkingStatus === false && styles.optionButtonTextSelected
                ]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="information-circle-outline" size={24} color="#9CA3AF" />
            </View>
            <Text style={styles.infoText}>
              {smokingStatus === true || drinkingStatus === true
                ? "Research shows that smoking and alcohol consumption can negatively impact growth hormone production and bone development. We'll help you create a plan that addresses these factors."
                : "Understanding your lifestyle habits helps us create a personalized growth plan tailored to your needs."}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={() => navigation.navigate('Onboarding13')}
          disabled={!isReadyToContinue}
        />
      </View>
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
    paddingTop: ONBOARDING_SPACING.PAGE_VERTICAL,
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 28,
    marginBottom: ONBOARDING_SPACING.SM,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  questionsContainer: {
    flex: 0,
  },
  questionSection: {
    marginBottom: 32,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionIcon: {
    marginRight: 10,
  },
  questionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  optionsRow: {
    flexDirection: 'row',
  },
  optionButton: {
    flex: 1,
    paddingVertical: ONBOARDING_SPACING.MD,
    paddingHorizontal: ONBOARDING_SPACING.LG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ONBOARDING_COLORS.BORDER,
    backgroundColor: ONBOARDING_COLORS.SURFACE,
    borderRadius: ONBOARDING_BORDER_RADIUS.MD,
  },
  optionButtonSecond: {
    marginLeft: ONBOARDING_SPACING.SM + 4,
  },
  optionButtonSelected: {
    borderColor: ONBOARDING_COLORS.BORDER_SELECTED,
    backgroundColor: ONBOARDING_COLORS.SURFACE_ELEVATED,
  },
  optionButtonText: {
    ...ONBOARDING_TYPOGRAPHY.OPTION_TEXT,
  },
  optionButtonTextSelected: {
    color: ONBOARDING_COLORS.TEXT_PRIMARY,
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 24,
    alignItems: 'flex-start',
  },
  infoIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    flex: 1,
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding12;
