import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Dimensions,
  StatusBar,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TribeHeader from '../components/Tribe/TribeHeader';
import FilterBar from '../components/Tribe/FilterBar';

// Components
import PostCard from '../components/Tribe/PostCard';
import PostComposer from '../components/Tribe/PostComposer';
import ShareModal from '../components/Tribe/ShareModal';
import CommentModal from '../components/Tribe/CommentModal';
import { LoadingState, ErrorState, EmptyState } from '../components/Tribe/EmptyStates';
import CollapsedComposer from '../components/Tribe/CollapsedComposer';
import PostList from '../components/Tribe/PostList';

// Services
import { DatabaseService } from '../services/database';
import { RealtimeService } from '../services/realtimeService';
import { ShareService } from '../services/shareService';
import { supabase } from '../config/supabase';

// Context
import { useUser } from '../contexts/UserContext';

const TribeScreen = ({ navigation, onNavigateToProfile }) => {
  const { userProfile } = useUser();
  const [filter, setFilter] = useState('Latest');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [composerVisible, setComposerVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostForComment, setSelectedPostForComment] = useState(null);
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [heightTag, setHeightTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Removed scroll animation since header is now fixed
  const screenHeight = Dimensions.get('window').height;
  const flatListRef = useRef(null);

  // Real API call to fetch posts from Supabase
  const fetchPosts = async (filterType = filter) => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Map filter to post type (only for content filters, not sorting filters)
      let postType = null;
      if (filterType === 'Progress') postType = 'progress';
      else if (filterType === 'Questions') postType = 'question';
      else if (filterType === 'Tips') postType = 'tip';
      // For 'Latest', 'Most Popular', 'Oldest' - fetch all posts (postType remains null)

      // Fetch posts from database
      const { data, error } = await DatabaseService.getCommunityPosts(20, 0, postType);

      if (error) {
        throw new Error(error);
      }

      // Transform data to match expected format
      const transformedPosts = (data || []).map(post => ({
        id: post.id,
        user: {
          id: post.users?.id || post.user_id,
          name: post.users?.display_name || 'Anonymous',
          avatar: post.users?.avatar_url || 'https://via.placeholder.com/40x40/cccccc/666666?text=' + (post.users?.display_name?.charAt(0) || 'U'),
        },
        text: post.content,
        content: post.content,
        type: post.post_type,
        imageUrls: post.image_urls || [],
        images: post.image_urls || [],
        heightData: post.height_data,
        heightTag: post.height_data?.current_height || '5\'10"',
        likeCount: post.likes_count || 0,
        commentCount: post.comments_count || 0,
        createdAt: new Date(post.created_at),
        isLiked: post.post_likes?.some(like => like.user_id === user.id) || false,
        liked: post.post_likes?.some(like => like.user_id === user.id) || false,
        saved: false,
        comments: [],
      }));

      // Sort based on filter
      let sortedPosts = [...transformedPosts];

      switch (filterType) {
        case 'Latest':
          sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'Most Popular':
          sortedPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
          break;
        case 'Oldest':
          sortedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        default:
          // Default to Latest if filter not recognized
          sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }

      setPosts(sortedPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    let communitySubscription;

    const setupRealtime = async () => {
      try {
        // Subscribe to community updates
        communitySubscription = RealtimeService.subscribeToCommunityUpdates((payload) => {
          console.log('Community update:', payload);
          // Refresh posts when new ones are added
          if (payload.eventType === 'INSERT') {
            fetchPosts();
          }
        });
      } catch (error) {
        console.error('Error setting up real-time:', error);
      }
    };

    setupRealtime();

    return () => {
      if (communitySubscription) {
        communitySubscription.unsubscribe();
      }
    };
  }, []);

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    fetchPosts(newFilter);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  // Handle like
  const handleLike = async (postId) => {
    if (!userProfile?.id) {
      Alert.alert('Error', 'Please log in to like posts');
      return;
    }

    // Optimistically update UI
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLiked = !post.liked;
        return {
          ...post,
          liked: newLiked,
          likeCount: newLiked ? post.likeCount + 1 : post.likeCount - 1
        };
      }
      return post;
    }));

    // Save to database
    try {
      const { error } = await DatabaseService.togglePostLike(userProfile.id, postId);
      if (error) {
        console.error('Error toggling like:', error);
        // Revert optimistic update on error
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              liked: !post.liked,
              likeCount: !post.liked ? post.likeCount + 1 : post.likeCount - 1
            };
          }
          return post;
        }));
        Alert.alert('Error', 'Failed to update like. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likeCount: !post.liked ? post.likeCount + 1 : post.likeCount - 1
          };
        }
        return post;
      }));
      Alert.alert('Error', 'Failed to update like. Please try again.');
    }
  };

  // Handle save
  const handleSave = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          saved: !post.saved
        };
      }
      return post;
    }));
  };

  // Handle comment
  const handleComment = (postId) => {
    if (!userProfile?.id) {
      Alert.alert('Error', 'Please log in to comment on posts');
      return;
    }

    setSelectedPostForComment(postId);
    setCommentModalVisible(true);
  };

  const handleCommentSubmit = async (commentText) => {
    try {
      const { error } = await DatabaseService.addComment(
        userProfile.id,
        selectedPostForComment,
        commentText
      );

      if (error) {
        console.error('Error adding comment:', error);
        Alert.alert('Error', 'Failed to add comment. Please try again.');
        return;
      }

      // Refresh posts to show new comment
      fetchPosts();
      setCommentModalVisible(false);
      setSelectedPostForComment(null);
      Alert.alert('Success', 'Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    }
  };

  const closeCommentModal = () => {
    setCommentModalVisible(false);
    setSelectedPostForComment(null);
  };

  // Handle more options
  const handleMore = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    Alert.alert(
      'Post Options',
      'Choose an action',
      [
        {
          text: 'Share to Facebook',
          onPress: () => handleShare(post, 'facebook')
        },
        {
          text: 'Share to Instagram',
          onPress: () => handleShare(post, 'instagram')
        },
        {
          text: 'Share to WhatsApp',
          onPress: () => handleShare(post, 'whatsapp')
        },
        {
          text: 'Share to Other Apps',
          onPress: () => handleShare(post, 'general')
        },
        {
          text: 'Report',
          onPress: () => Alert.alert('Thanks for keeping Tribe safe'),
          style: 'destructive'
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  // Handle sharing
  const handleShare = async (post, platform = 'general') => {
    try {
      let result;

      if (platform === 'general') {
        result = await ShareService.sharePost(post);
      } else {
        result = await ShareService.shareToPlatform(post, platform);
      }

      if (result.success) {
        Alert.alert('Success', 'Post shared successfully!');
      } else if (result.error !== 'User cancelled sharing') {
        Alert.alert('Error', `Failed to share: ${result.error}`);
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share post. Please try again.');
    }
  };

  // Handle share modal
  const handleShareModal = (post) => {
    setSelectedPost(post);
    setShareModalVisible(true);
  };

  const closeShareModal = () => {
    setShareModalVisible(false);
    setSelectedPost(null);
  };

  // Handle post submission
  const handlePost = async () => {
    if (postText.length < 3) return;

    try {
      setIsUploading(true);
      console.log('Starting post creation...');

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('User auth result:', { user: user?.id, error: userError });

      if (userError || !user) {
        Alert.alert('Error', 'You must be logged in to post');
        return;
      }

      // Create post data
      const postData = {
        content: postText,
        postType: 'motivation', // Default type, could be made selectable
        imageUrls: selectedImages,
        heightData: heightTag ? { current_height: heightTag } : null,
        isPublic: true,
      };

      console.log('Creating post with data:', { userId: user.id, postData });

      // Create post in database
      const { data, error } = await DatabaseService.createPost(user.id, postData);

      console.log('Post creation result:', { data, error });

      if (error) {
        throw new Error(error);
      }

      // Refresh posts to show the new one
      await fetchPosts();

      // Reset composer
      setPostText('');
      setSelectedImages([]);
      setHeightTag('');
      setComposerVisible(false);

      // Show success message
      Alert.alert('Success', 'Posted to Tribe!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', `Failed to create post: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle notifications
  const handleNotifications = () => {
    Alert.alert('Coming Soon', 'Notifications coming soon!');
  };

  // Render post item moved to PostList component

  // Header is now fixed/sticky - no animation

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <TribeHeader
        styles={styles}
        onBack={() => {
          if (navigation && navigation.navigate) {
            navigation.navigate('home');
          } else if (navigation && navigation.goBack) {
            navigation.goBack();
          }
        }}
        onSettings={() => {
          if (typeof onNavigateToProfile === 'function') {
            onNavigateToProfile();
          } else if (navigation && navigation.navigate) {
            navigation.navigate('profile');
          }
        }}
      />

      <FilterBar styles={styles} filter={filter} onChange={handleFilterChange} />

      {/* Collapsed Composer */}
      <CollapsedComposer styles={styles} onOpen={() => setComposerVisible(true)} />

      {/* Post List */}
      <PostList
        styles={styles}
        posts={posts}
        loading={loading}
        error={error}
        refreshing={refreshing}
        screenHeight={screenHeight}
        flatListRef={flatListRef}
        onRefresh={handleRefresh}
        onLike={handleLike}
        onSave={handleSave}
        onComment={handleComment}
        onMore={handleMore}
        onShare={handleShareModal}
      />

      {/* Composer Modal */}
      <PostComposer
        visible={composerVisible}
        onClose={() => setComposerVisible(false)}
        postText={postText}
        setPostText={setPostText}
        heightTag={heightTag}
        setHeightTag={setHeightTag}
        onPost={handlePost}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        isUploading={isUploading}
      />

      {/* Share Modal */}
      <ShareModal
        visible={shareModalVisible}
        onClose={closeShareModal}
        post={selectedPost}
      />

      {/* Comment Modal */}
      <CommentModal
        visible={commentModalVisible}
        onClose={closeCommentModal}
        onSubmit={handleCommentSubmit}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  filterButton: {
    padding: 4,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#000000',
  },
  filterChipText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  collapsedComposer: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  collapsedComposerText: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  postList: {
    paddingHorizontal: 16,
  },
});

export default TribeScreen;
