import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {COLORS, SPACING, FONTFAMILY, FONTSIZE} from '@src/theme';

const LoadingScreen = () => {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading</Text>
        <ActivityIndicator
          size="large"
          color={COLORS.primaryWhiteRgb}
          style={styles.loader}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10000, // Ensure the loading screen is above other content
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondaryBlueHex,
    paddingHorizontal: 20,
    paddingVertical: SPACING.space_10,
  },
  loader: {},
  loadingText: {
    paddingRight: SPACING.space_20,
    color: COLORS.primaryWhiteRgb,
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_medium,
  },
});

export default LoadingScreen;
