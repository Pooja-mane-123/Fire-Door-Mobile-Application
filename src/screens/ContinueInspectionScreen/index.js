import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Checkbox} from 'react-native-paper';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import FiredoorLogo from '@src/assets/images/firedoor_logo.png';
import {launchCamera} from 'react-native-image-picker';
import CamaraIcon from '@src/assets/images/camara.png';
import CloseIcon from '@src/assets/images/closeImageIcon.png';
import dayjs from 'dayjs';

const ContinueInspectionScreen = ({navigation, route}) => {
  const {qrScanData} = route.params;
  console.log('qrScanData', qrScanData);
  const [checked, setChecked] = useState({});
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCheck = (id, value) => {
    setChecked(prevChecked => ({
      ...prevChecked,
      [id]: value, // set to true or false
    }));
  };

  const handleCameraOpen = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: true,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const source = {uri: response.assets[0].uri};
          console.log('Image URI: ', source.uri);
          setImages(prevImages => [...prevImages, source.uri]); // Append new image to the list
          console.log('Image URI: ', source.uri);
        }
      },
    );
  };

  const handleImagePress = uri => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  console.log(selectedImage, 'selectedImage');

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const handleCompleteInspection = () => {
    const inspectionData = {
      questions: [checked],
      images: images,
      date: new Date().toLocaleDateString(),
    };

    // Save the inspection data (this could be to local storage, a database, etc.)
    console.log('Inspection Completed:', inspectionData);

    // Navigate to the next screen, e.g., InspectionSummaryScreen
    navigation.navigate('InspectionReport', {
      qrScanData: qrScanData,
      inspectionData: inspectionData,
    });
  };

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

  const renderQuestion = ({item, index}) => {
    // Get the previous question's section name, or null if this is the first question
    const prevSection =
      index > 0 ? inspectionQuestions[index - 1].section : null;

    // Check if the current question's section is different from the previous one
    const showSectionHeader = item.section && item.section !== prevSection;

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
              <Checkbox
                value="yes"
                status={checked[item.id] === true ? 'checked' : 'unchecked'}
                onPress={() => handleCheck(item.id, true)}
              />
              <Text>Yes</Text>
            </View>
            <View style={styles.option}>
              <Checkbox
                value="no"
                status={checked[item.id] === false ? 'checked' : 'unchecked'}
                onPress={() => handleCheck(item.id, false)}
              />
              <Text>No</Text>
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
                  <Text>INSPECTING...</Text>
                </View>

                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Checkpoints</Text>
                  <Text>INSPECTING...</Text>
                </View>

                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Images</Text>
                  <Text>INSPECTING...</Text>
                </View>

                <View style={styles.detailItemObject}>
                  <Text style={styles.textBold}>Reinspection</Text>
                  <Text>INSPECTING...</Text>
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
          <Text style={styles.sectionHeader}>ADD PHOTOS</Text>
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

            {/* </View> */}
            <View style={styles.addPhotoItem}>
              {/* Camera Icon to take a photo */}
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleCameraOpen}>
                <Image source={CamaraIcon} style={styles.cameraIcon} />
                <Text>Take a Photo</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.inspectionDeclarationTextContainer}>
            <Text style={styles.inspectionDeclarationText}>
              Ensure that the entire fire door assembly, including the frame,
              hardware, and any glazing, complies with the relevant British
              Standards.{' '}
            </Text>
            <Text style={styles.inspectionDeclarationText1}>
              Confirm that the door and all its components are tested
              periodically as part of the building's fire safety management
              plan.
            </Text>
          </View>

          <View style={styles.completeInspection}>
            <TouchableOpacity onPress={handleCompleteInspection}>
              <Text style={styles.completeInspectionText}>
                COMPLETE INSPECTION
              </Text>
            </TouchableOpacity>
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
      <StatusBar backgroundColor={COLORS.primaryWhiteRgb} />

      <View style={styles.TopNavBar}>
        <View style={styles.navBarSection}>
          <Image style={styles.FireDoorImage} source={FiredoorLogo} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.IndexText}>INSPECTING...</Text>
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
    marginBottom: SPACING.space_32,
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
    backgroundColor: COLORS.forthGreyHex,
    width: 210,
    padding: 14,
    alignSelf: 'flex-end',
    margin: 20,
  },

  completeInspectionText: {
    color: COLORS.seventhGreyHex,
    fontSize: FONTSIZE.size_14,
  },

  photoContainer: {
    flexDirection: 'row',
    gap: SPACING.space_24,
    borderBottomColor: COLORS.primaryDarkGreyHex,
    borderBottomWidth: 1,
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
});

export default ContinueInspectionScreen;
