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

// Components
import PostCard from '../components/Tribe/PostCard';
import PostComposer from '../components/Tribe/PostComposer';
import { LoadingState, ErrorState, EmptyState } from '../components/Tribe/EmptyStates';

// Data
import { MOCK_POSTS } from '../data/mockPosts';

const TribeScreen = ({ navigation }) => {
  const [filter, setFilter] = useState('Latest');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [composerVisible, setComposerVisible] = useState(false);
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [heightTag, setHeightTag] = useState('');

  // Removed scroll animation since header is now fixed
  const screenHeight = Dimensions.get('window').height;
  const flatListRef = useRef(null);

  // Simulated API call to fetch posts
  const fetchPosts = async (filterType = filter) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate random error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Failed to load posts. Please try again.');
      }

      let sortedPosts = [...MOCK_POSTS];

      // Sort based on filter
      switch (filterType) {
        case 'Latest':
          sortedPosts.sort((a, b) => b.createdAt - a.createdAt);
          break;
        case 'Most Popular':
          sortedPosts.sort((a, b) => b.likeCount - a.likeCount);
          break;
        case 'Oldest':
          sortedPosts.sort((a, b) => a.createdAt - b.createdAt);
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
  const handleLike = (postId) => {
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
  const handleComment = () => {
    Alert.alert('Coming Soon', 'Comments feature coming soon!');
  };

  // Handle more options
  const handleMore = (postId) => {
    Alert.alert(
      'Post Options',
      'Choose an action',
      [
        {
          text: 'Report',
          onPress: () => Alert.alert('Thanks for keeping Tribe safe'),
          style: 'destructive'
        },
        {
          text: 'Share',
          onPress: () => Alert.alert('Share feature coming soon!')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  // Handle post submission
  const handlePost = () => {
    if (postText.length < 3) return;

    // Create new post
    const newPost = {
      id: Date.now().toString(),
      user: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      createdAt: new Date(),
      text: postText,
      heightTag: heightTag || '178 cm',
      likeCount: 0,
      commentCount: 0,
      liked: false,
      saved: false,
      images: selectedImages,
      comments: []
    };

    // Add to posts (optimistic update)
    setPosts([newPost, ...posts]);

    // Reset composer
    setPostText('');
    setSelectedImages([]);
    setHeightTag('');
    setComposerVisible(false);

    // Show success toast
    Alert.alert('Posted to Tribe');
  };

  // Handle notifications
  const handleNotifications = () => {
    Alert.alert('Coming Soon', 'Notifications coming soon!');
  };

  // Render post item
  const renderPostItem = ({ item }) => (
    <PostCard
      item={item}
      onLike={handleLike}
      onSave={handleSave}
      onComment={handleComment}
      onMore={handleMore}
    />
  );

  // Render empty state
  const renderEmptyState = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} onRetry={() => fetchPosts()} />;
    if (posts.length === 0) return <EmptyState onCreatePost={() => setComposerVisible(true)} />;
    return null;
  };

  // Header is now fixed/sticky - no animation

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation && navigation.goBack && navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TRIBE</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleNotifications}
        >
          <Icon name="settings-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        {['Latest', 'Most Popular', 'Oldest'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterChip,
              filter === item && styles.filterChipActive
            ]}
            onPress={() => handleFilterChange(item)}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === item && styles.filterChipTextActive
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Collapsed Composer */}
      <TouchableOpacity
        style={styles.collapsedComposer}
        onPress={() => setComposerVisible(true)}
      >
        <Text style={styles.collapsedComposerText}>
          What's on your height journey?
        </Text>
      </TouchableOpacity>

      {/* Post List */}
      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        contentContainerStyle={[
          styles.postList,
          { paddingBottom: screenHeight > 800 ? 120 : screenHeight > 650 ? 80 : 40 }
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3B5FE3"
          />
        }
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
      />

      {/* Floating Action Button for Chat */}
      <TouchableOpacity style={styles.fabButton}>
        <View style={styles.fabGradient}>
          <Icon name="chatbubble" size={24} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
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
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 60,
    alignItems: 'center',
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default TribeScreen;
