import React, { useMemo, useState } from 'react';
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
import * as ImagePicker from 'expo-image-picker';
import { API_KEYS } from '../config/apiKeys';

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
  const [view, setView] = useState('hub'); // 'hub' | 'list' | 'detail'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeTopTab, setActiveTopTab] = useState('train'); // 'train' | 'physical' | 'nutrition'
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recommended'); // 'recommended' | 'duration' | 'difficulty'
  const [showRecipeLibrary, setShowRecipeLibrary] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);
  const screenHeight = Dimensions.get('window').height;

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
    setSelectedExercise(item._full ? item._full : item);
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
            navigation && navigation.goBack && navigation.goBack();
          } else if (view === 'list') {
            setView('hub');
          } else if (view === 'detail') {
            // If we're in nutrition detail view, go back to nutrition hub
            if (activeTopTab === 'nutrition') {
              setView('hub');
            } else {
              setView('list');
            }
          }
        }}
        >
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {view === 'hub' ? 'TRAIN' :
         view === 'list' ? (categories.find(c => c.id === selectedCategory)?.name || 'EXERCISES') :
         view === 'detail' && activeTopTab === 'nutrition' ? (NUTRITION_CATEGORIES.find(cat => cat.id === selectedCategory)?.name || 'NUTRITION') :
         (selectedExercise?.name || 'DETAIL')}
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
          onPress={() => setActiveTopTab(tab)}
          style={[styles.topTab, activeTopTab === tab && styles.topTabActive]}
        >
          <Text style={[styles.topTabText, activeTopTab === tab && styles.topTabTextActive]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const ProgressCard = (
    <View style={styles.progressCard}>
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Progression</Text>
        <Text style={styles.progressPercent}>0%</Text>
      </View>
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: '0%' }]} />
      </View>
      <TouchableOpacity style={styles.primaryCta}>
        <Text style={styles.primaryCtaText}>Start my program  →</Text>
      </TouchableOpacity>
    </View>
  );

  // Top 6 exercise options section
  const TopExerciseOptions = (
    <View style={styles.topOptionsContainer}>
      <Text style={styles.topOptionsTitle}>All Exercises</Text>
      <View style={styles.topOptionsGrid}>
        {[
          { id: 'all', name: 'All Exercises', icon: 'fitness' },
          { id: 'beginner', name: 'Beginner', icon: 'play-circle' },
          { id: 'intermediate', name: 'Intermediate', icon: 'trending-up' },
          { id: 'advanced', name: 'Advanced', icon: 'trophy' },
          { id: 'quick', name: 'Quick Workouts', icon: 'flash' },
          { id: 'favorites', name: 'Favorites', icon: 'heart' },
        ].map(option => (
          <TouchableOpacity key={option.id} style={styles.topOptionCard} onPress={() => openCategory(option.id)}>
            <View style={styles.topOptionIconHolder}>
              <Icon name={option.icon} size={20} color="#000000" />
            </View>
            <Text style={styles.topOptionText} numberOfLines={2}>{option.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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

  const PhysicalContent = (
    <View style={styles.gridContainer}>
      <Text style={styles.gridTitle}>PHYSICAL THERAPY</Text>
      <View style={styles.grid}>
        {[
          { id: 'posture-correction', name: 'Posture Correction', icon: 'body' },
          { id: 'spinal-decompression', name: 'Spinal Decompression', icon: 'swap-vertical' },
          { id: 'flexibility', name: 'Flexibility', icon: 'fitness' },
          { id: 'strength-building', name: 'Strength Building', icon: 'barbell' },
          { id: 'balance-training', name: 'Balance Training', icon: 'walk' },
          { id: 'recovery', name: 'Recovery', icon: 'medkit-outline' }
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

  const ListControls = (
    <View style={styles.listControls}>
      <TextInput
        placeholder="Search exercises"
        placeholderTextColor="#888888"
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 8 }}>
        {[
          { id: 'recommended', label: 'Recommended' },
          { id: 'duration', label: 'Duration' },
          { id: 'difficulty', label: 'Difficulty' },
        ].map(opt => (
          <TouchableOpacity key={opt.id} onPress={() => setSort(opt.id)} style={[styles.sortChip, sort === opt.id && styles.sortChipActive]}>
            <Text style={[styles.sortChipText, sort === opt.id && styles.sortChipTextActive]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
        </View>
  );

  const ExerciseItem = ({ item }) => (
    <TouchableOpacity style={styles.exerciseCard} onPress={() => openExercise(item)}>
      {/* Top-right icon badge */}
      <View style={styles.iconBadgeTop}>
        <Icon name={item.icon || 'fitness'} size={16} color="#000000" />
      </View>
      <View style={styles.exerciseThumb}>
        <Image source={getExerciseImageUrl(item)} style={styles.exerciseThumbImg} resizeMode="cover" />
            </View>
            <View style={styles.exerciseContent}>
              <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={[styles.exerciseImpact, item.highImpact ? styles.highImpact : styles.mediumImpact]}>
                {item.impact}
              </Text>
        <Text style={styles.exerciseDetails}>{item.duration} • {item.difficulty}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>
  );

  const DetailView = selectedExercise && (
    <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
      <View style={styles.detailHero}>
        <Icon name="image" size={36} color="#FFFFFF" />
      </View>
      <Text style={styles.detailTitle}>{selectedExercise.name}</Text>
      <View style={styles.detailChipsRow}>
        <View style={styles.detailChip}><Text style={styles.detailChipText}>{selectedExercise.difficulty}</Text></View>
        <View style={styles.detailChip}><Text style={styles.detailChipText}>{selectedExercise.durationMin} min</Text></View>
      </View>
      <Text style={styles.sectionHeading}>Benefits</Text>
      <View style={styles.bullets}>
        {(selectedExercise.benefits || []).slice(0,3).map((b, i) => (
          <Text key={i} style={styles.bullet}>• {b}</Text>
        ))}
      </View>
      <Text style={styles.sectionHeading}>Target Muscles</Text>
      <View style={styles.muscleChips}>
        {(selectedExercise.targetMuscles || []).slice(0,6).map(m => (
          <View key={m} style={styles.muscleChip}><Text style={styles.muscleChipText}>{m}</Text></View>
        ))}
      </View>
      <Text style={styles.sectionHeading}>Steps</Text>
      <View style={styles.steps}>
        {(selectedExercise.steps || []).map((s, idx) => (
          <View key={idx} style={styles.stepRow}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>{idx + 1}</Text></View>
            <Text style={styles.stepText}>{s}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.primaryCta}>
        <Text style={styles.primaryCtaText}>Add to Plan</Text>
      </TouchableOpacity>
    </ScrollView>
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
          {ProgressCard}
          {activeTopTab === 'train' && TopExerciseOptions}
          {activeTopTab === 'train' && CategoryGrid}
          {activeTopTab === 'physical' && PhysicalContent}
          {activeTopTab === 'nutrition' && NutritionContent}
        </ScrollView>
      )}

      {view === 'list' && (
        <>
          {ListControls}
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.exerciseListContent, { paddingBottom: screenHeight > 700 ? 100 : 40 }]}
            renderItem={ExerciseItem}
          />
        </>
      )}

          {view === 'detail' && (activeTopTab === 'nutrition' ? NutritionDetailView : DetailView)}

          {/* Floating Action Button for Chat */}
      <TouchableOpacity style={styles.fabButton}>
        <View style={styles.fabGradient}>
              <Icon name="chatbubble" size={24} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
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
  progressCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#000000',
    fontWeight: '600',
  },
  progressPercent: {
    color: '#000000',
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CD964',
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
    paddingHorizontal: 16,
  },
  topOptionsTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
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
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBadgeTop: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  exerciseImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    margin: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  exerciseThumbImg: {
    width: '100%',
    height: '100%',
  },
  exerciseContent: {
    flex: 1,
    paddingVertical: 12,
  },
  exerciseName: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseImpact: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  highImpact: {
    color: '#4CD964',
  },
  mediumImpact: {
    color: '#3B5FE3',
  },
  exerciseDetails: {
    color: '#666666',
    fontSize: 14,
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 60,
    alignItems: 'center',
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  // Detail view
  detailContent: {
    padding: 16,
    paddingBottom: 48,
  },
  detailHero: {
    height: 180,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
});

export default ExercisesScreen;
