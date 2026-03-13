import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/UI/Icon';

export default function TermsOfServiceScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: September 17, 2025</Text>

          <Text style={styles.sectionTitle}>Agreement to Terms</Text>
          <Text style={styles.sectionText}>
            These Terms of Service ("Terms") are a legally binding agreement between you and Roman Co Ltd., a company incorporated under the laws of Canada and registered in Alberta, doing business as Peak Height ("Peak Height," "we," "us," or "our"), governing your access to and use of the Peak Height mobile application and any related websites, services, and features (collectively, the "App"). By downloading, installing, accessing, or using the App, you acknowledge that you have read, understand, and agree to be bound by these Terms. If you do not agree, do not access or use the App.
          </Text>

          <Text style={styles.sectionTitle}>Intellectual Property Rights</Text>
          <Text style={styles.sectionText}>
            All content within the App including code, text, graphics, logos, designs, audio, video, and trademarks is owned by or licensed to Peak Height. Content is protected by copyright, trademark, and international intellectual property laws. Unauthorized use is prohibited.
          </Text>

          <Text style={styles.sectionTitle}>User Representations</Text>
          <Text style={styles.sectionText}>By using the App, you represent that:</Text>
          <Text style={styles.bulletPoint}>• You have the legal capacity to agree to these Terms.</Text>
          <Text style={styles.bulletPoint}>• You are at least 13 years old (or have parental consent if required by your jurisdiction).</Text>
          <Text style={styles.bulletPoint}>• You will not use the App for illegal or unauthorized purposes.</Text>
          <Text style={styles.bulletPoint}>• You will not attempt to access the App through automated means (bots, scripts, etc.).</Text>
          <Text style={styles.bulletPoint}>• Your use of the App complies with all applicable laws.</Text>

          <Text style={styles.sectionTitle}>Prohibited Activities</Text>
          <Text style={styles.sectionText}>You agree not to misuse the App. This includes, but is not limited to:</Text>
          <Text style={styles.bulletPoint}>• Using the App for commercial purposes without authorization.</Text>
          <Text style={styles.bulletPoint}>• Attempting to reverse engineer, copy, or resell the App.</Text>
          <Text style={styles.bulletPoint}>• Uploading harmful code, spam, or abusive content.</Text>
          <Text style={styles.bulletPoint}>• Harassing other users or interfering with App operations.</Text>

          <Text style={styles.sectionTitle}>User-Generated Contributions</Text>
          <Text style={styles.sectionText}>
            The App may allow you to post or share content (e.g., text, images, feedback). You understand that such contributions may be visible to others and will be treated as non-confidential.
          </Text>

          <Text style={styles.sectionTitle}>Contribution License</Text>
          <Text style={styles.sectionText}>
            By submitting content, you grant Peak Height a worldwide, royalty-free license to use, reproduce, modify, and distribute your contributions for purposes including improvement, marketing, and community engagement.
          </Text>

          <Text style={styles.sectionTitle}>Mobile Application License</Text>
          <Text style={styles.sectionText}>
            We grant you a limited, non-transferable license to install and use the App on devices you own or control. You must not: reverse engineer or modify the App, use the App for unauthorized commercial purposes, or share the App in ways that bypass intended restrictions. For Apple iOS users, these Terms incorporate Apple App Store rules. Apple is not responsible for maintenance, support, or warranty claims.
          </Text>

          <Text style={styles.sectionTitle}>Third-Party Websites & Content</Text>
          <Text style={styles.sectionText}>
            The App may include links or content from third parties. We do not control or endorse such content and are not responsible for its accuracy, safety, or reliability.
          </Text>

          <Text style={styles.sectionTitle}>Advertisers</Text>
          <Text style={styles.sectionText}>
            Currently, Peak Height does not display third-party ads. If this changes, updates will be made to these Terms.
          </Text>

          <Text style={styles.sectionTitle}>App Management</Text>
          <Text style={styles.sectionText}>
            We reserve the right to monitor and remove inappropriate content, restrict or suspend access to users who violate these Terms, and manage the App to maintain proper functionality.
          </Text>

          <Text style={styles.sectionTitle}>Privacy Policy</Text>
          <Text style={styles.sectionText}>
            Your use of the App is also governed by our Privacy Policy, which outlines how we collect and handle your data. By using the App, you consent to data processing as described in that policy.
          </Text>

          <Text style={styles.sectionTitle}>Term & Termination</Text>
          <Text style={styles.sectionText}>
            These Terms remain in effect while you use the App. We may suspend or terminate access at any time, without notice, if you violate these Terms or applicable laws.
          </Text>

          <Text style={styles.sectionTitle}>Modifications & Interruptions</Text>
          <Text style={styles.sectionText}>
            We may update, suspend, or discontinue the App at any time. While we aim for smooth operation, interruptions may occur. We are not liable for service disruptions or modifications.
          </Text>

          <Text style={styles.sectionTitle}>Governing Law</Text>
          <Text style={styles.sectionText}>
            If unresolved, disputes shall be resolved exclusively in the courts of the Province of Alberta, Canada.
          </Text>

          <Text style={styles.sectionTitle}>Dispute Resolution</Text>
          <Text style={styles.sectionText}>
            If a dispute arises, you agree to first contact our project manager at rlakhnyuk@gmail.com for resolution. If unresolved, disputes will be handled under the jurisdiction outlined in Section 14.
          </Text>

          <Text style={styles.sectionTitle}>Corrections</Text>
          <Text style={styles.sectionText}>
            The App may contain errors or outdated information. We reserve the right to correct or update content at any time.
          </Text>

          <Text style={styles.sectionTitle}>Purchases & Payment</Text>
          <Text style={styles.sectionText}>
            Payments for subscriptions or in-app purchases are processed through app store providers (e.g., Apple App Store). You agree to provide accurate billing details and authorize recurring charges if applicable. Prices may change, and taxes may apply.
          </Text>

          <Text style={styles.sectionTitle}>Cancellation Policy</Text>
          <Text style={styles.sectionText}>
            All purchases are non-refundable. You may cancel subscriptions via your app store account. Cancellation takes effect at the end of your current billing cycle.
          </Text>

          <Text style={styles.sectionTitle}>Guidelines for Reviews</Text>
          <Text style={styles.sectionText}>If you leave reviews or feedback:</Text>
          <Text style={styles.bulletPoint}>• Be honest and respectful</Text>
          <Text style={styles.bulletPoint}>• Do not use profanity, hate speech, or discriminatory language</Text>
          <Text style={styles.bulletPoint}>• Do not post false or misleading claims</Text>
          <Text style={styles.sectionText}>We may remove or decline reviews at our discretion.</Text>

          <Text style={styles.sectionTitle}>Limitation of Liability & Disclaimer of Warranties</Text>
          <Text style={styles.sectionText}>
            Peak Height provides general lifestyle, fitness, and health guidance. We do not guarantee results such as increased height. Individual outcomes vary, and the App is not a substitute for medical advice. Except where liability cannot be excluded by law, Peak Height is not responsible for indirect or consequential damages, including lost profits, data, or goodwill.
          </Text>

          <Text style={styles.sectionTitle}>Disclaimer</Text>
          <Text style={styles.sectionText}>
            The App is provided "as is" and "as available" without warranties of any kind. We do not guarantee uninterrupted service, accuracy, or specific outcomes. Use of the App is at your own risk.
          </Text>

          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.sectionText}>
            If you have questions about these Terms, email our director at rlakhnyuk@gmail.com
          </Text>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    color: '#E5E7EB',
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#E5E7EB',
    lineHeight: 22,
    marginLeft: 16,
    marginBottom: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});

