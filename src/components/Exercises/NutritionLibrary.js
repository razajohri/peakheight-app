import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../UI/Icon';

export default function NutritionLibrary({ styles, openBarcodeScanner, openFoodPhotoRecognition, openCategory }) {
  return (
    <View style={styles.gridContainer}>
      <Text style={styles.gridTitle}>NUTRITION FOR GROWTH</Text>

      <Text style={styles.sectionLabel}>TOOLS</Text>
      <View style={styles.nutritionTopRow}>
        {/* Barcode Scanner - Hidden for now */}
        {false && (
          <TouchableOpacity style={styles.nutritionTopCard} onPress={openBarcodeScanner}>
            <View style={[styles.nutritionTopIconHolder, { backgroundColor: '#3B82F615' }]}>
              <Icon name="barcode" size={24} color="#3B82F6" />
            </View>
            <View style={styles.nutritionTopTextCol}>
              <Text style={styles.nutritionTopCardTitle}>Barcode Scanner</Text>
              <Text style={styles.nutritionTopCardSubtitle}>Scan barcodes</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[
            styles.nutritionTopCard, 
            { 
              width: '100%',
              paddingVertical: 20,
              paddingHorizontal: 16,
              backgroundColor: '#10B981',
              shadowColor: '#10B981',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }
          ]} 
          onPress={openFoodPhotoRecognition}
          activeOpacity={0.8}
        >
          <View style={[
            styles.nutritionTopIconHolder, 
            { 
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              width: 64,
              height: 64,
              borderRadius: 32,
              marginBottom: 12,
            }
          ]}>
            <Icon name="camera" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.nutritionTopTextCol}>
            <Text style={[
              styles.nutritionTopCardTitle, 
              { 
                fontSize: 20,
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: 6,
              }
            ]}>Food Recognition</Text>
            <Text style={[
              styles.nutritionTopCardSubtitle, 
              { 
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500',
              }
            ]}>AI-powered photo scan</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>LIBRARY</Text>
      <View style={styles.nutritionTopRow}>
        {[{ id: 'recipes', name: 'Recipe Library', icon: 'restaurant', subtitle: 'Growth recipes', color: '#F59E0B' },
          { id: 'supplements', name: 'Supplements', icon: 'medical', subtitle: 'Recommended picks', color: '#8B5CF6' }].map(item => (
          <TouchableOpacity key={item.id} style={styles.nutritionTopCard} onPress={() => openCategory(item.id)}>
            <View style={[styles.nutritionTopIconHolder, { backgroundColor: `${item.color}15` }]}>
              <Icon name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.nutritionTopTextCol}>
              <Text style={styles.nutritionTopCardTitle}>{item.name}</Text>
              <Text style={styles.nutritionTopCardSubtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.grid}>
        {[{ id: 'growth-foods', name: 'Growth Foods', icon: 'leaf', color: '#10B981' },
          { id: 'protein-sources', name: 'Protein Sources', icon: 'fish', color: '#06B6D4' },
          { id: 'calcium-rich', name: 'Calcium Rich', icon: 'water', color: '#3B82F6' }].map(item => (
          <TouchableOpacity key={item.id} style={styles.gridCard} onPress={() => openCategory(item.id)}>
            <View style={[styles.gridIconHolder, { backgroundColor: `${item.color}15` }]}>
              <Icon name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={styles.gridCardText} numberOfLines={2}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

