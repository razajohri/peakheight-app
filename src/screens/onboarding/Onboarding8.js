// Onboarding8.js (Page 8 - What is your foot size?)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingStars from '../../components/UI/FloatingStars';
import ProgressHeader from '../../components/onboarding/ProgressHeader';
import OnboardingButton from '../../components/onboarding/OnboardingButton';
import HapticFeedback from '../../utils/hapticFeedback';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { 
  ONBOARDING_TYPOGRAPHY, 
  ONBOARDING_SPACING,
  ONBOARDING_COLORS,
  ONBOARDING_BORDER_RADIUS 
} from '../../utils/onboardingConstants';

const Onboarding8 = ({ navigation, data, updateData }) => {
  const [sizeSystem, setSizeSystem] = useState(data.footSizeSystem || 'us'); // 'us', 'eu', or 'uk'
  const [footSize, setFootSize] = useState(data.footSize || 8); // Default to 8 (US size)
  
  // Initialize default value if not set
  useEffect(() => {
    if (!data.footSize || data.footSize === 0) {
      updateData({
        footSize: 8,
        footSizeSystem: 'us'
      });
    }
  }, []);

  const updateFootSize = (newSize, newSystem) => {
    updateData({
      footSize: newSize,
      footSizeSystem: newSystem
    });
  };

  const getMinMaxValues = () => {
    switch (sizeSystem) {
      case 'us':
        return { min: 5, max: 15 };
      case 'eu':
        return { min: 35, max: 50 };
      case 'uk':
        return { min: 4, max: 14 };
      default:
        return { min: 5, max: 15 };
    }
  };

  const { min, max } = getMinMaxValues();

  return (
    <SafeAreaView style={styles.container}>
      <FloatingStars />
      <ProgressHeader 
        currentStep={10} 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What is your foot size?</Text>
          <Text style={styles.subtitle}>This helps us track your growth progress</Text>
        </View>

        <View
          style={styles.segmentContainer}
        >
          <TouchableOpacity
            style={[
              styles.segmentButton,
              sizeSystem === 'us' && styles.segmentButtonActive
            ]}
            onPress={() => {
              HapticFeedback.selection();
              setSizeSystem('us');
              setFootSize(9); // Reset to default US size
              updateFootSize(9, 'us');
            }}
          >
            <Text style={[
              styles.segmentButtonText,
              sizeSystem === 'us' && styles.segmentButtonTextActive
            ]}>US</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              sizeSystem === 'eu' && styles.segmentButtonActive
            ]}
            onPress={() => {
              HapticFeedback.selection();
              setSizeSystem('eu');
              setFootSize(42); // Reset to default EU size
              updateFootSize(42, 'eu');
            }}
          >
            <Text style={[
              styles.segmentButtonText,
              sizeSystem === 'eu' && styles.segmentButtonTextActive
            ]}>EU</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              sizeSystem === 'uk' && styles.segmentButtonActive
            ]}
            onPress={() => {
              HapticFeedback.selection();
              setSizeSystem('uk');
              setFootSize(8); // Reset to default UK size
              updateFootSize(8, 'uk');
            }}
          >
            <Text style={[
              styles.segmentButtonText,
              sizeSystem === 'uk' && styles.segmentButtonTextActive
            ]}>UK</Text>
          </TouchableOpacity>
        </View>

        <View
          style={styles.sizeContainer}
        >
          <Text style={styles.sizeValue}>{footSize}</Text>
          <Text style={styles.sizeLabel}>{sizeSystem.toUpperCase()}</Text>
        </View>

        <View
          style={styles.sliderContainer}
        >
          <Slider
            style={styles.slider}
            minimumValue={min}
            maximumValue={max}
            step={0.5}
            value={footSize}
            onValueChange={(value) => {
              setFootSize(value);
              updateFootSize(value, sizeSystem);
            }}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#1f1f1f"
            thumbTintColor="#FFFFFF"
          />

          <View style={styles.sliderLabelsContainer}>
            <Text style={styles.sliderLabel}>{min}</Text>
            <Text style={styles.sliderLabel}>{max}</Text>
          </View>
        </View>

        <View style={styles.confidenceTag}>
          <Text style={styles.confidenceText}>Confidence: Medium</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <OnboardingButton
          title="Continue"
          onPress={() => {
            if (!footSize || footSize === 0) {
              Alert.alert(
                'Foot Size Required',
                'Please select your foot size to continue.',
                [{ text: 'OK', style: 'default' }]
              );
              return;
            }
            navigation.navigate('Onboarding9');
          }}
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
    marginBottom: ONBOARDING_SPACING.LG,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginBottom: ONBOARDING_SPACING.SECTION_GAP,
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
  sizeContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  sizeValue: {
    ...ONBOARDING_TYPOGRAPHY.PAGE_TITLE,
    fontSize: 40,
    fontWeight: 'bold',
  },
  sizeLabel: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    fontSize: 12,
    marginTop: ONBOARDING_SPACING.SM,
  },
  sliderContainer: {
    marginBottom: ONBOARDING_SPACING.SECTION_GAP,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ONBOARDING_SPACING.SM,
  },
  sliderLabel: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    fontSize: 14,
  },
  confidenceTag: {
    alignSelf: 'flex-start',
    backgroundColor: ONBOARDING_COLORS.SURFACE,
    paddingVertical: ONBOARDING_SPACING.XS,
    paddingHorizontal: ONBOARDING_SPACING.SM + 4,
    borderRadius: ONBOARDING_BORDER_RADIUS.SM,
    borderWidth: 1,
    borderColor: ONBOARDING_COLORS.BORDER,
  },
  confidenceText: {
    ...ONBOARDING_TYPOGRAPHY.SUBTITLE,
    fontSize: 12,
  },
  buttonContainer: {
    padding: ONBOARDING_SPACING.LG,
    paddingBottom: 40,
  },
});

export default Onboarding8;
