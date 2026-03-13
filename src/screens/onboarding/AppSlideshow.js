import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    image: require('../../../assets/app screenshots/home page dashboard.jpg'),
    description: 'Track your daily progress, view your growth factors, and get personalized insights from your AI coach Jacob.',
    feature: 'Daily Progress & AI Coach'
  },
  {
    id: 2,
    image: require('../../../assets/app screenshots/daily task page.jpg'),
    description: 'Complete your daily tasks, track your streak, and measure your height progress. Stay consistent with your 120-day growth plan.',
    feature: 'Task Management & Height Tracking'
  },
  {
    id: 3,
    image: require('../../../assets/app screenshots/hub page exercise page.jpg'),
    description: 'Access personalized exercises based on your phase. Choose from stretching, hanging, posture, and core strengthening workouts.',
    feature: 'Personalized Exercise Plans'
  },
  {
    id: 4,
    image: require('../../../assets/app screenshots/my exercises custom exercise.jpg'),
    description: 'Create custom exercise plans tailored to your needs. Track your favorite exercises and build your perfect routine.',
    feature: 'Custom Workout Builder'
  },
  {
    id: 5,
    image: require('../../../assets/app screenshots/community tribe page.jpg'),
    description: 'Connect with others on their height growth journey. Share progress, get motivated, and learn from the community.',
    feature: 'Community Support & Sharing'
  },
];

export default function AppSlideshow({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentSlide < slides.length - 1) {
      // Fade animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      // Last slide - go to onboarding
      navigation.navigate('Onboarding2');
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Onboarding2');
  };

  const currentSlideData = slides[currentSlide];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.gradient}
      >
        {/* Skip button */}
        <View style={styles.skipContainer}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* ScrollView for slides */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentSlide(slideIndex);
          }}
          style={styles.scrollView}
        >
          {slides.map((slide, index) => (
            <View key={slide.id} style={styles.slideContainer}>
              <Animated.View
                style={[
                  styles.slideContent,
                  index === currentSlide && { opacity: fadeAnim },
                ]}
              >
                {/* Image with shadow effect */}
                <View style={styles.imageShadowContainer}>
                  <View style={styles.imageWrapper}>
                    <Image
                      source={slide.image}
                      style={styles.slideImage}
                      resizeMode="cover"
                    />
                  </View>
                </View>

                {/* Content */}
                <View style={styles.textContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>{slide.feature}</Text>
                  </View>
                  <Text style={styles.description}>{slide.description}</Text>
                </View>
              </Animated.View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom section with indicators and button */}
        <View style={styles.bottomSection}>
          {/* Page indicators */}
          <View style={styles.indicators}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentSlide && styles.activeIndicator,
                ]}
              />
            ))}
          </View>

          {/* Next button with gradient */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F5F5F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    flex: 1,
  },
  skipContainer: {
    paddingTop: 20,
    paddingRight: 24,
    alignItems: 'flex-end',
    zIndex: 10,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  slideContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  imageShadowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  imageWrapper: {
    width: SCREEN_WIDTH * 0.88,
    height: SCREEN_HEIGHT * 0.55,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    backgroundColor: '#1a1a1a',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    paddingBottom: 10,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  titleContainer: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  description: {
    fontSize: 15,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
    fontWeight: '400',
  },
  bottomSection: {
    paddingBottom: 50,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    gap: 10,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeIndicator: {
    width: 28,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  nextButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.3,
  },
});

