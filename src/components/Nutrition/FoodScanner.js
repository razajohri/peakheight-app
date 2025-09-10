import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const FoodScanner = ({ navigation, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');

  // Real food database lookup using Open Food Facts API
  const lookupFoodData = async (barcode) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.openfoodfacts.org/api/v0/product/${barcode}.json`);
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

  const calculateGrowthScore = (nutrition) => {
    let score = 0;

    // Protein (30% of score) - essential for growth
    if (nutrition.protein >= 20) score += 30;
    else if (nutrition.protein >= 15) score += 25;
    else if (nutrition.protein >= 10) score += 20;
    else if (nutrition.protein >= 5) score += 10;

    // Calcium (25% of score) - bone health
    if (nutrition.calcium >= 300) score += 25;
    else if (nutrition.calcium >= 200) score += 20;
    else if (nutrition.calcium >= 100) score += 15;
    else if (nutrition.calcium >= 50) score += 10;

    // Vitamin D (20% of score) - bone health
    if (nutrition.vitaminD >= 400) score += 20;
    else if (nutrition.vitaminD >= 200) score += 15;
    else if (nutrition.vitaminD >= 100) score += 10;
    else if (nutrition.vitaminD >= 50) score += 5;

    // Fiber (15% of score) - overall health
    if (nutrition.fiber >= 5) score += 15;
    else if (nutrition.fiber >= 3) score += 10;
    else if (nutrition.fiber >= 1) score += 5;

    // Sugar penalty (10% of score) - avoid excessive sugar
    if (nutrition.sugar <= 5) score += 10;
    else if (nutrition.sugar <= 10) score += 5;
    else if (nutrition.sugar > 20) score -= 5;

    return Math.min(Math.max(score, 0), 100);
  };

  const startScanning = () => {
    Alert.alert(
      'Barcode Scanner',
      'Camera scanning requires a development build. For now, you can manually enter a barcode.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Enter Manually', onPress: () => setScanning(true) }
      ]
    );
  };

  const handleManualBarcodeSubmit = () => {
    if (manualBarcode.trim()) {
      setScanning(false);
      lookupFoodData(manualBarcode.trim());
      setManualBarcode('');
    } else {
      Alert.alert('Error', 'Please enter a valid barcode');
    }
  };


  const scanFoodPhoto = () => {
    Alert.alert(
      'Food Recognition',
      'This would use AI to recognize food from photos and estimate portion sizes and nutrition.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Demo Recognition', onPress: () => {
          setScanResult({
            name: 'Grilled Chicken Breast',
            nutrition: {
              calories: 165,
              protein: 31,
              carbs: 0,
              fat: 3.6,
              calcium: 15,
              vitaminD: 0
            },
            growthScore: 92
          });
        }}
      ]
    );
  };

  const Header = (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Icon name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Food Scanner</Text>
      <View style={styles.placeholder} />
    </View>
  );

  const ManualInputView = (
    <View style={styles.manualInputContainer}>
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
            onPress={() => setScanning(false)}
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

  const ScanResult = scanResult && (
    <View style={styles.resultContainer}>
      <Text style={styles.resultTitle}>Scan Result</Text>

      <View style={styles.foodCard}>
        <Text style={styles.foodName}>{scanResult.name}</Text>
        {scanResult.brand && <Text style={styles.foodBrand}>{scanResult.brand}</Text>}

        <View style={styles.growthScoreContainer}>
          <Text style={styles.growthScoreLabel}>Growth Score</Text>
          <View style={styles.growthScoreBar}>
            <View style={[styles.growthScoreFill, { width: `${scanResult.growthScore}%` }]} />
          </View>
          <Text style={styles.growthScoreText}>{scanResult.growthScore}/100</Text>
        </View>

        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{scanResult.nutrition.calories}</Text>
            <Text style={styles.nutritionLabel}>Calories</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{scanResult.nutrition.protein}g</Text>
            <Text style={styles.nutritionLabel}>Protein</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{scanResult.nutrition.calcium}mg</Text>
            <Text style={styles.nutritionLabel}>Calcium</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{scanResult.nutrition.vitaminD}IU</Text>
            <Text style={styles.nutritionLabel}>Vitamin D</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Today's Meals</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanResult(null)}>
        <Text style={styles.scanAgainText}>Scan Another Item</Text>
      </TouchableOpacity>
    </View>
  );

  if (scanning) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        {ManualInputView}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {Header}

      <View style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CD964" />
            <Text style={styles.loadingText}>Looking up product...</Text>
          </View>
        )}
        {!scanResult && !loading && ScannerOptions}
        {ScanResult}
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
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
  resultContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  foodCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  foodBrand: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
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
  scanAgainButton: {
    alignItems: 'center',
    padding: 12,
  },
  scanAgainText: {
    color: '#4CD964',
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
});

export default FoodScanner;
