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
  Platform,
  Animated
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../UI/Icon';
import * as Haptics from 'expo-haptics';
import { useUser } from '../../contexts/UserContext';
import { AICoachService } from '../../services/aiCoachService';

const AICoachModal = ({ visible, onClose }) => {
  const { userProfile, userProgress } = useUser();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
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
        text: `Hi ${userProfile?.name || 'there'}! 👋 I'm Jacob, your personalized AI Height Coach. I'm trained on 1000+ research papers. I'm here to help you with your height growth journey. You're currently on day ${userProgress?.current_day || 1} of your ${AICoachService.getPhaseForDay(userProgress?.current_day || 1)} phase! What would you like to know?`,
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
        text: "Hi! I'm Jacob, your Personal Height Growth Coach. I'm here to help you maximize your growth potential. What would you like to know?",
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
    
    // Hide quick questions after first user message
    if (showQuickQuestions) {
      setShowQuickQuestions(false);
    }

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
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
        <SafeAreaView style={styles.safeAreaTop} edges={['top']}>
          <View style={{ height: insets.top, backgroundColor: '#000000' }} />
        </SafeAreaView>
        {/* Header */}
        <LinearGradient
          colors={['#000000', '#1a1a1a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 8 : 16 }]}
        >
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={['#FFFFFF', '#F0F0F0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerIconContainer}
            >
              <Icon name="body" size={24} color="#000000" />
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>Jacob Height Coach</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.headerSubtitle}>
                  Day {userProgress?.current_day || 1} • {AICoachService.getPhaseForDay(userProgress?.current_day || 1)} Phase
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
          >
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick Questions - Only show initially */}
        {showQuickQuestions && (
          <View style={styles.quickQuestionsContainer}>
            <Text style={styles.quickQuestionsTitle}>Quick Questions</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickQuestionsContent}
              style={styles.quickQuestionsScrollView}
            >
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionChip}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    handleQuickQuestion(question);
                  }}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#F8F9FA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.quickQuestionGradient}
                  >
                    <Text style={styles.quickQuestionText}>{question}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.aiAvatar}
                >
                  <Icon name="body" size={16} color="#000000" />
                </LinearGradient>
              )}
              <View style={[
                styles.messageBubble,
                msg.isUser ? styles.userBubble : styles.aiBubble
              ]}>
                {msg.isTyping ? (
                  <View style={styles.typingContainer}>
                    <ActivityIndicator size="small" color="#000000" />
                    <Text style={styles.typingText}>Coach is typing...</Text>
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
        <View style={styles.inputSafeArea}>
          <LinearGradient
            colors={['#FFFFFF', '#F8F9FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.inputContainer}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.messageInput, Platform.OS === 'ios' && styles.messageInputIOS]}
                placeholder="Ask your coach anything..."
                placeholderTextColor="#AAAAAA"
                value={message}
                onChangeText={setMessage}
                multiline={true}
                maxLength={500}
                editable={!isLoading}
                textContentType="none"
                autoCorrect={true}
                autoCapitalize="sentences"
                blurOnSubmit={false}
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
                  <LinearGradient
                    colors={message.trim().length > 0 ? ['#000000', '#333333'] : ['#CCCCCC', '#AAAAAA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sendButtonGradient}
                  >
                    <Icon name="send" size={20} color="#FFFFFF" />
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        <SafeAreaView style={styles.safeAreaBottom} edges={['bottom']} />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeAreaTop: {
    backgroundColor: '#000000',
  },
  safeAreaBottom: {
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Quick Questions
  quickQuestionsContainer: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    minHeight: 60,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  quickQuestionsContent: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  quickQuestionsScrollView: {
    flexGrow: 0,
  },
  quickQuestionChip: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  quickQuestionGradient: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  quickQuestionText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  // Messages
  messagesContainer: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 0 : 0,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#000000',
    borderBottomRightRadius: 6,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
  inputSafeArea: {
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 24 : 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 14 : 12,
    paddingBottom: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 16,
    color: '#000000',
    minHeight: Platform.OS === 'ios' ? 48 : 48,
    maxHeight: 100,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    textAlignVertical: Platform.OS === 'android' ? 'center' : 'top',
  },
  messageInputIOS: {
    paddingTop: 14,
    paddingBottom: 14,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default AICoachModal;

