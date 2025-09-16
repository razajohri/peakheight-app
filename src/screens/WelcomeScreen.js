import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image
} from 'react-native';
import { COLORS, APP_CONFIG } from '../utils/constants';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ onGetStarted }) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // This screen is no longer auto-shown; leave animations but remove auto-transition
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [onGetStarted]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image source={require('../../assets/icon.png')} style={{ width: 96, height: 96, borderRadius: 20, marginBottom: 8 }} />
            <Text style={styles.logoText}>{APP_CONFIG.NAME}</Text>
          </View>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.heroImage}>
            <Image source={require('../../assets/icon.png')} style={{ width: 80, height: 80, borderRadius: 16 }} />
          </View>

          <Text style={styles.title}>Ready to grow taller and stronger?</Text>
          <Text style={styles.subtitle}>
            Join thousands achieving their height goals with science-backed methods.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.pageIndicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logo: {
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  heroEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 10,
  },
  bottomSection: {
    paddingBottom: 40,
  },

  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.BORDER,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: COLORS.PRIMARY,
    width: 20,
  },
});
