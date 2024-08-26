'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import FiredoorLogo from '@src/assets/images/firedoor_logo.png';
import QRCode from 'react-native-qrcode-svg'; // Import QRCode component

const QrCodeResultScreen = ({navigation, route}) => {
  const {qrScanData} = route.params;
  console.log('qrScanData', qrScanData);

  const renderQRContent = () => {
    let headerStyle = styles.headerText;
    let errorMessageStyle = styles.errorMessage;

    if (Object.keys(qrScanData).length === 0) {
      // Handle case where QR scan data is an empty object
      headerStyle = styles.headerTextInvalid;
      errorMessageStyle = styles.errorMessageInvalid;
      return (
        <View style={styles.contentContainer}>
          <Text style={errorMessageStyle}>
            The scanned QR code is not recognized as a valid code.
          </Text>
        </View>
      );
    }

    if (qrScanData.doorId === null) {
      // Handle case where QR scan data is valid but doorId is null
      headerStyle = styles.headerTextNotInstalled;
      errorMessageStyle = styles.errorMessageNotInstalled;
      return (
        <View style={styles.contentContainer}>
          <Text style={errorMessageStyle}>
            The scanned QR code has not been installed on a door yet.
          </Text>
        </View>
      );
    }

    // QR Code Success Content
    return (
      <View style={styles.contentContainer}>
        <View style={styles.qrDetailsContainer}>
          <View style={styles.qrCodeContainer}>
            {/* Generate QR Code from a string */}
            <QRCode
              value={!!qrScanData?.code && qrScanData?.code} // Replace with your dynamic string if needed
              size={230}
              color={COLORS.primaryDarkGreyHex}
            />
          </View>
          <View style={styles.details}>
            <Text style={styles.qrCodeText}>
              QR: {!!qrScanData?.code && qrScanData?.code}
            </Text>
            <Text style={styles.label}>DIRECTOR: Edmund Blackadder</Text>
            <Text style={styles.label}>BUILDING: Blackadder Mansion</Text>
            <Text style={styles.label}>DOOR: East Wing</Text>
            <Text style={styles.label}>
              DESCRIPTION: Opens into the eastern wing, access via Main Hall on
              the ground floor
            </Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>MATERIAL:</Text>
            <Text style={styles.infoText}>Timber</Text>
            <Text style={styles.infoLabel}>COLOUR:</Text>
            <Text style={styles.infoText}>Dark Red</Text>
            <Text style={styles.infoLabel}>GLAZED WIN:</Text>
            <Text style={styles.infoText}>Yes</Text>
            <Text style={styles.infoLabel}>CERTIFIER:</Text>
            <Text style={styles.infoText}>bwf certfire</Text>
            <Text style={styles.infoLabel}>RATING:</Text>
            <Text style={styles.infoText}>FD 30</Text>
            <Text style={styles.infoLabel}>INSTALLED:</Text>
            <Text style={styles.infoText}>20th Jan 2024</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>LAST INSPECTION:</Text>
            <Text style={styles.infoText}>DATE: 22 August 2024</Text>
            <Text style={styles.infoText}>INSPECTED BY: Jim Morisson</Text>
            <Text style={styles.infoText}>STATUS: FAILED</Text>
            <Text style={styles.infoText}>
              COMMENTS: Signs not fully legible. Need to be re-painted /
              replaced. And please avoid chaining dogs to the door.
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primaryWhiteRgb} />

      <View style={styles.TopNavBar}>
        <View style={styles.navBarSection}>
          <Image style={styles.FireDoorImage} source={FiredoorLogo} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.IndexText}>INSPECTING...</Text>
        </View>
      </View>

      <View style={styles.qRContainer}>
        <Text
          style={
            Object.keys(qrScanData).length === 0
              ? styles.invalidQr
              : styles.errorMessage
          }>
          INVALID QR CODE
        </Text>

        <Text
          style={qrScanData.doorId ? styles.successQr : styles.errorMessage}>
          QR SCAN SUCCESS
        </Text>

        <Text
          style={
            qrScanData?.doorId === null
              ? styles.notInstalledQr
              : styles.errorMessage
          }>
          QR NOT INSTALLED
        </Text>
      </View>

      {renderQRContent()}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>GO BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ContinueInspectionScreen')}>
          <Text style={styles.buttonText}>CONTINUE INSPECTION</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryWhiteRgb,
  },
  TopNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.tertiaryGreyHex,
    height: 70,
  },
  navBarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  FireDoorImage: {
    width: 60,
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: SPACING.space_8,
  },
  titleContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  IndexText: {
    color: COLORS.primaryGreyHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
  },

  qRContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.space_50,
  },

  invalidQr: {
    color: COLORS.primaryGreyHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
  },

  successQr: {
    color: COLORS.primaryGreyHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
  },

  notInstalledQr: {
    color: COLORS.primaryGreyHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
  },
  contentContainer: {
    padding: SPACING.space_20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey,
    paddingBottom: SPACING.space_10,
    marginBottom: SPACING.space_20,
  },
  headerText: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryDarkGreyHex, // default color
  },
  headerTextInvalid: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryDarkGreyHex, // invalid QR code color
  },
  headerTextNotInstalled: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryDarkGreyHex, // QR not installed color
  },
  qrDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.space_20,
  },
  qrCodeContainer: {
    flex: 1,
    alignItems: 'center',
    // marginRight: SPACING.space_10,
    // margin: SPACING.space_10

  },
  qrCode: {
    width: 100,
    height: 100,
    // marginBottom: SPACING.space_10,
  },
  qrCodeText: {
    fontSize: FONTSIZE.size_14,
    color: COLORS.primary,

  },
  details: {
    // flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    flex: 1,
    gap: SPACING.space_15,
    
  },
  label: {
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.greyDark,
    marginBottom: SPACING.space_8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.space_20,
  },
  infoSection: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONTSIZE.size_12,
    fontFamily: FONTFAMILY.poppins_bold,
    color: COLORS.grey,
  },
  infoText: {
    fontSize: FONTSIZE.size_12,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.greyDark,
    marginBottom: SPACING.space_5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SPACING.space_15,
    borderRadius: 5,
    alignItems: 'center',
    margin: SPACING.space_10,
  },
  buttonText: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.sixthGreyHex,
    backgroundColor: COLORS.primaryDarkGreyHex,
    padding: SPACING.space_10,
  },
  errorMessage: {
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.sixthGreyHex, // default error color
  },
  errorMessageInvalid: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryDarkGreyHex, // invalid QR code error color
    textAlign: 'center',
    marginVertical: SPACING.space_20,
  },
  errorMessageNotInstalled: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryDarkGreyHex, // QR not installed error color
    textAlign: 'center',
    marginVertical: SPACING.space_20,
  },
});

export default QrCodeResultScreen;
