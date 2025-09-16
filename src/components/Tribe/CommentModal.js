import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CommentModal = ({ visible, onClose, onSubmit, loading = false }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    if (!commentText || commentText.trim().length === 0) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    onSubmit(commentText.trim());
    setCommentText('');
  };

  const handleClose = () => {
    setCommentText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Write a Comment</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Comment Input */}
          <View style={styles.commentSection}>
            <ScrollView
              style={styles.inputScroll}
              contentContainerStyle={styles.inputScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Share your thoughts..."
                  placeholderTextColor="#999999"
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  maxLength={500}
                  autoFocus
                  textAlignVertical="top"
                />
              </View>

              {/* Character Count */}
              <View style={styles.footerContainer}>
                <Text style={styles.characterCount}>
                  {commentText.length}/500
                </Text>
              </View>
            </ScrollView>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              (!commentText.trim() || loading) && styles.submitButtonDisabled
            ]}
            disabled={!commentText.trim() || loading}
          >
            <Text style={[
              styles.submitButtonText,
              (!commentText.trim() || loading) && styles.submitButtonTextDisabled
            ]}>
              {loading ? 'Posting...' : 'Post Comment'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    minHeight: 320,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  commentSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flex: 1,
    flexGrow: 1,
    paddingBottom: 12,
  },
  inputScroll: {
    flex: 1,
  },
  inputScrollContent: {
    paddingBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minHeight: 140,
  },
  commentInput: {
    padding: 16,
    fontSize: 16,
    color: '#000000',
    textAlignVertical: 'top',
    minHeight: 140,
    lineHeight: 22,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  characterCount: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
  },
  submitButton: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#E5E5E5',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButtonTextDisabled: {
    color: '#999999',
  },
});

export default CommentModal;
