import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NUTRITION_CATEGORIES } from '../../utils/exercisesData';
import { NUTRITION_ITEMS } from '../../utils/nutritionData';
import { useUser } from '../../contexts/UserContext';
import { SupplementsService } from '../../services/supplementsService';
import * as Haptics from 'expo-haptics';

// Local images for nutrition categories (static requires; Metro-safe)
const LOCAL_NUTRITION_IMAGES = {
  'growth-foods': {
    'food-001': require('../../../assets/Growth Foods/Growth Foods/Leafy Greens.webp'),
    'food-002': require('../../../assets/Growth Foods/Growth Foods/Sweet Potatoes.webp'),
    'food-003': require('../../../assets/Growth Foods/Growth Foods/Berries.webp'),
    'food-004': require('../../../assets/Growth Foods/Growth Foods/Nuts.webp'),
    'food-005': require('../../../assets/Growth Foods/Growth Foods/Avocados.webp'),
    'food-006': require('../../../assets/Growth Foods/Growth Foods/Quinoa.webp'),
  },
  'protein-sources': {
    'protein-001': require('../../../assets/Protein Rich/Protein Rich/Grass-Fed Beef.webp'),
    'protein-002': require('../../../assets/Protein Rich/Protein Rich/Wild Salmon.webp'),
    'protein-003': require('../../../assets/Protein Rich/Protein Rich/Free-Range Eggs.webp'),
    'protein-004': require('../../../assets/Protein Rich/Protein Rich/Greek Yogurt.webp'),
    'protein-005': require('../../../assets/Protein Rich/Protein Rich/Chicken Breast.webp'),
    'protein-006': require('../../../assets/Protein Rich/Protein Rich/Lentils.webp'),
  },
  'calcium-rich': {
    'calcium-001': require('../../../assets/Calcium Rich/Calcium Rich/Raw Milk.webp'),
    'calcium-002': require('../../../assets/Calcium Rich/Calcium Rich/Sardines.webp'),
    'calcium-003': require('../../../assets/Calcium Rich/Calcium Rich/Cheese.webp'),
    'calcium-004': require('../../../assets/Calcium Rich/Calcium Rich/Fresh Kale.webp'),
    'calcium-005': require('../../../assets/Calcium Rich/Calcium Rich/Almonds.webp'),
    'calcium-006': require('../../../assets/Calcium Rich/Calcium Rich/Bone Broth.webp'),
  },
};

export default function NutritionDetailView({ styles, selectedCategory }) {
  const { userProfile } = useUser();
  const [selectedSupplements, setSelectedSupplements] = useState([]);
  const [loadingSupplements, setLoadingSupplements] = useState(true);
  const [updatingSupplement, setUpdatingSupplement] = useState(null);

  // Load user's selected supplements when component mounts or category changes
  useEffect(() => {
    if (selectedCategory === 'supplements' && userProfile?.id) {
      loadUserSupplements();
    }
  }, [selectedCategory, userProfile?.id]);

  const loadUserSupplements = async () => {
    if (!userProfile?.id) return;
    try {
      setLoadingSupplements(true);
      const supplements = await SupplementsService.getUserSupplements(userProfile.id);
      setSelectedSupplements(supplements);
    } catch (error) {
      console.error('Error loading supplements:', error);
    } finally {
      setLoadingSupplements(false);
    }
  };

  const handleToggleSupplement = async (supplementId) => {
    if (!userProfile?.id || updatingSupplement === supplementId) return;

    try {
      setUpdatingSupplement(supplementId);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const isInPlan = selectedSupplements.includes(supplementId);
      
      if (isInPlan) {
        // Remove from plan
        const result = await SupplementsService.removeSupplement(userProfile.id, supplementId);
        if (result.success) {
          setSelectedSupplements(result.supplements);
        }
      } else {
        // Add to plan
        const result = await SupplementsService.addSupplement(userProfile.id, supplementId);
        if (result.success) {
          setSelectedSupplements(result.supplements);
        }
      }
    } catch (error) {
      console.error('Error toggling supplement:', error);
    } finally {
      setUpdatingSupplement(null);
    }
  };

  const getHDImage = (uri) => {
    if (!uri || typeof uri !== 'string') return uri;
    try {
      if (uri.includes('images.unsplash.com')) {
        const base = uri.split('?')[0];
        return `${base}?auto=format&q=70&w=900&h=675&fit=crop&crop=faces,edges&dpr=1.5`;
      }
      return uri;
    } catch {
      return uri;
    }
  };

  const getNutritionImageSource = (item) => {
    const localByCategory = LOCAL_NUTRITION_IMAGES[selectedCategory];
    if (localByCategory && localByCategory[item.id]) {
      // Return local require (number)
      return localByCategory[item.id];
    }
    const uri = getHDImage(item.image);
    return uri ? { uri } : undefined;
  };

  return (
    <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
      {selectedCategory !== 'supplements' && (
        <Text style={styles.detailTitle}>
          {NUTRITION_CATEGORIES.find(cat => cat.id === selectedCategory)?.name || selectedCategory}
        </Text>
      )}
      <Text style={[styles.sectionHeading, { fontSize: 18 }]}>Items</Text>
      <View style={styles.nutritionItemsList}>
        {NUTRITION_ITEMS.filter(item => item.categoryId === selectedCategory).map(item => (
          <View key={item.id} style={[
            styles.nutritionItemCard,
            { paddingVertical: 18, paddingHorizontal: 16, borderRadius: 16, marginBottom: 14 }
          ]}>
            {selectedCategory !== 'supplements' && (
              <View style={styles.nutritionItemImage}>
                {(() => {
                  const imgSource = getNutritionImageSource(item);
                  return imgSource ? (
                    <Image source={imgSource} style={styles.nutritionItemImageContent} resizeMode="cover" />
                  ) : null;
                })()}
              </View>
            )}
            <View style={styles.nutritionItemContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.nutritionItemName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.nutritionGrowthScore}>
                  <Text style={styles.nutritionGrowthScoreText}>GS {item.growthScore}</Text>
                </View>
              </View>
              <Text style={[styles.nutritionItemDescription, { marginBottom: 12 }]} numberOfLines={3}>{item.description}</Text>
              <View style={[styles.nutritionItemBenefits, { marginTop: 2 }]} >
                {item.benefits.slice(0, 3).map((benefit, index) => (
                  <View key={index} style={styles.nutritionBenefitChip}>
                    <Text style={styles.nutritionBenefitText} numberOfLines={1}>{benefit}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.nutritionItemFooter}>
                <Text style={styles.nutritionItemServing} numberOfLines={1}>{item.dosage || item.serving}</Text>
              </View>
              {selectedCategory === 'supplements' && (
                <TouchableOpacity
                  style={[
                    {
                      marginTop: 12,
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor: selectedSupplements.includes(item.id) ? '#FF3B30' : '#8B5CF6',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 40,
                    }
                  ]}
                  onPress={() => handleToggleSupplement(item.id)}
                  disabled={updatingSupplement === item.id || loadingSupplements}
                  activeOpacity={0.7}
                >
                  {updatingSupplement === item.id ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={{
                      color: '#FFFFFF',
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                      {selectedSupplements.includes(item.id) ? 'Remove from Plan' : 'Add to Plan'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
