import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Image, Alert, ScrollView, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import Icon from '../UI/Icon';
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

    // Pre-check permissions to avoid app exit on iOS
    const mediaPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    const cameraPermission = await ImagePicker.getCameraPermissionsAsync();
    
    console.log('Current permissions:', { 
      media: mediaPermission.status, 
      camera: cameraPermission.status 
    });

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
      // Check current permission status
      const { status: currentStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
      console.log('Current media library permission:', currentStatus);

      let finalStatus = currentStatus;

      // Request permission if not already granted
      if (currentStatus !== 'granted') {
        console.log('Requesting media library permissions...');
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        finalStatus = status;
        console.log('Permission result:', finalStatus);
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library in Settings to share images.',
          [{ text: 'OK' }]
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
        // Force JPEG output for better compatibility (converts HEIC automatically)
        allowsMultipleSelection: false,
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
      // Check current permission status
      const { status: currentStatus } = await ImagePicker.getCameraPermissionsAsync();
      console.log('Current camera permission:', currentStatus);

      let finalStatus = currentStatus;

      // Request permission if not already granted
      if (currentStatus !== 'granted') {
        console.log('Requesting camera permissions...');
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        finalStatus = status;
        console.log('Camera permission result:', finalStatus);
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your camera in Settings to take photos.',
          [{ text: 'OK' }]
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
        // Force JPEG output for better compatibility
        allowsMultipleSelection: false,
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

  const handleHeightTagChange = (text) => {
    // Check if the text contains any non-numeric characters (except periods)
    const hasInvalidChars = /[^0-9.]/.test(text);
    
    if (hasInvalidChars) {
      // Show alert if user tries to enter words or invalid characters
      Alert.alert('Invalid Input', 'Please enter only numbers and periods (.)');
      // Filter out invalid characters
      const filteredText = text.replace(/[^0-9.]/g, '');
      setHeightTag(filteredText);
    } else {
      // Only allow numbers and periods (dots)
      setHeightTag(text);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 20}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.composerContainer}>
          <View style={styles.composerHeader}>
            <Text style={styles.composerTitle}>Create Post</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.composerScrollView}
            contentContainerStyle={styles.composerScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
            nestedScrollEnabled={true}
          >
            <TextInput
            style={styles.composerInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#AAAAAA"
            multiline
            maxLength={500}
            value={postText}
            onChangeText={setPostText}
            blurOnSubmit={true}
            onSubmitEditing={() => Keyboard.dismiss()}
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
              placeholder="178.5"
              placeholderTextColor="#AAAAAA"
              value={heightTag}
              onChangeText={handleHeightTagChange}
              keyboardType="decimal-pad"
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
          </ScrollView>
        </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  composerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  composerScrollView: {
    flexGrow: 1,
  },
  composerScrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
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
