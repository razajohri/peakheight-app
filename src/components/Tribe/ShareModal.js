import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import Icon from '../UI/Icon';
import { ShareService } from '../../services/shareService';

const ShareModal = ({ visible, onClose, post }) => {
  if (!post) return null;

  const shareOptions = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'logo-facebook',
      color: '#1877F2',
      onPress: () => handleShare('facebook')
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'logo-instagram',
      color: '#E4405F',
      onPress: () => handleShare('instagram')
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
      onPress: () => handleShare('whatsapp')
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: 'logo-twitter',
      color: '#1DA1F2',
      onPress: () => handleShare('twitter')
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'logo-linkedin',
      color: '#0077B5',
      onPress: () => handleShare('linkedin')
    },
    {
      id: 'general',
      name: 'More Apps',
      icon: 'share-outline',
      color: '#666666',
      onPress: () => handleShare('general')
    }
  ];

  const handleShare = async (platform) => {
    try {
      let result;

      if (platform === 'general') {
        result = await ShareService.sharePost(post);
      } else {
        result = await ShareService.shareToPlatform(post, platform);
      }

      onClose(); // Close modal first

      if (result.success) {
        Alert.alert('Success', 'Post shared successfully!');
      } else if (result.error !== 'User cancelled sharing') {
        Alert.alert('Error', `Failed to share: ${result.error}`);
      }
    } catch (error) {
      console.error('Share error:', error);
      onClose();
      Alert.alert('Error', 'Failed to share post. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Share Post</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          <View style={styles.shareOptions}>
            {shareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.shareOption}
                onPress={option.onPress}
              >
                <View style={[styles.shareIconContainer, { backgroundColor: option.color }]}>
                  <Icon name={option.icon} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.shareOptionText}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.postPreview}>
            <Text style={styles.previewTitle}>Preview:</Text>
            <View style={styles.previewContent}>
              <Text style={styles.previewText} numberOfLines={3}>
                {post.text}
              </Text>
              <Text style={styles.previewAuthor}>
                - {post.user.name}
              </Text>
            </View>
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
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
  },
  shareOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  shareOption: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  shareIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
  },
  postPreview: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 20,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  previewContent: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 8,
  },
  previewAuthor: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
});

export default ShareModal;
