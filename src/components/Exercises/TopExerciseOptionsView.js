import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../UI/Icon';
import { getGridColumns } from '../../utils/responsiveUtils';

export default function TopExerciseOptionsView({ styles, HapticFeedback, onPressToday, onOpenCategory }) {
  return (
    <View style={styles.topOptionsContainer}>
      <Text style={styles.topOptionsTitle}>TRAINING SECTIONS</Text>

      {/* Three pill cards, like the HTML design */}
      <View style={localStyles.sectionList}>
        {/* High HGH Impact */}
        <TouchableOpacity
          style={localStyles.sectionCard}
          activeOpacity={0.85}
          onPress={() => {
            HapticFeedback.medium();
            onOpenCategory('high-hgh-impact');
          }}
        >
          <View style={[localStyles.iconWrapper, { backgroundColor: '#F59E0B1A' }]}>
            <Icon name="flash" size={24} color="#F59E0B" />
          </View>
          <View style={localStyles.textWrapper}>
            <View style={localStyles.titleRow}>
              <Text style={localStyles.cardTitle}>High HGH Impact</Text>
              <Icon name="chevron-forward" size={16} color="#D1D5DB" />
            </View>
            <Text style={localStyles.cardSubtitle}>
              Fastest height-boosting moves to spike growth hormone.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Exercises */}
        <TouchableOpacity
          style={localStyles.sectionCard}
          activeOpacity={0.85}
          onPress={() => {
            HapticFeedback.medium();
            onOpenCategory('exercises');
          }}
        >
          <View style={[localStyles.iconWrapper, { backgroundColor: '#0D33F21A' }]}>
            <Icon name="fitness" size={24} color="#0D33F2" />
          </View>
          <View style={localStyles.textWrapper}>
            <View style={localStyles.titleRow}>
              <Text style={localStyles.cardTitle}>Exercises</Text>
              <Icon name="chevron-forward" size={16} color="#D1D5DB" />
            </View>
            <Text style={localStyles.cardSubtitle}>
              Build strength and muscle that supports taller posture.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Stretches */}
        <TouchableOpacity
          style={localStyles.sectionCard}
          activeOpacity={0.85}
          onPress={() => {
            HapticFeedback.medium();
            onOpenCategory('stretches');
          }}
        >
          <View style={[localStyles.iconWrapper, { backgroundColor: '#10B9811A' }]}>
            <Icon name="body" size={24} color="#10B981" />
          </View>
          <View style={localStyles.textWrapper}>
            <View style={localStyles.titleRow}>
              <Text style={localStyles.cardTitle}>Stretches</Text>
              <Icon name="chevron-forward" size={16} color="#D1D5DB" />
            </View>
            <Text style={localStyles.cardSubtitle}>
              Fix posture, undo sitting, and unlock hidden height.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    gap: 2,
  },
  sectionList: {
    marginTop: 8,
    gap: 12,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#020617',
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
  },
});

