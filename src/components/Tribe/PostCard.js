import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PostCard = ({ item, onLike, onSave, onComment, onMore }) => {
  const [expanded, setExpanded] = useState(false);
  const longText = item.text.length > 200;

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

    return date.toLocaleDateString();
  };

  return (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{item.user.name}</Text>
            <Text style={styles.timestamp}>
              {formatTimestamp(item.createdAt)}
            </Text>
          </View>
        </View>
        <View style={styles.heightTagContainer}>
          <Text style={styles.heightTag}>{item.heightTag}</Text>
        </View>
      </View>

      {/* Post Body */}
      <View style={styles.postBody}>
        <Text style={styles.postText}>
          {longText && !expanded
            ? `${item.text.substring(0, 200)}...`
            : item.text}
        </Text>

        {longText && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.readMoreText}>
              {expanded ? 'Read less' : 'Read more'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Images */}
        {item.images.length > 0 && (
          <View style={[
            styles.imageContainer,
            item.images.length === 1 ? styles.singleImageContainer : styles.multipleImagesContainer
          ]}>
            {item.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={[
                  styles.postImage,
                  item.images.length === 1 ? styles.singleImage : styles.gridImage
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Post Footer */}
      <View style={styles.postFooter}>
        <TouchableOpacity
          style={styles.footerAction}
          onPress={() => onLike(item.id)}
        >
          <Icon
            name={item.liked ? 'heart' : 'heart-outline'}
            size={22}
            color={item.liked ? '#FF3B30' : '#666666'}
          />
          <Text style={styles.actionText}>{item.likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerAction}
          onPress={onComment}
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
          onPress={() => onMore(item.id)}
        >
          <Icon name="ellipsis-horizontal" size={20} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* Comments Preview */}
      {item.comments.length > 0 && (
        <View style={styles.commentsPreview}>
          {item.comments.slice(0, 2).map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <Image
                source={{ uri: comment.user.avatar }}
                style={styles.commentAvatar}
              />
              <View style={styles.commentContent}>
                <Text style={styles.commentText}>
                  <Text style={styles.commentUsername}>{comment.user.name}</Text>{' '}
                  {comment.text}
                </Text>
                <Text style={styles.commentTimestamp}>
                  {formatTimestamp(comment.createdAt)}
                </Text>
              </View>
            </View>
          ))}

          {item.commentCount > 2 && (
            <TouchableOpacity onPress={onComment}>
              <Text style={styles.viewAllComments}>
                View all {item.commentCount} comments
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  timestamp: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  heightTagContainer: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heightTag: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  postBody: {
    marginBottom: 12,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
    marginBottom: 12,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B5FE3',
    marginBottom: 12,
  },
  imageContainer: {
    marginTop: 8,
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
    borderTopColor: '#E5E5E5',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666666',
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
    fontSize: 14,
    color: '#000000',
    lineHeight: 18,
  },
  commentUsername: {
    fontWeight: '600',
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 2,
  },
  viewAllComments: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginTop: 4,
  },
});

export default PostCard;
