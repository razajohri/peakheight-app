// Onboarding16.js (Page 16 - Paywall)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

const Onboarding16 = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('annual');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Unlock your full height potential</Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>Personalized height optimization plan</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>AI-powered posture analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>Expert nutrition guidance</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>Progress tracking & analytics</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureText}>24/7 support from height specialists</Text>
            </View>
          </View>

          <View style={styles.plansContainer}>
            <TouchableOpacity
              style={[
                styles.planCard,
                selectedPlan === 'monthly' && styles.planCardSelected
              ]}
              onPress={() => setSelectedPlan('monthly')}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>Monthly</Text>
                <Text style={styles.planPrice}>$9.99</Text>
                <Text style={styles.planPeriod}>per month</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.planCard,
                selectedPlan === 'annual' && styles.planCardSelected
              ]}
              onPress={() => setSelectedPlan('annual')}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>Annual</Text>
                <Text style={styles.planPrice}>$29.99</Text>
                <Text style={styles.planPeriod}>per year</Text>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>Save 75%</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.trustContainer}>
            <Text style={styles.trustTitle}>Trust & Security</Text>
            <View style={styles.trustItems}>
              <Text style={styles.trustItem}>• Evidence-based methods</Text>
              <Text style={styles.trustItem}>• Privacy by design</Text>
              <Text style={styles.trustItem}>• Reviewed quarterly by experts</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding17')}
        >
          <Text style={styles.buttonText}>
            {selectedPlan === 'annual' ? 'Start Annual Plan - $29.99' : 'Start Monthly Plan - $9.99'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.termsButton}>
          <Text style={styles.termsText}>Terms of Service • Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D', // Deep navy base
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 120,
  },
  title: {
    fontFamily: 'Playfair Display-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 32,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  featuresList: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F3E',
  },
  featureText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  plansContainer: {
    marginBottom: 32,
  },
  planCard: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
  },
  planCardSelected: {
    borderColor: '#3B5FE3',
    backgroundColor: 'rgba(59, 95, 227, 0.1)',
  },
  planHeader: {
    alignItems: 'center',
  },
  planTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  planPrice: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
  },
  planPeriod: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 4,
  },
  savingsBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  savingsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  trustContainer: {
    backgroundColor: '#1A1F2D',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  trustTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  trustItems: {
    gap: 8,
  },
  trustItem: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#AAAAAA',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0A0F1D',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#2A2F3E',
  },
  button: {
    backgroundColor: '#3B5FE3',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  termsButton: {
    alignItems: 'center',
  },
  termsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#AAAAAA',
  },
});

export default Onboarding16;
