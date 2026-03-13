import React, { useMemo, useEffect, useState } from 'react';
import { View, StatusBar, Dimensions, Alert } from 'react-native';
import RecipeLibrary from '../components/Nutrition/RecipeLibrary';
import ExercisesMainView from '../components/Exercises/ExercisesMainView';
import HapticFeedback from '../utils/hapticFeedback';
import { CustomExercisePlanService } from '../services/customExercisePlanService';
import { useExerciseNavigation } from '../hooks/useExerciseNavigation';
import { filterExercises } from '../utils/exerciseUtils';
import { exercisesStyles } from '../styles/exercisesStyles';
import { useUser } from '../contexts/UserContext';
import StreakModal from '../components/Home/StreakModal';
import StreakFreezeModal from '../components/Home/StreakFreezeModal';
import SeedRetentionModal from '../components/Home/SeedRetentionModal';
import { StreakFreezeService } from '../services/streakFreezeService';
import { SoundService } from '../services/soundService';
import * as Haptics from 'expo-haptics';

const ExercisesScreen = ({ navigation, intent, onConsumeIntent, onNavigateToProfile }) => {
  const { userProfile, userProgress, fetchUserProfile } = useUser();
  const [isStreakModalVisible, setStreakModalVisible] = useState(false);
  const [isFreezeModalVisible, setFreezeModalVisible] = useState(false);
  const [isSeedRetentionModalVisible, setSeedRetentionModalVisible] = useState(false);
  const [freezeStatus, setFreezeStatus] = useState({ available: false, previousStreak: 0, currentStreak: 0 });
  const {
    view,
    selectedCategory,
    selectedExercise,
    selectedSubExercise,
    activeTopTab,
    search,
    sort,
    showRecipeLibrary,
    barcodeInput,
    showBarcodeInput,
    timer,
    isTimerRunning,
    showCompletionModal,
    customExercisePlan,
    loadingCustomPlan,
    setView,
    setSelectedCategory,
    setSelectedExercise,
    setSelectedSubExercise,
    setActiveTopTab,
    setSearch,
    setSort,
    setShowRecipeLibrary,
    setBarcodeInput,
    setShowBarcodeInput,
    setTimer,
    setIsTimerRunning,
    setShowCompletionModal,
    setCustomExercisePlan,
    setLoadingCustomPlan,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleTimer,
    openCategory,
    openExercise,
    openSubExercise,
    openBarcodeScanner,
    openFoodPhotoRecognition,
    handleBarcodeLookup,
    goToPreviousExercise,
    goToNextExercise,
  } = useExerciseNavigation();

  // Handle deep intent to show hub/today
  useEffect(() => {
    if (intent === 'today-hub') {
      setView('hub');
      setActiveTopTab && setActiveTopTab('physical');
      onConsumeIntent && onConsumeIntent();
    }
  }, [intent]);

  // Fetch freeze status
  useEffect(() => {
    const fetchFreezeStatus = async () => {
      if (userProfile?.id) {
        const status = await StreakFreezeService.getFreezeStatus(userProfile.id);
        setFreezeStatus(status);
      }
    };
    fetchFreezeStatus();
  }, [userProfile?.id]);

  const screenHeight = Dimensions.get('window').height;

  const filteredExercises = useMemo(() => {
    return filterExercises(selectedCategory, search, sort);
  }, [selectedCategory, search, sort]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {showRecipeLibrary ? (
        <RecipeLibrary
          navigation={navigation}
          onClose={() => setShowRecipeLibrary(false)}
        />
      ) : (
        <ExercisesMainView
          styles={styles}
          screenHeight={screenHeight}
          view={view}
          activeTopTab={activeTopTab}
          navigation={navigation}
          selectedCategory={selectedCategory}
          selectedExercise={selectedExercise}
          selectedSubExercise={selectedSubExercise}
          showBarcodeInput={showBarcodeInput}
          barcodeInput={barcodeInput}
          setBarcodeInput={setBarcodeInput}
          showCompletionModal={showCompletionModal}
          filteredExercises={filteredExercises}
          loadingCustomPlan={loadingCustomPlan}
          customExercisePlan={customExercisePlan}
          userProfile={userProfile}
          setSelectedExercise={setSelectedExercise}
          setView={setView}
          setSelectedCategory={setSelectedCategory}
          setCustomExercisePlan={setCustomExercisePlan}
          setShowBarcodeInput={setShowBarcodeInput}
          setShowCompletionModal={setShowCompletionModal}
          setSelectedSubExercise={setSelectedSubExercise}
          setActiveTopTab={setActiveTopTab}
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          resetTimer={resetTimer}
          openCategory={openCategory}
          openExercise={openExercise}
          openSubExercise={openSubExercise}
          handleBarcodeLookup={handleBarcodeLookup}
          HapticFeedback={HapticFeedback}
          CustomExercisePlanService={CustomExercisePlanService}
          onNavigateToProfile={onNavigateToProfile}
          onStreak={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            await SoundService.playStreakSound();
            setStreakModalVisible(true);
          }}
          onShield={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSeedRetentionModalVisible(true);
          }}
        />
      )}

      {/* Streak Modal */}
      <StreakModal
        visible={isStreakModalVisible}
        onClose={() => setStreakModalVisible(false)}
        userProgress={userProgress}
        freezeStatus={freezeStatus}
        onUseFreeze={() => {
          setStreakModalVisible(false);
          setFreezeModalVisible(true);
        }}
      />

      {/* Streak Freeze Modal */}
      <StreakFreezeModal
        visible={isFreezeModalVisible}
        onClose={() => setFreezeModalVisible(false)}
        previousStreak={freezeStatus.previousStreak}
        onRestore={async () => {
          if (userProfile?.id) {
            const result = await StreakFreezeService.useStreakFreeze(userProfile.id);
            if (result.success) {
              await fetchUserProfile(userProfile.id);
              setFreezeModalVisible(false);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert(
                '❄️ Streak Restored!',
                `Your streak of ${result.restoredStreak} days has been restored! Keep up the amazing work! 🔥`
              );
            } else {
              Alert.alert('Error', result.error || 'Failed to restore streak. Please try again.');
            }
          }
        }}
      />

      {/* Seed Retention Modal */}
      <SeedRetentionModal
        visible={isSeedRetentionModalVisible}
        onClose={() => setSeedRetentionModalVisible(false)}
      />
                  </View>
  );
};

const styles = exercisesStyles;

export default ExercisesScreen;
