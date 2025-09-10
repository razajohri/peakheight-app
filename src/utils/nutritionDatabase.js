// Nutrition database for food recognition
// Based on USDA Food Database and Open Food Facts

export const NUTRITION_DATABASE = {
  // Fruits
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, calcium: 6, vitaminD: 0 },
  'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, calcium: 5, vitaminD: 0 },
  'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, calcium: 40, vitaminD: 0 },
  'strawberry': { calories: 32, protein: 0.7, carbs: 8, fat: 0.3, calcium: 16, vitaminD: 0 },
  'blueberry': { calories: 57, protein: 0.7, carbs: 14, fat: 0.3, calcium: 6, vitaminD: 0 },
  'grape': { calories: 62, protein: 0.6, carbs: 16, fat: 0.2, calcium: 10, vitaminD: 0 },
  'avocado': { calories: 160, protein: 2, carbs: 9, fat: 15, calcium: 12, vitaminD: 0 },

  // Vegetables
  'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, calcium: 47, vitaminD: 0 },
  'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, calcium: 99, vitaminD: 0 },
  'carrot': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, calcium: 33, vitaminD: 0 },
  'tomato': { calories: 18, protein: 0.9, carbs: 4, fat: 0.2, calcium: 10, vitaminD: 0 },
  'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, calcium: 12, vitaminD: 0 },
  'sweet potato': { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, calcium: 30, vitaminD: 0 },
  'kale': { calories: 49, protein: 4.3, carbs: 9, fat: 0.9, calcium: 150, vitaminD: 0 },

  // Proteins
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, calcium: 15, vitaminD: 0 },
  'salmon': { calories: 208, protein: 25, carbs: 0, fat: 12, calcium: 12, vitaminD: 11 },
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 15, calcium: 18, vitaminD: 0 },
  'pork': { calories: 242, protein: 27, carbs: 0, fat: 14, calcium: 20, vitaminD: 0 },
  'turkey': { calories: 189, protein: 29, carbs: 0, fat: 7, calcium: 15, vitaminD: 0 },
  'fish': { calories: 206, protein: 22, carbs: 0, fat: 12, calcium: 12, vitaminD: 8 },
  'tuna': { calories: 132, protein: 30, carbs: 0, fat: 1, calcium: 4, vitaminD: 0 },
  'shrimp': { calories: 99, protein: 24, carbs: 0, fat: 0.3, calcium: 70, vitaminD: 0 },

  // Dairy
  'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, calcium: 125, vitaminD: 1 },
  'cheese': { calories: 113, protein: 7, carbs: 1, fat: 9, calcium: 200, vitaminD: 0.5 },
  'yogurt': { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, calcium: 110, vitaminD: 0 },
  'greek yogurt': { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, calcium: 110, vitaminD: 0 },
  'butter': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, calcium: 24, vitaminD: 0.5 },

  // Eggs
  'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, calcium: 56, vitaminD: 2 },
  'eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11, calcium: 56, vitaminD: 2 },

  // Grains
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, calcium: 28, vitaminD: 0 },
  'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2, calcium: 151, vitaminD: 0 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, calcium: 21, vitaminD: 0 },
  'oats': { calories: 389, protein: 17, carbs: 66, fat: 7, calcium: 54, vitaminD: 0 },
  'quinoa': { calories: 120, protein: 4, carbs: 22, fat: 2, calcium: 17, vitaminD: 0 },

  // Nuts & Seeds
  'almond': { calories: 579, protein: 21, carbs: 22, fat: 50, calcium: 269, vitaminD: 0 },
  'walnut': { calories: 654, protein: 15, carbs: 14, fat: 65, calcium: 98, vitaminD: 0 },
  'peanut': { calories: 567, protein: 26, carbs: 16, fat: 49, calcium: 92, vitaminD: 0 },
  'cashew': { calories: 553, protein: 18, carbs: 30, fat: 44, calcium: 37, vitaminD: 0 },

  // Beverages
  'water': { calories: 0, protein: 0, carbs: 0, fat: 0, calcium: 0, vitaminD: 0 },
  'coffee': { calories: 2, protein: 0.3, carbs: 0, fat: 0, calcium: 5, vitaminD: 0 },
  'tea': { calories: 1, protein: 0, carbs: 0, fat: 0, calcium: 0, vitaminD: 0 },
  'juice': { calories: 45, protein: 0.5, carbs: 11, fat: 0.1, calcium: 8, vitaminD: 0 },

  // Common Food Items
  'pizza': { calories: 266, protein: 11, carbs: 33, fat: 10, calcium: 150, vitaminD: 0 },
  'burger': { calories: 354, protein: 16, carbs: 33, fat: 17, calcium: 100, vitaminD: 0 },
  'sandwich': { calories: 250, protein: 12, carbs: 30, fat: 8, calcium: 120, vitaminD: 0 },
  'salad': { calories: 20, protein: 2, carbs: 4, fat: 0.2, calcium: 30, vitaminD: 0 },
  'soup': { calories: 50, protein: 3, carbs: 8, fat: 1, calcium: 20, vitaminD: 0 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, calcium: 21, vitaminD: 0 },
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, calcium: 15, vitaminD: 0 },
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 15, calcium: 18, vitaminD: 0 },
  'fish': { calories: 206, protein: 22, carbs: 0, fat: 12, calcium: 12, vitaminD: 8 },
  'vegetables': { calories: 25, protein: 2, carbs: 5, fat: 0.2, calcium: 30, vitaminD: 0 },
  'fruit': { calories: 60, protein: 1, carbs: 15, fat: 0.2, calcium: 10, vitaminD: 0 },
  'meat': { calories: 200, protein: 25, carbs: 0, fat: 10, calcium: 15, vitaminD: 0 },
  'dairy': { calories: 60, protein: 3, carbs: 5, fat: 3, calcium: 100, vitaminD: 1 },
  'grains': { calories: 120, protein: 4, carbs: 25, fat: 1, calcium: 20, vitaminD: 0 },
  'nuts': { calories: 600, protein: 20, carbs: 20, fat: 50, calcium: 100, vitaminD: 0 }
};

