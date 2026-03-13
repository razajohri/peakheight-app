import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from '../UI/Icon';

const FeedbackModal = ({ visible, onClose, onSubmit, loading = false }) => {
  const [feedbackType, setFeedbackType] = useState('general_feedback');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const feedbackTypes = [
    { id: 'feature_request', label: 'Feature Request', icon: 'bulb-outline' },
    { id: 'bug_report', label: 'Bug Report', icon: 'bug-outline' },
    { id: 'general_feedback', label: 'General Feedback', icon: 'chatbubble-outline' },
    { id: 'app_improvement', label: 'App Improvement', icon: 'construct-outline' },
  ];

  const handleSubmit = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your feedback message');
      return;
    }

    if (message.trim().length < 10) {
      Alert.alert('Error', 'Please provide more details (at least 10 characters)');
      return;
    }

    onSubmit({
      feedbackType,
      title: title.trim() || null,
      message: message.trim(),
    });

    // Reset form
    setTitle('');
    setMessage('');
    setFeedbackType('general_feedback');
  };

  const handleClose = () => {
    setTitle('');
    setMessage('');
    setFeedbackType('general_feedback');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <SafeAreaView style={styles.safeAreaContainer} edges={['bottom']}>
          <View style={styles.modalContainer}>
            {/* Drag Handle */}
            <View style={styles.dragHandle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Feedback</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeIconButton}>
                <Icon name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
            >
              {/* Feedback Type Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>What would you like to share?</Text>
                <View style={styles.typeContainer}>
                  {feedbackTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[
                        styles.typeButton,
                        feedbackType === type.id && styles.typeButtonActive,
                      ]}
                      onPress={() => setFeedbackType(type.id)}
                    >
                      <Icon
                        name={type.icon}
                        size={20}
                        color={feedbackType === type.id ? '#FFFFFF' : '#666666'}
                      />
                      <Text
                        style={[
                          styles.typeButtonText,
                          feedbackType === type.id && styles.typeButtonTextActive,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Title Input (Optional) */}
              <View style={styles.section}>
                <Text style={styles.label}>Title (Optional)</Text>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Brief summary of your feedback"
                  placeholderTextColor="#999999"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                  returnKeyType="next"
                />
              </View>

              {/* Message Input */}
              <View style={styles.section}>
                <Text style={styles.label}>
                  Your Feedback <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Tell us what's on your mind... Share your ideas, report issues, or suggest improvements."
                  placeholderTextColor="#999999"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={8}
                  maxLength={1000}
                  textAlignVertical="top"
                  autoFocus={false}
                />
                <Text style={styles.charCount}>
                  {message.length}/1000
                </Text>
              </View>
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={[
                  styles.submitButton,
                  (!message.trim() || loading || message.trim().length < 10) &&
                    styles.submitButtonDisabled,
                ]}
                disabled={!message.trim() || loading || message.trim().length < 10}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Icon name="send" size={18} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Send Feedback</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeAreaContainer: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  closeIconButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    gap: 6,
  },
  typeButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  titleInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    height: 50,
  },
  messageInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#000000',
    minHeight: 150,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    height: 150,
  },
  charCount: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5E5',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default FeedbackModal;

