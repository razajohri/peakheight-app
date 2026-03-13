import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';
import { useUser } from '../../contexts/UserContext';
import { AuthService } from '../../services/auth';
import CelebrationModal from '../UI/CelebrationModal';
import SeedRetentionModal from './SeedRetentionModal';
import * as Haptics from 'expo-haptics';

const HeightMetrics = ({ onSeedRetentionPress }) => {
  const { user, userProfile, loading, getCurrentHeight, getTargetHeight, updateUserProfile, fetchUserProfile } = useUser();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [unit, setUnit] = useState('imperial'); // 'imperial' or 'metric'
  const [updating, setUpdating] = useState(false);
  const [seedRetentionModalVisible, setSeedRetentionModalVisible] = useState(false);
  const scrollViewRef = React.useRef(null);

  const currentHeight = getCurrentHeight();
  const targetHeight = getTargetHeight();

  if (loading) {
    return (
      <View style={styles.metricsRow}>
        <View style={styles.metricCardWrapper}>
          <LinearGradient
            colors={["#F8FAFC", "#E2E8F0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.metricCard}
          >
          <Text style={styles.metricLabel}>CURRENT HEIGHT</Text>
          <Text style={styles.metricValue}>Loading...</Text>
          </LinearGradient>
        </View>
        <View style={styles.metricCardWrapper}>
          <LinearGradient
            colors={["#F8FAFC", "#E2E8F0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.metricCard}
          >
          <Text style={styles.metricLabel}>TARGET HEIGHT</Text>
          <Text style={styles.metricValue}>Loading...</Text>
          </LinearGradient>
        </View>
      </View>
    );
  }

  const handleUpdateHeight = () => {
    if (!userProfile?.id) return;
    
    // Initialize with current height if available
    if (currentHeight) {
      if (unit === 'imperial') {
        setHeightInput(`${currentHeight.feet}'${currentHeight.inches}"`);
      } else {
        setHeightInput(currentHeight.cm.toString());
      }
    } else {
      setHeightInput('');
    }
    setUpdateModalVisible(true);
  };

  const convertToCm = (value, inputUnit) => {
    if (inputUnit === 'imperial') {
      // Parse feet'inches" format
      const match = value.match(/(\d+)'(\d+)"/);
      if (match) {
        const feet = parseInt(match[1]);
        const inches = parseInt(match[2]);
        return (feet * 12 + inches) * 2.54;
      }
      // Try just feet
      const feetOnly = parseFloat(value);
      if (!isNaN(feetOnly)) {
        return feetOnly * 30.48;
      }
    } else {
      // Metric - just parse the number
      return parseFloat(value);
    }
    return null;
  };

  const handleSaveHeight = async () => {
    if (!heightInput.trim()) {
      Alert.alert('Invalid Input', 'Please enter your height');
      return;
    }

    const heightCm = convertToCm(heightInput, unit);
    
    if (!heightCm || heightCm < 100 || heightCm > 250) {
      Alert.alert('Invalid Height', 'Please enter a valid height between 100-250 cm (3\'3" - 8\'2")');
      return;
    }

    setUpdating(true);
    try {
      const oldHeight = userProfile?.current_height;
      const growth = oldHeight ? (heightCm - oldHeight).toFixed(1) : null;

      // Update user profile in database
      await updateUserProfile({
        currentHeight: heightCm
      });

      // Refresh user profile to get updated data
      if (user?.id) {
        await fetchUserProfile(user.id);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      setUpdateModalVisible(false);
      setHeightInput('');

      // Show celebration
      if (growth && parseFloat(growth) > 0) {
        const growthInches = (parseFloat(growth) / 2.54).toFixed(1);
        setCelebrationMessage(`🎉 Congratulations! You've grown ${growth} cm (${growthInches}")! Keep up the amazing work!`);
      } else if (growth && parseFloat(growth) < 0) {
        setCelebrationMessage(`✅ Height updated successfully!`);
      } else {
        setCelebrationMessage(`✅ Height updated successfully!`);
      }
      setCelebrationVisible(true);
    } catch (error) {
      console.error('Error updating height:', error);
      Alert.alert('Error', 'Failed to update height. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const formatHeightForInput = (heightCm) => {
    if (!heightCm) return '';
    const totalInches = heightCm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  return (
    <>
      <View style={styles.metricsRow}>
        {/* Current Height - Clickable */}
        <TouchableOpacity 
          onPress={handleUpdateHeight}
          activeOpacity={0.7}
          style={styles.metricCardWrapper}
        >
          <LinearGradient
            colors={["#F8FAFC", "#E2E8F0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.metricCard}
        >
          <View style={styles.metricCardContent}>
            <Text style={styles.metricLabel}>CURRENT HEIGHT</Text>
            <Text style={styles.metricValue}>
              {currentHeight ? currentHeight.display : 'Not set'}
            </Text>
            <Text style={styles.metricSubtext}>
              {currentHeight ? 'Tap to update' : 'Complete onboarding to set'}
            </Text>
            {currentHeight && (
              <Icon name="chevron-forward" size={16} color="#666666" style={styles.editIcon} />
            )}
          </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Target Height */}
        <View style={styles.metricCardWrapper}>
          <View style={styles.targetHeightContainer}>
            <LinearGradient
              colors={["#F8FAFC", "#E2E8F0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.metricCard}
            >
              <Text style={styles.metricLabel}>TARGET HEIGHT</Text>
              <Text style={styles.metricValue}>
                {targetHeight ? targetHeight.display : 'Not set'}
              </Text>
              <Text style={styles.metricSubtext}>
                {targetHeight ? 'Your goal' : 'Complete onboarding to set'}
              </Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Update Height Modal */}
      <Modal
        visible={updateModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Your Height</Text>
              <TouchableOpacity
                onPress={() => setUpdateModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              ref={scrollViewRef}
              style={styles.modalBody}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalBodyContent}
              showsVerticalScrollIndicator={true}
            >
              {/* Unit Toggle */}
              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[styles.unitButton, unit === 'imperial' && styles.unitButtonActive]}
                  onPress={() => {
                    setUnit('imperial');
                    if (currentHeight) {
                      setHeightInput(`${currentHeight.feet}'${currentHeight.inches}"`);
                    }
                  }}
                >
                  <Text style={[styles.unitButtonText, unit === 'imperial' && styles.unitButtonTextActive]}>
                    Feet & Inches
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitButton, unit === 'metric' && styles.unitButtonActive]}
                  onPress={() => {
                    setUnit('metric');
                    if (currentHeight) {
                      setHeightInput(currentHeight.cm.toString());
                    }
                  }}
                >
                  <Text style={[styles.unitButtonText, unit === 'metric' && styles.unitButtonTextActive]}>
                    Centimeters
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Height Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {unit === 'imperial' ? 'Enter height (e.g., 5\'10")' : 'Enter height in cm'}
                </Text>
                <TextInput
                  style={styles.input}
                  value={heightInput}
                  onChangeText={setHeightInput}
                  placeholder={unit === 'imperial' ? "5'10\"" : "175"}
                  keyboardType="default"
                  autoFocus={true}
                />
                {unit === 'imperial' && (
                  <Text style={styles.inputHint}>
                    Format: feet'inches" (e.g., 5'10" or 6'2")
                  </Text>
                )}
              </View>

              {/* Current vs New Height Preview */}
              {currentHeight && heightInput && (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewLabel}>Current: {currentHeight.display}</Text>
                  {(() => {
                    const newHeightCm = convertToCm(heightInput, unit);
                    if (newHeightCm) {
                      const totalInches = newHeightCm / 2.54;
                      const feet = Math.floor(totalInches / 12);
                      const inches = Math.round(totalInches % 12);
                      const growth = (newHeightCm - currentHeight.cm).toFixed(1);
                      return (
                        <>
                          <Text style={styles.previewLabel}>
                            New: {feet}'{inches}" ({newHeightCm.toFixed(1)} cm)
                          </Text>
                          {parseFloat(growth) !== 0 && (
                            <Text style={[styles.previewLabel, parseFloat(growth) > 0 ? styles.growthPositive : styles.growthNegative]}>
                              {parseFloat(growth) > 0 ? '↑' : '↓'} {Math.abs(parseFloat(growth))} cm
                            </Text>
                          )}
                        </>
                      );
                    }
                    return null;
                  })()}
                </View>
              )}

              {/* Save Button */}
              <TouchableOpacity
                style={[styles.saveButton, updating && styles.saveButtonDisabled]}
                onPress={handleSaveHeight}
                disabled={updating}
              >
                <Text style={styles.saveButtonText}>
                  {updating ? 'Updating...' : 'Update Height'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Celebration Modal */}
      <CelebrationModal
        visible={celebrationVisible}
        onClose={() => setCelebrationVisible(false)}
        title="🎉 Height Updated!"
        message={celebrationMessage}
        showConfetti={true}
        autoClose={true}
        autoCloseDelay={4000}
      />

      {/* Seed Retention Modal */}
      <SeedRetentionModal
        visible={seedRetentionModalVisible}
        onClose={() => setSeedRetentionModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  metricCardWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  metricCard: {
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  metricCardContent: {
    position: 'relative',
  },
  metricLabel: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  metricValue: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metricSubtext: {
    color: '#666666',
    fontSize: 12,
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: 20,
    paddingBottom: 40,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  unitButtonTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputHint: {
    fontSize: 12,
    color: '#666666',
    marginTop: 6,
  },
  previewContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  },
  growthPositive: {
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
  },
  growthNegative: {
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  targetHeightContainer: {
    position: 'relative',
    flex: 1,
  },
  seedRetentionIconButton: {
    position: 'absolute',
    right: -20,
    top: -8,
    zIndex: 10,
  },
  seedRetentionIcon: {
    width: 47,
    height: 47,
    borderRadius: 23.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default HeightMetrics;

