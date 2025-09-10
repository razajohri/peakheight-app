import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AICoachWidget = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI Height Coach. I'm here to help you maximize your growth potential. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim().length === 0) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simulate AI response (in real app, this would call an API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(message.trim());
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('height') || lowerMessage.includes('grow')) {
      return "Great question! Height growth is influenced by sleep, nutrition, exercise, and posture. Focus on 8+ hours of quality sleep and proper nutrition. What specific aspect would you like to know more about?";
    }

    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      return "Excellent! For height growth, focus on stretching exercises like hanging, cobra pose, and wall stretches. These help decompress your spine. How often are you currently exercising?";
    }

    if (lowerMessage.includes('sleep')) {
      return "Sleep is crucial for growth! Aim for 8-10 hours of quality sleep. Growth hormone is released during deep sleep. Are you getting enough rest?";
    }

    if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet')) {
      return "Nutrition plays a key role! Focus on protein, calcium, vitamin D, and zinc. Foods like eggs, dairy, leafy greens, and nuts support growth. What's your current diet like?";
    }

    if (lowerMessage.includes('posture')) {
      return "Good posture can make you appear taller and support spinal health! Practice standing straight, sitting properly, and doing posture exercises. Would you like some specific posture tips?";
    }

    if (lowerMessage.includes('streak') || lowerMessage.includes('motivation')) {
      return "You're doing amazing with your 21-day streak! Consistency is key to seeing results. Keep up the great work and remember - every small step counts towards your height goals!";
    }

    return "That's a great question! I'm here to help with height growth, exercise routines, nutrition tips, sleep optimization, and posture improvement. What specific area would you like to explore?";
  };

  const handleQuickQuestion = (question) => {
    setMessage(question);
    handleSendMessage();
  };

  const quickQuestions = [
    "How can I grow taller?",
    "Best exercises for height?",
    "Sleep tips for growth?",
    "Nutrition for height?"
  ];

  return (
    <>
      {/* AI Coach Widget Button */}
      <TouchableOpacity
        style={styles.coachWidget}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.coachIconContainer}>
          <Icon name="chatbubble-ellipses" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.coachTextContainer}>
          <Text style={styles.coachTitle}>AI Coach</Text>
          <Text style={styles.coachSubtitle}>Chat with your coach</Text>
        </View>
        <Icon name="chevron-forward" size={16} color="#666666" />
      </TouchableOpacity>

      {/* AI Coach Chat Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconContainer}>
                <Icon name="chatbubble-ellipses" size={24} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>AI Height Coach</Text>
                <Text style={styles.headerSubtitle}>Always here to help</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Quick Questions */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestionsContainer}>
            {quickQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickQuestionChip}
                onPress={() => handleQuickQuestion(question)}
              >
                <Text style={styles.quickQuestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Messages */}
          <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
            {messages.map((msg) => (
              <View key={msg.id} style={[styles.messageContainer, msg.isUser ? styles.userMessage : styles.aiMessage]}>
                <View style={[styles.messageBubble, msg.isUser ? styles.userBubble : styles.aiBubble]}>
                  <Text style={[styles.messageText, msg.isUser ? styles.userText : styles.aiText]}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Ask your AI coach anything..."
              placeholderTextColor="#AAAAAA"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, message.trim().length === 0 && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={message.trim().length === 0}
            >
              <Icon name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Widget Styles
  coachWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  coachIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coachTextContainer: {
    flex: 1,
  },
  coachTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  coachSubtitle: {
    fontSize: 14,
    color: '#666666',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  quickQuestionChip: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  quickQuestionText: {
    fontSize: 14,
    color: '#3B5FE3',
    fontWeight: '500',
  },

  // Messages
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#3B5FE3',
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
    backgroundColor: '#3B5FE3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
});

export default AICoachWidget;
