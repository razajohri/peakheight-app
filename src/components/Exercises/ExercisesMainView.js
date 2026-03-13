import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, FlatList, View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveHeight, getSafeAreaPadding } from '../../utils/responsiveUtils';
import HeaderBar from './HeaderBar';
import TopTabsBar from './TopTabsBar';
import TopExerciseOptionsView from './TopExerciseOptionsView';
import CategoryGrid from './CategoryGrid';
import WeeklyProgressView from './WeeklyProgressView';
import NutritionLibrary from './NutritionLibrary';
import ListControls from './ListControls';
import ExerciseItem from './ExerciseItem';
import SubExercisesView from './SubExercisesView';
import ExerciseDetailView from './ExerciseDetailView';
import NutritionDetailView from './NutritionDetailView';
import ExerciseCompletionModal from './ExerciseCompletionModal';
import FoodScanner from '../Nutrition/FoodScanner';
import CustomExercisePlan from './CustomExercisePlan';
import { getExerciseImageUrl } from '../../utils/nutritionUtils';
import { exercises } from '../../utils/exerciseUtils';
import { DailyPlanService } from '../../services/dailyPlanService';
import { DailyExerciseCompletionService } from '../../services/dailyExerciseCompletionService';
import * as Haptics from 'expo-haptics';
import Icon from '../UI/Icon';
import PeakHeightTodayWidget from '../../../widgets/PeakHeightTodayWidget';

