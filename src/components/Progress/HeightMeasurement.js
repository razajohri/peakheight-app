import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeightGrowthService } from '../../services/heightGrowthService';
import { useTheme } from '../../hooks/useTheme';

const { width } = Dimensions.get('window');

export default function HeightMeasurement({ userId, onMeasurementAdded }) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [heightInput, setHeightInput] = useState('');
  const [measurementType, setMeasurementType] = useState('morning');
  const [notes, setNotes] = useState('');
  const [recentMeasurements, setRecentMeasurements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentMeasurements();
  }, [userId]);

  const loadRecentMeasurements = async () => {
    try {
      const measurements = await HeightGrowthService.getHeightProgress(userId, 7);
      setRecentMeasurements(measurements || []);
    } catch (error) {
      console.error('Error loading measurements:', error);
    }
  };

  const handleAddMeasurement = async () => {
    if (!heightInput || isNaN(parseFloat(heightInput))) {
      Alert.alert('Invalid Input', 'Please enter a valid height in centimeters');
      return;
    }

    const heightCm = parseFloat(heightInput);
    if (heightCm < 100 || heightCm > 250) {
      Alert.alert('Invalid Height', 'Please enter a height between 100-250 cm');
      return;
    }

    setLoading(true);
    try {
      await HeightGrowthService.recordHeightMeasurement(
        userId,
        heightCm,
        measurementType,
        notes
      );

      Alert.alert('Success', 'Height measurement recorded successfully!');
      setModalVisible(false);
      setHeightInput('');
      setNotes('');
      setMeasurementType('morning');

      // Reload measurements
      await loadRecentMeasurements();

      // Notify parent component
      if (onMeasurementAdded) {
        onMeasurementAdded();
      }
    } catch (error) {
      console.error('Error recording measurement:', error);
      Alert.alert('Error', 'Failed to record measurement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProgressMetrics = () => {
    if (recentMeasurements.length < 2) {
      return null;
    }

    return HeightGrowthService.calculateProgressMetrics(recentMeasurements);
  };

  const formatHeight = (heightCm) => {
    const feet = Math.floor(heightCm / 30.48);
    const inches = Math.round((heightCm % 30.48) / 2.54);
    return `${heightCm.toFixed(1)} cm (${feet}'${inches}")`;
  };

  const metrics = getProgressMetrics();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.measurementButton, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="resize" size={20} color={colors.background} />
        <Text style={[styles.buttonText, { color: colors.background }]}>
          Record Height
        </Text>
      </TouchableOpacity>

      {metrics && (
        <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.progressTitle, { color: colors.text }]}>
            Recent Progress
          </Text>
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: colors.primary }]}>
                {metrics.totalGrowth > 0 ? '+' : ''}{metrics.totalGrowth} cm
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Total Growth
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={[styles.metricValue, { color: colors.primary }]}>
                {metrics.weeklyGrowth > 0 ? '+' : ''}{metrics.weeklyGrowth} cm
              </Text>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Weekly Rate
              </Text>
            </View>
          </View>
          <Text style={[styles.trendText, { color: colors.textSecondary }]}>
            Trend: {metrics.trend} • Confidence: {metrics.confidence}
          </Text>
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Record Height Measurement
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Height (cm)
                </Text>
                <TextInput
                  style={[styles.textInput, {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={heightInput}
                  onChangeText={setHeightInput}
                  placeholder="Enter height in centimeters"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Measurement Type
                </Text>
                <View style={styles.typeButtons}>
                  {['morning', 'evening', 'average'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        {
                          backgroundColor: measurementType === type ? colors.primary : colors.surface,
                          borderColor: colors.border
                        }
                      ]}
                      onPress={() => setMeasurementType(type)}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          {
                            color: measurementType === type ? colors.background : colors.text
                          }
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Notes (Optional)
                </Text>
                <TextInput
                  style={[styles.textInput, styles.textArea, {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any additional notes..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {recentMeasurements.length > 0 && (
                <View style={styles.recentMeasurements}>
                  <Text style={[styles.recentTitle, { color: colors.text }]}>
                    Recent Measurements
                  </Text>
                  {recentMeasurements.slice(0, 3).map((measurement, index) => (
                    <View key={index} style={[styles.measurementItem, { backgroundColor: colors.surface }]}>
                      <Text style={[styles.measurementDate, { color: colors.textSecondary }]}>
                        {new Date(measurement.measurement_date).toLocaleDateString()}
                      </Text>
                      <Text style={[styles.measurementHeight, { color: colors.text }]}>
                        {formatHeight(measurement.height_cm)}
                      </Text>
                      <Text style={[styles.measurementType, { color: colors.textSecondary }]}>
                        {measurement.measurement_type}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleAddMeasurement}
                disabled={loading}
              >
                <Text style={[styles.saveButtonText, { color: colors.background }]}>
                  {loading ? 'Saving...' : 'Save Measurement'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  measurementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  progressCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  trendText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
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
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    maxHeight: 400,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentMeasurements: {
    marginTop: 20,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  measurementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  measurementDate: {
    fontSize: 12,
    flex: 1,
  },
  measurementHeight: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  measurementType: {
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
