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
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../contexts/UserContext';
import { AuthService } from '../services/auth';
import HapticFeedback from '../utils/hapticFeedback';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileStats from '../components/Profile/ProfileStats';
import ProfileProgress from '../components/Profile/ProfileProgress';
import ProfileDetails from '../components/Profile/ProfileDetails';
import ProfileLifestyle from '../components/Profile/ProfileLifestyle';
import ProfileSettings from '../components/Profile/ProfileSettings';
import ProfileSubscription from '../components/Profile/ProfileSubscription';
import ProfileAbout from '../components/Profile/ProfileAbout';

const { width, height } = Dimensions.get('window');

const PersonalProfileScreen = ({ navigation, onLogout }) => {
  const { userProfile, userProgress, loading, updateUserProfile } = useUser();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [showNotificationTest, setShowNotificationTest] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (userProfile) {
      setIsPremium(userProfile.subscription_status === 'active');
    }
  }, [userProfile]);

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

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your premium subscription? You will lose access to premium features.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement subscription cancellation logic
              Alert.alert('Success', 'Your subscription has been cancelled.');
              setIsPremium(false);
            } catch (error) {
              console.error('Cancel subscription error:', error);
              Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
            }
          }
        }
      ]
    );
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header + Hero */}
        <ProfileHeader
          styles={styles}
          insets={insets}
          isPremium={isPremium}
          userProfile={userProfile}
          HapticFeedback={HapticFeedback}
          onBack={() => navigation.goBack()}
        />

        {/* Stats Cards */}
        <ProfileStats styles={styles} getDaysOnJourney={getDaysOnJourney} userProgress={userProgress} />
        <ProfileProgress
          styles={styles}
          userProfile={userProfile}
          formatHeight={formatHeight}
          calculateHeightProgress={calculateHeightProgress}
        />

        {/* Personal Information */}
        <ProfileDetails
          styles={styles}
          userProfile={userProfile}
          formatDate={formatDate}
          formatWeight={formatWeight}
        />

        {/* Lifestyle Information */}
        <ProfileLifestyle styles={styles} userProfile={userProfile} />

        {/* Settings */}
        <ProfileSettings
          styles={styles}
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
          onTestNotifications={() => {}}
          HapticFeedback={HapticFeedback}
        />

        {/* Subscription Management */}
        <ProfileSubscription
          styles={styles}
          isPremium={isPremium}
          onCancel={handleCancelSubscription}
          HapticFeedback={HapticFeedback}
        />

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>

          <View style={styles.actionCard}>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={() => {
                HapticFeedback.medium();
                handleSignOut();
              }}
            >
              <LinearGradient
                colors={['#FF3B30', '#DC2626']}
                style={styles.signOutGradient}
              >
                <Icon name="log-out" size={20} color="#FFFFFF" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <ProfileAbout styles={styles} />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
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

  // Header Styles
  gradientHeader: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSpacer: {
    width: 40, // Same width as the back button to maintain balance
  },

  // Profile Hero Styles
  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#000000',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  membershipBadge: {
    alignSelf: 'flex-start',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
    letterSpacing: 0.5,
  },

  // Stats Styles
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: -15,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
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
    color: '#666666',
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
    color: '#666666',
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

  // Section Styles
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    letterSpacing: 0.5,
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
    color: '#666666',
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
    color: '#666666',
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
    color: '#666666',
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

  bottomSpacing: {
    height: 40,
  },
});

export default PersonalProfileScreen;
