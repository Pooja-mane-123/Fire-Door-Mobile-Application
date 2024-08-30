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
import dayjs from 'dayjs';

const QrCodeResultScreen = ({navigation, route}) => {
  const {qrScanData} = route.params;

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

    const installedFormattedDate = dayjs(
      qrScanData?.door?.createdAt || 'NA',
    ).format('DD MMM YYYY');

    const inspectionFormattedDate = dayjs(
      qrScanData?.door?.lastInspectionDate,
    ).format('DD MMM YYYY');

    const doorInspections = qrScanData?.door?.doorInspections;
    const passedInspection = doorInspections?.find(
      inspection =>
        inspection.doorInspectionStatus.label === 'Passed' ||
        inspection.doorInspectionStatus.label === 'Failed' ||
        'NA',
    );

    // QR Code Success Content
    return (
      <View style={styles.contentContainer}>
        <View style={styles.qrDetailsContainer}>
          <View style={styles.qrCodeContainer}>
            {/* Generate QR Code from a string */}
            <QRCode
              value={!!qrScanData?.code && qrScanData?.code} // Replace with your dynamic string if needed
              size={200}
              color={COLORS.primaryDarkGreyHex}
            />
          </View>
          <View style={styles.details}>
            <View style={styles.qRDetails}>
              <Text style={styles.qrCodeText}>QR</Text>
              <Text>{!!qrScanData?.code && qrScanData?.code}</Text>
            </View>

            <View style={styles.qRDetails}>
              <Text style={styles.label}>DIRECTOR</Text>
              <Text style={styles.label}>
                {qrScanData?.director?.name || 'NA'}
              </Text>
            </View>

            <View style={styles.qRDetails}>
              <Text style={styles.label}>BUILDING </Text>
              <Text style={styles.label}>
                {qrScanData?.door?.building?.name || 'NA'}
              </Text>
            </View>

            <View style={styles.qRDetails}>
              <Text style={styles.label}>DOOR</Text>
              <Text style={styles.label}>{qrScanData?.door?.name || 'NA'}</Text>
            </View>

            <View style={styles.qRDetails}>
              <Text style={styles.label}>DESCRIPTION</Text>
              <Text style={styles.description}>
                {qrScanData?.door?.locationDescription || 'NA'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <View style={styles.doorInfo}>
              <Text style={styles.infoLabel}>MATERIAL</Text>
              <Text style={styles.infoText}>
                {qrScanData?.door?.material?.name || 'NA'}
              </Text>
            </View>

            <View style={styles.doorInfo}>
              <Text style={styles.infoLabel}>COLOUR</Text>
              <Text style={styles.infoText}>
                {qrScanData?.door?.colour?.name || 'NA'}
              </Text>
            </View>

            <View style={styles.doorInfo}>
              <Text style={styles.infoLabel}>GLAZED WIN</Text>
              <Text style={styles.infoText}>
                {qrScanData?.door?.glazedWindow === true ? 'YES' : 'NO'}
              </Text>
            </View>

            <View style={styles.doorInfo}>
              <Text style={styles.infoLabel}>CERTIFIER</Text>
              <Text style={styles.infoText}>
                {qrScanData?.door?.certifier?.name || 'NA'}
              </Text>
            </View>

            <View style={styles.doorInfo}>
              <Text style={styles.infoLabel}>RATING</Text>
              <Text style={styles.infoText}>
                {qrScanData?.door?.rating?.name || 'NA'}
              </Text>
            </View>

            <View style={styles.doorInfo}>
              <Text style={styles.infoLabel}>INSTALLED</Text>
              <Text style={styles.infoText}>
                {installedFormattedDate || 'NA'}
              </Text>
            </View>
          </View>
          <View style={styles.inspectionInfoSection}>
            <View style={styles.doorInfo}>
              <Text style={styles.infoLabel}>LAST INSPECTION DATE</Text>
              <Text style={styles.infoText}>
                {inspectionFormattedDate || 'NA'}
              </Text>
            </View>

            <View style={styles.doorInfo}>
              <Text style={styles.infoLabel}>INSPECTED BY</Text>
              <View>
                {qrScanData?.door?.building?.inspectors?.map(
                  (inspector, index) => (
                    <Text key={index} style={styles.infoText}>
                      {inspector.name}
                    </Text>
                  ),
                )}
              </View>
            </View>

            <View style={styles.doorInfo}>
              <Text style={styles.infoLabel}>STATUS</Text>
              <Text style={styles.infoText}>
                {passedInspection?.doorInspectionStatus?.label || 'NA'}
              </Text>
            </View>

            <View style={styles.doorInfoComment}>
              <Text style={styles.infoLabel}>COMMENTS</Text>
              <Text style={styles.infoText}>
                Signs not fully legible. Need to be re-painted / replaced. And
                please avoid chaining dogs to the door.
              </Text>
            </View>
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
          onPress={() =>
            navigation.navigate('ContinueInspection', {
              qrScanData: qrScanData,
            })
          }>
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
    paddingRight: SPACING.space_60,
    paddingLeft: SPACING.space_60,
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
    gap: SPACING.space_50,
    marginBottom: SPACING.space_20,
    borderBottomColor: COLORS.primaryDarkGreyHex,
    borderBottomWidth: 2,
  },
  qrCodeContainer: {
    // flex: 1,
    // alignItems: 'center',
    marginBottom: SPACING.space_20,
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

  qRDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.greyDark,
    marginBottom: SPACING.space_8,
  },

  description: {
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.greyDark,
    marginBottom: SPACING.space_8,
    marginLeft: SPACING.space_50,
    flexShrink: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    marginBottom: SPACING.space_20,
  },
  infoSection: {
    flex: 1,
  },

  inspectionInfoSection: {
    flex: 1,
    paddingLeft: SPACING.space_50,
  },

  doorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.space_10,
    // marginRight: SPACING.space_36,
    gap: SPACING.space_30,
  },

  doorInfoComment: {
    flexDirection: 'column',
    marginRight: SPACING.space_36,
    paddingLeft: SPACING.space_10,
  },

  infoTextComment: {
    marginBottom: SPACING.space_16,
    fontSize: FONTSIZE.size_12,
  },

  infoLabel: {
    fontSize: FONTSIZE.size_12,
    fontFamily: FONTFAMILY.poppins_light,
    color: COLORS.primaryGreyHex,
  },
  infoText: {
    fontSize: FONTSIZE.size_12,
    fontFamily: FONTFAMILY.poppins_bold,
    color: COLORS.primaryGreyHex,
    marginBottom: SPACING.space_4,
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
