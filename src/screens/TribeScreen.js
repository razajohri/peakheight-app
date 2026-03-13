import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Dimensions,
  StatusBar,
  Alert,
  Animated,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/UI/Icon';
import TribeHeader from '../components/Tribe/TribeHeader';

// Components
import PostCard from '../components/Tribe/PostCard';
import PostComposer from '../components/Tribe/PostComposer';
import ShareModal from '../components/Tribe/ShareModal';
import CommentModal from '../components/Tribe/CommentModal';
import { LoadingState, ErrorState, EmptyState } from '../components/Tribe/EmptyStates';
import CollapsedComposer from '../components/Tribe/CollapsedComposer';
import PostList from '../components/Tribe/PostList';
import NewMembersCarousel from '../components/Tribe/NewMembersCarousel';

// Services
import { DatabaseService } from '../services/database';
import { RealtimeService } from '../services/realtimeService';
import { ShareService } from '../services/shareService';
import { ImageUploadService } from '../services/imageUploadService';
import { supabase } from '../config/supabase';

// Context
import { useUser } from '../contexts/UserContext';
import StreakModal from '../components/Home/StreakModal';
import StreakFreezeModal from '../components/Home/StreakFreezeModal';
import SeedRetentionModal from '../components/Home/SeedRetentionModal';
import { StreakFreezeService } from '../services/streakFreezeService';
import { SoundService } from '../services/soundService';
import * as Haptics from 'expo-haptics';

