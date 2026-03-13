import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from '../UI/Icon';

const CommentModal = ({ visible, onClose, onSubmit, loading = false, existingComments = [], viewMode = 'add', onReply, selectedCommentForReply, onSwitchToAddMode }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    if (!commentText || commentText.trim().length === 0) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    onSubmit(commentText.trim(), selectedCommentForReply || null);
    setCommentText('');
  };

  const handleClose = () => {
    setCommentText('');
    onClose();
  };

  // Organize comments into a tree structure (parent comments with nested replies)
  const organizeComments = (comments) => {
    const commentMap = new Map();
    const rootComments = [];

    // First pass: create map of all comments
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build tree structure
    comments.forEach(comment => {
      const commentNode = commentMap.get(comment.id);
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies.push(commentNode);
        } else {
          // Parent not found, treat as root comment
          rootComments.push(commentNode);
        }
      } else {
        rootComments.push(commentNode);
      }
    });

    return rootComments;
  };

  // Render a comment and its replies recursively
  const renderComment = (comment, isReply = false, depth = 0) => {
    const maxDepth = 3; // Limit nesting depth
    if (depth > maxDepth) return null;

    return (
      <View key={comment.id} style={[styles.commentItem, isReply && styles.replyItem]}>
        <View style={styles.commentAvatar}>
          <Text style={styles.commentAvatarText}>
            {comment.user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={[styles.commentContent, isReply && styles.replyContent]}>
          <View style={styles.commentMeta}>
            <Text style={styles.commentAuthor}>{comment.user.name}</Text>
            <Text style={styles.commentTime}>
              {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <Text style={styles.commentText}>{comment.text}</Text>
          {onReply && (
            <TouchableOpacity 
              onPress={() => onReply(comment.id)}
              style={styles.replyButton}
            >
              <Icon name="arrow-undo-outline" size={14} color="#666666" />
              <Text style={styles.replyButtonText}>Reply</Text>
            </TouchableOpacity>
          )}
          {/* Render nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <View style={styles.repliesContainer}>
              {comment.replies.map(reply => renderComment(reply, true, depth + 1))}
            </View>
          )}
        </View>
      </View>
    );
  };

  // Reset comment text when selectedCommentForReply changes
  React.useEffect(() => {
    if (selectedCommentForReply && visible) {
      // Scroll to the comment being replied to if needed
      // This could be enhanced with a ref to scroll to the specific comment
    }
  }, [selectedCommentForReply, visible]);

  // Single full-screen chat-style modal for viewing and adding comments
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.chatOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <SafeAreaView style={styles.chatContainer}>
          {/* Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={handleClose} style={styles.chatBackButton}>
              <Icon name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.chatTitleContainer}>
              <Text style={styles.chatTitle}>Comments</Text>
              <Text style={styles.chatSubtitle}>
                {existingComments.length} {existingComments.length === 1 ? 'reply' : 'replies'}
              </Text>
            </View>
            <View style={styles.chatHeaderSpacer} />
          </View>

          {/* Comment list */}
          {existingComments.length > 0 ? (
            <ScrollView
              style={styles.chatScroll}
              contentContainerStyle={styles.chatScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {organizeComments(existingComments).map((comment) => (
                <View key={comment.id}>{renderComment(comment, false, 0)}</View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Icon name="chatbubbles-outline" size={32} color="#4B5563" />
              </View>
              <Text style={styles.emptyText}>No comments yet</Text>
              <Text style={styles.emptySubtext}>Start the conversation</Text>
            </View>
          )}

          {/* Replying to bar */}
          {selectedCommentForReply && (() => {
            const repliedToComment = existingComments.find(c => c.id === selectedCommentForReply);
            return repliedToComment ? (
              <View style={styles.replyingToBar}>
                <Text style={styles.replyingToBarText}>
                  Replying to <Text style={styles.replyingToBarName}>{repliedToComment.user.name}</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (onReply) {
                      onReply(null);
                    }
                  }}
                  style={styles.replyingToBarClose}
                >
                  <Icon name="close" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            ) : null;
          })()}

          {/* Input bar */}
          <View style={styles.chatInputBar}>
            <TextInput
              style={styles.chatInput}
              placeholder={
                selectedCommentForReply
                  ? 'Write a reply...'
                  : 'Write a comment...'
              }
              placeholderTextColor="#6B7280"
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!commentText.trim() || loading}
              style={[
                styles.chatSendButton,
                (!commentText.trim() || loading) && styles.chatSendButtonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Icon name="send" size={18} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // New full-screen chat layout
  chatOverlay: {
    flex: 1,
    // Match other modals: subtle dimmed background behind a light surface
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  chatContainer: {
    flex: 1,
    // Light surface so it doesn't feel like a separate dark app screen
    backgroundColor: '#FFFFFF',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    // Ensure the header (and back button) sits clearly below the system status bar
    // Add a little extra space so it doesn't feel cramped under the navbar
    paddingTop:
      Platform.OS === 'ios'
        ? 24
        : (StatusBar.currentHeight || 0) + 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148, 163, 184, 0.4)',
  },
  chatBackButton: {
    padding: 6,
    borderRadius: 18,
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  chatTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  chatTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  chatHeaderSpacer: {
    width: 32,
  },
  chatScroll: {
    flex: 1,
  },
  chatScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },

  // Override some existing comment styles to look like chat bubbles
  commentItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  commentAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#020617',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.9)',
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E7EB',
    marginRight: 6,
  },
  commentTime: {
    fontSize: 11,
    color: '#6B7280',
  },
  commentText: {
    fontSize: 14,
    color: '#F9FAFB',
    lineHeight: 20,
    marginTop: 2,
  },
  replyItem: {
    marginLeft: 40,
    marginTop: 6,
  },
  repliesContainer: {
    marginTop: 8,
    borderLeftWidth: 0,
    paddingLeft: 0,
  },

  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  replyButtonText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    fontWeight: '500',
  },

  // Replying-to bar above input
  replyingToBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E5',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#F8F9FA',
  },
  replyingToBarText: {
    fontSize: 12,
    color: '#4B5563',
  },
  replyingToBarName: {
    fontWeight: '600',
    color: '#111827',
  },
  replyingToBarClose: {
    padding: 4,
  },

  // Chat input
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  chatInput: {
    flex: 1,
    maxHeight: 120,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
    color: '#111827',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  chatSendButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatSendButtonDisabled: {
    backgroundColor: '#1E293B',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeAreaContainer: {
    width: '100%',
  },

  // Drag Handle
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },

  // View Mode Container
  viewModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%',
    maxHeight: '75%',
  },

  // Add Mode Container
  addModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 60 : 30,
    maxHeight: '90%',
  },

  // Header
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addCommentButton: {
    padding: 4,
  },
  closeIconButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },

  // ScrollView (View Mode)
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },

  // Comment Item
  commentItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  commentItemFirst: {
    marginTop: 8,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  commentContent: {
    flex: 1,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: '#999999',
  },
  commentText: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  replyButtonText: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 4,
    fontWeight: '500',
  },
  repliesContainer: {
    marginTop: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E5E5',
  },
  replyItem: {
    marginBottom: 16,
  },
  replyContent: {
    paddingLeft: 0,
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  replyingToContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  replyingToText: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 6,
  },
  replyingToName: {
    fontWeight: '600',
    color: '#000000',
  },
  cancelReplyButton: {
    padding: 4,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
  },

  // Input Section (Add Mode)
  inputSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 18,
    fontSize: 15,
    color: '#000000',
    minHeight: 120,
    maxHeight: 180,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  charCount: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
    marginTop: 8,
  },

  // Submit Button
  submitButton: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: Platform.OS === 'ios' ? 8 : 0,
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CommentModal;
