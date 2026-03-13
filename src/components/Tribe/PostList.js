import React, { useMemo } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import PostCard from './PostCard';
import { LoadingState, ErrorState, EmptyState } from './EmptyStates';

export default function PostList({
  styles,
  posts,
  loading,
  error,
  refreshing,
  screenHeight,
  flatListRef,
  onRefresh,
  onLike,
  onSave,
  onComment,
  onViewComments,
  onMore,
  onShare
}) {
  // Just render posts in a clean vertical list (join events are shown in a separate carousel)
  const combinedItems = useMemo(() => {
    return (posts || []).map(post => ({
      type: 'post',
      id: `post-${post.id}`,
      data: post,
    }));
  }, [posts]);

  const renderItem = ({ item }) => (
    <PostCard
      item={item.data}
      onLike={onLike}
      onSave={onSave}
      onComment={onComment}
      onViewComments={onViewComments}
      onMore={onMore}
      onShare={onShare}
    />
  );

  const renderEmptyState = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} onRetry={onRefresh} />;
    if (combinedItems.length === 0) return <EmptyState onCreatePost={() => {}} />;
    return null;
  };

  return (
    <FlatList
      ref={flatListRef}
      data={combinedItems}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={[styles.postList, { paddingBottom: screenHeight > 800 ? 120 : screenHeight > 650 ? 80 : 40 }]}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState}
      scrollEventThrottle={16}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B5FE3" />}
    />
  );
}