export default function ExercisesMainView({
  styles,
  screenHeight,
  view,
  activeTopTab,
  navigation,
  selectedCategory,
  selectedExercise,
  selectedSubExercise,
  showBarcodeInput,
  barcodeInput,
  setBarcodeInput,
  showCompletionModal,
  filteredExercises,
  loadingCustomPlan,
  customExercisePlan,
  userProfile,
  setSelectedExercise,
  setView,
  setSelectedCategory,
  setCustomExercisePlan,
  setShowBarcodeInput,
  setShowCompletionModal,
  setSelectedSubExercise,
  setActiveTopTab,
  search,
  setSearch,
  sort,
  setSort,
  resetTimer,
  openCategory,
  openExercise,
  openSubExercise,
  handleBarcodeLookup,
  HapticFeedback,
  CustomExercisePlanService,
  onNavigateToProfile,
  onStreak,
  onShield,
}) {
  const [scannerMode, setScannerMode] = useState(null);
  const [detailTimer, setDetailTimer] = useState(0);
  const [isDetailTimerRunning, setIsDetailTimerRunning] = useState(false);
  const [todayList, setTodayList] = useState([]);
  const [currentTodayIndex, setCurrentTodayIndex] = useState(null);
  const [showTodayComplete, setShowTodayComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [selectedHghExercise, setSelectedHghExerciseState] = useState(null);
  const [isHghDay, setIsHghDay] = useState(true);
  const [hghDayIndex, setHghDayIndex] = useState(0);

  // Load completed exercises for today
  const loadCompletedExercises = async () => {
    if (!userProfile?.id) return;

    try {
      const progress = await DailyPlanService.getUserProgress(userProfile.id);
      const currentDay = progress?.current_day || 1;

      const { data: completions } = await DailyExerciseCompletionService.getCompletedExercises(
        userProfile.id,
        currentDay
      );

      const completedSet = new Set();
      (completions || []).forEach(completion => {
        const key = completion.sub_exercise_id
          ? `${completion.exercise_id}-${completion.sub_exercise_id}`
          : completion.exercise_id;
        completedSet.add(key);
      });

      setCompletedExercises(completedSet);
    } catch (error) {
      console.error('Error loading completed exercises:', error);
    }
  };

  // Mark current exercise as completed
  const markCurrentExerciseCompleted = async () => {
    if (!userProfile?.id || currentTodayIndex == null || !todayList[currentTodayIndex]) return;

    try {
      const currentExercise = todayList[currentTodayIndex];
      const exerciseId = currentExercise.parentExercise?.id || currentExercise.id;
      const subExerciseId = currentExercise.subExercise?.id || null;

      const progress = await DailyPlanService.getUserProgress(userProfile.id);
      const currentDay = progress?.current_day || 1;

      await DailyExerciseCompletionService.markExerciseCompleted(
        userProfile.id,
        currentDay,
        exerciseId,
        subExerciseId
      );

      // Update local state
      const key = subExerciseId ? `${exerciseId}-${subExerciseId}` : exerciseId;
      setCompletedExercises(prev => new Set([...prev, key]));
    } catch (error) {
      console.error('Error marking exercise as completed:', error);
    }
  };

  const detailTotalTime = useMemo(() => {
    if (selectedSubExercise && selectedSubExercise.duration) return selectedSubExercise.duration;
    if (selectedExercise && selectedExercise.durationMin) return selectedExercise.durationMin * 60;
    return 0;
  }, [selectedExercise, selectedSubExercise]);

  useEffect(() => {
    // Initialize timer when opening a detail
    if (selectedExercise || selectedSubExercise) {
      setDetailTimer(detailTotalTime || 0);
      setIsDetailTimerRunning(false);
    }
  }, [selectedExercise, selectedSubExercise, detailTotalTime]);

  // Load completed exercises when component mounts or user changes
  useEffect(() => {
    if (userProfile?.id) {
      loadCompletedExercises();
    }
  }, [userProfile?.id]);

  useEffect(() => {
    if (!isDetailTimerRunning) return;
    if (detailTimer <= 0) {
      setIsDetailTimerRunning(false);
      // auto-enable next when finished
      return;
    }
    const id = setInterval(() => {
      setDetailTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [isDetailTimerRunning, detailTimer]);

  // Vibrate and show completion when timer ends
  useEffect(() => {
    if (detailTimer === 0 && isDetailTimerRunning) {
      try { require('expo-haptics').notificationAsync(require('expo-haptics').NotificationFeedbackType.Success); } catch {}
      // Optionally, set a local state to show a completion modal
      setIsDetailTimerRunning(false);
      // TODO: integrate completion modal if desired
    }
  }, [detailTimer, isDetailTimerRunning]);
  const Header = (
    <HeaderBar
      styles={styles}
      navigation={navigation}
      view={view}
      setView={setView}
      selectedCategory={selectedCategory}
      selectedExercise={selectedExercise}
      selectedSubExercise={selectedSubExercise}
      setSelectedSubExercise={setSelectedSubExercise}
      activeTopTab={activeTopTab}
      setActiveTopTab={setActiveTopTab}
      todayList={todayList}
      currentTodayIndex={currentTodayIndex}
      setCurrentTodayIndex={setCurrentTodayIndex}
      onStreak={onStreak}
      onShield={onShield}
    />
  );

  const TopTabs = (
    <TopTabsBar
      styles={styles}
      activeTopTab={activeTopTab}
      setActiveTopTab={(tab) => {
        HapticFeedback.medium();
        setActiveTopTab(tab);
      }}
      HapticFeedback={HapticFeedback}
    />
  );

  const TopExerciseOptionsViewContent = (
    <TopExerciseOptionsView
      styles={styles}
      HapticFeedback={HapticFeedback}
      onPressToday={() => {
        HapticFeedback.medium();
        // setActiveTopTab will be handled by the hook
      }}
      onOpenCategory={openCategory}
    />
  );

  const CategoryGridContent = (
    null
  );

  const CustomExercisePlanContent = (
    <CustomExercisePlan
      styles={styles}
      loadingCustomPlan={loadingCustomPlan}
      customExercisePlan={customExercisePlan}
      userProfile={userProfile}
      setSelectedExercise={setSelectedExercise}
      setView={setView}
      setSelectedCategory={setSelectedCategory}
      setCustomExercisePlan={setCustomExercisePlan}
      CustomExercisePlanService={CustomExercisePlanService}
    />
  );

  const NutritionContent = (
    <NutritionLibrary
      styles={styles}
      openBarcodeScanner={() => {
        setBarcodeInput('');
        setScannerMode('barcode');
        setShowBarcodeInput(true);
      }}
      openFoodPhotoRecognition={() => {
        setBarcodeInput('');
        setScannerMode('photo');
        setShowBarcodeInput(true);
      }}
      openCategory={openCategory}
    />
  );

  const ListControlsView = (
    <ListControls
      styles={styles}
      search={search}
      setSearch={setSearch}
      sort={sort}
      setSort={setSort}
    />
  );

  // Simple "Today's pick" preview: prefer a high-impact exercise, fallback to first exercise
  const todayPick = useMemo(() => {
    if (!Array.isArray(exercises) || exercises.length === 0) return null;
    const highImpact = exercises.filter(e => e.highImpact || e.isHighestImpact);
    const chosen = (highImpact.length > 0 ? highImpact : exercises)[0];
    return chosen?._full || chosen;
  }, []);

  // HGH-focused exercise options (prioritize the 4 dedicated HGH exercises, then other high-impact ones)
  const hghExercises = useMemo(() => {
    if (!Array.isArray(exercises) || exercises.length === 0) return [];

    // Dedicated highest-impact HGH exercises (ex-054 to ex-057)
    const coreHghIds = new Set(['ex-054', 'ex-055', 'ex-056', 'ex-057']);
    const allHigh = exercises.filter(e => e.highImpact || e.isHighestImpact);
    const core = allHigh.filter(e => coreHghIds.has(String(e.id)));
    const extras = allHigh.filter(e => !coreHghIds.has(String(e.id)));

    // Show core HGH moves first, then other high-impact options
    return [...core, ...extras];
  }, []);

  // Initialize HGH schedule (2 days on, 1 day off) and user-selected HGH exercise
  useEffect(() => {
    const initHghSchedule = async () => {
      if (!userProfile?.id || hghExercises.length === 0) return;

      try {
        const progress = await DailyPlanService.getUserProgress(userProfile.id);
        const currentDay = progress?.current_day || 1;

        // 2 days on, 1 day off cycle based on current_day
        const cycleIndex = (currentDay - 1) % 3; // 0,1 = on; 2 = off
        setIsHghDay(cycleIndex === 0 || cycleIndex === 1);
        setHghDayIndex(cycleIndex);

        const storageKey = `ph_hgh_exercise_choice_${userProfile.id}`;
        const storedId = await AsyncStorage.getItem(storageKey);

        let chosen = null;
        if (storedId) {
          chosen = hghExercises.find(e => String(e.id) === storedId);
        }
        if (!chosen && hghExercises.length > 0) {
          chosen = hghExercises[0];
        }

        setSelectedHghExerciseState(chosen?._full || chosen || null);
      } catch (error) {
        console.error('Error initializing HGH schedule:', error);
      }
    };

    initHghSchedule();
  }, [userProfile?.id, hghExercises]);

  const setSelectedHghExercise = async (exercise) => {
    try {
      if (userProfile?.id && exercise?.id) {
        const storageKey = `ph_hgh_exercise_choice_${userProfile.id}`;
        await AsyncStorage.setItem(storageKey, String(exercise.id));
      }
    } catch (error) {
      console.error('Error saving HGH exercise preference:', error);
    }
    setSelectedHghExerciseState(exercise?._full || exercise || null);
  };

  // Keep iOS home-screen widget in sync with today's HGH focus and basic progress
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    try {
      const headline = 'Today’s growth focus';

      let subheadline = 'Stay consistent and grow over time';
      if (selectedHghExercise?.name) {
        subheadline = selectedHghExercise.name;
      }

      let progressLabel = undefined;
      if (todayList && todayList.length > 0 && completedExercises instanceof Set) {
        let completedCount = 0;
        todayList.forEach((item) => {
          const exerciseId = item.parentExercise?.id || item.id;
          const subExerciseId = item.subExercise?.id || null;
          const key = subExerciseId ? `${exerciseId}-${subExerciseId}` : exerciseId;
          if (completedExercises.has(key)) {
            completedCount += 1;
          }
        });
        if (completedCount === todayList.length) {
          progressLabel = 'Done for today';
        } else {
          progressLabel = `${completedCount} / ${todayList.length} done today`;
        }
      }

      PeakHeightTodayWidget.updateSnapshot({
        title: 'PeakHeight',
        headline,
        subheadline,
        progressLabel,
      });
    } catch (error) {
      console.error('Error updating PeakHeight widget:', error);
    }
  }, [isHghDay, hghDayIndex, selectedHghExercise, todayList, completedExercises]);

  const renderExerciseItem = ({ item, index }) => (
    <ExerciseItem
      styles={styles}
      item={item}
      index={index}
      onPress={openExercise}
      getExerciseImageUrl={getExerciseImageUrl}
    />
  );

  const SubExercisesViewContent = selectedExercise && selectedExercise.subExercises && (
    <SubExercisesView
      styles={styles}
      selectedExercise={selectedExercise}
      getExerciseImageUrl={getExerciseImageUrl}
      openSubExercise={openSubExercise}
    />
  );

  const DetailViewContent = (selectedSubExercise || selectedExercise) && (
    <ExerciseDetailView
      styles={styles}
      selectedExercise={selectedExercise}
      selectedSubExercise={selectedSubExercise}
      getExerciseImageUrl={getExerciseImageUrl}
      timer={detailTimer}
      isTimerRunning={isDetailTimerRunning}
      onTogglePlay={() => setIsDetailTimerRunning((v) => !v)}
      onReset={() => {
        setIsDetailTimerRunning(false);
        setDetailTimer(detailTotalTime || 0);
      }}
      onPrevious={() => {}}
      onNext={async () => {
        try {
        // Mark current exercise as completed first
        await markCurrentExerciseCompleted();

        // advance to next item in today's list
        if (currentTodayIndex != null && todayList.length > 0) {
          const nextIndex = currentTodayIndex + 1;
          if (nextIndex < todayList.length) {
            const next = todayList[nextIndex];
            setSelectedExercise(next.parentExercise || next);
            setSelectedSubExercise(next.subExercise || null);
            setCurrentTodayIndex(nextIndex);
              // Reset timer for next exercise
              setIsDetailTimerRunning(false);
          } else {
            // reached end: mark day complete and show congrats
            // Note: Day progression is now handled by syncCurrentDay() which requires
            // all daily tasks to be completed AND 24 hours to pass
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch {}
            setShowTodayComplete(true);
              setIsDetailTimerRunning(false);
            // Don't manually advance day - let syncCurrentDay() handle it based on task completion
          }
          } else if (selectedExercise && selectedExercise.subExercises && selectedExercise.subExercises.length > 0) {
            // Check if we're viewing a sub-exercise and there are more sub-exercises
            if (selectedSubExercise) {
              const currentSubIndex = selectedExercise.subExercises.findIndex(
                sub => String(sub.id) === String(selectedSubExercise.id)
              );
              if (currentSubIndex >= 0 && currentSubIndex < selectedExercise.subExercises.length - 1) {
                // Go to next sub-exercise
                const nextSubExercise = selectedExercise.subExercises[currentSubIndex + 1];
                setSelectedSubExercise(nextSubExercise);
                setIsDetailTimerRunning(false);
              } else {
                // No more sub-exercises, just stop timer
                setIsDetailTimerRunning(false);
              }
            } else {
              // Not viewing a sub-exercise, just stop timer
              setIsDetailTimerRunning(false);
            }
          } else {
            // Not in today's list and no sub-exercises - just stop timer and stay on current exercise
            setIsDetailTimerRunning(false);
          }
        } catch (error) {
          console.error('Error in onNext:', error);
          setIsDetailTimerRunning(false);
        }
      }}
      currentTodayIndex={currentTodayIndex}
      todayList={todayList}
      navigation={navigation}
      setView={setView}
      onNavigateToProfile={onNavigateToProfile}
    />
  );

  const NutritionDetailViewContent = selectedCategory && (
    <NutritionDetailView
      styles={styles}
      selectedCategory={selectedCategory}
    />
  );

  // Show header for all views except exercise detail (but include nutrition detail)
  const shouldShowHeader = view !== 'detail' || (view === 'detail' && activeTopTab === 'nutrition');

  return (
    <>
      {shouldShowHeader && Header}

      {view === 'hub' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {TopTabs}
          {activeTopTab === 'train' && TopExerciseOptionsViewContent}

          {/* Today's pick preview to make the screen feel richer */}
          {activeTopTab === 'train' && todayPick && (
            <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
                Today&apos;s pick
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                style={{
                  borderRadius: 16,
                  padding: 16,
                  backgroundColor: '#050505',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
                onPress={() => {
                  setSelectedExercise(todayPick);
                  setSelectedSubExercise(null);
                  setView('detail');
                }}
              >
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
                  {todayPick.name}
                </Text>
                {!!todayPick.shortDescription && (
                  <Text style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 10 }}>
                    {todayPick.shortDescription}
                  </Text>
                )}
                <Text style={{ fontSize: 12, color: '#6B7280' }}>
                  Tap to start this exercise now.
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* HGH section with simple, minimal text */}
          {activeTopTab === 'train' && hghExercises.length > 0 && (
            <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
                {isHghDay ? `HGH exercise (${hghDayIndex === 0 ? '1/2' : '2/2'})` : 'HGH exercise'}
              </Text>

              {isHghDay && selectedHghExercise && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={{
                    borderRadius: 16,
                    padding: 14,
                    backgroundColor: '#111827',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.08)',
                    marginBottom: 8,
                  }}
                  onPress={() => {
                    HapticFeedback.medium();
                    setSelectedExercise(selectedHghExercise);
                    setSelectedSubExercise(null);
                    setView('detail');
                  }}
                >
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF' }}>
                    {selectedHghExercise.name}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Simple chooser for HGH exercise preference */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 4 }}
              >
                {hghExercises.map((exercise) => {
                  const isSelected =
                    selectedHghExercise && String(selectedHghExercise.id) === String(exercise.id);
                  return (
                    <TouchableOpacity
                      key={String(exercise.id)}
                      activeOpacity={0.85}
                      style={{
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 999,
                        borderWidth: 1,
                        marginRight: 8,
                        backgroundColor: isSelected ? '#111827' : '#FFFFFF',
                        borderColor: isSelected ? '#111827' : '#E5E7EB',
                      }}
                      onPress={async () => {
                        HapticFeedback.medium();
                        await setSelectedHghExercise(exercise);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: isSelected ? '#FFFFFF' : '#111827',
                        }}
                      >
                        {exercise.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {activeTopTab === 'physical' && (
            <WeeklyProgressView
              styles={styles}
              onTodayListUpdate={(list) => setTodayList(list)}
              onExerciseSelect={(parentExercise, subExercise, index) => {
                setSelectedExercise(parentExercise);
                setSelectedSubExercise(subExercise || null);
                setCurrentTodayIndex(index ?? null);
                setView('detail');
              }}
              completedExercises={completedExercises}
            />
          )}
          {activeTopTab === 'nutrition' && NutritionContent}
        </ScrollView>
      )}

      {view === 'list' && (
        <>
          {ListControlsView}
          {(!filteredExercises || filteredExercises.length === 0) ? (
            <View style={{ paddingHorizontal: 20, paddingVertical: 60, alignItems: 'center' }}>
              <Icon name="search-outline" size={48} color="#CCCCCC" />
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#666666', marginTop: 16, marginBottom: 8 }}>
                No exercises found
              </Text>
              <Text style={{ fontSize: 14, color: '#999999', textAlign: 'center' }}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredExercises}
              keyExtractor={(item) => String(item.id || item.name)}
              contentContainerStyle={{ 
                paddingHorizontal: 20, 
                paddingTop: 8,
                paddingBottom: getSafeAreaPadding().bottom + responsiveHeight(60) 
              }}
              renderItem={renderExerciseItem}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {view === 'sub-exercises' && SubExercisesViewContent}
      {view === 'detail' && (activeTopTab === 'nutrition' ? NutritionDetailViewContent : DetailViewContent)}

      <ExerciseCompletionModal
        styles={styles}
        visible={showCompletionModal}
        selectedExercise={selectedExercise}
        selectedSubExercise={selectedSubExercise}
        onClose={() => setShowCompletionModal(false)}
        onContinue={() => {
          setSelectedSubExercise(null);
          setActiveTopTab && setActiveTopTab('physical');
          setView('hub');
          resetTimer();
        }}
      />

      {showTodayComplete && (
        <>
          <View style={styles.completionModalOverlay}>
            <View style={styles.completionModal}>
              <View style={styles.completionIconContainer}>
                <Icon name="trophy" size={80} color="#4CD964" />
              </View>
              <Text style={styles.completionTitle}>Congratulations!</Text>
              <Text style={styles.completionMessage}>
                You have completed today's exercises. Come back tomorrow!
              </Text>
              <TouchableOpacity
                style={styles.completionButton}
                onPress={() => {
                  setShowTodayComplete(false);
                  setView('hub');
                  setSelectedSubExercise(null);
                }}
              >
                <Text style={styles.completionButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {showBarcodeInput && (
        <FoodScanner
          navigation={navigation}
        onClose={() => setShowBarcodeInput(false)}
        initialMode={scannerMode}
        suppressOptions={true}
        />
      )}

      {!!errorMessage && (
        <View style={{ position: 'absolute', bottom: 90, left: 20, right: 20, backgroundColor: '#FEE2E2', borderColor: '#FCA5A5', borderWidth: 1, borderRadius: 12, padding: 12 }}>
          <Text style={{ color: '#991B1B', fontWeight: '600', marginBottom: 6 }}>Error</Text>
          <Text style={{ color: '#7F1D1D', marginBottom: 8 }}>{errorMessage}</Text>
          <TouchableOpacity onPress={() => setErrorMessage('')} style={{ alignSelf: 'flex-end', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#991B1B' }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
