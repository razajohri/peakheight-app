import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter, ScrollView, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';
import { useUser } from '../../contexts/UserContext';
import * as Haptics from 'expo-haptics';
import { DailyPlanService } from '../../services/dailyPlanService';

const GrowthFactors = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [dailyTaskData, setDailyTaskData] = useState(null);
  const { userProfile, loading, userProgress } = useUser();

  // Fetch daily task data for the last 7 days
  useEffect(() => {
    const fetchDailyTaskData = async () => {
      if (!userProfile) return;

      try {
        const userProgress = await DailyPlanService.getUserProgress(userProfile.id);
        if (userProgress) {
          // Get tasks for the last 7 days
          const taskData = [];
          for (let i = 0; i < 7; i++) {
            const dayNumber = userProgress.current_day - i;
            if (dayNumber > 0) {
              const dayTasks = await DailyPlanService.getDailyTasks(userProfile.id, dayNumber);
              if (dayTasks) {
                taskData.push({
                  day: dayNumber,
                  tasks: dayTasks.tasks || [],
                  completedTasks: dayTasks.completed_tasks || [],
                  isCompleted: dayTasks.is_completed || false
                });
              }
            }
          }
          setDailyTaskData(taskData);
        }
      } catch (error) {
        console.error('Error fetching daily task data:', error);
      }
    };

    fetchDailyTaskData();
    // Listen for task completion events to update growth factors in real-time
    // This ensures Nutrition and Stretching Routine scores update when tasks are completed
    const sub = DeviceEventEmitter.addListener('dailyTasksUpdated', fetchDailyTaskData);
    return () => {
      if (sub && sub.remove) sub.remove();
    };
  }, [userProfile]);

  // Calculate growth factor scores based on user data
  const calculateGrowthFactors = () => {
    if (!userProfile) {
      return [
        { name: 'Sleep Quality', value: 0, icon: 'moon', color: '#000000', trend: null },
        { name: 'Nutrition', value: 0, icon: 'leaf', color: '#000000', trend: null },
        { name: 'Exercise', value: 0, icon: 'barbell', color: '#000000', trend: null },
        { name: 'Stretching Routine', value: 0, icon: 'body', color: '#000000', trend: null }
      ];
    }

    // Debug logging
    console.log('GrowthFactors - dailyTaskData:', dailyTaskData);
    console.log('GrowthFactors - dailyTaskData length:', dailyTaskData ? dailyTaskData.length : 'null');

    // Calculate Sleep Quality (based on sleep hours from user profile)
    // NOTE: sleep_hours should only change when user explicitly logs it, but the score
    // is calculated dynamically from the current value
    const sleepHours = userProfile.sleep_hours || 0;
    const sleepScore = Math.min(100, Math.max(0, (sleepHours / 8) * 100));
    const sleepColor = '#6366F1'; // Indigo
    const sleepTrend = sleepScore >= 80 ? 'up' : sleepScore <= 50 ? 'down' : null;

    // Calculate Exercise (based on workout frequency from user profile)
    // NOTE: workout_frequency should only change when user explicitly logs it, but the score
    // is calculated dynamically from the current value
    const workoutFreq = userProfile.workout_frequency;
    let exerciseScore = 0;
    if (workoutFreq === 'daily') exerciseScore = 90;
    else if (workoutFreq === 'often') exerciseScore = 75;
    else if (workoutFreq === 'sometimes') exerciseScore = 60;
    else if (workoutFreq === 'rarely') exerciseScore = 30;
    else exerciseScore = 10;

    const exerciseColor = '#10B981'; // Emerald
    const exerciseTrend = exerciseScore >= 70 ? 'up' : exerciseScore <= 30 ? 'down' : null;

    // Calculate Nutrition (based on daily task completions)
    // IMPORTANT: This score SHOULD update when users complete nutrition tasks
    let nutritionScore = 0;
    if (dailyTaskData && dailyTaskData.length > 0) {
      let nutritionTasksCompleted = 0;
      let totalNutritionTasks = 0;

      dailyTaskData.forEach(dayData => {
        if (dayData.tasks && Array.isArray(dayData.tasks)) {
          dayData.tasks.forEach(task => {
            if (task.category === 'nutrition') {
              totalNutritionTasks++;
              if (dayData.completedTasks && Array.isArray(dayData.completedTasks) && dayData.completedTasks.includes(task.id)) {
                nutritionTasksCompleted++;
              }
            }
          });
        }
      });

      nutritionScore = totalNutritionTasks > 0 ? Math.round((nutritionTasksCompleted / totalNutritionTasks) * 100) : 0;
      console.log('Nutrition calculation:', { nutritionTasksCompleted, totalNutritionTasks, nutritionScore });
    } else {
      nutritionScore = 0; // Default when no data
      console.log('Nutrition: No daily task data, setting to 0');
    }
    const nutritionColor = '#F59E0B'; // Amber
    const nutritionTrend = nutritionScore >= 70 ? 'up' : nutritionScore <= 50 ? 'down' : null;

    // Calculate Stretching Routine (based on daily task completions)
    // IMPORTANT: This score SHOULD update when users complete stretching/exercise tasks
    let stretchingScore = 0;
    if (dailyTaskData && dailyTaskData.length > 0) {
      let stretchingTasksCompleted = 0;
      let totalStretchingTasks = 0;

      dailyTaskData.forEach(dayData => {
        if (dayData.tasks && Array.isArray(dayData.tasks)) {
          dayData.tasks.forEach(task => {
            if (task.category === 'basic_stretching' || task.category === 'advanced_stretching' || task.category === 'exercise') {
              totalStretchingTasks++;
              if (dayData.completedTasks && Array.isArray(dayData.completedTasks) && dayData.completedTasks.includes(task.id)) {
                stretchingTasksCompleted++;
              }
            }
          });
        }
      });

      stretchingScore = totalStretchingTasks > 0 ? Math.round((stretchingTasksCompleted / totalStretchingTasks) * 100) : 0;
      console.log('Stretching calculation:', { stretchingTasksCompleted, totalStretchingTasks, stretchingScore });
    } else {
      stretchingScore = 0; // Default when no data
      console.log('Stretching: No daily task data, setting to 0');
    }
    const stretchingColor = '#8B5CF6'; // Purple
    const stretchingTrend = stretchingScore >= 70 ? 'up' : stretchingScore <= 50 ? 'down' : null;

    return [
    {
      name: 'Sleep Quality',
        value: Math.round(sleepScore),
      icon: 'moon',
        color: sleepColor,
        trend: sleepTrend,
        tip: `${sleepHours} hours/night. Aim for 8-9 hours for optimal growth hormone production.`
      },
      {
        name: 'Exercise',
        value: exerciseScore,
        icon: 'barbell',
        color: exerciseColor,
        trend: exerciseTrend,
        tip: `Regular stretching and strength training stimulate bone growth.`
    },
    {
      name: 'Nutrition',
        value: nutritionScore,
      icon: 'leaf',
        color: nutritionColor,
        trend: nutritionTrend,
        tip: `Focus on protein, calcium, and vitamin D for optimal bone growth.`
    },
    {
        name: 'Stretching Routine',
        value: stretchingScore,
      icon: 'body',
        color: stretchingColor,
        trend: stretchingTrend,
        tip: `Daily stretching helps decompress your spine and can add 0.5-1 inch to your height.`
      }
    ];
  };

  const factors = calculateGrowthFactors();

  const renderFactorItem = (factor) => (
    <View key={factor.name} style={styles.factorItem}>
      <View style={styles.factorIconContainer}>
        <Icon name={factor.icon} size={16} color="#000000" />
      </View>
      <View style={styles.factorContent}>
        <View style={styles.factorLabelRow}>
          <Text style={styles.factorLabel}>{factor.name}</Text>
          <View style={styles.factorValueContainer}>
            <Text style={[
              styles.factorValue,
              factor.value === 0 && { color: '#FF3B30' }
            ]}>
              {factor.value}%
            </Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[
            styles.progressBar,
            {
              width: `${factor.value}%`,
              backgroundColor: factor.color
            }
          ]} />
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.factorsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MAIN GROWTH FACTORS</Text>
        </View>
        <Text style={styles.loadingText}>Loading your growth data...</Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={["#F8FAFC", "#E2E8F0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.factorsSection}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MAIN GROWTH FACTORS</Text>
          <Text style={styles.chevronIcon}>›</Text>
        </View>

        {factors.map(renderFactorItem)}
        </LinearGradient>
      </TouchableOpacity>

      {/* Growth Factors Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalCard}
          >
            {/* Structured Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>MAIN GROWTH FACTORS</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <Icon name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            {/* Dynamic Growth Factors */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              {factors.map((factor, idx) => (
                <View
                  key={factor.name}
                  style={[
                    styles.factorDetail,
                    idx === factors.length - 1 && { marginBottom: 0, paddingBottom: 0, borderBottomWidth: 0 }
                  ]}
                >
                  <View style={styles.factorHeader}>
                    <View style={styles.factorIconContainer}>
        <Icon name={factor.icon} size={24} color="#000000" />
                    </View>
                    <View style={styles.factorInfo}>
                      <Text style={styles.factorName}>{factor.name}</Text>
                      <Text style={[styles.factorScore, { color: factor.color }]}>
                        {factor.value}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.factorProgress}>
                    <LinearGradient
                      colors={[factor.color, factor.color]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[
                        styles.factorProgressBar,
                        { width: `${factor.value}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.factorTip}>
                    {factor.tip}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  factorsSection: {
    marginTop: 12,
    marginBottom: Platform.OS === 'android' ? -22 : 10,
    borderRadius: 20,
    padding: Platform.OS === 'android' ? 16 : 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 8 : 12,
  },
  sectionTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  chevronIcon: {
    color: '#AAAAAA',
    fontSize: 20,
    fontWeight: 'bold',
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 6 : 10,
  },
  factorIconContainer: {
    width: Platform.OS === 'android' ? 28 : 32,
    height: Platform.OS === 'android' ? 28 : 32,
    borderRadius: Platform.OS === 'android' ? 14 : 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.OS === 'android' ? 8 : 10,
  },
  factorContent: {
    flex: 1,
  },
  factorLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 4 : 6,
  },
  factorLabel: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  factorValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factorValue: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  progressBarContainer: {
    height: Platform.OS === 'android' ? 6 : 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: Platform.OS === 'android' ? 3 : 4,
  },
  progressBar: {
    height: Platform.OS === 'android' ? 6 : 8,
    borderRadius: Platform.OS === 'android' ? 3 : 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 20,
    maxHeight: '80%',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContent: {
    paddingTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalHeaderCard: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  modalHeaderLeft: {
    flexDirection: 'column',
  },
  modalDayTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '800',
  },
  modalPhaseSubtitle: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 16,
  },
  modalIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalIconItem: {
    alignItems: 'center',
    flex: 1,
  },
  modalIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalIconLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  modalTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  factorDetail: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  factorInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  factorName: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  factorScore: {
    color: '#4CD964',
    fontSize: 18,
    fontWeight: '700',
  },
   factorProgress: {
     height: 6,
     backgroundColor: 'rgba(0,0,0,0.1)',
     borderRadius: 3,
     marginBottom: 10,
   },
   factorProgressBar: {
     height: 6,
     borderRadius: 3,
   },
  factorTip: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  loadingText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default GrowthFactors;

