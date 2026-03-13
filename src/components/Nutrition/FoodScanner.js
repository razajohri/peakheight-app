import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Platform } from 'react-native';
import { InteractionManager } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { recognizeFoodWithOpenAIBase64 } from '../../utils/nutritionUtils';
import { estimateNutrition, calculateGrowthScore } from '../../utils/nutritionDatabase';
import Icon from '../UI/Icon';

const { width, height } = Dimensions.get('window');

const FoodScanner = ({ navigation, onClose, initialMode, suppressOptions = false }) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [candidateOptions, setCandidateOptions] = useState([]); // low-confidence suggestions
  const [quantity, setQuantity] = useState(1);
  const [mealType, setMealType] = useState('Breakfast');
  const hasAutoOpenedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Real food database lookup using Open Food Facts API
  const lookupFoodData = async (barcode) => {
    setLoading(true);
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        const nutrition = extractNutrition(product.nutriments);
        const growthScore = calculateGrowthScore(nutrition);

        setScanResult({
          name: product.product_name || 'Unknown Product',
          brand: product.brands || '',
          nutrition,
          growthScore,
          image: product.image_url,
          ingredients: product.ingredients_text || ''
        });
      } else {
        Alert.alert('Product Not Found', 'This product is not in our database. Try scanning a different barcode.');
      }
    } catch (error) {
      console.error('Error looking up food:', error);
      Alert.alert('Error', 'Failed to look up product information. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const extractNutrition = (nutriments) => {
    return {
      calories: nutriments.energy_kcal_100g || 0,
      protein: nutriments.proteins_100g || 0,
      carbs: nutriments.carbohydrates_100g || 0,
      fat: nutriments.fat_100g || 0,
      calcium: nutriments.calcium_100g || 0,
      vitaminD: nutriments.vitamin_d_100g || 0,
      fiber: nutriments.fiber_100g || 0,
      sugar: nutriments.sugars_100g || 0,
      sodium: nutriments.sodium_100g || 0
    };
  };

  // Using imported calculateGrowthScore from nutritionDatabase

  const startScanning = () => {
    setScanResult(null);
    setManualBarcode('');
    setCandidateOptions([]);
    setScanning(true);
  };

  const handleManualBarcodeSubmit = () => {
    const code = manualBarcode.trim();
    if (!code || code.length < 7 || !/^\d+$/.test(code)) {
      Alert.alert('Error', 'Please enter a valid numeric barcode');
      return;
    }
    setScanResult(null);
    setScanning(false); // allow result view to render
    lookupFoodData(code);
  };

  const acceptCandidate = (name) => {
    const nutrition = estimateNutrition(name);
    const growthScore = calculateGrowthScore(nutrition);
    setCandidateOptions([]);
    setScanResult({
      name,
      brand: '',
      nutrition,
      growthScore,
      image: '',
      ingredients: ''
    });
  };

  const scanFoodPhoto = async () => {
    try {
      // Prefer camera; fall back to library if unavailable/denied
      const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
      let result;
      const mediaImages = (ImagePicker.MediaType && ImagePicker.MediaType.Images) || null;
      const mediaTypesParam = mediaImages ? [mediaImages] : ImagePicker.MediaTypeOptions.Images;
      if (cameraPerm.granted) {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: mediaTypesParam,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          base64: true,
        });
      } else {
        const libraryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!libraryPerm.granted) {
          Alert.alert('Permission Required', 'Please allow camera or photo library access to use Food Recognition.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: mediaTypesParam,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          base64: true,
        });
      }

      if (result.canceled || !result.assets || !result.assets[0]) {
        // If launched inline from Nutrition and user cancels, close overlay
        if (suppressOptions && onClose) {
          onClose();
        }
        return;
      }

      const imageUri = result.assets[0].uri;
      const base64 = result.assets[0].base64;
      if (!base64) {
        throw new Error('Failed to read image data');
      }
      // Quick sanity check: if the base64 payload is too small, prompt retake
      if (base64.length < 50_000) {
        Alert.alert('Low-quality photo', 'Please retake a clearer, closer photo with the food centered.');
        return;
      }

      if (isMountedRef.current) setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 50));
      await new Promise((resolve) => InteractionManager.runAfterInteractions(resolve));

      const vision = await recognizeFoodWithOpenAIBase64(base64);
      if (vision.success) {
        const confidence = typeof vision.confidence === 'number' ? vision.confidence : 0.0;
        const bestName = (vision.foodItems && vision.foodItems[0]) ? vision.foodItems[0] : 'Unknown Food';
        // Low-confidence fallback: show candidate picker if available
        if (confidence < 0.6 && Array.isArray(vision.candidates) && vision.candidates.length > 0) {
          setCandidateOptions(vision.candidates.slice(0, 3));
          setLoading(false);
          return;
        }
        const nutrition = estimateNutrition(bestName);
        const growthScore = calculateGrowthScore(nutrition);
        if (isMountedRef.current) {
          setScanResult({
            name: bestName,
            brand: '',
            nutrition,
            growthScore,
            image: imageUri,
            ingredients: '',
            heightGrowthInfo: vision.heightGrowthInfo || null
          });
        }
      } else {
        Alert.alert('Recognition Failed', vision.error || 'Unable to recognize food.');
      }
    } catch (e) {
      console.error('Food photo scan error:', e);
      Alert.alert('Error', 'Failed to recognize food. Please try another photo.');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const Header = () => (
    <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 16 }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (suppressOptions) {
            onClose && onClose();
            return;
          }
          if (scanning || scanResult || candidateOptions.length > 0) {
            setScanning(false);
            setScanResult(null);
            setCandidateOptions([]);
            setQuantity(1);
          } else {
            onClose && onClose();
          }
        }}
      >
        <Icon name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {scanResult ? 'Nutrition' : 'Food Scanner'}
      </Text>
      <View style={styles.placeholder} />
    </View>
  );

  const ManualInputView = (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.manualInputContainer}
    >
      <View style={styles.manualInputContent}>
        <Icon name="barcode" size={64} color="#4CD964" />
        <Text style={styles.manualInputTitle}>Enter Barcode Manually</Text>
        <Text style={styles.manualInputSubtitle}>
          Enter the barcode number from the product packaging
        </Text>

        <TextInput
          style={styles.barcodeInput}
          placeholder="Enter barcode (e.g., 3017620422003)"
          value={manualBarcode}
          onChangeText={setManualBarcode}
          keyboardType="numeric"
          autoFocus={true}
        />

        <View style={styles.manualInputButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              if (suppressOptions) {
                onClose && onClose();
              } else {
                setScanning(false);
              }
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleManualBarcodeSubmit}
          >
            <Text style={styles.submitButtonText}>Look Up Product</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const CandidatePicker = candidateOptions.length > 0 && (
    <View style={styles.candidateContainer}>
      <Text style={styles.candidateTitle}>Select the closest match</Text>
      {candidateOptions.map((c, idx) => (
        <TouchableOpacity key={idx} style={styles.candidateButton} onPress={() => acceptCandidate(c.name)}>
          <Text style={styles.candidateButtonText}>{c.name}</Text>
          <Text style={styles.candidateConfidence}>{Math.round((c.confidence || 0) * 100)}%</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const ScannerOptions = (
    <View style={styles.optionsContainer}>
      <Text style={styles.optionsTitle}>Choose Scanning Method</Text>

      <TouchableOpacity style={styles.optionCard} onPress={startScanning}>
        <View style={styles.optionIconHolder}>
          <Icon name="barcode" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Barcode Scanner</Text>
          <Text style={styles.optionSubtitle}>Scan product barcodes for instant nutrition data</Text>
        </View>
        <Icon name="chevron-forward" size={20} color="#666666" />
      </TouchableOpacity>


      <TouchableOpacity style={styles.optionCard} onPress={scanFoodPhoto}>
        <View style={styles.optionIconHolder}>
          <Icon name="camera" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>Food Photo</Text>
          <Text style={styles.optionSubtitle}>Take photo of food for AI recognition</Text>
        </View>
        <Icon name="chevron-forward" size={20} color="#666666" />
      </TouchableOpacity>
    </View>
  );

  // Calculate nutrition values based on quantity
  const getNutritionValue = (baseValue) => {
    if (typeof baseValue !== 'number' || isNaN(baseValue)) return 'N/A';
    return Math.round(baseValue * quantity);
  };

  const ScanResult = scanResult && (
    <ScrollView 
      style={styles.resultScrollView}
      contentContainerStyle={styles.resultContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.resultCard}>
        {/* Food Title and Quantity Selector */}
        <View style={styles.titleRow}>
          <Text style={styles.foodName} numberOfLines={2}>
            {scanResult.name}
          </Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        {scanResult.brand && <Text style={styles.foodBrand}>{scanResult.brand}</Text>}

        {/* Growth Score */}
        <View style={styles.growthScoreContainer}>
          <Text style={styles.growthScoreLabel}>Growth Score</Text>
          <View style={styles.growthScoreBar}>
            <View style={[styles.growthScoreFill, { width: `${scanResult.growthScore || 0}%` }]} />
          </View>
          <Text style={styles.growthScoreText}>{scanResult.growthScore || 0}/100</Text>
        </View>

        {/* Height Growth Info (if available) */}
        {scanResult.heightGrowthInfo && (
          <View style={styles.heightGrowthContainer}>
            <Text style={styles.heightGrowthTitle}>Height Growth Analysis</Text>
            <View style={styles.heightGrowthItem}>
              <Text style={styles.heightGrowthLabel}>Impact:</Text>
              <Text style={[styles.heightGrowthValue, { 
                color: scanResult.heightGrowthInfo.impact === 'excellent' ? '#10B981' : 
                       scanResult.heightGrowthInfo.impact === 'good' ? '#059669' :
                       scanResult.heightGrowthInfo.impact === 'moderate' ? '#F59E0B' :
                       scanResult.heightGrowthInfo.impact === 'poor' ? '#EF4444' : '#6B7280'
              }]}>
                {scanResult.heightGrowthInfo.impact}
              </Text>
            </View>
            <View style={styles.heightGrowthItem}>
              <Text style={styles.heightGrowthLabel}>Rating:</Text>
              <Text style={styles.heightGrowthValue}>{scanResult.heightGrowthInfo.rating}</Text>
            </View>
            <View style={styles.heightGrowthNutrients}>
              <Text style={styles.heightGrowthLabel}>Key Nutrients:</Text>
              <Text style={styles.heightGrowthNutrientsText}>{scanResult.heightGrowthInfo.nutrients}</Text>
            </View>
          </View>
        )}

        {/* Nutrition Grid - Old Style */}
        {scanResult.nutrition && scanResult.nutrition.calories !== 'Unknown' && (
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{getNutritionValue(scanResult.nutrition.calories)}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{getNutritionValue(scanResult.nutrition.protein)}g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{getNutritionValue(scanResult.nutrition.calcium)}mg</Text>
              <Text style={styles.nutritionLabel}>Calcium</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>{getNutritionValue(scanResult.nutrition.vitaminD)}IU</Text>
              <Text style={styles.nutritionLabel}>Vitamin D</Text>
            </View>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.doneButton}
          onPress={() => {
            if (onClose) {
              onClose();
            }
          }}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Auto-open flows based on initialMode (run once)
  useEffect(() => {
    if (hasAutoOpenedRef.current) return;
    if (initialMode === 'photo') {
      hasAutoOpenedRef.current = true;
      setTimeout(() => {
        scanFoodPhoto();
      }, 0);
    } else if (initialMode === 'barcode') {
      hasAutoOpenedRef.current = true;
      setTimeout(() => {
        startScanning();
      }, 0);
    }
  }, [initialMode]);

  if (scanning) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        {Header()}
        {ManualInputView}
      </SafeAreaView>
    );
  }

  // When scan result is shown, display result view
  if (scanResult) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        {Header()}
        {ScanResult}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4CD964" />
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {Header()}

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 24 }}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CD964" />
            <Text style={styles.loadingText}>Looking up product...</Text>
          </View>
        )}
        {candidateOptions.length > 0 && CandidatePicker}
        {!loading && !suppressOptions && candidateOptions.length === 0 && ScannerOptions}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  optionsContainer: {
    flex: 1,
  },
  optionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  optionIconHolder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CD964',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  candidateContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  candidateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  candidateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 10,
  },
  candidateButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  candidateConfidence: {
    fontSize: 12,
    color: '#666666',
  },
  // Result view styles
  resultScrollView: {
    flex: 1,
  },
  resultContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  resultCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    marginRight: 12,
    marginBottom: 4,
  },
  foodBrand: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginHorizontal: 8,
    minWidth: 30,
    textAlign: 'center',
  },
  growthScoreContainer: {
    marginBottom: 20,
  },
  growthScoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  growthScoreBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    marginBottom: 4,
  },
  growthScoreFill: {
    height: '100%',
    backgroundColor: '#4CD964',
    borderRadius: 4,
  },
  growthScoreText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  nutritionItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 12,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666666',
  },
  addButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Manual input styles
  manualInputContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  manualInputContent: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  manualInputTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  manualInputSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  barcodeInput: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#F8F9FA',
    marginBottom: 30,
  },
  manualInputButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#4CD964',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  // Height Growth Analysis styles
  heightGrowthContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  heightGrowthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  heightGrowthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  heightGrowthLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
  },
  heightGrowthValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textTransform: 'capitalize',
  },
  heightGrowthNutrients: {
    marginTop: 8,
  },
  heightGrowthNutrientsText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginTop: 4,
  },
  // Action button
  doneButton: {
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});

export default FoodScanner;

