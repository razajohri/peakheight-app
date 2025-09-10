import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PostComposer = ({
  visible,
  onClose,
  postText,
  setPostText,
  heightTag,
  setHeightTag,
  onPost
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.composerContainer}>
          <View style={styles.composerHeader}>
            <Text style={styles.composerTitle}>Create Post</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.composerInput}
            placeholder="What's on your height journey?"
            placeholderTextColor="#AAAAAA"
            multiline
            maxLength={500}
            value={postText}
            onChangeText={setPostText}
          />

          <View style={styles.composerCounter}>
            <Text style={styles.counterText}>
              {postText.length}/500
            </Text>
          </View>

          <View style={styles.heightTagSelector}>
            <Text style={styles.heightTagLabel}>Height Tag:</Text>
            <TextInput
              style={styles.heightTagInput}
              placeholder="178 cm or #posture"
              placeholderTextColor="#AAAAAA"
              value={heightTag}
              onChangeText={setHeightTag}
            />
          </View>

          <View style={styles.composerActions}>
            <TouchableOpacity style={styles.addPhotoButton}>
              <Icon name="image-outline" size={24} color="#3B5FE3" />
              <Text style={styles.addPhotoText}>Add Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.postButton,
                postText.length < 3 && styles.postButtonDisabled
              ]}
              disabled={postText.length < 3}
              onPress={onPost}
            >
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  composerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  composerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  composerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  cancelButton: {
    fontSize: 16,
    color: '#3B5FE3',
    fontWeight: '600',
  },
  composerInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  composerCounter: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  counterText: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  heightTagSelector: {
    marginBottom: 20,
  },
  heightTagLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  heightTagInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#000000',
  },
  composerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B5FE3',
  },
  addPhotoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#3B5FE3',
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: '#3B5FE3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  postButtonDisabled: {
    backgroundColor: '#AAAAAA',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PostComposer;
