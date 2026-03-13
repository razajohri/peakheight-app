import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';

const PostCard = ({ item, onLike, onSave, onComment, onViewComments, onMore, onShare }) => {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [likeAnimation] = useState(new Animated.Value(1));
  const longText = item.text && item.text.length > 200;
  
  // Filter out invalid image URLs (local file paths that won't work)
  const validImages = (item.images || []).filter(image => {
    // Skip local file paths that won't work
    if (image && image.startsWith('file:///var/mobile')) {
      return false;
    }
    return image && image.trim().length > 0;
  });

  // Post type configuration
  const getPostTypeConfig = (type) => {
    const configs = {
      progress: { color: '#4CAF50', icon: 'trending-up', label: 'Progress' },
      tip: { color: '#FF9800', icon: 'bulb', label: 'Tip' },
      question: { color: '#2196F3', icon: 'help-circle', label: 'Question' },
      motivation: { color: '#E91E63', icon: 'heart', label: 'Motivation' }
    };
    return configs[type] || { color: '#666666', icon: 'document', label: 'Post' };
  };

  const postTypeConfig = getPostTypeConfig(item.type);

  // Profile Avatar Component with fallback
  const ProfileAvatar = ({ source, name, style }) => {
    if (imageError || !source || source.includes('placeholder')) {
      // Show user's initial instead of icon
      const initial = name ? name.charAt(0).toUpperCase() : '?';
      return (
        <View style={[style, { backgroundColor: '#3B5FE3', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>
            {initial}
          </Text>
        </View>
      );
    }

    return (
      <Image
        source={{ uri: source }}
        style={style}
        onError={() => setImageError(true)}
      />
    );
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;

    // Use manual date formatting instead of toLocaleDateString
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Handle like with animation
  const handleLike = () => {
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onLike(item.id);
  };

  return (
    <LinearGradient
      colors={["#F8FAFC", "#E2E8F0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.postCard}
    >
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <ProfileAvatar source={item.user.avatar} name={item.user.name} style={styles.avatar} />
          <View style={styles.userInfo}>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>{item.user.name}</Text>
              {item.user.age !== null && item.user.age !== undefined && (
                <Text style={styles.userAge}> • {item.user.age}</Text>
              )}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.timestamp}>
                {formatTimestamp(item.createdAt)}
              </Text>
              {item.heightTag && (
                <View style={styles.heightTagContainer}>
                  <Text style={styles.heightTag}>{item.heightTag}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Post Body */}
      <View style={styles.postBody}>
        {item.text && (
          <Text style={styles.postText}>
            {longText && !expanded
              ? `${item.text.substring(0, 200)}...`
              : item.text}
          </Text>
        )}

        {longText && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.readMoreText}>
              {expanded ? 'Read less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Images */}
        {validImages.length > 0 && (
          <View style={[
            styles.imageContainer,
            validImages.length === 1 ? styles.singleImageContainer : styles.multipleImagesContainer
          ]}>
            {validImages.map((image, index) => {
              // Skip if this image already failed to load
              if (imageErrors[index]) return null;
              
              return (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={[
                    styles.postImage,
                    validImages.length === 1 ? styles.singleImage : styles.gridImage
                  ]}
                  onError={() => {
                    setImageErrors(prev => ({ ...prev, [index]: true }));
                  }}
                />
              );
            })}
          </View>
        )}
      </View>

      {/* Post Footer */}
      <View style={styles.postFooter}>
        <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
          <TouchableOpacity
            style={styles.footerAction}
            onPress={handleLike}
            activeOpacity={0.7}
          >
            <Icon
              name={item.liked ? 'heart' : 'heart-outline'}
              size={22}
              color={item.liked ? '#FF3B30' : '#666666'}
            />
            <Text style={[styles.actionText, item.liked && styles.likedText]}>{item.likeCount}</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={styles.footerAction}
          onPress={() => onComment(item.id)}
        >
          <Icon name="chatbubble-outline" size={20} color="#666666" />
          <Text style={styles.actionText}>{item.commentCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerAction}
          onPress={() => onSave(item.id)}
        >
          <Icon
            name={item.saved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={item.saved ? '#3B5FE3' : '#666666'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerAction}
          onPress={() => onShare && onShare(item)}
        >
          <Icon name="share-outline" size={20} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* View all comments link */}
      {item.commentCount > 0 && (
        <TouchableOpacity onPress={() => onViewComments(item.id)} style={styles.viewAllCommentsContainer}>
          <Text style={styles.viewAllComments}>
            View all {item.commentCount} comment{item.commentCount !== 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  postCard: {
    // Match the light, premium gradient feel of the MAIN GROWTH FACTORS card
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 0,
    overflow: 'hidden',
  },
  userInfo: {
    flex: 1,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  userAge: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  postTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  postTypeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heightTagContainer: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    marginLeft: 8,
  },
  heightTag: {
    fontSize: 10,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  postBody: {
    marginBottom: 0,
  },
  postText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#111827',
    marginBottom: 0,
    fontWeight: '400',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 10,
  },
  imageContainer: {
    marginTop: 12,
  },
  singleImageContainer: {
    height: 200,
  },
  multipleImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  postImage: {
    borderRadius: 12,
  },
  singleImage: {
    width: '100%',
    height: '100%',
  },
  gridImage: {
    width: '49%',
    height: 120,
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 12,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(15,23,42,0.05)',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  likedText: {
    color: '#FB7185',
    fontWeight: '600',
  },
  commentsPreview: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentText: {
    fontSize: 13,
    color: '#111827',
    lineHeight: 18,
  },
  commentUsername: {
    fontWeight: '600',
  },
  commentTimestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  viewAllCommentsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewAllComments: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6',
  },
});

export default PostCard;
