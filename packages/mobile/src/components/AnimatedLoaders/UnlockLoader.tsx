import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import UnlockLottie from '../../assets/lotties/unlock.json';

const UnlockLoader = () => {
  return (
    <LottieView
      style={[StyleSheet.absoluteFillObject, styles.container]}
      source={UnlockLottie}
      autoPlay
      loop
    />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 1,
  },
});

export default UnlockLoader;
