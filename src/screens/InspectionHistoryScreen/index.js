import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackArrow from '@src/assets/images/BackArrow.png';
import UserImage from '@src/assets/images/UserImage.png';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import {getInspectorInspectionHistory} from '@src/redux/thunks/userThunk';
import {useDispatch} from 'react-redux';
import dayjs from 'dayjs';

export default function InspectionHistoryScreen({navigation}) {
  const dispatch = useDispatch();
  const [inspectionHistoryData, setInspectionHistoryData] = useState([]);

  useEffect(() => {
    getInspectorInspectionHistoryData();
  }, []);

  const getInspectorInspectionHistoryData = async () => {
    try {
      const inspectorId = 5;
      const response = await dispatch(
        getInspectorInspectionHistory(inspectorId),
      ).unwrap();
      setInspectionHistoryData(response);
    } catch (error) {
      console.log('error', error);
    }
  };

  console.log('inspectionHistoryData', inspectionHistoryData);

  const renderInspectionItem = ({item}) => {
    const inspectionDate =
      item?.doorinspectionInspectionReport?.length > 0
        ? dayjs(item.doorinspectionInspectionReport[0]?.createdAt).format(
            'DD MMMM YYYY',
          )
        : 'NA';

    const comments =
      item?.doorinspectionInspectionReport?.length > 0
        ? item?.doorinspectionInspectionReport[0]?.remarks?.additionalNotes
        : 'NA';

    const checkPointLength =
      item?.doorinspectionInspectionReport?.length > 0 &&
      item.doorinspectionInspectionReport[0]?.checkpoints
        ? Array.isArray(item.doorinspectionInspectionReport[0].checkpoints)
          ? Object.keys(item.doorinspectionInspectionReport[0].checkpoints[0])
              .length
          : Object.keys(item.doorinspectionInspectionReport[0].checkpoints)
              .length
        : 0;

    const reInspection = item?.doorinspectionInspectionReport?.length > 0;
    const reInspectionStatus = reInspection ? 'Yes' : 'No';
    const status = reInspection ? 'Failed' : 'Passed';

    const imageLength =
      item?.doorinspectionInspectionReport?.length > 0
        ? item.doorinspectionInspectionReport[0]?.doorInspectionPhotos?.length
        : 0;

    const qrCode = item?.door?.qRCode?.code || 'NA';
    const directorName = item?.door?.building?.director?.name || 'NA';
    const buildingName = item?.door?.building?.name || 'NA';

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ShowReportHistory', {
            id: item.id,
            inspectionHistoryData: item,
          })
        }>
        <View style={styles.inspectionItem}>
          <View style={styles.inspectionHeader}>
            <Text style={styles.inspectionDate}>{inspectionDate}</Text>
            <Text style={styles.inspectionQRCode}>{qrCode}</Text>
            <Text style={styles.inspectorName}>{directorName}</Text>
          </View>

          <View style={styles.inspectionHistoryContainer}>
            <View>
              <Text style={styles.location}>
                {buildingName || 'NA'} - {item?.door?.name || 'NA'}
              </Text>

              <View style={styles.comment}>
                <Text style={styles.detailLabel}>COMMENTS:</Text>
                <Text style={styles.detailValue}>
                  {comments || 'No Comments'}
                </Text>
              </View>
            </View>

            <View style={styles.inspectionDetails}>
              <View style={styles.detailRowStatus}>
                <Text style={styles.detailLabel}>STATUS:</Text>
                <Text style={styles.detailValue}>
                  {checkPointLength || 0}/ 21
                </Text>
                <Text style={styles.detailValue}>{status || 'NA'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>IMAGES:</Text>
                <Text style={styles.detailValue}>{imageLength || 0}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>RE-INSPECTION:</Text>
                <Text style={styles.detailValue}>
                  {reInspectionStatus || 'No'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.SafeAreaViewFlex}>
      <StatusBar backgroundColor={COLORS.primaryWhiteRgb} />

      <View style={styles.TopNavBar}>
        <View style={styles.navBarSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{
                width: 80,
                height: 70,
                backgroundColor: COLORS.forthGreyHex,
              }}>
              <Image source={BackArrow} style={styles.navBarIcon} />
            </View>
          </TouchableOpacity>
          <Text style={styles.divider}></Text>
        </View>

        <View style={styles.navBarSection}>
          <Text style={styles.IndexText}>Inspection History</Text>
        </View>

        <View style={styles.UserImageContainer}>
          <Text style={styles.divider}></Text>
          <Image source={UserImage} style={styles.UserImage} />
        </View>
      </View>
      <View style={styles.container}>
        <FlatList
          data={inspectionHistoryData}
          renderItem={renderInspectionItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeAreaViewFlex: {
    flex: 1,
    backgroundColor: COLORS.primaryWhiteRgb,
  },
  ScrollViewFlex: {
    flexGrow: 1,
    paddingHorizontal: SPACING.space_20,
  },
  TopNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.space_2,
    backgroundColor: COLORS.forthGreyHex,
    height: 70,
  },
  navBarIcon: {
    width: 40,
    height: 40,
    margin: SPACING.space_18,
  },
  IndexText: {
    color: COLORS.primaryLightGreyHex,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_20,
  },
  UserImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  FireDoorImage: {
    width: 60,
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: SPACING.space_8,
  },
  divider: {
    borderRightColor: COLORS.primaryDarkGreyHex,
    borderRightWidth: 2,
    height: 70,
  },
  UserImage: {
    width: 40,
    height: 40,
    margin: SPACING.space_20,
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.primaryWhiteRgb,
  },
  inspectionItem: {
    padding: 16,
    marginVertical: 10,
    borderBottomColor: COLORS.primaryDarkGreyHex,
    borderBottomWidth: 1,
  },
  inspectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inspectionDate: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  inspectionQRCode: {
    fontSize: 14,
    color: '#666',
  },
  inspectorName: {
    fontSize: 14,
    color: '#666',
  },

  inspectionHistoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  inspectionDetails: {
    flexDirection: 'column',
    gap: 10,
    paddingTop: 8,
  },

  detailRowStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },

  comment: {
    flexDirection: 'column',
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 60,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
});
