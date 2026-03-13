import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Dimensions,
  Modal,
  Platform,
  Image,
  StatusBar,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/UI/Icon';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../contexts/UserContext';
import { AuthService } from '../services/auth';
import HapticFeedback from '../utils/hapticFeedback';
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileStats from '../components/Profile/ProfileStats';
import ProfileProgress from '../components/Profile/ProfileProgress';
import ProfileDetails from '../components/Profile/ProfileDetails';
import ProfileLifestyle from '../components/Profile/ProfileLifestyle';
import ProfileSettings from '../components/Profile/ProfileSettings';
import ProfileSubscription from '../components/Profile/ProfileSubscription';
import ProfileAbout from '../components/Profile/ProfileAbout';
import FeedbackModal from '../components/Profile/FeedbackModal';
import { DatabaseService } from '../services/database';
import SubscriptionService from '../services/subscriptionService';
import Purchases from 'react-native-purchases';
import { SeedRetentionService } from '../services/seedRetentionService';

const { width, height } = Dimensions.get('window');

const PersonalProfileScreen = ({ navigation, onLogout, onNavigateToProgress, onNavigateToTab }) => {
  const { userProfile, userProgress, loading, updateUserProfile } = useUser();
  const [isPremium, setIsPremium] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [personalDetailsModalVisible, setPersonalDetailsModalVisible] = useState(false);
  const [lifestyleModalVisible, setLifestyleModalVisible] = useState(false);
  const [seedRetentionStreak, setSeedRetentionStreak] = useState(0);
  const insets = useSafeAreaInsets();

  const tabs = [
    { id: 'home', label: 'Me', icon: 'home' },
    { id: 'exercises', label: 'Hub', icon: 'barbell' },
    { id: 'daily', label: 'Today', icon: 'calendar' },
    { id: 'tribe', label: 'Tribe', icon: 'people' },
  ];

  const handleTabPress = (tabId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onNavigateToTab) {
      onNavigateToTab(tabId);
    } else if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (userProfile) {
      // Check premium_status from database (boolean) - subscription_status is not used
      setIsPremium(userProfile.premium_status === true);
    }
  }, [userProfile]);

  // Fetch seed retention streak
  useEffect(() => {
    const fetchSeedRetentionStreak = async () => {
      if (userProfile?.id && userProfile?.gender === 'male') {
        try {
          const status = await SeedRetentionService.getSeedRetentionStatus(userProfile.id);
          setSeedRetentionStreak(status.currentStreak);
        } catch (error) {
          console.error('Error fetching seed retention streak:', error);
        }
      }
    };
    fetchSeedRetentionStreak();
  }, [userProfile?.id, userProfile?.gender]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.signOut();
              if (onLogout) {
                onLogout();
              }
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleAddWidgetInfo = () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Add PeakHeight widget',
        [
          '1. Go to your iPhone Home Screen.',
          '2. Long‑press on an empty area until apps start jiggling.',
          '3. Tap the + button in the top‑left corner.',
          '4. Search for "PeakHeight".',
          '5. Choose the "PeakHeight Today" widget and tap Add Widget.',
        ].join('\n'),
        [{ text: 'OK' }],
      );
    } else {
      Alert.alert(
        'Widgets on iOS only',
        'Home‑screen widgets are currently available on iOS. You can still use all PeakHeight features inside the app.',
        [{ text: 'OK' }],
      );
    }
  };


  const handleCancelSubscription = async () => {
    try {
      // Initialize SubscriptionService if needed
      await SubscriptionService.initialize();
      
      // Try to use RevenueCat's showManageSubscriptions (iOS only)
      if (Platform.OS === 'ios') {
        try {
          await Purchases.showManageSubscriptions();
          return;
        } catch (rcError) {
          console.log('RevenueCat showManageSubscriptions not available, using fallback URL:', rcError);
        }
      }
      
      // Fallback: Open platform-specific subscription management URL
      let url;
      if (Platform.OS === 'ios') {
        url = 'https://apps.apple.com/account/subscriptions';
      } else {
        // Android - use package name from app.json
        const packageName = 'com.peakheight.app';
        url = `https://play.google.com/store/account/subscriptions?package=${packageName}`;
      }
      
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        Alert.alert(
          'Manage Subscription',
          'You will be redirected to manage your subscription. Your subscription will remain active until the end of the current billing period.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Manage Subscription',
          Platform.OS === 'ios' 
            ? 'Please go to Settings > [Your Name] > Subscriptions to manage your subscription.'
            : 'Please go to Google Play Store > Account > Subscriptions to manage your subscription.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      Alert.alert(
        'Manage Subscription',
        Platform.OS === 'ios'
          ? 'Please go to Settings > [Your Name] > Subscriptions to cancel your subscription.'
          : 'Please go to Google Play Store > Account > Subscriptions to cancel your subscription.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    if (!userProfile?.id) {
      Alert.alert('Error', 'Please log in to send feedback');
      return;
    }

    try {
      setFeedbackLoading(true);
      const { data, error } = await DatabaseService.submitFeedback(
        userProfile.id,
        feedbackData.feedbackType,
        feedbackData.message,
        feedbackData.title
      );

      if (error) {
        Alert.alert('Error', `Failed to submit feedback: ${error}`);
        return;
      }

      Alert.alert('Success', 'Thank you for your feedback! We appreciate your input.');
      setFeedbackModalVisible(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', `Failed to submit feedback: ${error.message || error}`);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const formatHeight = (heightInCm) => {
    if (!heightInCm) return 'Not set';
    const feet = Math.floor(heightInCm / 30.48);
    const inches = Math.round((heightInCm % 30.48) / 2.54);
    return `${feet}'${inches}"`;
  };

  const formatWeight = (weightInKg) => {
    if (!weightInKg) return 'Not set';
    const pounds = Math.round(weightInKg / 0.453592);
    return `${pounds} lbs`;
  };

  const calculateHeightProgress = () => {
    if (!userProfile?.current_height || !userProfile?.target_height) return 0;
    const current = userProfile.current_height;
    const target = userProfile.target_height;
    const progress = ((current - 150) / (target - 150)) * 100; // Assuming 150cm as base
    return Math.max(0, Math.min(100, progress));
  };

  const getDaysOnJourney = () => {
    if (!userProfile?.created_at) return 0;
    const created = new Date(userProfile.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Removed NotificationTestScreen

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.fixedHeaderContainer}>
        <LinearGradient
          colors={['#FFFFFF', '#F8F9FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.simpleHeader, { paddingTop: Platform.OS === 'ios' ? Math.max(insets.top - 52, 0) : 0 }, styles.headerGradient]}
        >
          <View style={styles.leftContainer}>
            <TouchableOpacity 
              style={[styles.backButton, styles.premiumButton]} 
              onPress={() => { HapticFeedback?.light?.(); navigation.goBack(); }}
            >
              <Icon name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, styles.premiumTitle]}>PROFILE</Text>
          </View>
          <View style={styles.rightContainer}>
            <View style={styles.headerButton} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.scrollViewContent, { paddingTop: Platform.OS === 'ios' ? (Math.max(insets.top - 52, 0) + 44) : 44, paddingBottom: Platform.OS === 'android' ? 20 : 20 }]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'never' : undefined}
        automaticallyAdjustContentInsets={Platform.OS === 'ios' ? false : undefined}
        contentInset={Platform.OS === 'ios' ? { top: 0, bottom: 0, left: 0, right: 0 } : undefined}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            {userProfile?.avatar_url ? (
              <Image
                source={{ uri: userProfile.avatar_url }}
                style={styles.profileAvatar}
              />
            ) : (
              <View style={styles.profileAvatarPlaceholder}>
                <Icon name="person" size={50} color="#000000" />
              </View>
            )}
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Icon name="diamond" size={16} color="#FFD700" />
              </View>
            )}
          </View>
          <Text style={styles.profileName}>
            {userProfile?.first_name 
              ? userProfile.last_name 
                ? `${userProfile.first_name} ${userProfile.last_name}` 
                : userProfile.first_name
              : userProfile?.display_name || 'Height Seeker'}
          </Text>
          <Text style={styles.profileEmail}>{userProfile?.email || 'No email'}</Text>
        </View>

        {/* Key Statistic Cards */}
        <LinearGradient
          colors={["#F8FAFC", "#E2E8F0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.keyStatCard}
        >
          <View style={styles.keyStatIconContainer}>
            <Icon name="flame" size={20} color="#FF9500" />
          </View>
          <View style={styles.keyStatContent}>
            <Text style={styles.keyStatNumber}>{userProgress?.current_streak || 0}</Text>
            <Text style={styles.keyStatLabel}>Current Streak</Text>
          </View>
        </LinearGradient>

        {/* Seed Retention Streak Card - Only show for male users */}
        {userProfile?.gender === 'male' && (
          <LinearGradient
            colors={["#F8FAFC", "#E2E8F0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.keyStatCard}
          >
            <View style={styles.seedRetentionIconContainer}>
              <Icon name="water" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.keyStatContent}>
              <Text style={[styles.keyStatNumber, styles.seedRetentionNumber]}>{seedRetentionStreak}</Text>
              <Text style={styles.keyStatLabel}>Seed Retention Streak</Text>
            </View>
          </LinearGradient>
        )}

        {/* Menu Items List */}
        <LinearGradient
          colors={["#F8FAFC", "#E2E8F0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.menuCard}
        >
          {/* Personal Details */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              HapticFeedback.light();
              setPersonalDetailsModalVisible(true);
            }}
          >
            <Icon name="person" size={24} color="#000000" />
            <Text style={styles.menuText}>Personal Details</Text>
            <Icon name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>

          {/* Lifestyle */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              HapticFeedback.light();
              setLifestyleModalVisible(true);
            }}
          >
            <Icon name="fitness" size={24} color="#000000" />
            <Text style={styles.menuText}>Lifestyle</Text>
            <Icon name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>

          {/* Add Widget to Home Screen (iOS) */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              HapticFeedback.light();
              handleAddWidgetInfo();
            }}
          >
            <Icon name="apps" size={24} color="#000000" />
            <Text style={styles.menuText}>Add PeakHeight widget</Text>
            <Icon name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>

          {/* Send Feedback */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              HapticFeedback.light();
              setFeedbackModalVisible(true);
            }}
          >
            <Icon name="chatbubble-ellipses-outline" size={24} color="#000000" />
            <Text style={styles.menuText}>Send Feedback</Text>
            <Icon name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>

          {/* Terms of Service */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              HapticFeedback.light();
              navigation.navigate('TermsOfService');
            }}
          >
            <Icon name="document-text" size={24} color="#000000" />
            <Text style={styles.menuText}>Terms of Service</Text>
            <Icon name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              HapticFeedback.light();
              navigation.navigate('PrivacyPolicy');
            }}
          >
            <Icon name="shield-checkmark" size={24} color="#000000" />
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Icon name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>

          {/* Subscription (if premium) */}
          {isPremium && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                HapticFeedback.light();
                handleCancelSubscription();
              }}
            >
              <Icon name="diamond" size={24} color="#FFD700" />
              <Text style={styles.menuText}>Subscription</Text>
              <Icon name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>
          )}

          {/* Log Out */}
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={() => {
              HapticFeedback.medium();
              handleSignOut();
            }}
          >
            <Icon name="log-out" size={24} color="#000000" />
            <Text style={styles.menuText}>Log Out</Text>
            <Icon name="chevron-forward" size={20} color="#CCCCCC" />
          </TouchableOpacity>
        </LinearGradient>

      </ScrollView>

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackModalVisible}
        onClose={() => setFeedbackModalVisible(false)}
        onSubmit={handleFeedbackSubmit}
        loading={feedbackLoading}
      />

      {/* Personal Details Modal */}
      <Modal
        visible={personalDetailsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPersonalDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Personal Details</Text>
              <TouchableOpacity
                onPress={() => setPersonalDetailsModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Icon name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalInfoCard}>
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}><Icon name="calendar" size={20} color="#3B5FE3" /></View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Date of Birth</Text>
                    <Text style={styles.infoValue}>{formatDate(userProfile?.date_of_birth)}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}><Icon name="person" size={20} color="#10B981" /></View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Gender</Text>
                    <Text style={styles.infoValue}>{userProfile?.gender || 'Not set'}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <View style={styles.infoIconContainer}><Icon name="scale" size={20} color="#F59E0B" /></View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Current Weight</Text>
                    <Text style={styles.infoValue}>{formatWeight(userProfile?.current_weight)}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Lifestyle Modal */}
      <Modal
        visible={lifestyleModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLifestyleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lifestyle</Text>
              <TouchableOpacity
                onPress={() => setLifestyleModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Icon name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalInfoCard}>
                <View style={styles.lifestyleItem}>
                  <View style={styles.lifestyleIconContainer}><Icon name="moon" size={20} color="#8B5CF6" /></View>
                  <View style={styles.lifestyleContent}>
                    <Text style={styles.lifestyleLabel}>Sleep Hours</Text>
                    <Text style={styles.lifestyleValue}>{userProfile?.sleep_hours || 'Not set'} hours/night</Text>
                  </View>
                </View>
                <View style={styles.lifestyleItem}>
                  <View style={styles.lifestyleIconContainer}><Icon name="fitness" size={20} color="#EF4444" /></View>
                  <View style={styles.lifestyleContent}>
                    <Text style={styles.lifestyleLabel}>Workout Frequency</Text>
                    <Text style={styles.lifestyleValue}>{userProfile?.workout_frequency || 'Not set'}</Text>
                  </View>
                </View>
                <View style={styles.lifestyleItem}>
                  <View style={styles.lifestyleIconContainer}><Icon name="footsteps" size={20} color="#06B6D4" /></View>
                  <View style={styles.lifestyleContent}>
                    <Text style={styles.lifestyleLabel}>Foot Size</Text>
                    <Text style={styles.lifestyleValue}>{userProfile?.foot_size || 'Not set'}</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },

  // Simple Header Styles
  simpleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    minHeight: 44,
  },
  headerGradient: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  backButton: {
    padding: 2,
    marginTop: 5,
  },
  premiumButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#000000',
  },

  // Fixed Header Container
  fixedHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },

  // Profile Section Styles
  profileSection: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 30,
    paddingBottom: Platform.OS === 'ios' ? 24 : 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
  },
  profileAvatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#000000',
  },

  // Key Statistic Card
  keyStatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  keyStatIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  seedRetentionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  seedRetentionNumber: {
    color: '#8B5CF6',
  },
  keyStatContent: {
    flex: 1,
  },
  keyStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  keyStatLabel: {
    fontSize: 13,
    color: '#000000',
  },

  // Menu Card
  menuCard: {
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 0,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    marginLeft: 16,
  },


  // Progress Card Styles
  progressCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressGradient: {
    padding: 20,
  },
  progressHeader: {
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  heightDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heightItem: {
    alignItems: 'center',
  },
  heightLabel: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 4,
  },
  heightValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  heightArrow: {
    marginHorizontal: 20,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },


  // Info Card Styles
  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 95, 227, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },

  // Lifestyle Card Styles
  lifestyleCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lifestyleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  lifestyleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lifestyleContent: {
    flex: 1,
  },
  lifestyleLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 2,
  },
  lifestyleValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },

  // Settings Card Styles
  settingsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 95, 227, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },

  // Subscription Card Styles
  subscriptionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  subscriptionGradient: {
    padding: 24,
    alignItems: 'center',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  subscriptionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Action Card Styles
  actionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  signOutButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  signOutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // About Card Styles
  aboutCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  versionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  versionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 95, 227, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  versionContent: {
    flex: 1,
  },
  versionLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 2,
  },
  versionValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  aboutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 102, 102, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  aboutLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    flex: 1,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalInfoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },

});

export default PersonalProfileScreen;
