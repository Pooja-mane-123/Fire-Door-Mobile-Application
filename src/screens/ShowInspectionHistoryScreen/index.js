import React, {useEffect, useState} from 'react';
import {getReportById} from '@src/redux/thunks/userThunk';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackArrow from '@src/assets/images/BackArrow.png';
import UserImage from '@src/assets/images/UserImage.png';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import {useDispatch} from 'react-redux';
import dayjs from 'dayjs';
import CloseIcon from '@src/assets/images/closeImageIcon.png';

export default function ShowInspectionHistoryScreen({navigation, route}) {
  const {id, inspectionHistoryData} = route.params;
  console.log(inspectionHistoryData);
  const dispatch = useDispatch();
  const [inspectionReportData, setInspectionReportData] = useState({});
  const [images, setImages] = useState(
    inspectionReportData?.doorInspectionPhotos || [],
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState({});

  useEffect(() => {
    getInspectionReportData();
  }, []);

  const getInspectionReportData = async () => {
    try {
      const payload = {
        reportId: id,
        id: inspectionHistoryData?.door?.id,
      };
      const response = await dispatch(getReportById(payload)).unwrap();
      setInspectionReportData(response);
    } catch (error) {
      console.log('error', error);
    }
  };
  console.log('inspectionReportData', inspectionReportData);

  const inspectionQuestions = [
    {
      id: 'q1',
      section: 'DOOR LEAF & FRAME',
      text: 'Is the door leaf free from damage (e.g., cracks, warping, holes)?',
    },
    {
      id: 'q2',
      text: 'Is the door frame securely attached to the wall and in good condition?',
    },
    {
      id: 'q3',
      section: 'SEALS',
      text: 'Are the intumescent seals intact and continuous around the door leaf or frame?',
    },
    {
      id: 'q4',
      text: 'Are the smoke seals in place and undamaged?',
    },
    {
      id: 'q5',
      section: 'SELF CLOSING DEVICE',
      text: 'Does the device close the door fully & securely from any open position?',
    },
    {
      id: 'q6',
      text: 'Is the device functioning smoothly without sticking or excessive force?',
    },
    {
      id: 'q7',
      section: 'GAPS & CLEARANCES',
      text: 'Is the gap between the door leaf & frame consistently around 3mm (+-1mm)?',
    },
    {
      id: 'q8',
      text: 'Is the gap under the door within the acceptable range? (8-10mm)?',
    },
    {
      id: 'q9',
      section: 'HINGES',
      text: 'Are the hinges CE marked and fire-rated?',
    },
    {
      id: 'q10',
      text: 'Are all screws in place, tightened, and not damaged?',
    },
    {
      id: 'q11',
      section: 'LOCKS & LATCHES',
      text: 'Are the locks and latches functioning correctly and in good condition?',
    },

    {
      id: 'q12',
      text: 'Are they CE marked and fire-rated?',
    },

    {
      id: 'q13',
      section: 'GLASS & GLAZING (IF APPLICABLE)',
      text: 'Is the glazing fire-resistant and free from damage (cracks, holes, etc.)?',
    },

    {
      id: 'q14',
      text: 'Are the glazing beads & intumescent glazing seals in good condition and securely fixed?',
    },

    {
      id: 'q15',
      section: 'FIRE DOOR SIGNS',
      text: 'Is the fire door signage present and clearly visible on both sides of the door?',
    },

    {
      id: 'q16',
      text: 'Does the signage indicate "Fire Door - Keep Shut"(or "Fire Door - Keep Locked" if applicable)?',
    },

    {
      id: 'q17',
      section: 'DOOR OPERATION',
      text: 'Does the door open and close without obstruction?',
    },

    {
      id: 'q18',
      text: 'Can the door be held open only by an automatic release mechanism linked to the fire alarm system?',
    },

    {
      id: 'q19',
      section: 'CERTIFICATION & LABELS',
      text: 'Is the fire door certification label or plug present and legible?',
    },

    {
      id: 'q20',
      text: 'Is there documentation available to confirm the fire rating of the door and its components?',
    },

    {
      id: 'q21',
      text: 'Are any issues noted in previous inspections resolved and documented?',
    },
  ];

  const handleImagePress = uri => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderQuestion = ({item, index}) => {
    console.log('item', item);
    // Get the previous question's section name, or null if this is the first question
    const prevSection =
      index > 0 ? inspectionQuestions[index - 1].section : null;

    // Check if the current question's section is different from the previous one
    const showSectionHeader = item.section && item.section !== prevSection;

    const answer = item.id == true ? 'Yes' : 'No';

    return (
      <>
        {/* Render the section header if this is the first question of the section */}
        {showSectionHeader && (
          <Text style={styles.sectionHeader}>{item.section}</Text>
        )}
        <View style={styles.question}>
          <Text style={styles.questionText}>{item.text}</Text>
          <View style={styles.options}>
            <View style={styles.option}>
              <Text style={styles.answerText}>{answer}</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const reInspection = inspectionReportData?.checkpoints?.includes(false);
  const reInspectionStatus = reInspection ? 'Yes' : 'No';
  const status = reInspection ? 'Failed' : 'Passed';

  const renderHeaderComponent = () => {
    return (
      <View style={styles.inspectionItem}>
        <View style={styles.inspectionHeader}>
          <Text style={styles.inspectionDate}>
            {dayjs(inspectionReportData?.createdAt).format('DD MMMM YYYY')}
          </Text>
          <Text style={styles.inspectionQRCode}>
            QR -{' '}
            {inspectionReportData?.doorInspection?.door?.qRCode?.code || 'NA'}
          </Text>
          <Text style={styles.inspectorName}>
            {inspectionReportData?.doorInspection?.door?.building?.director
              ?.name || 'NA'}
          </Text>
        </View>

        <View style={styles.inspectionHistoryContainer}>
          <View>
            <Text style={styles.location}>
              {inspectionReportData?.doorInspection?.door?.building?.name ||
                'NA'}{' '}
              - {inspectionReportData?.doorInspection?.door?.name || 'NA'}
            </Text>

            <View style={styles.comment}>
              <Text style={styles.detailLabel}>COMMENTS:</Text>
              <Text style={styles.detailValue}>
                {inspectionReportData?.remarks?.additionalNotes ||
                  'No Comments'}
              </Text>
            </View>
          </View>

          <View style={styles.inspectionDetails}>
            <View style={styles.detailRowStatus}>
              <Text style={styles.detailLabel}>STATUS:</Text>
              <Text style={styles.detailValue}>
                {inspectionReportData?.checkpoints
                  ? Array.isArray(inspectionReportData.checkpoints)
                    ? inspectionReportData.checkpoints.length > 0
                      ? Object.keys(inspectionReportData.checkpoints[0]).length
                      : 0
                    : Object.keys(inspectionReportData.checkpoints).length
                  : 0}
                /21
              </Text>
              <Text style={styles.detailValue}>{status || 'NA'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>IMAGES:</Text>
              <Text style={styles.detailValue}>
                {inspectionReportData?.doorInspectionPhotos?.length || 0}
              </Text>
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
    );
  };

  const renderFooterComponent = () => {
    return (
      <View style={styles.footer}>
        {/* Image Capture Section */}
        <Text style={styles.sectionHeader}>PHOTOS</Text>
        <ScrollView
          style={styles.photoContainer}
          horizontal={true} // Enable horizontal scrolling
          showsHorizontalScrollIndicator={false} // Optionally hide the scroll indicator
        >
          {/* Captured Images */}
          <View style={styles.capturedPhotoContainer}>
            {images.length > 0 ? (
              images.map((imageUri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImagePress(imageUri)}>
                  <Image
                    key={index}
                    source={{uri: imageUri}}
                    style={styles.capturedImage}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.addPhotoItem}>
                <Text></Text>
              </View>
            )}
          </View>
        </ScrollView>

        <Text style={styles.inspectionRemarksText}>
          INSPECTION REMARKS / RECOMMENDATIONS
        </Text>

        <View style={styles.inspectionRemarkContainer}>
          <Text style={styles.remarkText}>No</Text>
        </View>

        {/* Image Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={handleCloseModal}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={handleCloseModal}>
              <Image source={CloseIcon} style={styles.modalCloseButton} />
            </TouchableOpacity>

            <Image source={{uri: selectedImage}} style={styles.modalImage} />
          </View>
        </Modal>
      </View>
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

      {/* Inspection Questions Section */}
      <View style={styles.section}>
        <FlatList
          data={inspectionQuestions}
          renderItem={renderQuestion}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderHeaderComponent}
          ListFooterComponent={renderFooterComponent}
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

  section: {
    paddingRight: SPACING.space_36,
    paddingLeft: SPACING.space_36,
    marginBottom: SPACING.space_60,
    marginTop: SPACING.space_32,
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

  photoContainer: {
    flexDirection: 'row',
    gap: SPACING.space_24,
  },

  capturedPhotoContainer: {
    flexDirection: 'row',
    gap: SPACING.space_24,
    marginBottom: SPACING.space_32,
    borderColor: COLORS.primaryDarkGreyHex,
  },

  cameraIcon: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },

  capturedImage: {
    width: 150,
    height: 150,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: SPACING.space_24,
    borderBottomColor: COLORS.primaryDarkGreyHex,
    borderBottomWidth: 1,
    borderColor: COLORS.primaryDarkGreyHex,
    borderWidth: 2,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.9,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  modalCloseButton: {
    width: 50,
    height: 50,
    marginRight: SPACING.space_30,
    alignSelf: 'flex-end',
    marginTop: SPACING.space_12,
  },
  modalCloseButtonText: {
    color: COLORS.primaryWhiteRgb,
    fontSize: FONTSIZE.size_14,
  },

  inspectionRemarkContainer: {
    marginTop: SPACING.space_20,
    marginBottom: SPACING.space_24,
  },

  remarkText: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryGreyHex,
    fontWeight: 'bold',
  },

  inspectionRemarksText: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryGreyHex,
    marginTop: SPACING.space_28,
  },
  sectionHeader: {
    fontSize: FONTSIZE.size_16,
    marginBottom: SPACING.space_20,
  },
  addPhotoItem: {
    borderColor: COLORS.primaryDarkGreyHex,
    borderWidth: 1,
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.space_24,
  },
  question: {
    marginBottom: SPACING.space_10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionText: {
    marginBottom: SPACING.space_8,
    flexShrink: 1,
    fontWeight: 'bold',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.space_16,
  },

  answerText: {
    color: COLORS.primaryGreyHex,
    fontWeight: 'bold',
  },
});
