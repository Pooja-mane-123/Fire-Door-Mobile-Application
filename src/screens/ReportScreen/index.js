import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import React, {useEffect, useState} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackArrow from '@src/assets/images/BackArrow.png';
import dayjs from 'dayjs';
import CloseIcon from '@src/assets/images/closeImageIcon.png';

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

const ReportScreen = ({navigation, route}) => {
  const {qrScanData, inspectionData} = route.params;
  const [checked, setChecked] = useState({});
  const [images, setImages] = useState(inspectionData.images || []);
  const [status, setStatus] = useState(null);
  const [reinspection, setReinspection] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doorInspectionReportData, setDoorInspectionReportData] = useState({
    remarks: '',
  });

  // Filter questions based on the response IDs
  const filteredQuestions = inspectionQuestions.filter(q =>
    Object.keys(inspectionData.questions[0]).includes(q.id),
  );

  useEffect(() => {
    // Set initial checked state based on inspectionData
    const initialChecked = {};
    filteredQuestions.forEach(q => {
      initialChecked[q.id] = inspectionData.questions[0][q.id];
    });
    setChecked(initialChecked);

    // Determine status and reinspection based on the answers
    const hasFalseAnswer = Object.values(initialChecked).includes(false);
    const newStatus = hasFalseAnswer ? 'Failed' : 'Passed';
    const newReinspection = hasFalseAnswer ? 'Yes' : 'No';

    // Assuming there's a state for status and reinspection, update them
    setStatus(newStatus);
    setReinspection(newReinspection);
  }, []);

  const handleImagePress = uri => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderQuestion = ({item, index}) => {
    // Get the previous question's section name, or null if this is the first question
    const prevSection =
      index > 0 ? inspectionQuestions[index - 1].section : null;

    // Check if the current question's section is different from the previous one
    const showSectionHeader = item.section && item.section !== prevSection;

    const answer = checked[item.id] === true ? 'Yes' : 'No';

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

  const installedFormattedDate = dayjs(qrScanData?.door?.createdAt).format(
    'DD MMMM YYYY',
  );

  const renderHeaderComponent = () => {
    return (
      <>
        <View style={styles.headerContainer}>
          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.leftHeader}>
                <Text style={styles.textBold}>
                  {dayjs().format('DD MMMM YYYY')}
                </Text>
                <View style={styles.leftHeaderItem}>
                  <Text>QR </Text>
                  <Text style={styles.textBold}>
                    {!!qrScanData?.code && qrScanData?.code}
                  </Text>
                </View>

                <View style={styles.leftHeaderItem}>
                  <Text>INSTALLED </Text>
                  <Text style={styles.textBold}>
                    {' '}
                    {installedFormattedDate || 'NA'}
                  </Text>
                </View>

                <Text style={styles.label}>
                  {qrScanData?.director?.name || 'NA'}
                </Text>
              </View>

              <View style={styles.rightHeader}>
                <Text style={styles.textBold}>
                  {qrScanData?.door?.building?.name || 'NA'} -{' '}
                  {qrScanData?.door?.name || 'NA'}
                </Text>
              </View>
            </View>

            {/* Door Details Section */}
            <View style={styles.details}>
              <View style={styles.detailItem}>
                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Maker</Text>
                  <Text>{qrScanData?.door?.maker?.name || 'NA'}</Text>
                </View>

                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Material</Text>
                  <Text>{qrScanData?.door?.material?.name || 'NA'}</Text>
                </View>

                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Certifier</Text>
                  <Text>{qrScanData?.door?.certifier?.name || 'NA'}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Colour</Text>
                  <Text>{qrScanData?.door?.colour?.name || 'NA'}</Text>
                </View>

                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Glazing</Text>
                  <Text>
                    {qrScanData?.door?.glazedWindow === true ? 'YES' : 'NO'}
                  </Text>
                </View>

                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Rating</Text>
                  <Text>FD 30</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Status</Text>
                  <Text>{status || 'NA'}</Text>
                </View>

                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Checkpoints</Text>
                  <Text>
                    {Object.keys(inspectionData?.questions[0]).length || 0}
                  </Text>
                </View>

                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Images</Text>
                  <Text>{inspectionData?.images?.length || 0}</Text>
                </View>

                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Reinspection</Text>
                  <Text>{reinspection || 'NA'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  const renderFooterComponent = () => {
    return (
      <>
        <View style={styles.footer}>
          {/* Image Capture Section */}
          <Text style={styles.sectionHeader}>PHOTOS</Text>
          {/* <View style={styles.addPhotoItem}> */}
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
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.TopNavBar}>
        <View style={styles.navBarSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={BackArrow} style={styles.navBarIcon} />
          </TouchableOpacity>
          <Text style={styles.divider} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.IndexText}>INSPECTION REPORT</Text>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  TopNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
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
  content: {
    borderBottomColor: COLORS.primaryDarkGreyHex,
    borderBottomWidth: 1,
    marginBottom: SPACING.space_32,
  },
  header: {
    flexDirection: 'column',
    marginBottom: SPACING.space_16,
  },
  leftHeader: {
    flexDirection: 'row',
    gap: SPACING.space_12,
  },
  leftHeaderItem: {
    flexDirection: 'row',
    gap: SPACING.space_8,
    marginBottom: SPACING.space_16,
  },
  rightHeader: {
    alignItems: 'flex-start',
  },
  textBold: {
    fontWeight: 'bold',
  },
  label: {
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.greyDark,
    marginBottom: SPACING.space_8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.space_16,
  },
  detailItem: {
    width: '30%',
    gap: SPACING.space_8,
  },

  detailItemObject: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    paddingRight: SPACING.space_36,
    paddingLeft: SPACING.space_36,
    marginBottom: SPACING.space_60,
    marginTop: SPACING.space_32,
  },
  sectionHeader: {
    fontSize: FONTSIZE.size_16,
    marginBottom: SPACING.space_20,
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

  addPhotoItem: {
    borderColor: COLORS.primaryDarkGreyHex,
    borderWidth: 1,
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.space_24,
  },

  inspectionDeclarationText: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryGreyHex,
    marginTop: SPACING.space_30,
    marginBottom: SPACING.space_30,
  },

  inspectionDeclarationText1: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryGreyHex,
    marginBottom: SPACING.space_30,
  },

  inspectionDeclarationTextContainer: {
    borderBottomColor: COLORS.primaryDarkGreyHex,
    borderBottomWidth: 1,
  },

  completeInspection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  completeInspectionText: {
    color: COLORS.seventhGreyHex,
    fontSize: FONTSIZE.size_14,
    backgroundColor: COLORS.forthGreyHex,
    // margin: 20,
    marginTop: SPACING.space_28,
    marginBottom: SPACING.space_28,
    padding: 12,
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
});

export default ReportScreen;