const TribeScreen = ({ navigation, onNavigateToProfile }) => {
  const { userProfile, userProgress, fetchUserProfile } = useUser();
  const [posts, setPosts] = useState([]);
  const [joinEvents, setJoinEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [composerVisible, setComposerVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostForComment, setSelectedPostForComment] = useState(null);
  const [selectedCommentForReply, setSelectedCommentForReply] = useState(null);
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [heightTag, setHeightTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isStreakModalVisible, setStreakModalVisible] = useState(false);
  const [isFreezeModalVisible, setFreezeModalVisible] = useState(false);
  const [isSeedRetentionModalVisible, setSeedRetentionModalVisible] = useState(false);
  const [freezeStatus, setFreezeStatus] = useState({ available: false, previousStreak: 0, currentStreak: 0 });

  // Removed scroll animation since header is now fixed
  const screenHeight = Dimensions.get('window').height;
  const flatListRef = useRef(null);

  // Real API call to fetch posts from Supabase
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Fetch all posts (no filtering by type)
      let postType = null;

      // Fetch posts from database
      const { data, error } = await DatabaseService.getCommunityPosts(20, 0, postType);

      if (error) {
        throw new Error(error);
      }

      // Fetch recent join events (last 7 days - increased from 48 hours)
      const { data: joinEventsData, error: joinEventsError } = await DatabaseService.getRecentJoinEvents(10, 168); // 168 hours = 7 days
      if (joinEventsError) {
        console.error('❌ Error fetching join events:', joinEventsError);
        setJoinEvents([]);
      } else {
        console.log('✅ Fetched join events:', joinEventsData?.length || 0, 'events');
        
        // Filter out specific users: Rishi Shah, Vetle, Amani
        const usersToFilter = ['Rishi Shah', 'Vetle', 'Amani'];
        const filteredJoinEvents = (joinEventsData || []).filter(event => {
          let userName = 'Unknown';
          if (event.users?.display_name && event.users.display_name.trim()) {
            userName = event.users.display_name;
          } else if (event.users?.first_name || event.users?.last_name) {
            const fullName = `${event.users.first_name || ''} ${event.users.last_name || ''}`.trim();
            if (fullName) {
              userName = fullName;
            } else if (event.users?.email) {
              userName = event.users.email.split('@')[0];
            }
          } else if (event.users?.email) {
            userName = event.users.email.split('@')[0];
          }
          
          // Check if user name matches any of the filtered names (case-insensitive)
          return !usersToFilter.some(filterName => 
            userName.toLowerCase().includes(filterName.toLowerCase()) || 
            filterName.toLowerCase().includes(userName.toLowerCase())
          );
        });
        
        if (filteredJoinEvents.length > 0) {
          filteredJoinEvents.forEach((e, idx) => {
            const userName = e.users?.display_name || e.users?.first_name || e.users?.email?.split('@')[0] || 'Unknown';
            console.log(`  ${idx + 1}. ${userName} joined at ${e.joined_at}`);
          });
        }
        setJoinEvents(filteredJoinEvents);
      }

      // Transform data to match expected format
      const transformedPosts = (data || []).map(post => {
        // Debug: Log user data for first post
        if (data.indexOf(post) === 0) {
          console.log('🔍 First post user data:', post.users);
          console.log('🔍 User ID:', post.user_id);
          console.log('🔍 Display name:', post.users?.display_name);
          console.log('🔍 First name:', post.users?.first_name);
          console.log('🔍 Last name:', post.users?.last_name);
          console.log('🔍 Email:', post.users?.email);
          console.log('🔍 Comments:', post.comments);
        }
        
        // Construct name: try display_name, then first_name + last_name, then email, finally Anonymous
        let userName = 'Anonymous';
        if (post.users?.display_name && post.users.display_name.trim()) {
          userName = post.users.display_name;
        } else if (post.users?.first_name || post.users?.last_name) {
          const fullName = `${post.users.first_name || ''} ${post.users.last_name || ''}`.trim();
          if (fullName) {
            userName = fullName;
          } else if (post.users?.email) {
            userName = post.users.email.split('@')[0];
          }
        } else if (post.users?.email) {
          userName = post.users.email.split('@')[0];
        }

        // Calculate age from date_of_birth
        const calculateAge = (dateOfBirth) => {
          if (!dateOfBirth) return null;
          const birthDate = new Date(dateOfBirth);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age;
        };

        const userAge = calculateAge(post.users?.date_of_birth);

        // Derive like information robustly so counts never show 0 when likes exist
        const likesFromRelation = Array.isArray(post.post_likes) ? post.post_likes.length : 0;
        let likeCount = typeof post.likes_count === 'number' ? post.likes_count : 0;
        // If the relation has more likes than the counter, trust the relation
        if (likesFromRelation > likeCount) {
          likeCount = likesFromRelation;
        }
        const isLikedByUser = post.post_likes?.some(like => like.user_id === user.id) || false;
        // If this user has liked the post but count is still 0, force at least 1
        if (isLikedByUser && likeCount === 0) {
          likeCount = 1;
        }

        // Transform comments
        const transformedComments = (post.comments || []).map(comment => {
          // Get comment author name
          let commentUserName = 'Anonymous';
          if (comment.users?.display_name && comment.users.display_name.trim()) {
            commentUserName = comment.users.display_name;
          } else if (comment.users?.first_name || comment.users?.last_name) {
            const fullName = `${comment.users.first_name || ''} ${comment.users.last_name || ''}`.trim();
            if (fullName) {
              commentUserName = fullName;
            } else if (comment.users?.email) {
              commentUserName = comment.users.email.split('@')[0];
            }
          } else if (comment.users?.email) {
            commentUserName = comment.users.email.split('@')[0];
          }

          return {
            id: comment.id,
            user: {
              id: comment.user_id,
              name: commentUserName,
              avatar: comment.users?.avatar_url || 'https://via.placeholder.com/40x40/cccccc/666666?text=' + (commentUserName.charAt(0) || 'U'),
            },
            text: comment.content,
            createdAt: new Date(comment.created_at),
            parentCommentId: comment.parent_comment_id || null,
          };
        });

        return {
          id: post.id,
          user: {
            id: post.users?.id || post.user_id,
            name: userName,
            avatar: post.users?.avatar_url || 'https://via.placeholder.com/40x40/cccccc/666666?text=' + (userName.charAt(0) || 'U'),
            age: userAge,
          },
          text: post.content,
          content: post.content,
          type: post.post_type,
          imageUrls: (post.image_urls || []).map(url => ImageUploadService.getImageUrl(url)).filter(url => url !== null),
          images: (post.image_urls || []).map(url => ImageUploadService.getImageUrl(url)).filter(url => url !== null),
          heightData: post.height_data,
          heightTag: post.height_data?.current_height || '5\'10"',
          likeCount,
          commentCount: transformedComments.length,
          createdAt: new Date(post.created_at),
          isLiked: isLikedByUser,
          liked: isLikedByUser,
          saved: post.post_saves?.some(save => save.user_id === user.id) || false,
          comments: transformedComments,
        };
      });

      // Sort posts by latest (newest first)
      const sortedPosts = [...transformedPosts].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Newest first
      });
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

  // Fetch freeze status
  useEffect(() => {
    const fetchFreezeStatus = async () => {
      if (userProfile?.id) {
        const status = await StreakFreezeService.getFreezeStatus(userProfile.id);
        setFreezeStatus(status);
      }
    };
    fetchFreezeStatus();
  }, [userProfile?.id]);

  // Set up real-time subscriptions
  useEffect(() => {
    let communitySubscription;
    let joinEventsSubscription;

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

        // Subscribe to join events
        joinEventsSubscription = RealtimeService.subscribeToJoinEvents((payload) => {
          console.log('Join event update:', payload);
          // Refresh join events when new ones are added
          if (payload.eventType === 'INSERT') {
            // Refresh join events
            DatabaseService.getRecentJoinEvents(10, 168).then(({ data, error }) => {
              if (!error && data) {
                // Filter out specific users: Rishi Shah, Vetle, Amani
                const usersToFilter = ['Rishi Shah', 'Vetle', 'Amani'];
                const filteredJoinEvents = (data || []).filter(event => {
                  let userName = 'Unknown';
                  if (event.users?.display_name && event.users.display_name.trim()) {
                    userName = event.users.display_name;
                  } else if (event.users?.first_name || event.users?.last_name) {
                    const fullName = `${event.users.first_name || ''} ${event.users.last_name || ''}`.trim();
                    if (fullName) {
                      userName = fullName;
                    } else if (event.users?.email) {
                      userName = event.users.email.split('@')[0];
                    }
                  } else if (event.users?.email) {
                    userName = event.users.email.split('@')[0];
                  }
                  
                  // Check if user name matches any of the filtered names (case-insensitive)
                  return !usersToFilter.some(filterName => 
                    userName.toLowerCase().includes(filterName.toLowerCase()) || 
                    filterName.toLowerCase().includes(userName.toLowerCase())
                  );
                });
                console.log('✅ Real-time: Updated join events:', filteredJoinEvents.length);
                setJoinEvents(filteredJoinEvents);
              } else {
                console.error('❌ Real-time: Error refreshing join events:', error);
              }
            });
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
      if (joinEventsSubscription) {
        joinEventsSubscription.unsubscribe();
      }
    };
  }, []);

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

    // Optimistically update UI (never allow negative like counts)
    setPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post.id === postId) {
          const newLiked = !post.liked;
          return {
            ...post,
            liked: newLiked,
            likeCount: newLiked
              ? post.likeCount + 1
              : Math.max(0, post.likeCount - 1),
          };
        }
        return post;
      });
    });

    // Save to database (keep optimistic UI even if this fails)
    try {
      const { error } = await DatabaseService.togglePostLike(userProfile.id, postId);
      if (error) {
        console.error('Error toggling like:', error);
        // Do NOT revert optimistic UI; just notify user that sync failed
        Alert.alert('Network issue', 'Your like is saved locally, but syncing to the server failed. It will retry later.');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Keep optimistic UI state; only show a message
      Alert.alert('Network issue', 'Your like is saved locally, but syncing to the server failed. Please try again later.');
    }
  };

  // Handle save
  const handleSave = async (postId) => {
    if (!userProfile?.id) {
      Alert.alert('Error', 'Please log in to save posts');
      return;
    }

    // Optimistically update UI
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          saved: !post.saved
        };
      }
      return post;
    }));

    // Save to database
    try {
      const { error } = await DatabaseService.togglePostSave(userProfile.id, postId);
      if (error) {
        console.error('Error toggling save:', error);
        // Revert optimistic update on error
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              saved: !post.saved
            };
          }
          return post;
        }));
        Alert.alert('Error', 'Failed to update save. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      // Revert optimistic update on error
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            saved: !post.saved
          };
        }
        return post;
      }));
    }
  };

  // State for modal mode
  const [commentModalMode, setCommentModalMode] = useState('add');

  // Handle comment - for adding comments (comment icon click)
  const handleComment = (postId) => {
    if (!userProfile?.id) {
      Alert.alert('Error', 'Please log in to comment on posts');
      return;
    }

    setSelectedPostForComment(postId);
    setCommentModalMode('add');
    setCommentModalVisible(true);
  };

  // Handle view comments - for viewing all comments ("View all" link)
  const handleViewComments = (postId) => {
    if (!userProfile?.id) {
      Alert.alert('Error', 'Please log in to view comments');
      return;
    }

    // Find the post to get its comments
    const post = posts.find(p => p.id === postId);
    
    setSelectedPostForComment(postId);
    setSelectedPost(post);
    setCommentModalMode('view');
    setCommentModalVisible(true);
  };

  const handleCommentSubmit = async (commentText, parentCommentId = null) => {
    try {
      console.log('🔷 Submitting comment:', {
        userId: userProfile.id,
        postId: selectedPostForComment,
        parentCommentId: parentCommentId,
        commentText: commentText.substring(0, 50)
      });

      const { data, error } = await DatabaseService.addComment(
        userProfile.id,
        selectedPostForComment,
        commentText,
        parentCommentId
      );

      if (error) {
        console.error('❌ Error adding comment:', error);
        Alert.alert('Error', `Failed to add comment: ${error}`);
        return;
      }

      console.log('✅ Comment added successfully:', data);

      // Close modal first
      setCommentModalVisible(false);
      setSelectedPostForComment(null);
      setSelectedCommentForReply(null);

      // Then refresh posts to show new comment
      await fetchPosts();
      
      // Show success message after refresh
      Alert.alert('Success', parentCommentId ? 'Reply added successfully!' : 'Comment added successfully!');
    } catch (error) {
      console.error('❌ Exception adding comment:', error);
      Alert.alert('Error', `Failed to add comment: ${error.message || error}`);
    }
  };

  const closeCommentModal = () => {
    setCommentModalVisible(false);
    setSelectedPostForComment(null);
    setSelectedCommentForReply(null);
  };

  // Handle reply to comment
  const handleReplyToComment = (commentId) => {
    if (commentId === null) {
      // Clear reply selection
      setSelectedCommentForReply(null);
      return;
    }
    if (!userProfile?.id) {
      Alert.alert('Error', 'Please log in to reply to comments');
      return;
    }
    setSelectedCommentForReply(commentId);
    setCommentModalMode('add');
    // If modal is not visible, open it; if it's already open in view mode, it will switch to add mode
    if (!commentModalVisible) {
      setCommentModalVisible(true);
    }
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
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA', '#F1F3F4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
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
        onStreak={async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          await SoundService.playStreakSound();
          setStreakModalVisible(true);
        }}
        onShield={async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setSeedRetentionModalVisible(true);
        }}
      />

      {/* New members carousel (story-style circles) */}
      <NewMembersCarousel joinEvents={joinEvents} />

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
        onViewComments={handleViewComments}
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
        existingComments={selectedPost?.comments || []}
        viewMode={commentModalMode}
        onReply={handleReplyToComment}
        selectedCommentForReply={selectedCommentForReply}
        onSwitchToAddMode={() => {
          setSelectedCommentForReply(null);
          setCommentModalMode('add');
        }}
      />

      {/* Streak Modal */}
      <StreakModal
        visible={isStreakModalVisible}
        onClose={() => setStreakModalVisible(false)}
        userProgress={userProgress}
        freezeStatus={freezeStatus}
        onUseFreeze={() => {
          setStreakModalVisible(false);
          setFreezeModalVisible(true);
        }}
      />

      {/* Streak Freeze Modal */}
      <StreakFreezeModal
        visible={isFreezeModalVisible}
        onClose={() => setFreezeModalVisible(false)}
        previousStreak={freezeStatus.previousStreak}
        onRestore={async () => {
          if (userProfile?.id) {
            const result = await StreakFreezeService.useStreakFreeze(userProfile.id);
            if (result.success) {
              await fetchUserProfile(userProfile.id);
              setFreezeModalVisible(false);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert(
                '❄️ Streak Restored!',
                `Your streak of ${result.restoredStreak} days has been restored! Keep up the amazing work! 🔥`
              );
            } else {
              Alert.alert('Error', result.error || 'Failed to restore streak. Please try again.');
            }
          }
        }}
      />

      {/* Seed Retention Modal */}
      <SeedRetentionModal
        visible={isSeedRetentionModalVisible}
        onClose={() => setSeedRetentionModalVisible(false)}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 4,
    paddingBottom: 8,
  },
  backButton: {
    padding: 2,
  },
  headerTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  collapsedComposer: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 10,
    borderRadius: 21,
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});

export default TribeScreen;
