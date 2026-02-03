import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => {
  return (
    <Image
      source={require('../../assets/images/logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 180,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default Logo;
