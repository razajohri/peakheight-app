import React from 'react';
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
  onMore,
  onShare
}) {
  const renderPostItem = ({ item }) => (
    <PostCard
      item={item}
      onLike={onLike}
      onSave={onSave}
      onComment={onComment}
      onMore={onMore}
      onShare={onShare}
    />
  );

  const renderEmptyState = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} onRetry={onRefresh} />;
    if (posts.length === 0) return <EmptyState onCreatePost={() => {}} />;
    return null;
  };

  return (
    <FlatList
      ref={flatListRef}
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderPostItem}
      contentContainerStyle={[styles.postList, { paddingBottom: screenHeight > 800 ? 120 : screenHeight > 650 ? 80 : 40 }]}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState}
      scrollEventThrottle={16}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B5FE3" />}
    />
  );
}


