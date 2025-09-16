import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useUser } from '../../contexts/UserContext';
import { AICoachService } from '../../services/aiCoachService';

const AICoachModal = ({ visible, onClose }) => {
  const { userProfile, userProgress } = useUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const scrollViewRef = useRef(null);

  // Initialize conversation when modal opens
  useEffect(() => {
    if (visible) {
      initializeConversation();
    }
  }, [visible]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const initializeConversation = async () => {
    try {
      // Load conversation history
      const history = await AICoachService.getConversationHistory(userProfile?.id);
      setConversationHistory(history);

      // Set initial welcome message
      const welcomeMessage = {
        id: 1,
        text: `Hi ${userProfile?.name || 'there'}! 👋 I'm your AI Height Coach. I'm here to help you maximize your growth potential on your 120-day journey. You're currently on day ${userProgress?.current_day || 1} of your ${AICoachService.getPhaseForDay(userProgress?.current_day || 1)} phase! What would you like to know?`,
        isUser: false,
        timestamp: new Date(),
        isTyping: false
      };

      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing conversation:', error);
      // Fallback welcome message
      setMessages([{
        id: 1,
        text: "Hi! I'm your AI Height Coach. I'm here to help you maximize your growth potential. What would you like to know?",
        isUser: false,
        timestamp: new Date(),
        isTyping: false
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim().length === 0 || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date(),
      isTyping: false
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage = {
      id: Date.now() + 1,
      text: '',
      isUser: false,
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Get user context for personalized responses
      const userContext = await AICoachService.getUserContext(userProfile?.id);

      // Try to get quick response first for common questions
      const quickResponse = AICoachService.getQuickResponse(userMessage.text, userContext);

      // If it's a simple question, use quick response
      if (quickResponse !== AICoachService.getQuickResponse("", userContext)) {
        // Remove typing indicator
        setMessages(prev => prev.filter(msg => !msg.isTyping));

        // Add AI response
        const aiMessage = {
          id: Date.now() + 2,
          text: quickResponse,
          isUser: false,
          timestamp: new Date(),
          isTyping: false
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
        return;
      }

      // For complex questions, use OpenAI
      const result = await AICoachService.sendMessage(
        userProfile?.id,
        userMessage.text,
        conversationHistory
      );

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));

      if (result.error) {
        // Show error message
        const errorMessage = {
          id: Date.now() + 2,
          text: "I'm having trouble connecting right now. Please try again in a moment. In the meantime, here's a quick tip: " + AICoachService.generatePersonalizedTip(userContext),
          isUser: false,
          timestamp: new Date(),
          isTyping: false
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        // Add AI response
        const aiMessage = {
          id: Date.now() + 2,
          text: result.response,
          isUser: false,
          timestamp: new Date(),
          isTyping: false
        };
        setMessages(prev => [...prev, aiMessage]);

        // Update conversation history
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: userMessage.text },
          { role: 'assistant', content: result.response }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));

      // Show error message
      const errorMessage = {
        id: Date.now() + 2,
        text: "I'm having trouble connecting right now. Please try again in a moment! 😅",
        isUser: false,
        timestamp: new Date(),
        isTyping: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const quickQuestions = [
    "How can I grow taller?",
    "What exercises should I do today?",
    "How is my progress?",
    "Sleep tips for growth?",
    "Best foods for height?",
    "How does the app work?"
  ];

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconContainer}>
              <Icon name="chatbubble-ellipses" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Height Coach</Text>
              <Text style={styles.headerSubtitle}>
                Day {userProgress?.current_day || 1} • {AICoachService.getPhaseForDay(userProgress?.current_day || 1)} Phase
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
          >
            <Icon name="close" size={24} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* Quick Questions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickQuestionsContainer}
          contentContainerStyle={styles.quickQuestionsContent}
        >
          {quickQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestionChip}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleQuickQuestion(question);
              }}
            >
              <Text style={styles.quickQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[
              styles.messageContainer,
              msg.isUser ? styles.userMessage : styles.aiMessage
            ]}>
              {!msg.isUser && (
                <View style={styles.aiAvatar}>
                  <Icon name="sparkles" size={16} color="#000000" />
                </View>
              )}
              <View style={[
                styles.messageBubble,
                msg.isUser ? styles.userBubble : styles.aiBubble
              ]}>
                {msg.isTyping ? (
                  <View style={styles.typingContainer}>
                    <ActivityIndicator size="small" color="#000000" />
                    <Text style={styles.typingText}>AI Coach is typing...</Text>
                  </View>
                ) : (
                  <Text style={[
                    styles.messageText,
                    msg.isUser ? styles.userText : styles.aiText
                  ]}>
                    {msg.text}
                  </Text>
                )}
                <Text style={[
                  styles.messageTime,
                  msg.isUser ? styles.userTime : styles.aiTime
                ]}>
                  {formatTime(msg.timestamp)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Ask your AI coach anything..."
            placeholderTextColor="#AAAAAA"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (message.trim().length === 0 || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              handleSendMessage();
            }}
            disabled={message.trim().length === 0 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon name="send" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingTop: 50, // Account for status bar
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  closeButton: {
    padding: 4,
  },

  // Quick Questions
  quickQuestionsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  quickQuestionsContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  quickQuestionChip: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  quickQuestionText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '700',
  },

  // Messages
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#000000',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#F8F9FA',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#000000',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  userTime: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  aiTime: {
    color: '#666666',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    fontStyle: 'italic',
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
});

export default AICoachModal;
