import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../contexts/UserContext';
import * as Haptics from 'expo-haptics';
import { DailyPlanService } from '../../services/dailyPlanService';

const GrowthFactors = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [dailyTaskData, setDailyTaskData] = useState(null);
  const { userProfile, loading } = useUser();

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
  }, [userProfile]);

  // Calculate growth factor scores based on user data
  const calculateGrowthFactors = () => {
    if (!userProfile) {
      return [
        { name: 'Sleep Quality', value: 0, icon: 'moon', color: '#000000', trend: null },
        { name: 'Nutrition', value: 0, icon: 'nutrition', color: '#000000', trend: null },
        { name: 'Exercise', value: 0, icon: 'fitness', color: '#000000', trend: null },
        { name: 'Stretching Routine', value: 0, icon: 'fitness', color: '#000000', trend: null }
      ];
    }

    // Debug logging
    console.log('GrowthFactors - dailyTaskData:', dailyTaskData);
    console.log('GrowthFactors - dailyTaskData length:', dailyTaskData ? dailyTaskData.length : 'null');

    // Calculate Sleep Quality (based on sleep hours)
    const sleepHours = userProfile.sleep_hours || 0;
    const sleepScore = Math.min(100, Math.max(0, (sleepHours / 8) * 100));
    const sleepColor = '#000000'; // Black for all
    const sleepTrend = sleepScore >= 80 ? 'up' : sleepScore <= 50 ? 'down' : null;

    // Calculate Exercise (based on workout frequency)
    const workoutFreq = userProfile.workout_frequency;
    let exerciseScore = 0;
    if (workoutFreq === 'daily') exerciseScore = 90;
    else if (workoutFreq === 'often') exerciseScore = 75;
    else if (workoutFreq === 'sometimes') exerciseScore = 60;
    else if (workoutFreq === 'rarely') exerciseScore = 30;
    else exerciseScore = 10;

    const exerciseColor = '#000000'; // Black for all
    const exerciseTrend = exerciseScore >= 70 ? 'up' : exerciseScore <= 30 ? 'down' : null;

    // Calculate Nutrition (based on daily task completions)
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
    const nutritionColor = '#000000'; // Black for all
    const nutritionTrend = nutritionScore >= 70 ? 'up' : nutritionScore <= 50 ? 'down' : null;

    // Calculate Stretching Routine (based on daily task completions)
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
    const stretchingColor = '#000000'; // Black for all
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
        icon: 'fitness',
        color: exerciseColor,
        trend: exerciseTrend,
        tip: `${workoutFreq || 'No exercise'}. Regular stretching and strength training stimulate bone growth.`
    },
    {
      name: 'Nutrition',
        value: nutritionScore,
      icon: 'nutrition',
        color: nutritionColor,
        trend: nutritionTrend,
        tip: `You've completed ${nutritionScore}% of your nutrition tasks. Focus on protein, calcium, and vitamin D for optimal bone growth.`
    },
    {
        name: 'Stretching Routine',
        value: stretchingScore,
      icon: 'fitness',
        color: stretchingColor,
        trend: stretchingTrend,
        tip: `You've completed ${stretchingScore}% of your stretching tasks. Daily stretching helps decompress your spine and can add 0.5-1 inch to your height.`
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
            {factor.trend && (
              <Icon
                name={factor.trend === 'up' ? 'arrow-up' : 'arrow-down'}
                size={12}
                color={factor.trend === 'up' ? '#4CD964' : '#FF3B30'}
              />
            )}
            <Text style={[
              styles.factorValue,
              factor.trend === 'down' && { color: '#FF3B30' }
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
        style={styles.factorsSection}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MAIN GROWTH FACTORS</Text>
          <Text style={styles.chevronIcon}>›</Text>
        </View>

        {factors.map(renderFactorItem)}
      </TouchableOpacity>

      {/* Growth Factors Modal */}
      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Growth Factors Analysis</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
              >
                <Icon name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            {/* Dynamic Growth Factors */}
            {factors.map((factor) => (
              <View key={factor.name} style={styles.factorDetail}>
              <View style={styles.factorHeader}>
                <View style={styles.factorIconContainer}>
                    <Icon name={factor.icon} size={24} color={factor.color} />
                </View>
                <View style={styles.factorInfo}>
                    <Text style={styles.factorName}>{factor.name}</Text>
                    <Text style={[styles.factorScore, { color: factor.color }]}>
                      {factor.value}%
              </Text>
                </View>
              </View>
              <View style={styles.factorProgress}>
                  <View style={[
                    styles.factorProgressBar,
                    {
                      width: `${factor.value}%`,
                      backgroundColor: factor.color
                    }
                  ]} />
              </View>
              <Text style={styles.factorTip}>
                  {factor.tip}
              </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  factorsSection: {
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    marginBottom: 10,
  },
  factorIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  factorContent: {
    flex: 1,
  },
  factorLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '92%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    maxHeight: '82%',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '800',
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