// Function to estimate nutrition for any food item
export const estimateNutrition = (foodName) => {
  const normalizedName = foodName.toLowerCase().trim();

  // Direct match
  if (NUTRITION_DATABASE[normalizedName]) {
    return NUTRITION_DATABASE[normalizedName];
  }

  // Partial match - find foods that contain the search term
  const matchingFoods = Object.keys(NUTRITION_DATABASE).filter(key =>
    key.includes(normalizedName) || normalizedName.includes(key)
  );

  if (matchingFoods.length > 0) {
    return NUTRITION_DATABASE[matchingFoods[0]];
  }

  // Default nutrition for unknown foods
  return {
    calories: 'Unknown',
    protein: 'Unknown',
    carbs: 'Unknown',
    fat: 'Unknown',
    calcium: 'Unknown',
    vitaminD: 'Unknown'
  };
};

// Function to calculate growth score based on nutrition
export const calculateGrowthScore = (nutrition) => {
  if (nutrition.calories === 'Unknown') return 50;

  let score = 50; // Base score

  // Protein bonus (most important for growth)
  if (nutrition.protein && nutrition.protein > 0) {
    score += Math.min(nutrition.protein * 2, 25);
  }

  // Calcium bonus (bone health)
  if (nutrition.calcium && nutrition.calcium > 0) {
    score += Math.min(nutrition.calcium / 10, 15);
  }

  // Vitamin D bonus (calcium absorption)
  if (nutrition.vitaminD && nutrition.vitaminD > 0) {
    score += Math.min(nutrition.vitaminD * 5, 10);
  }

  // Sugar penalty (can hinder growth)
  if (nutrition.sugars && nutrition.sugars > 0) {
    score -= Math.min(nutrition.sugars, 10);
  }

  // Saturated fat penalty
  if (nutrition.saturatedFat && nutrition.saturatedFat > 0) {
    score -= Math.min(nutrition.saturatedFat * 2, 10);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

export default { NUTRITION_DATABASE, estimateNutrition, calculateGrowthScore };
