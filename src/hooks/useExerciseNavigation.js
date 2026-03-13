import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { lookupBarcode, recognizeFoodWithGoogleVision } from '../utils/nutritionUtils';
import { CustomExercisePlanService } from '../services/customExercisePlanService';
import { useUser } from '../contexts/UserContext';
import HapticFeedback from '../utils/hapticFeedback';

export const useExerciseNavigation = () => {
  const [view, setView] = useState('hub');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedSubExercise, setSelectedSubExercise] = useState(null);
  const [activeTopTab, setActiveTopTab] = useState('train');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recommended');
  const [showRecipeLibrary, setShowRecipeLibrary] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [customExercisePlan, setCustomExercisePlan] = useState(null);
  const [loadingCustomPlan, setLoadingCustomPlan] = useState(false);

  const { userProfile } = useUser();

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  // Load custom exercise plan
  useEffect(() => {
    const loadCustomPlan = async () => {
      if (userProfile?.id) {
        setLoadingCustomPlan(true);
        try {
          const plan = await CustomExercisePlanService.getUserExercisePlan(userProfile.id);
          setCustomExercisePlan(plan);
        } catch (error) {
          console.error('Error loading custom plan:', error);
        } finally {
          setLoadingCustomPlan(false);
        }
      }
    };

    loadCustomPlan();
  }, [userProfile?.id]);

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setTimer(30);
    setIsTimerRunning(false);
  };

  const toggleTimer = () => {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const openCategory = (id) => {
    HapticFeedback.medium();

    if (activeTopTab === 'nutrition') {
      if (id === 'recipes') {
        setShowRecipeLibrary(true);
      } else {
        setSelectedCategory(id);
        setView('detail');
      }
    } else {
      setSelectedCategory(id);
      setView('list');
    }
  };

  const openExercise = (item) => {
    HapticFeedback.light();
    const exercise = item._full ? item._full : item;
    setSelectedExercise(exercise);

    if (exercise.subExercises && exercise.subExercises.length > 0) {
      setView('sub-exercises');
    } else {
      setView('detail');
    }
  };

  const openSubExercise = (subExercise) => {
    HapticFeedback.light();
    setSelectedSubExercise(subExercise);
    setTimer(subExercise.duration);
    setView('detail');
  };

  const openBarcodeScanner = () => {
    setShowBarcodeInput(true);
  };

  const openFoodPhotoRecognition = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to use this feature.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const recognitionResult = await recognizeFoodWithGoogleVision(imageUri);

        if (recognitionResult.success) {
          Alert.alert(
            'Food Recognition Results',
            `Detected food items:\n\n${recognitionResult.foodItems.join('\n')}\n\nConfidence: ${Math.round(recognitionResult.confidence * 100)}%`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Recognition Failed', recognitionResult.error);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process image. Please try again.');
    }
  };

  const handleBarcodeLookup = async (barcode) => {
    const result = await lookupBarcode(barcode);

    if (result.success) {
      const { product } = result;
      Alert.alert(
        'Product Found!',
        `Product: ${product.name}\nBrand: ${product.brand}\n\nNutrition per 100g:\n• Calories: ${product.nutrition.calories}\n• Protein: ${product.nutrition.protein}g\n• Carbs: ${product.nutrition.carbs}g\n• Fat: ${product.nutrition.fat}g\n• Calcium: ${product.nutrition.calcium}mg\n• Vitamin D: ${product.nutrition.vitaminD}μg\n\nGrowth Score: ${product.growthScore}/100\n\nData from Open Food Facts API`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Product Not Found', result.error);
    }
  };

  const goToPreviousExercise = () => {
    // Implementation for previous exercise navigation
  };

  const goToNextExercise = () => {
    // Implementation for next exercise navigation
  };

  return {
    // State
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

    // Setters
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

    // Functions
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
  };
};
