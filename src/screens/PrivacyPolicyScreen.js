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

export default function PrivacyPolicyScreen({ navigation }) {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last updated: September 17, 2025</Text>

          <Text style={styles.sectionText}>
            This Privacy Policy for Roman Co Ltd., a company incorporated under the laws of Canada and registered in Alberta, doing business as Peak Height ("Peak Height," "we," "us," or "our") explains how and why we collect, store, use, and share ("process") your information when you use our services ("Services"), such as when you:
          </Text>
          <Text style={styles.bulletPoint}>• Download and use our mobile application (Peak Height), or any other application of ours that links to this Privacy Policy</Text>
          <Text style={styles.bulletPoint}>• Engage with us in other related ways, including any sales, marketing, or events</Text>

          <Text style={styles.sectionText}>
            Questions or concerns? Reading this Privacy Policy will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. For further questions, please contact us at support@peakheightapp.com.
          </Text>

          <Text style={styles.sectionTitle}>SUMMARY OF KEY POINTS</Text>
          <Text style={styles.sectionText}>
            We may collect personal information when you use our Services depending on your interactions, choices, and the products and features you use. We do not process biometric or facial recognition data. We do not receive information about you from third parties. We process information to provide, improve, and administer our Services, communicate with you, maintain security, prevent fraud, and comply with laws. We may share limited data with trusted service providers under strict contractual protections. We use organizational and technical safeguards, but no system is 100% secure.
          </Text>

          <Text style={styles.sectionTitle}>WHAT INFORMATION DO WE COLLECT?</Text>
          <Text style={styles.sectionText}>
            We collect personal information you provide, such as size and weight, gender, age, ethnicity, parent height, shoe size, training routines, sleep habits, and email address. We do not collect biometric data such as facial recognition. Payment data is processed by Apple or Google; we do not store card details. If enabled, we may send push notifications. Automatically collected information includes device type, operating system, IP address, crash logs, usage data, and session times.
          </Text>

          <Text style={styles.sectionTitle}>HOW DO WE PROCESS YOUR INFORMATION?</Text>
          <Text style={styles.sectionText}>
            We process data to predict growth patterns, enhance app features, personalize your experience, and provide AI-powered chatbot interactions through OpenAI's API. Chatbot conversations are processed in real time and not stored on our servers. Users should avoid sharing sensitive information with the chatbot.
          </Text>

          <Text style={styles.sectionTitle}>LEGAL BASES FOR PROCESSING</Text>
          <Text style={styles.sectionText}>
            We only process data when we have a valid legal basis, such as consent, legal obligations, or legitimate interests like service improvement and fraud prevention. For users in Canada, the EU, UK, or other regulated regions, additional protections apply.
          </Text>

          <Text style={styles.sectionTitle}>WHEN AND WITH WHOM DO WE SHARE DATA?</Text>
          <Text style={styles.sectionText}>
            We may share information with service providers such as analytics and cloud storage providers, bound by data-protection agreements. We may also share data during business transfers such as mergers or acquisitions. We do not sell personal information.
          </Text>

          <Text style={styles.sectionTitle}>THIRD-PARTY WEBSITES</Text>
          <Text style={styles.sectionText}>
            The App may link to third-party websites or services. We are not responsible for their privacy practices, and users should review their policies.
          </Text>

          <Text style={styles.sectionTitle}>INTERNATIONAL TRANSFERS</Text>
          <Text style={styles.sectionText}>
            Your information may be transferred outside your home country. For EEA and UK users, we use Standard Contractual Clauses or equivalent safeguards to ensure protection.
          </Text>

          <Text style={styles.sectionTitle}>DATA RETENTION</Text>
          <Text style={styles.sectionText}>
            We keep personal information as long as necessary. Account data is deleted within 30 days of account deletion unless required by law. Payment data is retained only for transactions and audits. Analytics data may be kept for up to 12 months.
          </Text>

          <Text style={styles.sectionTitle}>DATA SECURITY</Text>
          <Text style={styles.sectionText}>
            We use encryption, access controls, firewalls, and monitoring to protect data. However, no method is fully secure. Users should use strong passwords and protect their devices.
          </Text>

          <Text style={styles.sectionTitle}>CHILDREN'S DATA</Text>
          <Text style={styles.sectionText}>
            We do not knowingly collect information from children under 13 or under the age of consent in your jurisdiction. If we learn such data has been collected, we will delete it. Parents may contact us at support@peakheightapp.com for removal requests.
          </Text>

          <Text style={styles.sectionTitle}>YOUR PRIVACY RIGHTS</Text>
          <Text style={styles.sectionText}>
            Depending on your location, you may have rights to access, correct, delete, restrict, or object to processing of your data, and to withdraw consent. To exercise rights, contact us at rlakhnyuk@gmail.com.
          </Text>

          <Text style={styles.sectionTitle}>DO-NOT-TRACK SIGNALS</Text>
          <Text style={styles.sectionText}>
            We do not currently respond to browser Do-Not-Track signals. If standards change, this policy will be updated.
          </Text>

          <Text style={styles.sectionTitle}>REGIONAL RIGHTS</Text>
          <Text style={styles.sectionText}>
            We comply with Canadian law (PIPEDA), EU and UK GDPR, and applicable US state laws such as CCPA. In other regions, we align with local privacy requirements.
          </Text>

          <Text style={styles.sectionTitle}>UPDATES TO THIS POLICY</Text>
          <Text style={styles.sectionText}>
            We may update this Privacy Policy periodically. The revised date will indicate when updates take effect. If changes are material, we may notify you through the app or by email.
          </Text>

          <Text style={styles.sectionTitle}>CONTACT US</Text>
          <Text style={styles.sectionText}>
            If you have questions, contact us at: Roman Co Ltd. (Peak Height), rlakhnyuk@gmail.com, 12153 Fort Rd NW, Edmonton, AB T5B 4H2.
          </Text>

          <Text style={styles.sectionTitle}>MANAGE YOUR DATA</Text>
          <Text style={styles.sectionText}>
            You can review or delete your data through account settings in the App. Data is permanently deleted within 30 days of account deletion, unless required by law.
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

