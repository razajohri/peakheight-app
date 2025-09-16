import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const PostComposer = ({
  visible,
  onClose,
  postText,
  setPostText,
  heightTag,
  setHeightTag,
  onPost,
  selectedImages,
  setSelectedImages,
  isUploading
}) => {
  const handleImagePicker = async () => {
    console.log('Image picker button clicked!');

    // Show options for camera or photo library
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Photo Library', onPress: () => openImageLibrary() },
        { text: 'Camera', onPress: () => openCamera() }
      ]
    );
  };

  const openImageLibrary = async () => {
    try {
      // Request permission first
      console.log('Requesting media library permissions...');
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission result:', permissionResult);

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library in Settings to share images.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => {
              console.log('Open app settings');
            }}
          ]
        );
        return;
      }

      console.log('Launching image picker...');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disable editing to avoid cropping interface issues
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        exif: false,
        base64: false,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Selected image URI:', imageUri);
        setSelectedImages([imageUri]);
      } else if (result.canceled) {
        console.log('User cancelled image picker');
      } else {
        console.log('No image selected');
        Alert.alert('Error', 'No image was selected');
      }
    } catch (error) {
      console.error('Error launching image picker:', error);
      Alert.alert('Error', `Failed to open image picker: ${error.message}`);
    }
  };

  const openCamera = async () => {
    try {
      // Request camera permission first
      console.log('Requesting camera permissions...');
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera permission result:', permissionResult);

      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your camera in Settings to take photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => {
              console.log('Open app settings');
            }}
          ]
        );
        return;
      }

      console.log('Launching camera...');

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        exif: false,
        base64: false,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Captured image URI:', imageUri);
        setSelectedImages([imageUri]);
      } else if (result.canceled) {
        console.log('User cancelled camera');
      } else {
        console.log('No image captured');
        Alert.alert('Error', 'No image was captured');
      }
    } catch (error) {
      console.error('Error launching camera:', error);
      Alert.alert('Error', `Failed to open camera: ${error.message}`);
    }
  };

  const removeImage = () => {
    setSelectedImages([]);
  };

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

          {/* Selected Image Preview */}
          {selectedImages.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              <Text style={styles.imagePreviewLabel}>Selected Image:</Text>
              <View style={styles.imagePreview}>
                <Image source={{ uri: selectedImages[0] }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                  <Icon name="close-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.composerActions}>
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={handleImagePicker}
              activeOpacity={0.7}
            >
              <Icon name="image-outline" size={24} color="#000000" />
              <Text style={styles.addPhotoText}>
                {selectedImages.length > 0 ? 'Change Photo' : 'Add Photo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.postButton,
                (postText.length < 3 || isUploading) && styles.postButtonDisabled
              ]}
              disabled={postText.length < 3 || isUploading}
              onPress={onPost}
            >
              <Text style={styles.postButtonText}>
                {isUploading ? 'Posting...' : 'Post'}
              </Text>
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
    color: '#000000',
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
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  addPhotoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  postButtonDisabled: {
    backgroundColor: '#AAAAAA',
    shadowOpacity: 0.1,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    marginBottom: 20,
  },
  imagePreviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  imagePreview: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
});

export default PostComposer;
