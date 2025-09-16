import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

// Import all onboarding pages
import Onboarding1 from './Onboarding1';
import Onboarding2 from './Onboarding2';
import Onboarding3 from './Onboarding3';
import Onboarding4 from './Onboarding4';
import Onboarding5 from './Onboarding5';
import Onboarding5B from './Onboarding5B';
import Onboarding6 from './Onboarding6';
import Onboarding7 from './Onboarding7';
import Onboarding8 from './Onboarding8';
import Onboarding9 from './Onboarding9';
import Onboarding10 from './Onboarding10';
import Onboarding11 from './Onboarding11';
import Onboarding12 from './Onboarding12';
import Onboarding13 from './Onboarding13';
import Onboarding14 from './Onboarding14';
import Onboarding15 from './Onboarding15';
import Onboarding17 from './Onboarding17';

export default function CompleteOnboardingFlow({ onComplete, onAuthRequired, initialData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(initialData || {});

  const nextPage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentPage < 17) {
      setCurrentPage(currentPage + 1);
    } else {
      handleComplete();
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const updateData = (newData) => {
    console.log('📝 updateData called with:', newData);
    setData(prevData => {
      const updated = { ...prevData, ...newData };
      console.log('📝 Updated data:', updated);
      return updated;
    });
  };

  const handleComplete = async () => {
    try {
      // Save onboarding data and complete the flow
      await onComplete(data);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const renderCurrentPage = () => {
    const navigation = {
      navigate: async (screenName) => {
        if (screenName === 'Onboarding2') setCurrentPage(2);
        else if (screenName === 'Onboarding3') setCurrentPage(3);
        else if (screenName === 'Onboarding4') setCurrentPage(4);
        else if (screenName === 'Onboarding5') setCurrentPage(5);
        else if (screenName === 'Onboarding5B') setCurrentPage(6);
        else if (screenName === 'Onboarding6') setCurrentPage(7);
        else if (screenName === 'Onboarding7') setCurrentPage(8);
        else if (screenName === 'Onboarding8') setCurrentPage(9);
        else if (screenName === 'Onboarding9') setCurrentPage(10);
        else if (screenName === 'Onboarding10') setCurrentPage(11);
        else if (screenName === 'Onboarding11') setCurrentPage(12);
        else if (screenName === 'Onboarding12') setCurrentPage(13);
        else if (screenName === 'Onboarding13') setCurrentPage(14);
        else if (screenName === 'Onboarding14') setCurrentPage(15);
        else if (screenName === 'Onboarding15') setCurrentPage(16);
        else if (screenName === 'Onboarding17') setCurrentPage(17);
        else if (screenName === 'Dashboard') handleComplete();
        else if (screenName === 'Auth') {
          console.log('🔐 OnAuthRequired called with data:', data);
          console.log('🔐 Data keys:', Object.keys(data || {}));

          // Store onboarding data in AsyncStorage as backup before auth
          try {
            await AsyncStorage.setItem('pendingOnboardingData', JSON.stringify(data));
            console.log('💾 Stored onboarding data in AsyncStorage before auth');
          } catch (error) {
            console.error('Failed to store onboarding data in AsyncStorage:', error);
          }

          onAuthRequired(data);
        }
      },
      goBack: () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    };

    const commonProps = {
      navigation,
      data,
      updateData,
      onAuthRequired
    };

    switch (currentPage) {
      case 1:
        return <Onboarding1 {...commonProps} />;
      case 2:
        return <Onboarding2 {...commonProps} />;
      case 3:
        return <Onboarding3 {...commonProps} />;
      case 4:
        return <Onboarding4 {...commonProps} />;
      case 5:
        return <Onboarding5 {...commonProps} />;
      case 6:
        return <Onboarding5B {...commonProps} />;
      case 7:
        return <Onboarding6 {...commonProps} />;
      case 8:
        return <Onboarding7 {...commonProps} />;
      case 9:
        return <Onboarding8 {...commonProps} />;
      case 10:
        return <Onboarding9 {...commonProps} />;
      case 11:
        return <Onboarding10 {...commonProps} />;
      case 12:
        return <Onboarding11 {...commonProps} />;
      case 13:
        return <Onboarding12 {...commonProps} />;
      case 14:
        return <Onboarding13 {...commonProps} />;
      case 15:
        return <Onboarding14 {...commonProps} />;
      case 16:
        return <Onboarding15 {...commonProps} />;
      case 17:
        return <Onboarding17 {...commonProps} />;
      default:
        return <Onboarding1 {...commonProps} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentPage()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
});
