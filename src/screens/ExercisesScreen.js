import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  Alert,
  TextInput,
  Dimensions,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CATEGORIES, EXERCISES, NUTRITION_CATEGORIES } from '../utils/exercisesData';
import { NUTRITION_ITEMS } from '../utils/nutritionData';
import { estimateNutrition, calculateGrowthScore } from '../utils/nutritionDatabase';
import { LinearGradient } from 'expo-linear-gradient';
import RecipeLibrary from '../components/Nutrition/RecipeLibrary';
import TopExerciseOptions from '../components/Exercises/TopExerciseOptions';
import ListControls from '../components/Exercises/ListControls';
import ExerciseItem from '../components/Exercises/ExerciseItem';
import WeeklyProgressView from '../components/Exercises/WeeklyProgressView';
import * as ImagePicker from 'expo-image-picker';
import { API_KEYS } from '../config/apiKeys';
import HapticFeedback from '../utils/hapticFeedback';
import { CustomExercisePlanService } from '../services/customExercisePlanService';
import { useUser } from '../contexts/UserContext';
import SubExercisesView from '../components/Exercises/SubExercisesView';
import ExerciseDetailView from '../components/Exercises/ExerciseDetailView';

const categories = [{ id: 'all', name: 'All' }, ...CATEGORIES];

const exercises = EXERCISES.map(e => ({
  id: e.id,
  name: e.name,
  category: e.categoryId,
  duration: `${e.durationMin} min`,
  difficulty: e.difficulty,
  highImpact: e.impact === 'High',
  impact: e.impact === 'High' ? 'High impact' : e.impact === 'Medium' ? 'Medium impact' : 'Low impact',
  _full: e,
}));


