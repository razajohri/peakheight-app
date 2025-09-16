// Onboarding13.js (Page 13 - Pain)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
              <View style={styles.factIcon}>
                <Text style={styles.factIconText}>!</Text>
              </View>
              <Text style={styles.factText}>Women prefer tall men</Text>
            </View>

            <View style={styles.factItem}>
              <View style={styles.factIcon}>
                <Text style={styles.factIconText}>!</Text>
              </View>
              <Text style={styles.factText}>Lower pay and respect</Text>
            </View>

            <View style={styles.factItem}>
              <View style={styles.factIcon}>
                <Text style={styles.factIconText}>!</Text>
              </View>
              <Text style={styles.factText}>Each inch adds $700/year</Text>
            </View>

            <View style={styles.factItem}>
              <View style={styles.factIcon}>
                <Text style={styles.factIconText}>!</Text>
              </View>
              <Text style={styles.factText}>58% of CEOs are 6ft+</Text>
            </View>

            <View style={styles.factItem}>
              <View style={styles.factIcon}>
                <Text style={styles.factIconText}>!</Text>
              </View>
              <Text style={styles.factText}>Harder to fit in</Text>
            </View>
          </View>

          <Text style={styles.description}>
            The right habits can unlock hidden growth potential.
          </Text>
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
    backgroundColor: '#000000',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 4,
    marginBottom: 24,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#1f1f1f',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  factsList: {
    marginBottom: 32,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  factIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  factIconText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: '#000000',
  },
  factText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    flex: 1,
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
    color: '#9CA3AF',
  },
  buttonContainer: {
    padding: 24,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
});

export default Onboarding13;
