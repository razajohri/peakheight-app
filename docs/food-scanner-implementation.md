# Food Scanner Implementation Guide

## Overview
The food scanner feature allows users to scan food items and get instant nutrition information, specifically focused on growth nutrients like protein, calcium, and vitamin D.

## Implementation Difficulty: Medium to Hard

### 1. Barcode Scanner (Easiest - Recommended to start with)

**Dependencies needed:**
```bash
npm install react-native-camera react-native-barcode-scanner
# or
npm install expo-barcode-scanner
```

**Implementation:**
- Scan product barcodes (UPC/EAN codes)
- Look up nutrition data from food databases
- Display growth-focused nutrition information

**Pros:**
- Most accurate for packaged foods
- Fast and reliable
- Large database of products available

**Cons:**
- Only works with packaged foods
- Requires internet connection for database lookup

### 2. OCR Nutrition Label Scanner (Medium difficulty)

**Dependencies needed:**
```bash
npm install react-native-vision-camera
npm install @react-native-ml-kit/text-recognition
# or
npm install expo-camera expo-text-detector
```

**Implementation:**
- Take photo of nutrition label
- Use OCR to extract text
- Parse nutrition information using regex/ML
- Calculate growth score based on nutrients

**Pros:**
- Works with any food that has a nutrition label
- More flexible than barcode scanning

**Cons:**
- Requires good lighting and clear text
- OCR accuracy can vary
- Complex text parsing logic needed

### 3. Food Recognition Scanner (Hardest - Most advanced)

**Dependencies needed:**
```bash
npm install @tensorflow/tfjs-react-native
npm install @tensorflow/tfjs-platform-react-native
# or use cloud APIs like Google Vision API, AWS Rekognition
```

**Implementation:**
- Take photo of food
- Use AI/ML to recognize food items
- Estimate portion sizes
- Calculate nutrition based on recognized foods

**Pros:**
- Works with any food (no barcode/label needed)
- Most user-friendly experience
- Can estimate portion sizes

**Cons:**
- Most complex to implement
- Requires ML models or cloud APIs
- Accuracy depends on food recognition quality
- Expensive (cloud API costs)

## Recommended Implementation Strategy

### Phase 1: Barcode Scanner (Start Here)
1. Implement barcode scanning for packaged foods
2. Integrate with free food databases (USDA FoodData Central, Open Food Facts)
3. Focus on growth nutrients (protein, calcium, vitamin D, etc.)

### Phase 2: OCR Label Scanner
1. Add OCR capability for nutrition labels
2. Parse common nutrition label formats
3. Calculate growth scores based on nutrient density

### Phase 3: Food Recognition (Future)
1. Integrate with cloud food recognition APIs
2. Add portion size estimation
3. Build custom ML models for better accuracy

## Food Database APIs

### Free Options:
- **USDA FoodData Central**: Comprehensive nutrition database
- **Open Food Facts**: Community-driven food database
- **Edamam Nutrition API**: Free tier available

### Paid Options:
- **Spoonacular API**: Comprehensive food and nutrition data
- **Nutritionix API**: Restaurant and packaged food data
- **FoodData Central API**: Official USDA database

## Growth Score Algorithm

```javascript
const calculateGrowthScore = (nutrition) => {
  let score = 0;

  // Protein (30% of score)
  if (nutrition.protein >= 20) score += 30;
  else if (nutrition.protein >= 15) score += 25;
  else if (nutrition.protein >= 10) score += 20;
  else if (nutrition.protein >= 5) score += 10;

  // Calcium (25% of score)
  if (nutrition.calcium >= 300) score += 25;
  else if (nutrition.calcium >= 200) score += 20;
  else if (nutrition.calcium >= 100) score += 15;
  else if (nutrition.calcium >= 50) score += 10;

  // Vitamin D (20% of score)
  if (nutrition.vitaminD >= 400) score += 20;
  else if (nutrition.vitaminD >= 200) score += 15;
  else if (nutrition.vitaminD >= 100) score += 10;
  else if (nutrition.vitaminD >= 50) score += 5;

  // Other nutrients (25% of score)
  // Add scoring for zinc, magnesium, etc.

  return Math.min(score, 100);
};
```

## Implementation Steps

### Step 1: Set up Camera Permissions
```javascript
// Add to app.json or Info.plist
{
  "expo": {
    "permissions": ["CAMERA"]
  }
}
```

### Step 2: Create Scanner Component
```javascript
import { Camera } from 'expo-camera';

const FoodScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // Look up food data using barcode
    lookupFoodData(data);
  };

  // Rest of component...
};
```

### Step 3: Integrate Food Database
```javascript
const lookupFoodData = async (barcode) => {
  try {
    const response = await fetch(`https://api.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();

    if (data.status === 1) {
      const product = data.product;
      const nutrition = extractNutrition(product.nutriments);
      const growthScore = calculateGrowthScore(nutrition);

      setScanResult({
        name: product.product_name,
        nutrition,
        growthScore
      });
    }
  } catch (error) {
    console.error('Error looking up food:', error);
  }
};
```

## Cost Considerations

### Free Implementation:
- Open Food Facts API (free)
- USDA FoodData Central (free)
- Basic OCR with react-native-vision-camera

### Paid Implementation:
- Spoonacular API: $0.01 per request
- Google Vision API: $1.50 per 1,000 requests
- AWS Rekognition: $1.00 per 1,000 images

## Timeline Estimate

- **Barcode Scanner**: 1-2 weeks
- **OCR Label Scanner**: 2-3 weeks
- **Food Recognition**: 4-6 weeks
- **Full Integration**: 6-8 weeks

## Next Steps

1. **Start with barcode scanning** - easiest to implement and most reliable
2. **Choose a food database** - Open Food Facts is free and comprehensive
3. **Implement basic UI** - use the FoodScanner component I created
4. **Add growth scoring** - focus on protein, calcium, vitamin D
5. **Test with real products** - validate accuracy with common foods

The barcode scanner approach is definitely achievable and would provide immediate value to users!