// Return an illustrative image for an exercise based on its name/category (remote only)
const getExerciseImageUrl = (exercise) => {
  const name = (exercise.name || '').toLowerCase();
  if (name.includes('cobra')) return { uri: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=200&h=200&fit=crop' };
  if (name.includes('hanging') || name.includes('hang')) return { uri: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?w=200&h=200&fit=crop' };
  if (name.includes('neck') || name.includes('chin')) return { uri: 'https://images.unsplash.com/photo-1599050751792-cd76f1f2a8f3?w=200&h=200&fit=crop' };
  if (name.includes('wall')) return { uri: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop' };
  if (name.includes('salute') || name.includes('raise') || name.includes('reach')) return { uri: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=200&h=200&fit=crop' };
  if (name.includes('dog')) return { uri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee1a26e?w=200&h=200&fit=crop' };
  return { uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop' };
};

const ExercisesScreen = ({ navigation }) => {
  const [view, setView] = useState('hub'); // 'hub' | 'list' | 'detail' | 'sub-exercises' | 'weekly-progress'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedSubExercise, setSelectedSubExercise] = useState(null);
  const [activeTopTab, setActiveTopTab] = useState('train'); // 'train' | 'physical' | 'nutrition'
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recommended'); // 'recommended' | 'duration' | 'difficulty'
  const [showRecipeLibrary, setShowRecipeLibrary] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [customExercisePlan, setCustomExercisePlan] = useState(null);
  const [loadingCustomPlan, setLoadingCustomPlan] = useState(false);
  const { userProfile } = useUser();
  const screenHeight = Dimensions.get('window').height;

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Timer completed - could trigger completion here
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimer(30);
  };

  const goToPreviousExercise = () => {
    console.log('Previous clicked', { selectedExercise, selectedSubExercise });
    if (selectedExercise && selectedExercise.subExercises && selectedSubExercise) {
      const list = selectedExercise.subExercises;
      const idx = list.findIndex(se => se.id === selectedSubExercise.id);
      console.log('Current index:', idx, 'Total exercises:', list.length);
      if (idx > 0) {
        const prev = list[idx - 1];
        console.log('Going to previous:', prev);
        setSelectedSubExercise(prev);
        setTimer(prev.duration);
        setIsTimerRunning(false);
      } else {
        console.log('Already at first exercise');
      }
    } else {
      console.log('No sub-exercises available');
    }
  };

  const goToNextExercise = () => {
    console.log('Next clicked', { selectedExercise, selectedSubExercise });
    if (selectedExercise && selectedExercise.subExercises && selectedSubExercise) {
      const list = selectedExercise.subExercises;
      const idx = list.findIndex(se => se.id === selectedSubExercise.id);
      console.log('Current index:', idx, 'Total exercises:', list.length);
      if (idx >= 0 && idx < list.length - 1) {
        const next = list[idx + 1];
        console.log('Going to next:', next);
        setSelectedSubExercise(next);
        setTimer(next.duration);
        setIsTimerRunning(false);
      } else {
        console.log('Last exercise - showing completion modal');
        setShowCompletionModal(true);
      }
    } else {
      console.log('No sub-exercises - showing completion modal');
      setShowCompletionModal(true);
    }
  };

  const handleExerciseCompletion = () => {
    setIsTimerRunning(false);
    setShowCompletionModal(true);
  };

  // Load custom exercise plan
  useEffect(() => {
    const loadCustomExercisePlan = async () => {
      if (!userProfile?.id) return;

      setLoadingCustomPlan(true);
      try {
        const plan = await CustomExercisePlanService.getUserExercisePlan(userProfile.id);
        setCustomExercisePlan(plan);
      } catch (error) {
        console.error('Error loading custom exercise plan:', error);
        // Set a fallback plan to prevent crashes
        setCustomExercisePlan({
          weekly_schedule: {
            monday: { focus: 'Posture & Alignment', exercises: [] },
            tuesday: { focus: 'Strength & Mobility', exercises: [] },
            wednesday: { focus: 'Stretching & Flexibility', exercises: [] },
            thursday: { focus: 'Core & Stability', exercises: [] },
            friday: { focus: 'Cardio & Jump Training', exercises: [] },
            saturday: { focus: 'Recovery & Relaxation', exercises: [] },
            sunday: { focus: 'Active Rest', exercises: [] }
          },
          daily_exercises: {
            morning: [],
            evening: []
          }
        });
      } finally {
        setLoadingCustomPlan(false);
      }
    };

    loadCustomExercisePlan();
  }, [userProfile?.id]);

  const filteredExercises = useMemo(() => {
    let data = exercises;

    // Category or preset filters
    if (selectedCategory === 'all') {
      data = exercises;
    } else if (selectedCategory === 'beginner') {
      data = exercises.filter(e => (e.difficulty || '').toLowerCase() === 'beginner');
    } else if (selectedCategory === 'intermediate') {
      data = exercises.filter(e => (e.difficulty || '').toLowerCase() === 'intermediate');
    } else if (selectedCategory === 'advanced') {
      data = exercises.filter(e => (e.difficulty || '').toLowerCase() === 'advanced');
    } else if (selectedCategory === 'quick') {
      data = exercises.filter(e => {
        const mins = parseInt(e.duration, 10);
        return !isNaN(mins) && mins <= 10;
      });
    } else if (selectedCategory === 'favorites') {
      // Placeholder: show all until favorites are implemented
      data = exercises;
    } else {
      // Treat as regular exercise category id
      data = exercises.filter(e => e.category === selectedCategory);
    }

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(e => e.name.toLowerCase().includes(q));
    }

    // Sorting
    if (sort === 'duration') {
      data = [...data].sort((a, b) => parseInt(a.duration, 10) - parseInt(b.duration, 10));
    } else if (sort === 'difficulty') {
      const order = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
      data = [...data].sort((a, b) => (order[(a.difficulty || '').toLowerCase()] || 0) - (order[(b.difficulty || '').toLowerCase()] || 0));
    }

    return data;
  }, [selectedCategory, search, sort]);

  const openCategory = (id) => {
    // Add haptic feedback for category selection
    HapticFeedback.medium();

    if (activeTopTab === 'nutrition') {
      // Handle nutrition-specific categories
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
    // Add haptic feedback for exercise selection
    HapticFeedback.light();
    const exercise = item._full ? item._full : item;
    setSelectedExercise(exercise);

    // Check if exercise has sub-exercises
    if (exercise.subExercises && exercise.subExercises.length > 0) {
      setView('sub-exercises');
    } else {
      setView('detail');
    }
  };

  const openSubExercise = (subExercise) => {
    // Add haptic feedback for sub-exercise selection
    HapticFeedback.light();
    setSelectedSubExercise(subExercise);
    setTimer(subExercise.duration);
    setView('detail');
  };

  const lookupBarcode = async (barcode) => {
    try {
      const response = await fetch(`${API_KEYS.OPEN_FOOD_FACTS_API}${barcode}.json`);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        const nutrition = product.nutriments || {};

        // Calculate growth score based on nutrition
        let growthScore = 50; // Base score
        if (nutrition.proteins_100g) growthScore += Math.min(nutrition.proteins_100g * 2, 20);
        if (nutrition.calcium_100g) growthScore += Math.min(nutrition.calcium_100g / 10, 15);
        if (nutrition.vitamin_d_100g) growthScore += Math.min(nutrition.vitamin_d_100g * 10, 10);
        if (nutrition.sugars_100g) growthScore -= Math.min(nutrition.sugars_100g, 15);
        if (nutrition.saturated_fat_100g) growthScore -= Math.min(nutrition.saturated_fat_100g * 2, 10);

        growthScore = Math.max(0, Math.min(100, Math.round(growthScore)));

        Alert.alert(
          'Product Found!',
          `Product: ${product.product_name || 'Unknown'}\nBrand: ${product.brands || 'Unknown'}\n\nNutrition per 100g:\n• Calories: ${nutrition.energy_kcal_100g || 'N/A'}\n• Protein: ${nutrition.proteins_100g || 'N/A'}g\n• Carbs: ${nutrition.carbohydrates_100g || 'N/A'}g\n• Fat: ${nutrition.fat_100g || 'N/A'}g\n• Calcium: ${nutrition.calcium_100g || 'N/A'}mg\n• Vitamin D: ${nutrition.vitamin_d_100g || 'N/A'}μg\n\nGrowth Score: ${growthScore}/100\n\nData from Open Food Facts API`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Product Not Found',
          'This barcode was not found in the Open Food Facts database. Please try a different barcode.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to lookup product. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const openBarcodeScanner = () => {
    setShowBarcodeInput(true);
  };

  // Google Vision API functions
  const convertImageToBase64 = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      return null;
    }
  };

  const recognizeFoodWithGoogleVision = async (imageUri) => {
    try {
      // Convert image to base64
      const base64Image = await convertImageToBase64(imageUri);
      if (!base64Image) {
        throw new Error('Failed to convert image');
      }

      // Use API key from config
      const GOOGLE_API_KEY = API_KEYS.GOOGLE_VISION_API_KEY;

      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: { content: base64Image },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'WEB_DETECTION', maxResults: 5 }
            ]
          }]
        })
      });

      const data = await response.json();

      if (data.responses && data.responses[0]) {
        const labels = data.responses[0].labelAnnotations || [];
        const webEntities = data.responses[0].webDetection?.webEntities || [];

        // Filter food-related labels
        const foodLabels = labels.filter(label =>
          label.description.toLowerCase().includes('food') ||
          label.description.toLowerCase().includes('fruit') ||
          label.description.toLowerCase().includes('vegetable') ||
          label.description.toLowerCase().includes('meat') ||
          label.description.toLowerCase().includes('dairy') ||
          label.description.toLowerCase().includes('bread') ||
          label.description.toLowerCase().includes('pasta') ||
          label.description.toLowerCase().includes('rice') ||
          label.description.toLowerCase().includes('chicken') ||
          label.description.toLowerCase().includes('beef') ||
          label.description.toLowerCase().includes('fish') ||
          label.description.toLowerCase().includes('egg') ||
          label.description.toLowerCase().includes('milk') ||
          label.description.toLowerCase().includes('cheese') ||
          label.description.toLowerCase().includes('yogurt') ||
          label.description.toLowerCase().includes('apple') ||
          label.description.toLowerCase().includes('banana') ||
          label.description.toLowerCase().includes('orange') ||
          label.description.toLowerCase().includes('broccoli') ||
          label.description.toLowerCase().includes('spinach') ||
          label.description.toLowerCase().includes('carrot') ||
          label.description.toLowerCase().includes('tomato') ||
          label.description.toLowerCase().includes('potato') ||
          label.description.toLowerCase().includes('salmon') ||
          label.description.toLowerCase().includes('tuna') ||
          label.description.toLowerCase().includes('shrimp') ||
          label.description.toLowerCase().includes('almond') ||
          label.description.toLowerCase().includes('walnut') ||
          label.description.toLowerCase().includes('avocado')
        );

        return {
          foodItems: foodLabels.map(label => ({
            name: label.description,
            confidence: label.score,
            nutrition: estimateNutrition(label.description)
          })),
          webEntities: webEntities.slice(0, 3)
        };
      }

      return null;
    } catch (error) {
      console.error('Google Vision API Error:', error);
      return null;
    }
  };

  // Open Food Facts name search -> returns best nutriments if found
  const fetchNutritionFromOpenFoodFacts = async (foodName) => {
    try {
      const q = encodeURIComponent(foodName);
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${q}&search_simple=1&action=process&page_size=1&json=1`);
      const data = await res.json();
      const product = (data && data.products && data.products[0]) || null;
      if (!product) return null;
      const n = product.nutriments || {};
      return {
        calories: n.energy_kcal_100g ?? 'Unknown',
        protein: n.proteins_100g ?? 'Unknown',
        carbs: n.carbohydrates_100g ?? 'Unknown',
        fat: n.fat_100g ?? 'Unknown',
        calcium: n.calcium_100g ?? 'Unknown',
        vitaminD: n.vitamin_d_100g ?? 'Unknown'
      };
    } catch (e) {
      return null;
    }
  };

  const openFoodPhotoRecognition = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to scan food.');
      return;
    }

    const resultPick = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
    });

    if (resultPick?.canceled) return;
    const asset = resultPick?.assets?.[0];
    if (!asset?.uri) return;

    Alert.alert('Analyzing Food...', 'Please wait while we analyze your food image.');

    const result = await recognizeFoodWithGoogleVision(asset.uri);

              if (result && result.foodItems.length > 0) {
                // Take the most confident result
                const top = result.foodItems[0];
                // Try Open Food Facts name search
                const offNutrition = await fetchNutritionFromOpenFoodFacts(top.name);
                const nutrition = offNutrition || top.nutrition;
                const growthScore = calculateGrowthScore(nutrition);

                const cal = nutrition.calories;
                const prot = nutrition.protein;
                const carb = nutrition.carbs;
                const fat = nutrition.fat;
                const ca = nutrition.calcium;
                const vd = nutrition.vitaminD;

                Alert.alert(
                  'Food Analysis Complete!',
                  `Food: ${top.name}\nConfidence: ${Math.round(top.confidence * 100)}%\n\nNutrition (per 100g):\n• Calories: ${cal}\n• Protein: ${prot}${prot === 'Unknown' ? '' : 'g'}\n• Carbs: ${carb}${carb === 'Unknown' ? '' : 'g'}\n• Fat: ${fat}${fat === 'Unknown' ? '' : 'g'}\n• Calcium: ${ca}${ca === 'Unknown' ? '' : 'mg'}\n• Vitamin D: ${vd}${vd === 'Unknown' ? '' : 'μg'}\n\nGrowth Score: ${growthScore}/100\n\nPowered by Google Vision + Open Food Facts`,
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert(
                  'No Food Detected',
                  'Could not identify any food items in the image. Please try again with a clearer photo of food items.',
                  [{ text: 'OK' }]
                );
              }
  };

  const Header = (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
        onPress={() => {
          if (view === 'hub') {
            // Navigate to home page when in hub view
            if (navigation && navigation.navigate) {
              navigation.navigate('home');
            } else if (navigation && navigation.goBack) {
              navigation.goBack();
            }
          } else if (view === 'list') {
            setView('hub');
          } else if (view === 'weekly-progress') {
            setView('hub');
          } else if (view === 'detail') {
            // If we're in nutrition detail view, go back to nutrition hub
            if (activeTopTab === 'nutrition') {
              setView('hub');
            } else if (selectedSubExercise) {
              // If we're in a sub-exercise detail, go back to sub-exercises
              setView('sub-exercises');
              setSelectedSubExercise(null);
            } else {
              // Check if we came from weekly progress or regular list
              if (activeTopTab === 'physical') {
                setView('hub'); // Go back to hub since weekly progress is shown in physical tab
              } else {
                setView('list');
              }
            }
          } else if (view === 'sub-exercises') {
            setView('list');
          }
        }}
        >
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {view === 'hub' ? 'TRAIN' :
         view === 'list' ? (categories.find(c => c.id === selectedCategory)?.name || 'EXERCISES') :
         view === 'weekly-progress' ? 'MY PROGRESS' :
         view === 'sub-exercises' ? (selectedExercise?.name || 'SUB-EXERCISES') :
         view === 'detail' && activeTopTab === 'nutrition' ? (NUTRITION_CATEGORIES.find(cat => cat.id === selectedCategory)?.name || 'NUTRITION') :
         view === 'detail' ? '1/7' :
         'DETAIL'}
      </Text>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => {
          // Navigate to profile page
          if (typeof onNavigateToProfile === 'function') {
            onNavigateToProfile();
          } else if (navigation && navigation.navigate) {
            navigation.navigate('profile');
          }
        }}
      >
        <Icon name="settings-outline" size={24} color="#000000" />
              </TouchableOpacity>
        </View>
  );

  const TopTabs = (
    <View style={styles.topTabs}>
      {['train','physical','nutrition'].map(tab => (
            <TouchableOpacity
          key={tab}
          onPress={() => {
            HapticFeedback.selection();
            setActiveTopTab(tab);
          }}
          style={[styles.topTab, activeTopTab === tab && styles.topTabActive]}
        >
          <Text style={[styles.topTabText, activeTopTab === tab && styles.topTabTextActive]}>
            {tab === 'physical' ? 'My Exercise' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
        </TouchableOpacity>
      ))}
    </View>
  );


  // Top 6 exercise options section (extracted)
  const TopExerciseOptionsView = (
    <TopExerciseOptions
      styles={styles}
      HapticFeedback={HapticFeedback}
      onPressToday={() => setActiveTopTab('physical')}
      onOpenCategory={openCategory}
    />
  );

  const CategoryGrid = (
    <View style={styles.gridContainer}>
      <Text style={styles.gridTitle}>BROWSE BY AREA</Text>
      <View style={styles.grid}>
        {[
          { id: 'posture', name: 'Posture', icon: 'body' },
          { id: 'masai-jump', name: 'Masai Jump', icon: 'flash' },
          { id: 'upper-body', name: 'Upper Body', icon: 'fitness' },
          { id: 'feet-ankles', name: 'Feet & Ankles', icon: 'footsteps' },
          { id: 'chest', name: 'Chest', icon: 'shield-outline' },
          { id: 'lower-body', name: 'Lower Body', icon: 'walk' },
          { id: 'neck', name: 'Neck', icon: 'person' },
          { id: 'shoulders', name: 'Shoulders', icon: 'accessibility-outline' },
          { id: 'hamstrings', name: 'Hamstrings', icon: 'swap-vertical' }
        ].map(cat => (
          <TouchableOpacity key={cat.id} style={styles.gridCard} onPress={() => openCategory(cat.id)}>
            <View style={styles.gridIconHolder}>
              <Icon name={cat.icon} size={20} color="#000000" />
            </View>
            <Text style={styles.gridCardText} numberOfLines={2}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Custom Exercise Plan Content
  const CustomExercisePlanContent = () => {
    if (loadingCustomPlan) {
      return (
        <View style={styles.gridContainer}>
          <Text style={styles.gridTitle}>MY EXERCISE PLAN</Text>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your custom plan...</Text>
          </View>
        </View>
      );
    }

    if (!customExercisePlan) {
      return (
        <View style={styles.gridContainer}>
          <Text style={styles.gridTitle}>MY EXERCISE PLAN</Text>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unable to load exercise plan</Text>
          </View>
        </View>
      );
    }

    let todayExercises;
    let currentPhase = 'Foundation';

    try {
      todayExercises = CustomExercisePlanService.getTodayExercises(customExercisePlan);
      currentPhase = customExercisePlan.weekly_schedule ?
        (customExercisePlan.weekly_schedule.monday?.exercises?.[0]?.difficulty === 'Beginner' ? 'Foundation' :
         customExercisePlan.weekly_schedule.monday?.exercises?.[0]?.difficulty === 'Intermediate' ? 'Building' : 'Advancing') : 'Foundation';
    } catch (error) {
      console.error('Error getting today exercises:', error);
      todayExercises = {
        weekly: [],
        morning: [],
        evening: [],
        focus: 'Posture & Alignment'
      };
    }

    return (
      <View style={styles.gridContainer}>
        <Text style={styles.gridTitle}>MY EXERCISE PLAN</Text>

        {/* Phase Badge */}
        <View style={[styles.phaseBadge, { display: 'none' }]} />

        {/* Today's Daily Exercises */}
        <View style={styles.dailyExercisesSection}>
          <Text style={styles.sectionTitle}>Today's Exercises</Text>
          <Text style={styles.sectionSubtitle}>
            {todayExercises.length} exercises selected for today • {currentPhase} Phase
          </Text>

          {todayExercises.map((exercise, index) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.dailyExerciseCard}
              onPress={() => {
                setSelectedExercise(exercise);
                setView('detail');
              }}
            >
              <View style={styles.dailyExerciseContent}>
                <View style={styles.dailyExerciseInfo}>
                  <Text style={styles.dailyExerciseNumber}>{index + 1}</Text>
                  <View style={styles.dailyExerciseDetails}>
                    <Text style={styles.dailyExerciseName}>{exercise.name}</Text>
                    <Text style={styles.dailyExerciseMeta}>
                      {exercise.durationMin} min • {exercise.difficulty}
                    </Text>
                  </View>
                </View>
                <View style={styles.dailyExerciseActions}>
                  <Icon name="chevron-forward" size={20} color="#666666" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>


        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => {
            setSelectedCategory('all');
            setView('list');
          }}>
            <Icon name="list" size={20} color="#3B5FE3" />
            <Text style={styles.actionButtonText}>Browse All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={async () => {
            // Refresh daily exercises
            if (userProfile?.id) {
              try {
                const updatedPlan = await CustomExercisePlanService.generateCustomExercisePlan(userProfile.id);
                await CustomExercisePlanService.updateUserExercisePlan(userProfile.id, {
                  daily_exercises: updatedPlan.dailyExercises,
                  last_updated: updatedPlan.lastUpdated
                });
                setCustomExercisePlan(updatedPlan);
              } catch (error) {
                console.error('Error refreshing plan:', error);
              }
            }
          }}>
            <Icon name="refresh" size={20} color="#10B981" />
            <Text style={[styles.actionButtonText, {color: '#10B981'}]}>Refresh Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const NutritionContent = (
    <View style={styles.gridContainer}>
      <Text style={styles.gridTitle}>NUTRITION FOR GROWTH</Text>

      {/* Tools section */}
      <Text style={styles.sectionLabel}>TOOLS</Text>
      <View style={styles.nutritionTopRow}>
        <TouchableOpacity style={styles.nutritionTopCard} onPress={() => openBarcodeScanner()}>
          <View style={styles.nutritionTopIconHolder}>
            <Icon name="barcode" size={24} color="#000000" />
          </View>
          <Text style={styles.nutritionTopCardTitle}>Barcode Scanner</Text>
          <Text style={styles.nutritionTopCardSubtitle}>Scan barcodes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nutritionTopCard} onPress={() => openFoodPhotoRecognition()}>
          <View style={styles.nutritionTopIconHolder}>
            <Icon name="camera" size={24} color="#000000" />
          </View>
          <Text style={styles.nutritionTopCardTitle}>Food Recognition</Text>
          <Text style={styles.nutritionTopCardSubtitle}>AI photo scan</Text>
        </TouchableOpacity>
      </View>

      {/* Library section - 5 equal cards */}
      <Text style={styles.sectionLabel}>LIBRARY</Text>
      {/* First row: 2 big cards (Recipe Library, Supplements) */}
      <View style={styles.nutritionTopRow}>
        {[
          { id: 'recipes', name: 'Recipe Library', icon: 'restaurant', subtitle: 'Growth recipes' },
          { id: 'supplements', name: 'Supplements', icon: 'medical', subtitle: 'Recommended picks' }
        ].map(item => (
          <TouchableOpacity key={item.id} style={styles.nutritionHalfCard} onPress={() => openCategory(item.id)}>
            <View style={styles.nutritionTopIconHolder}>
              <Icon name={item.icon} size={24} color="#000000" />
            </View>
            <Text style={styles.nutritionTopCardTitle}>{item.name}</Text>
            <Text style={styles.nutritionTopCardSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Second row: 3 small cards (Growth Foods, Protein, Calcium) */}
      <View style={styles.grid}>
        {[
          { id: 'growth-foods', name: 'Growth Foods', icon: 'leaf' },
          { id: 'protein-sources', name: 'Protein Sources', icon: 'fish' },
          { id: 'calcium-rich', name: 'Calcium Rich', icon: 'water' }
        ].map(item => (
          <TouchableOpacity key={item.id} style={styles.gridCard} onPress={() => openCategory(item.id)}>
            <View style={styles.gridIconHolder}>
              <Icon name={item.icon} size={20} color="#000000" />
            </View>
            <Text style={styles.gridCardText} numberOfLines={2}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const ListControlsView = (
    <ListControls styles={styles} search={search} setSearch={setSearch} sort={sort} setSort={setSort} />
  );

  const renderExerciseItem = ({ item }) => (
    <ExerciseItem styles={styles} item={item} onPress={openExercise} getExerciseImageUrl={getExerciseImageUrl} />
  );

  // Extracted views
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
      timer={timer}
      isTimerRunning={isTimerRunning}
      onTogglePlay={toggleTimer}
      onReset={resetTimer}
      onPrevious={goToPreviousExercise}
      onNext={goToNextExercise}
    />
  );

  const NutritionDetailView = selectedCategory && (
    <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.detailTitle}>
        {NUTRITION_CATEGORIES.find(cat => cat.id === selectedCategory)?.name || selectedCategory}
              </Text>
      <Text style={styles.sectionHeading}>Items</Text>
      <View style={styles.nutritionItemsList}>
        {NUTRITION_ITEMS.filter(item => item.categoryId === selectedCategory).map(item => (
          <View key={item.id} style={styles.nutritionItemCard}>
            <View style={styles.nutritionItemImage}>
              <Image
                source={{ uri: item.image }}
                style={styles.nutritionItemImageContent}
                resizeMode="cover"
              />
            </View>
            <View style={styles.nutritionItemContent}>
              <Text style={styles.nutritionItemName}>{item.name}</Text>
              <Text style={styles.nutritionItemType}>{item.type}</Text>
              <Text style={styles.nutritionItemDescription}>{item.description}</Text>
              <View style={styles.nutritionItemBenefits}>
                {item.benefits.slice(0, 3).map((benefit, index) => (
                  <View key={index} style={styles.nutritionBenefitChip}>
                    <Text style={styles.nutritionBenefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.nutritionItemFooter}>
                <Text style={styles.nutritionItemServing}>
                  {item.dosage || item.serving}
              </Text>
                <View style={styles.nutritionGrowthScore}>
                  <Text style={styles.nutritionGrowthScoreText}>Growth Score: {item.growthScore}/100</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {showRecipeLibrary ? (
        <RecipeLibrary
          navigation={navigation}
          onClose={() => setShowRecipeLibrary(false)}
        />
      ) : showBarcodeInput ? (
        <View style={styles.barcodeInputModal}>
          <View style={styles.barcodeInputContainer}>
            <Text style={styles.barcodeInputTitle}>Enter Barcode</Text>
            <Text style={styles.barcodeInputSubtitle}>
              Enter a barcode number to look up nutrition information
            </Text>
            <TextInput
              style={styles.barcodeInput}
              placeholder="e.g., 3017620422003"
              value={barcodeInput}
              onChangeText={setBarcodeInput}
              keyboardType="numeric"
              autoFocus={true}
            />
            <View style={styles.barcodeInputButtons}>
              <TouchableOpacity
                style={styles.barcodeCancelButton}
                onPress={() => {
                  setShowBarcodeInput(false);
                  setBarcodeInput('');
                }}
              >
                <Text style={styles.barcodeCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.barcodeLookupButton}
                onPress={() => {
                  if (barcodeInput.trim()) {
                    lookupBarcode(barcodeInput.trim());
                    setShowBarcodeInput(false);
                    setBarcodeInput('');
                  } else {
                    Alert.alert('Error', 'Please enter a valid barcode number');
                  }
                }}
              >
                <Text style={styles.barcodeLookupButtonText}>Lookup</Text>
          </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <>
          {Header}

          {view === 'hub' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {TopTabs}
          {activeTopTab === 'train' && TopExerciseOptionsView}
          {activeTopTab === 'train' && CategoryGrid}
          {activeTopTab === 'physical' && (
            <WeeklyProgressView
              onExerciseSelect={(exercise) => {
                setSelectedExercise(exercise);
                setView('detail');
              }}
            />
          )}
          {activeTopTab === 'nutrition' && NutritionContent}
        </ScrollView>
      )}

      {view === 'list' && (
        <>
          {ListControlsView}
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.exerciseListContent, { paddingBottom: screenHeight > 700 ? 100 : 40 }]}
            renderItem={renderExerciseItem}
          />
        </>
      )}

          {view === 'sub-exercises' && SubExercisesViewContent}
          {view === 'detail' && (activeTopTab === 'nutrition' ? NutritionDetailView : DetailViewContent)}


          {/* Completion Modal */}
          {showCompletionModal && (
            <View style={styles.completionModalOverlay}>
              <View style={styles.completionModal}>
                <View style={styles.completionIconContainer}>
                  <Icon name="checkmark-circle" size={80} color="#4CD964" />
                </View>
                <Text style={styles.completionTitle}>Keep it up!</Text>
                <Text style={styles.completionMessage}>
                  Great job completing {selectedSubExercise?.name || selectedExercise?.name}! You're one step closer to your height goals.
                </Text>
                <TouchableOpacity
                  style={styles.completionButton}
                  onPress={() => {
                    setShowCompletionModal(false);
                    if (selectedSubExercise) {
                      setView('sub-exercises');
                      setSelectedSubExercise(null);
                    } else {
                      setView('list');
                    }
                    resetTimer();
                  }}
                >
                  <Text style={styles.completionButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  filterButton: {
    padding: 4,
  },
  topTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  topTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginRight: 8,
  },
  topTabActive: {
    backgroundColor: '#000000',
  },
  topTabText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  topTabTextActive: {
    color: '#FFFFFF',
  },
  primaryCta: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  topOptionsContainer: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  topOptionsTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 18,
  },
  topOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topOptionCard: {
    width: '31%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  topOptionIconHolder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  topOptionText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 11,
    fontWeight: '600',
  },
  todayCard: {
    backgroundColor: '#3B5FE3',
    borderWidth: 2,
    borderColor: '#3B5FE3',
  },
  todayIconHolder: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  gridContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  gridTitle: {
    color: '#666666',
    fontSize: 12,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  libraryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  gridCard: {
    width: '31%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  libraryCard: {
    width: '31%',
    marginRight: '3.5%',
  },
  gridIconHolder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridCardText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 11,
    fontWeight: '600',
  },
  listControls: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    color: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sortChip: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sortChipActive: {
    backgroundColor: '#000000',
  },
  sortChipText: {
    color: '#000000',
    fontWeight: '600',
  },
  sortChipTextActive: {
    color: '#FFFFFF',
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  categoryButtonActive: {
    backgroundColor: '#3B5FE3',
  },
  categoryButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    fontWeight: '600',
  },
  exerciseListContent: {
    padding: 16,
    minHeight: '100%',
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  exerciseThumb: {
    width: 90,
    height: 90,
    borderRadius: 16,
    margin: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    position: 'relative',
  },
  exerciseThumbImg: {
    width: '100%',
    height: '100%',
  },
  exerciseImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 8,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  difficultyBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exerciseContent: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
  },
  exerciseHeader: {
    marginBottom: 8,
  },
  exerciseName: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 22,
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  highImpactDot: {
    backgroundColor: '#4CD964',
  },
  mediumImpactDot: {
    backgroundColor: '#000000',
  },
  exerciseImpact: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  highImpact: {
    color: '#4CD964',
  },
  mediumImpact: {
    color: '#000000',
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseDetails: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  // Detail view
  detailContent: {
    padding: 0,
    paddingBottom: 48,
    minHeight: '100%',
    flexGrow: 1,

  },
  // Exercise Hero Section
  exerciseHeroContainer: {
    height: 250,
    position: 'relative',
    marginBottom: 24,
  },
  exerciseHeroImage: {
    width: '100%',
    height: '100%',
  },
  exerciseHeroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  exerciseHeroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  exerciseHeroChips: {
    flexDirection: 'row',
  },
  heroChip: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  heroChipText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 12,
  },
  // Timer Section
  timerSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  timerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000000',
  },
  timerLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: -4,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 12,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#000000',
  },
  resetButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timerButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  // New Circular Timer Styles
  exerciseHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  exerciseCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mainTimerSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  circularTimerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timerSvg: {
    position: 'absolute',
  },
  exerciseImageContainer: {
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000000',
  },
  // Steps Section
  stepsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  // Benefits Section
  benefitsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  // Exercise Info Section
  exerciseInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  detailTitle: {
    color: '#000000',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailChipsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailChip: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  detailChipText: {
    color: '#000000',
    fontWeight: '600',
  },
  sectionHeading: {
    color: '#000000',
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    fontSize: 18,
  },
  bullets: {
    marginBottom: 12,
  },
  bullet: {
    color: '#000000',
    marginBottom: 6,
  },
  muscleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  muscleChip: {
    backgroundColor: 'rgba(76, 217, 100, 0.15)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  muscleChipText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 12,
  },
  steps: {
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CD964',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  stepNumText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  stepText: {
    flex: 1,
    color: '#000000',
  },
  // Completion Modal
  completionModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  completionModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  completionIconContainer: {
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  completionMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  completionButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  completionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  // Custom Exercise Plan Styles
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666666',
    fontSize: 16,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
  },
  phaseBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  phaseText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  todayFocus: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  todayFocusTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  todayFocusText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  weeklySchedule: {
    marginBottom: 20,
  },
  weeklyScroll: {
    paddingLeft: 0,
  },
  dayCard: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  dayFocus: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 4,
  },
  dayCount: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '600',
  },
  dailyRoutines: {
    marginBottom: 20,
  },
  routineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routineCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  routineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  routineCount: {
    fontSize: 12,
    color: '#666666',
  },
  quickActions: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  secondaryButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  // Scanner styles
  scannerSection: {
    marginBottom: 20,
  },
  scannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scannerIconHolder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CD964',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  scannerContent: {
    flex: 1,
  },
  scannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  scannerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  // Nutrition top row styles
  nutritionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nutritionTopCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionHalfCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: {
    marginTop: 8,
    marginBottom: 8,
    color: '#666666',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  nutritionTopIconHolder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  nutritionTopCardTitle: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  nutritionTopCardSubtitle: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 10,
  },
  // Barcode Input Modal Styles
  barcodeInputModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  barcodeInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  barcodeInputTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  barcodeInputSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  barcodeInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#F8F9FA',
    marginBottom: 24,
  },
  barcodeInputButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barcodeCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginRight: 8,
  },
  barcodeCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  barcodeLookupButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
    marginLeft: 8,
  },
  barcodeLookupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Nutrition Detail View Styles
  nutritionItemsList: {
    paddingBottom: 20,
  },
  nutritionItemCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  nutritionItemImageContent: {
    width: '100%',
    height: '100%',
  },
  nutritionItemContent: {
    flex: 1,
  },
  nutritionItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  nutritionItemType: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  nutritionItemDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  nutritionItemBenefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  nutritionBenefitChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  nutritionBenefitText: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '500',
  },
  nutritionItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutritionItemServing: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  nutritionGrowthScore: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  nutritionGrowthScoreText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Sub-exercises styles
  subExercisesSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionSubheading: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    lineHeight: 20,
  },
  subExerciseCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subExerciseContent: {
    flex: 1,
  },
  subExerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subExerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  subExerciseInfo: {
    flex: 1,
  },
  subExerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  subExerciseDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  subExerciseDuration: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 12,
  },
  subExerciseDurationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },

  // Daily Exercise Styles
  dailyExercisesSection: {
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    fontWeight: '500',
  },
  dailyExerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  dailyExerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dailyExerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dailyExerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  dailyExerciseDetails: {
    flex: 1,
  },
  dailyExerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  dailyExerciseMeta: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  dailyExerciseActions: {
    paddingLeft: 12,
  },
});

export default ExercisesScreen;
