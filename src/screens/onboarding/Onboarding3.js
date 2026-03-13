// Onboarding3.js (Page 3 - Choose your gender)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS,
  ONBOARDING_BORDER_RADIUS,
} from '../../utils/onboardingConstants';

const Onboarding3 = ({ navigation, data, updateData }) => {
  const [email, setEmail] = useState(data.email || '');

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={3} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What&apos;s your best email?</Text>
          <Text style={styles.subtitle}>(optional)</Text>
        </View>

        <View style={styles.emailContainer}>
          <Text style={styles.emailSubtitle}>
            We&apos;ll send your plan and important updates here.
          </Text>
          <TextInput
            style={styles.emailInput}
            placeholder=""
            placeholderTextColor={ONBOARDING_COLORS.TEXT_SECONDARY}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              updateData({ email: text.trim() });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={() => navigation.navigate('Onboarding4')}
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
    marginBottom: ONBOARDING_SPACING.SECTION_GAP,
  },
  title: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 28,
    marginBottom: ONBOARDING_SPACING.SM,
    textAlign: 'center',
  },
  subtitle: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    textAlign: 'center',
  },
  pickerWrapper: {
    // No longer used (was for date picker)
  },
  emailContainer: {
    marginTop: ONBOARDING_SPACING.LG,
    paddingHorizontal: 4,
  },
  emailTitle: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: ONBOARDING_SPACING.SM,
  },
  emailSubtitle: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    textAlign: 'center',
    marginBottom: ONBOARDING_SPACING.SM,
  },
  emailInput: {
    borderRadius: ONBOARDING_BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: ONBOARDING_COLORS.BORDER,
    paddingHorizontal: ONBOARDING_SPACING.MD,
    paddingVertical: ONBOARDING_SPACING.SM,
    color: ONBOARDING_COLORS.TEXT_PRIMARY,
    backgroundColor: ONBOARDING_COLORS.SURFACE,
    fontSize: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ONBOARDING_COLORS.BORDER,
    backgroundColor: ONBOARDING_COLORS.SURFACE,
    borderRadius: ONBOARDING_BORDER_RADIUS.LG,
    padding: ONBOARDING_SPACING.LG + 4,
    marginBottom: ONBOARDING_SPACING.MD + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  dateButtonStatic: {
    opacity: 0.8,
  },
  dateIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: ONBOARDING_COLORS.SURFACE_ELEVATED,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ONBOARDING_SPACING.MD,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateLabel: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    fontSize: 14,
    marginBottom: ONBOARDING_SPACING.XS,
  },
  dateButtonText: {
    ...ONBOARDING_TYPOGRAPHY.OPTION_TEXT,
    fontSize: 20,
  },
  pickerContainer: {
    backgroundColor: ONBOARDING_COLORS.SURFACE,
    borderRadius: ONBOARDING_BORDER_RADIUS.MD,
    marginTop: ONBOARDING_SPACING.LG,
    alignItems: 'center',
    overflow: 'hidden',
  },
  datePicker: {
    width: '100%',
    height: 200,
  },
  consentText: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    fontSize: 14,
    marginTop: ONBOARDING_SPACING.MD,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding3;
