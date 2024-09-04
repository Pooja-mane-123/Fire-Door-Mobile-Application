import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import LoadingScreen from '@src/components/loader';
import BackArrow from '@src/assets/images/BackArrow.png';
import {getDirectorById} from '@src/redux/thunks/userThunk';
import {useDispatch} from 'react-redux';
import dayjs from 'dayjs';
import {getLookupAction} from '@src/redux/thunks/lookupThunk';
import {getLookupByTypeAction} from '@src/redux/thunks/lookupThunk';

const DirectorProfileScreen = ({route, navigation}) => {
  const {directorId} = route.params;
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [directorData, setDirectorData] = useState({
    completedInspectionCount: 0,
    upcomingInspectionCount: 0,
    ongoingInspectionCount: 0,
  });

  const [lookupData, setLookupData] = useState([]);

  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const avatarUri = 'https://example.com/avatar.jpg';
  const dispatch = useDispatch();

  useEffect(() => {
    getDirectorData();
    // getAllLookupData();
    getLookupByType();
  }, []);

  useEffect(() => {
    if (userData && userData.directorBuildings) {
      const directorDetails = processLinkedDirectorData(userData);
      setDirectorData(directorDetails);
    }

    if (!selectedBuilding && userData?.directorBuildings?.length > 0) {
      setSelectedBuilding(userData?.directorBuildings[0]);
    }
  }, [userData]);

  const getDirectorData = async () => {
    try {
      setLoading(true);
      const data = await dispatch(getDirectorById(directorId)).unwrap();
      setUserData(data);
    } catch (error) {
      console.log('[Director-Profile-Error-Get-Data]', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllLookupData = async () => {
    try {
      setLoading(true);
      const data = await dispatch(getLookupAction()).unwrap();
      console.log('Lookup Data', data);
      setLookupData(data);
    } catch (error) {
      console.log('[Director-Profile-Error-Get-Data]', error);
    } finally {
      setLoading(false);
    }
  };

  const getLookupByType = async type => {
    try {
      setLoading(true);
      const data = await dispatch(getLookupByTypeAction({type})).unwrap();
      console.log('Lookup Data', data);
      setLookupData(data);
    } catch (error) {
      console.log('[Director-Profile-Error-Get-Data]', error);
    } finally {
      setLoading(false);
    }
  };

  console.log(lookupData);

  const getDoorCount = () => {
    return userData?.directorBuildings?.reduce(
      (count, building) => count + building?.doors?.length,
      0,
    );
  };

  const processLinkedDirectorData = (userData = {}) => {
    const result = userData?.directorBuildings?.reduce(
      (acc, building) => {
        building?.doors?.forEach(door => {
          door?.doorInspections?.forEach(inspection => {
            const statusName = inspection?.doorInspectionStatus?.name;

            if (statusName === 'inspectionStatusCompleted') {
              acc.completedInspectionCount++;
            } else if (statusName === 'inspectionStatusUpcoming') {
              acc.upcomingInspectionCount++;
            } else if (statusName === 'inspectionStatusOngoing') {
              acc.ongoingInspectionCount++;
            }
          });
        });

        return acc;
      },
      {
        completedInspectionCount: 0,
        upcomingInspectionCount: 0,
        ongoingInspectionCount: 0,
      },
    );

    return result;
  };

  const doorCount = getDoorCount();

  const handleBuildingPress = building => {
    setSelectedBuilding(building);
  };

  return (
    <SafeAreaView style={styles.SafeAreaViewFlex}>
      {loading && <LoadingScreen />}
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
        </View>
        <View
          style={{
            width: '80%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.IndexText}>Director's Profile</Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image source={{uri: avatarUri}} style={styles.avatar} />
        </View>
        <View style={styles.infoInspectionContainer}>
          <View style={styles.directorDetailsContainer}>
            <Text style={styles.title}>{userData?.name || 'NA'}</Text>
            <Text style={styles.subtitle}>{userData?.email || 'NA'}</Text>
            <Text style={styles.subtitle}>{userData?.phoneNumber || 'NA'}</Text>
            <View style={styles.buildingCountContainer}>
              <Text style={styles.buildings}>Buildings </Text>
              <Text style={styles.buildingCount}>
                {userData?.directorBuildings?.length || 0}
              </Text>
              <Text style={styles.buildings}>Doors </Text>
              <Text style={styles.buildingCount}>{doorCount || 0}</Text>
            </View>
          </View>
          <View style={styles.directorInspectionContainer}>
            <View style={styles.inspectionDetailsContainer}>
              <Text style={styles.inspectionTitle}>Inspections</Text>
              <Text style={styles.viewHistoryTitle}>View History</Text>
            </View>
            <View style={styles.completedOngoingContainer}>
              <View style={styles.completedInspection}>
                <Text style={styles.completedTitle}>Completed</Text>
                <Text>{directorData.completedInspectionCount || 0}</Text>
              </View>
              <View style={styles.ongoingInspection}>
                <Text style={styles.ongoingTitle}>Ongoing</Text>
                <Text>{directorData.ongoingInspectionCount || 0}</Text>
              </View>
            </View>

            <View style={styles.upcomingInstallationContainer}>
              <View style={styles.upcomingInspection}>
                <Text style={styles.upcomingTitle}>Upcoming</Text>
                <Text>{directorData.upcomingInspectionCount || 0}</Text>
              </View>
              <View style={styles.installationContainer}>
                <Text style={styles.installationTitle}>Installation</Text>
                <Text style={styles.installationTitle}>
                  {userData.installationCount || 0}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.directorBuildingDoorContainer}>
        <View style={styles.buildingDoorContainer}>
          {userData?.directorBuildings?.map((building, index) => {
            // Calculate the total number of inspections for this building
            const totalInspections = building.doors?.reduce((count, door) => {
              return count + (door.doorInspections?.length || 0);
            }, 0);
            return (
              <TouchableOpacity
                key={building.id}
                style={
                  selectedBuilding?.id === building.id
                    ? styles.selectedBuildingCard
                    : styles.buildingCard
                }
                onPress={() => handleBuildingPress(building)}>
                <Text style={styles.buildingTitle}>Building {index + 1}</Text>
                <Text style={styles.buildingName}>
                  {building.name || 'N/A'}
                </Text>
                <Text style={styles.addressText}>
                  {building.addressLine1 || 'N/A'},
                </Text>
                <Text style={styles.addressText}>
                  {building.addressLine2 || ''},
                </Text>
                <Text style={styles.addressText}>
                  {building.addressLine3 || ''},
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.doorCountText}>
                    Doors {building.doors?.length || 0}
                  </Text>
                  <Text style={styles.inspectionCountText}>
                    Insp. {totalInspections || 0}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedBuilding && (
          <View style={styles.directorBuildingDoorContainerHeader}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}>
              {selectedBuilding?.doors?.map((door, index) => {
                console.log('door', door);

                const doorCode = door?.qRCode?.code || 'N/A';
                const createdAt = door.createdAt
                  ? dayjs(door.createdAt).format('DD/MMM/YYYY')
                  : 'N/A';

                return (
                  <View key={door.id}>
                    <View style={styles.doorHeader}>
                      <Text style={styles.doorLabel}>Door {index + 1}</Text>
                      <Text style={styles.qrCode}>QR:{doorCode}</Text>
                      <Text style={styles.installedDate}>
                        INSTALLED:{createdAt}
                      </Text>
                    </View>
                    <Text style={styles.buildingName}>{door?.name}</Text>
                    <Text style={styles.addressText}>
                      {door?.locationDescription || 'NA'}
                    </Text>

                    <View style={styles.doorPropertiesContainer}>
                      <View style={styles.allDoorProperties}>
                        <View style={styles.doorProperties}>
                          <Text style={styles.properLabel}>Maker</Text>
                          <Text style={styles.properLabel}>
                            {door?.makerId}
                          </Text>
                        </View>
                        <View style={styles.doorProperties}>
                          <Text style={styles.properLabel}>Material</Text>
                          <Text style={styles.properLabel}>
                            {door?.materialId}
                          </Text>
                        </View>
                        <View style={styles.doorProperties}>
                          <Text style={styles.properLabel}>Certifier</Text>
                          <Text style={styles.properLabel}>
                            {door?.certifierId}
                          </Text>
                        </View>

                        <View style={styles.doorProperties}>
                          <Text style={styles.properLabel}>Inspections</Text>
                          <Text style={styles.properLabel}>
                            {door?.doorInspections?.length || 0}
                          </Text>
                        </View>

                        <View style={styles.doorProperties}>
                          <Text style={styles.properLabel}>Last</Text>
                          <Text style={styles.properLabel}>
                            {(door?.lastInspectionDate &&
                              dayjs?.(door?.lastInspectionDate)?.format(
                                'DD/MMM/YYYY',
                              )) ||
                              'N/A'}
                          </Text>
                        </View>

                        <View style={styles.doorProperties}>
                          <Text style={styles.properLabel}>Due Next</Text>
                          <Text style={styles.properLabel}>
                            {(door?.nextInspectionDueDate &&
                              dayjs?.(door?.nextInspectionDueDate)?.format(
                                'DD/MMM/YYYY',
                              )) ||
                              'N/A'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.allDoorProperties}>
                        <View style={styles.doorProperties}>
                          <Text style={styles.properLabel}>Maker</Text>
                          <Text style={styles.properLabel}>
                            {door?.makerId}
                          </Text>
                        </View>
                        <View style={styles.doorProperties}>
                          <Text style={styles.properLabel}>Material</Text>
                          <Text style={styles.properLabel}>
                            {door?.materialId}
                          </Text>
                        </View>
                        <View style={styles.doorProperties}>
                          <Text style={styles.properLabel}>Certifier</Text>
                          <Text style={styles.properLabel}>
                            {door?.certifierId}
                          </Text>
                        </View>

                        <View style={styles.doorProperties}>
                          <Text style={styles.properLabel}>Failed</Text>
                          <Text style={styles.properLabel}>
                            {door?.doorInspections?.filter(
                              inspection =>
                                inspection?.doorInspectionStatus?.name ===
                                'inspectionStatusFailed',
                            ).length || 0}
                          </Text>
                        </View>

                        <View style={styles.doorProperties}>
                          <Text style={styles.properLabel}>By</Text>
                          <Text style={styles.properLabel}>
                            {door?.doorInspections
                              ? door.doorInspections
                                  .map(
                                    inspection =>
                                      inspection.scheduledBy || 'N/A',
                                  )
                                  .join(', ')
                              : 'N/A'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeAreaViewFlex: {
    flex: 1,
    backgroundColor: COLORS.primaryWhiteRgb,
  },
  TopNavBar: {
    flexDirection: 'row',
    paddingVertical: SPACING.space_2,
    backgroundColor: COLORS.sixthGreyHex,
    width: '100%',
    height: 70,
  },
  navBarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBarIcon: {
    width: 40,
    height: 40,
    margin: SPACING.space_18,
  },
  IndexText: {
    color: COLORS.seventhGreyHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
  },
  container: {
    padding: SPACING.space_24,
    backgroundColor: COLORS.sixthGreyHex,
    marginTop: SPACING.space_4,
    flexDirection: 'row',
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.tertiaryGreyHex,
  },
  infoInspectionContainer: {
    flexDirection: 'row',
    padding: SPACING.space_18,
    gap: SPACING.space_36,
  },
  directorDetailsContainer: {
    gap: SPACING.space_4,
  },
  title: {
    fontSize: FONTSIZE.size_24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.seventhGreyHex,
  },
  buildingCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.space_24,
    gap: SPACING.space_28,
  },
  buildings: {
    textTransform: 'uppercase',
  },
  directorInspectionContainer: {
    flexDirection: 'column',
  },
  inspectionDetailsContainer: {
    flexDirection: 'row',
    gap: SPACING.space_24,
    borderBottomColor: COLORS.primaryDarkGreyHex,
    borderBottomWidth: 2,
    height: 32,
    paddingBottom: 5,
  },
  inspectionTitle: {
    fontSize: FONTSIZE.size_16,
    textTransform: 'uppercase',
  },
  viewHistoryTitle: {
    fontSize: FONTSIZE.size_12,
    textTransform: 'uppercase',
    color: COLORS.primaryDarkGreyHex,
    borderColor: COLORS.primaryDarkGreyHex,
    borderWidth: 1,
    alignSelf: 'center',
    padding: 5,
  },
  completedOngoingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: SPACING.space_28,
    marginTop: SPACING.space_12,
  },
  completedInspection: {
    flexDirection: 'column',
    gap: SPACING.space_12,
  },

  completedTitle: {
    fontSize: FONTSIZE.size_14,
    textTransform: 'uppercase',
  },

  ongoingInspection: {
    flexDirection: 'column',
    gap: SPACING.space_12,
  },

  ongoingTitle: {
    fontSize: FONTSIZE.size_14,
    textTransform: 'uppercase',
  },

  upcomingInstallationContainer: {
    flexDirection: 'row',
    gap: SPACING.space_28,
    marginTop: SPACING.space_12,
  },

  upcomingInspection: {
    flexDirection: 'column',
    gap: SPACING.space_12,
  },

  upcomingTitle: {
    fontSize: FONTSIZE.size_14,
    textTransform: 'uppercase',
  },

  installationContainer: {
    flexDirection: 'column',
    gap: SPACING.space_12,
  },

  installationTitle: {
    fontSize: FONTSIZE.size_14,
    textTransform: 'uppercase',
    marginLeft: SPACING.space_10,
  },

  directorBuildingDoorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 240,
  },
  buildingDoorContainer: {
    width: '40%',
    backgroundColor: COLORS.primaryWhiteRgb,
    padding: SPACING.space_16,
  },
  buildingCard: {
    padding: SPACING.space_16,
    backgroundColor: COLORS.primaryWhiteRgb,
    marginBottom: SPACING.space_8, // Space between each card
    borderColor: COLORS.secondaryGreyHex,
    borderWidth: 1,
    elevation: 3, // For shadow effect
  },

  selectedBuildingCard: {
    padding: SPACING.space_16,
    backgroundColor: COLORS.primaryWhiteRgb,
    marginBottom: SPACING.space_8, // Space between each card
    borderColor: COLORS.primaryDarkGreyHex,
    borderWidth: 2,
    elevation: 3, // For shadow effect
  },
  buildingTitle: {
    fontSize: SPACING.space_16,
    fontWeight: 'bold',
    marginBottom: SPACING.space_4,
    textTransform: 'uppercase',
  },
  buildingName: {
    fontSize: 16,
    color: COLORS.primaryDarkGreyHex,
    marginBottom: SPACING.space_8,
  },
  addressText: {
    fontSize: 14,
    color: COLORS.seventhGreyHex,
    marginBottom: SPACING.space_2,
  },
  doorCountText: {
    fontSize: 14,
    color: COLORS.primaryDarkGreyHex,
    marginTop: SPACING.space_8,
    textTransform: 'uppercase',
  },

  inspectionCountText: {
    fontSize: 14,
    color: COLORS.primaryDarkGreyHex,
    marginTop: SPACING.space_8,
    textTransform: 'uppercase',
  },

  directorBuildingDoorContainerHeader: {
    flexDirection: 'column',
    backgroundColor: COLORS.primaryWhiteRgb,
    paddingTop: SPACING.space_32,
    width: '100%',
  },

  doorHeader: {
    flexDirection: 'row',
    gap: SPACING.space_60,
    paddingBottom: SPACING.space_16,
  },
  doorLabel: {
    fontSize: FONTSIZE.size_14,
    textTransform: 'uppercase',
  },
  qrCode: {
    fontSize: FONTSIZE.size_14,
    textTransform: 'uppercase',
  },
  installedDate: {
    fontSize: FONTSIZE.size_14,
    textTransform: 'uppercase',
  },

  doorPropertiesContainer: {
    flexDirection: 'row',
    borderBottomColor: COLORS.primaryDarkGreyHex,
    borderBottomWidth: 1,
    gap: 20,
    marginBottom: SPACING.space_16,
  },

  allDoorProperties: {
    flexDirection: 'column',
    gap: SPACING.space_12,
    paddingBottom: SPACING.space_16,
    paddingRight: SPACING.space_60,
  },

  doorProperties: {
    flexDirection: 'row',
    gap: 100,
    justifyContent: 'space-between',
  },
});

export default DirectorProfileScreen;
