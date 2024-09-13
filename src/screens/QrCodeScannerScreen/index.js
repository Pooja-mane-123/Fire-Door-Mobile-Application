import React, {useEffect, useState} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import BackArrow from '@src/assets/images/BackArrow.png';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import {useDispatch} from 'react-redux';
import {getQrCodeById} from '@src/redux/thunks/userThunk';

const QrCodeScannerScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [qrScanData, setQrScanData] = useState(null);

  useEffect(() => {
    // No need to call getQrData on component mount
  }, []);

  const onSuccess = async e => {
    try {
      // Fetch QR code data based on the scanned code
      const qrData = await dispatch(getQrCodeById(e.data)).unwrap();
      setQrScanData(qrData);

      // Navigate to QRScanResultScreen with the fetched data
      navigation.navigate('QRScanResult', {qrScanData: qrData});
    } catch (error) {
      navigation.navigate('QRScanResult', {qrScanData: {}});
      console.log('QR Code Scan Error:', error);
      setQrScanData({});
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.TopNavBar}>
        <View style={styles.navBarSection}>
          <TouchableOpacity onPress={() => navigation.navigate('Index')}>
            <Image source={BackArrow} style={styles.navBarIcon} />
          </TouchableOpacity>
          <Text style={styles.divider} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.IndexText}>INSPECTING...</Text>
        </View>
      </View>

      {/* QR Code Scanner */}
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.off}
        showMarker
        customMarker={
          <View>
            <View style={styles.customMarkerContainer}>
              <View style={styles.markerCornerTopLeft} />
              <View style={styles.markerCornerTopRight} />
              <View style={styles.markerCornerBottomLeft} />
              <View style={styles.markerCornerBottomRight} />
            </View>
            <View
              style={{
                color: 'white',
                justifyContent: 'center',
                padding: 20,
                alignItems: 'center',
              }}>
              <Text style={{color: 'white'}}>SCAN QR CODE TO PROCEED</Text>
            </View>
          </View>
        }
        topViewStyle={styles.zeroContainer}
        bottomViewStyle={styles.zeroContainer}
        cameraStyle={styles.cameraContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TopNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333', // Example background color
    height: 70,
  },
  navBarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBarIcon: {
    width: 40,
    height: 40,
    margin: SPACING.space_18,
  },
  divider: {
    borderRightColor: COLORS.primaryDarkGreyHex,
    borderRightWidth: 2,
    height: 70,
  },
  titleContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  IndexText: {
    color: COLORS.primaryLightGreyHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
  },
  cameraContainer: {
    height: '100%',
  },
  zeroContainer: {
    height: 0,
    flex: 0,
  },
  customMarkerContainer: {
    width: 250, // Marker size, adjust if needed
    height: 250, // Marker size, adjust if needed
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  markerCornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30, // Size of the corner line, adjust if needed
    height: 30, // Size of the corner line, adjust if needed
    borderLeftWidth: 4, // Thickness of the line, adjust if needed
    borderTopWidth: 4, // Thickness of the line, adjust if needed
    borderColor: 'white',
  },
  markerCornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: 'white',
  },
  markerCornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: 'white',
  },
  markerCornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: 'white',
  },
});

AppRegistry.registerComponent('default', () => QrCodeScannerScreen);
export default QrCodeScannerScreen;
