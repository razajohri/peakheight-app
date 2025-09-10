// Onboarding13.js (Page 13 - Pain)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

const Onboarding13 = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '87%' }]} />
        </View>
        <Text style={styles.progressText}>13/15</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>The reality of being short</Text>

          <View style={styles.factsList}>
            <View style={styles.factItem}>
              <Text style={styles.factText}>Women prefer tall men</Text>
            </View>

            <View style={styles.factItem}>
              <Text style={styles.factText}>Lower pay and respect</Text>
            </View>

            <View style={styles.factItem}>
              <Text style={styles.factText}>Each inch adds $700/year</Text>
            </View>

            <View style={styles.factItem}>
              <Text style={styles.factText}>58% of CEOs are 6ft+</Text>
            </View>

            <View style={styles.factItem}>
              <Text style={styles.factText}>Harder to fit in</Text>
            </View>
          </View>

          <Text style={styles.description}>
            Height has a significant impact on social perception and career advancement. Studies show that taller individuals often receive higher salaries and more leadership opportunities.
          </Text>

          <View style={styles.methodContainer}>
            <Text style={styles.methodLink}>View sources</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding14')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D', // Deep navy base
    paddingTop: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#2A2F3E', // Darker gray
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#3B5FE3', // Cobalt accent
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#AAAAAA',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Playfair Display-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 32,
    letterSpacing: -0.5, // Tighter letter-spacing for headlines
  },
  factsList: {
    marginBottom: 32,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F3E', // Darker gray
  },
  factText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 24,
  },
  methodContainer: {
    alignItems: 'flex-start',
  },
  methodLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#3B5FE3', // Cobalt accent
  },
  buttonContainer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#3B5FE3', // Cobalt accent
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default Onboarding13;
