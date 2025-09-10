import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const RecipeLibrary = ({ navigation, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const categories = [
    { id: 'all', name: 'All Recipes', icon: 'restaurant' },
    { id: 'breakfast', name: 'Morning', icon: 'sunny' },
    { id: 'evening', name: 'Evening', icon: 'partly-sunny' },
    { id: 'night', name: 'Night', icon: 'moon' },
  ];

  const recipes = [
    // MORNING/BREAKFAST RECIPES
    {
      id: 1,
      name: 'Growth Protein Smoothie',
      category: 'breakfast',
      prepTime: '5 min',
      calories: 320,
      protein: 25,
      growthScore: 95,
      ingredients: ['Greek yogurt', 'Banana', 'Spinach', 'Protein powder', 'Almond milk'],
      description: 'High-protein smoothie packed with growth nutrients',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Calcium-Rich Oatmeal',
      category: 'breakfast',
      prepTime: '10 min',
      calories: 280,
      protein: 12,
      growthScore: 88,
      ingredients: ['Oats', 'Milk', 'Chia seeds', 'Almonds', 'Honey'],
      description: 'Creamy oatmeal loaded with calcium for bone health',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Height-Boosting Pancakes',
      category: 'breakfast',
      prepTime: '15 min',
      calories: 350,
      protein: 18,
      growthScore: 82,
      ingredients: ['Whole wheat flour', 'Eggs', 'Milk', 'Banana', 'Walnuts'],
      description: 'Protein-rich pancakes with growth-supporting nutrients',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop'
    },
    {
      id: 16,
      name: 'Growth Protein Waffles',
      category: 'breakfast',
      prepTime: '12 min',
      calories: 320,
      protein: 16,
      growthScore: 80,
      ingredients: ['Whole wheat flour', 'Eggs', 'Greek yogurt', 'Berries', 'Maple syrup'],
      description: 'High-protein waffles with growth nutrients',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=300&fit=crop'
    },
    {
      id: 17,
      name: 'Bone-Building Toast',
      category: 'breakfast',
      prepTime: '8 min',
      calories: 280,
      protein: 14,
      growthScore: 78,
      ingredients: ['Whole grain bread', 'Avocado', 'Eggs', 'Cheese', 'Tomatoes'],
      description: 'Calcium-rich toast perfect for morning growth',
      image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&h=300&fit=crop'
    },
    {
      id: 18,
      name: 'Growth Cereal Bowl',
      category: 'breakfast',
      prepTime: '3 min',
      calories: 240,
      protein: 12,
      growthScore: 75,
      ingredients: ['Whole grain cereal', 'Milk', 'Banana', 'Nuts', 'Honey'],
      description: 'Quick cereal bowl with growth-supporting nutrients',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'
    },
    {
      id: 19,
      name: 'Protein French Toast',
      category: 'breakfast',
      prepTime: '10 min',
      calories: 300,
      protein: 18,
      growthScore: 85,
      ingredients: ['Whole wheat bread', 'Eggs', 'Milk', 'Cinnamon', 'Berries'],
      description: 'High-protein French toast for morning growth',
      image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=300&h=300&fit=crop'
    },
    {
      id: 20,
      name: 'Growth Breakfast Burrito',
      category: 'breakfast',
      prepTime: '15 min',
      calories: 380,
      protein: 22,
      growthScore: 88,
      ingredients: ['Whole wheat tortilla', 'Eggs', 'Beans', 'Cheese', 'Avocado'],
      description: 'Protein-packed breakfast burrito for growth',
      image: 'https://images.unsplash.com/photo-1565299585323-38174c4aabaa?w=300&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Growth Scrambled Eggs',
      category: 'breakfast',
      prepTime: '8 min',
      calories: 220,
      protein: 20,
      growthScore: 90,
      ingredients: ['Eggs', 'Spinach', 'Cheese', 'Avocado', 'Tomatoes'],
      description: 'High-protein eggs with vitamin D and calcium',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Bone-Building Yogurt Bowl',
      category: 'breakfast',
      prepTime: '5 min',
      calories: 250,
      protein: 15,
      growthScore: 85,
      ingredients: ['Greek yogurt', 'Berries', 'Granola', 'Chia seeds', 'Honey'],
      description: 'Calcium-rich yogurt with antioxidants for growth',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop'
    },

    // EVENING RECIPES
    {
      id: 6,
      name: 'Grilled Salmon Bowl',
      category: 'evening',
      prepTime: '20 min',
      calories: 450,
      protein: 35,
      growthScore: 92,
      ingredients: ['Salmon', 'Quinoa', 'Broccoli', 'Avocado', 'Lemon'],
      description: 'Omega-3 rich salmon with complete proteins',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop'
    },
    {
      id: 7,
      name: 'Height-Boosting Salad',
      category: 'evening',
      prepTime: '15 min',
      calories: 220,
      protein: 18,
      growthScore: 85,
      ingredients: ['Spinach', 'Chicken breast', 'Almonds', 'Cheese', 'Olive oil'],
      description: 'Nutrient-dense salad for optimal growth',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop'
    },
    {
      id: 8,
      name: 'Growth Chicken Stir-Fry',
      category: 'evening',
      prepTime: '18 min',
      calories: 380,
      protein: 28,
      growthScore: 88,
      ingredients: ['Chicken breast', 'Broccoli', 'Bell peppers', 'Brown rice', 'Soy sauce'],
      description: 'High-protein stir-fry with growth-supporting vegetables',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=300&fit=crop'
    },
    {
      id: 9,
      name: 'Bone-Strengthening Pasta',
      category: 'evening',
      prepTime: '25 min',
      calories: 420,
      protein: 22,
      growthScore: 80,
      ingredients: ['Whole wheat pasta', 'Chicken', 'Spinach', 'Parmesan', 'Olive oil'],
      description: 'Calcium-rich pasta with complete amino acids',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=300&fit=crop'
    },
    {
      id: 10,
      name: 'Growth Quinoa Bowl',
      category: 'evening',
      prepTime: '20 min',
      calories: 350,
      protein: 20,
      growthScore: 87,
      ingredients: ['Quinoa', 'Black beans', 'Sweet potato', 'Kale', 'Tahini'],
      description: 'Complete protein bowl with growth nutrients',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop'
    },
    {
      id: 21,
      name: 'Bone-Building Fish Tacos',
      category: 'evening',
      prepTime: '25 min',
      calories: 420,
      protein: 28,
      growthScore: 90,
      ingredients: ['White fish', 'Corn tortillas', 'Cabbage', 'Avocado', 'Lime'],
      description: 'Calcium-rich fish tacos for evening growth',
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=300&fit=crop'
    },
    {
      id: 22,
      name: 'Growth Turkey Burger',
      category: 'evening',
      prepTime: '22 min',
      calories: 380,
      protein: 32,
      growthScore: 88,
      ingredients: ['Ground turkey', 'Whole wheat bun', 'Lettuce', 'Tomato', 'Cheese'],
      description: 'High-protein turkey burger for growth support',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop'
    },
    {
      id: 23,
      name: 'Height-Boosting Veggie Bowl',
      category: 'evening',
      prepTime: '18 min',
      calories: 320,
      protein: 18,
      growthScore: 82,
      ingredients: ['Brown rice', 'Tofu', 'Broccoli', 'Carrots', 'Sesame oil'],
      description: 'Plant-based bowl with growth nutrients',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop'
    },
    {
      id: 24,
      name: 'Growth Chicken Curry',
      category: 'evening',
      prepTime: '30 min',
      calories: 450,
      protein: 30,
      growthScore: 85,
      ingredients: ['Chicken breast', 'Coconut milk', 'Curry spices', 'Vegetables', 'Rice'],
      description: 'Protein-rich curry with growth-supporting spices',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=300&fit=crop'
    },
    {
      id: 25,
      name: 'Bone-Strengthening Lasagna',
      category: 'evening',
      prepTime: '35 min',
      calories: 480,
      protein: 25,
      growthScore: 83,
      ingredients: ['Whole wheat pasta', 'Ground beef', 'Cheese', 'Tomato sauce', 'Spinach'],
      description: 'Calcium-rich lasagna for evening growth',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=300&fit=crop'
    },

    // NIGHT RECIPES
    {
      id: 11,
      name: 'Bone-Strengthening Soup',
      category: 'night',
      prepTime: '30 min',
      calories: 180,
      protein: 15,
      growthScore: 90,
      ingredients: ['Bone broth', 'Vegetables', 'Herbs', 'Garlic', 'Ginger'],
      description: 'Healing soup rich in collagen and minerals',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop'
    },
    {
      id: 12,
      name: 'Growth Milk Shake',
      category: 'night',
      prepTime: '5 min',
      calories: 300,
      protein: 20,
      growthScore: 88,
      ingredients: ['Milk', 'Banana', 'Peanut butter', 'Honey', 'Cinnamon'],
      description: 'Calcium-rich shake perfect before bedtime',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop'
    },
    {
      id: 13,
      name: 'Sleep-Enhancing Oatmeal',
      category: 'night',
      prepTime: '10 min',
      calories: 250,
      protein: 12,
      growthScore: 82,
      ingredients: ['Oats', 'Milk', 'Banana', 'Almonds', 'Honey'],
      description: 'Comforting oatmeal that promotes growth hormone release',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop'
    },
    {
      id: 14,
      name: 'Growth Trail Mix',
      category: 'night',
      prepTime: '5 min',
      calories: 150,
      protein: 6,
      growthScore: 75,
      ingredients: ['Nuts', 'Seeds', 'Dried fruit', 'Dark chocolate'],
      description: 'Healthy snack mix for between meals',
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300&h=300&fit=crop'
    },
    {
      id: 15,
      name: 'Bone-Building Smoothie',
      category: 'night',
      prepTime: '5 min',
      calories: 280,
      protein: 18,
      growthScore: 85,
      ingredients: ['Milk', 'Banana', 'Spinach', 'Almonds', 'Honey'],
      description: 'Calcium-rich smoothie for nighttime growth support',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=300&fit=crop'
    },
    {
      id: 26,
      name: 'Sleep-Enhancing Tea',
      category: 'night',
      prepTime: '3 min',
      calories: 20,
      protein: 1,
      growthScore: 70,
      ingredients: ['Chamomile tea', 'Honey', 'Lemon', 'Ginger', 'Milk'],
      description: 'Calming tea to promote sleep and growth',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop'
    },
    {
      id: 27,
      name: 'Growth Banana Bread',
      category: 'night',
      prepTime: '8 min',
      calories: 200,
      protein: 8,
      growthScore: 75,
      ingredients: ['Banana', 'Whole wheat flour', 'Eggs', 'Nuts', 'Honey'],
      description: 'Healthy banana bread for evening growth',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop'
    },
    {
      id: 28,
      name: 'Bone-Building Pudding',
      category: 'night',
      prepTime: '5 min',
      calories: 180,
      protein: 12,
      growthScore: 80,
      ingredients: ['Chia seeds', 'Milk', 'Honey', 'Vanilla', 'Berries'],
      description: 'Calcium-rich pudding for nighttime growth',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop'
    },
    {
      id: 29,
      name: 'Growth Hot Chocolate',
      category: 'night',
      prepTime: '4 min',
      calories: 150,
      protein: 8,
      growthScore: 72,
      ingredients: ['Dark chocolate', 'Milk', 'Honey', 'Cinnamon', 'Marshmallows'],
      description: 'Warm chocolate drink for evening growth support',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop'
    },
    {
      id: 30,
      name: 'Sleep-Supporting Cookies',
      category: 'night',
      prepTime: '6 min',
      calories: 120,
      protein: 4,
      growthScore: 68,
      ingredients: ['Oats', 'Banana', 'Nuts', 'Honey', 'Cinnamon'],
      description: 'Healthy cookies to support sleep and growth',
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=300&h=300&fit=crop'
    }
  ];

  const filteredRecipes = selectedCategory === 'all'
    ? recipes
    : recipes.filter(recipe => recipe.category === selectedCategory);

  const Header = (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Icon name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Recipe Library</Text>
      <TouchableOpacity style={styles.searchButton}>
        <Icon name="search" size={24} color="#000000" />
      </TouchableOpacity>
    </View>
  );

  const CategoryTabs = (
    <View style={styles.categoryTabs}>
      <View style={styles.categoryGrid}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => setSelectedCategory(category.id)}
          >
            <View style={styles.categoryIconHolder}>
              <Icon
                name={category.icon}
                size={20}
                color="#000000"
              />
            </View>
            <Text style={styles.categoryCardText} numberOfLines={2}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const RecipeCard = ({ recipe }) => (
    <TouchableOpacity style={styles.recipeCard}>
      <View style={styles.recipeImage}>
        <Image
          source={{ uri: recipe.image || DEFAULT_RECIPE_IMAGE }}
          style={styles.recipeImageContent}
          resizeMode="cover"
        />
      </View>

      <View style={styles.recipeContent}>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        <Text style={styles.recipeDescription}>{recipe.description}</Text>

        <View style={styles.recipeStats}>
          <View style={styles.statItem}>
            <Icon name="time" size={14} color="#666666" />
            <Text style={styles.statText}>{recipe.prepTime}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="flame" size={14} color="#666666" />
            <Text style={styles.statText}>{recipe.calories} cal</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="fitness" size={14} color="#666666" />
            <Text style={styles.statText}>{recipe.protein}g protein</Text>
          </View>
        </View>

        <View style={styles.growthScoreContainer}>
          <Text style={styles.growthScoreLabel}>Growth Score</Text>
          <View style={styles.growthScoreBar}>
            <View style={[styles.growthScoreFill, { width: `${recipe.growthScore}%` }]} />
          </View>
          <Text style={styles.growthScoreText}>{recipe.growthScore}/100</Text>
        </View>

        <View style={styles.recipeActions}>
          <TouchableOpacity style={styles.viewButton} onPress={() => setSelectedRecipe(recipe)}>
            <Text style={styles.viewButtonText}>View Recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add to Today's Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const RecipeDetail = ({ recipe }) => (
    <View style={styles.recipeDetailContainer}>
      <View style={styles.recipeDetailHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedRecipe(null)}>
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.recipeDetailTitle}>{recipe.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.recipeDetailContent} showsVerticalScrollIndicator={false}>
        <View style={styles.recipeDetailImage}>
          <Image
            source={{ uri: recipe.image || DEFAULT_RECIPE_IMAGE }}
            style={styles.recipeDetailImageContent}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.recipeDetailDescription}>{recipe.description}</Text>

        <View style={styles.recipeDetailStats}>
          <View style={styles.detailStatItem}>
            <Icon name="time" size={20} color="#666666" />
            <Text style={styles.detailStatLabel}>Prep Time</Text>
            <Text style={styles.detailStatValue}>{recipe.prepTime}</Text>
          </View>
          <View style={styles.detailStatItem}>
            <Icon name="flame" size={20} color="#666666" />
            <Text style={styles.detailStatLabel}>Calories</Text>
            <Text style={styles.detailStatValue}>{recipe.calories}</Text>
          </View>
          <View style={styles.detailStatItem}>
            <Icon name="fitness" size={20} color="#666666" />
            <Text style={styles.detailStatLabel}>Protein</Text>
            <Text style={styles.detailStatValue}>{recipe.protein}g</Text>
          </View>
        </View>

        <View style={styles.growthScoreDetailContainer}>
          <Text style={styles.growthScoreDetailLabel}>Growth Score</Text>
          <View style={styles.growthScoreDetailBar}>
            <View style={[styles.growthScoreDetailFill, { width: `${recipe.growthScore}%` }]} />
          </View>
          <Text style={styles.growthScoreDetailText}>{recipe.growthScore}/100</Text>
        </View>

        <View style={styles.ingredientsContainer}>
          <Text style={styles.ingredientsTitle}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Icon name="checkmark-circle" size={16} color="#4CD964" />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>
            {recipe.category === 'breakfast' && '1. Prepare all ingredients\n2. Blend/mix according to recipe\n3. Serve immediately for best nutrition\n4. Enjoy your growth-supporting meal!'}
            {recipe.category === 'evening' && '1. Heat pan/oven to medium heat\n2. Cook protein source first\n3. Add vegetables and seasonings\n4. Cook until tender and serve hot\n5. Perfect for evening growth support!'}
            {recipe.category === 'night' && '1. Prepare ingredients for easy digestion\n2. Cook gently to preserve nutrients\n3. Serve warm for better sleep\n4. Enjoy 1-2 hours before bedtime\n5. Supports overnight growth hormone release!'}
          </Text>
        </View>

        <View style={styles.recipeDetailActions}>
          <TouchableOpacity style={styles.addToPlanButton}>
            <Icon name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addToPlanButtonText}>Add to Today's Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {selectedRecipe ? (
        <RecipeDetail recipe={selectedRecipe} />
      ) : (
        <>
          {Header}
          {CategoryTabs}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50, // Add top padding to avoid camera area
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
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
  searchButton: {
    padding: 8,
  },
  categoryTabs: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '42%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 6,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconHolder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryCardText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginRight: 12,
    overflow: 'hidden',
  },
  recipeImageContent: {
    width: '100%',
    height: '100%',
  },
  recipeContent: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  recipeStats: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  growthScoreContainer: {
    marginBottom: 12,
  },
  growthScoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  growthScoreBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    marginBottom: 2,
  },
  growthScoreFill: {
    height: '100%',
    backgroundColor: '#4CD964',
    borderRadius: 2,
  },
  growthScoreText: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'right',
  },
  recipeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  // Recipe Detail Styles
  recipeDetailContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 8, // Reduced top padding to move content up
  },
  recipeDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  recipeDetailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  recipeDetailContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recipeDetailImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  recipeDetailImageContent: {
    width: '100%',
    height: '100%',
  },
  recipeDetailDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  recipeDetailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  detailStatItem: {
    alignItems: 'center',
  },
  detailStatLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    marginBottom: 2,
  },
  detailStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  growthScoreDetailContainer: {
    marginBottom: 16,
  },
  growthScoreDetailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  growthScoreDetailBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    marginBottom: 4,
  },
  growthScoreDetailFill: {
    height: '100%',
    backgroundColor: '#4CD964',
    borderRadius: 4,
  },
  growthScoreDetailText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  ingredientsContainer: {
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ingredientText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
  },
  instructionsContainer: {
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
  recipeDetailActions: {
    marginBottom: 28,
  },
  addToPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addToPlanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default RecipeLibrary;
