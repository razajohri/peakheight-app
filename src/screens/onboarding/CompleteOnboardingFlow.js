import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

// Import all onboarding pages
import Onboarding1 from './Onboarding1';
import Onboarding2 from './Onboarding2';
import Onboarding3 from './Onboarding3';
import Onboarding4 from './Onboarding4';
import Onboarding5 from './Onboarding5';
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
import Onboarding16 from './Onboarding16';
import Onboarding17 from './Onboarding17';
import Onboarding18 from './Onboarding18';
import Onboarding19 from './Onboarding19';

export default function CompleteOnboardingFlow({ onComplete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});

  const nextPage = () => {
    if (currentPage < 19) {
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

  const handleComplete = () => {
    onComplete(data);
  };

  const renderCurrentPage = () => {
    const navigation = {
      navigate: (screenName) => {
        if (screenName === 'Onboarding2') setCurrentPage(2);
        else if (screenName === 'Onboarding3') setCurrentPage(3);
        else if (screenName === 'Onboarding4') setCurrentPage(4);
        else if (screenName === 'Onboarding5') setCurrentPage(5);
        else if (screenName === 'Onboarding6') setCurrentPage(6);
        else if (screenName === 'Onboarding7') setCurrentPage(7);
        else if (screenName === 'Onboarding8') setCurrentPage(8);
        else if (screenName === 'Onboarding9') setCurrentPage(9);
        else if (screenName === 'Onboarding10') setCurrentPage(10);
        else if (screenName === 'Onboarding11') setCurrentPage(11);
        else if (screenName === 'Onboarding12') setCurrentPage(12);
        else if (screenName === 'Onboarding13') setCurrentPage(13);
        else if (screenName === 'Onboarding14') setCurrentPage(14);
        else if (screenName === 'Onboarding15') setCurrentPage(15);
        else if (screenName === 'Onboarding16') setCurrentPage(16);
        else if (screenName === 'Onboarding17') setCurrentPage(17);
        else if (screenName === 'Onboarding18') setCurrentPage(18);
        else if (screenName === 'Onboarding19') setCurrentPage(19);
        else if (screenName === 'Dashboard') handleComplete();
      }
    };

    switch (currentPage) {
      case 1:
        return <Onboarding1 navigation={navigation} />;
      case 2:
        return <Onboarding2 navigation={navigation} />;
      case 3:
        return <Onboarding3 navigation={navigation} />;
      case 4:
        return <Onboarding4 navigation={navigation} />;
      case 5:
        return <Onboarding5 navigation={navigation} />;
      case 6:
        return <Onboarding6 navigation={navigation} />;
      case 7:
        return <Onboarding7 navigation={navigation} />;
      case 8:
        return <Onboarding8 navigation={navigation} />;
      case 9:
        return <Onboarding9 navigation={navigation} />;
      case 10:
        return <Onboarding10 navigation={navigation} />;
      case 11:
        return <Onboarding11 navigation={navigation} />;
      case 12:
        return <Onboarding12 navigation={navigation} />;
      case 13:
        return <Onboarding13 navigation={navigation} />;
      case 14:
        return <Onboarding14 navigation={navigation} />;
      case 15:
        return <Onboarding15 navigation={navigation} />;
      case 16:
        return <Onboarding16 navigation={navigation} />;
      case 17:
        return <Onboarding17 navigation={navigation} />;
      case 18:
        return <Onboarding18 navigation={navigation} />;
      case 19:
        return <Onboarding19 navigation={navigation} />;
      default:
        return <Onboarding1 navigation={navigation} />;
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
