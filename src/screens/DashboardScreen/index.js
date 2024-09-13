import React, {useEffect, useState} from 'react';
import {
  Image,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import UserImage from '@src/assets/images/UserImage.png';
import {GetTodosByUserId} from '@src/redux/thunks/todosThunk';
import {SafeAreaView} from 'react-native-safe-area-context';
import TodoCard from '@src/components/todos/todo-card';
import LoadingScreen from '@src/components/loader';
import FiredoorLogo from '@src/assets/images/FiredoorLogo.png';
import {
  getInspectorById,
  getTodaysInspectionByInspectorId,
} from '@src/redux/thunks/userThunk';
import dayjs from 'dayjs';

const DashboardScreen = ({navigation}) => {
  // const navigation = useNavigation();

  // ==> Redux States
  const userTodos = useSelector(state => state?.todo);

  // ==> Hooks
  const dispatch = useDispatch();

  const [userData, setUserData] = useState([]);
  const [todaysInspection, setTodaysInspection] = useState([]);

  // ==> Local Component States
  useEffect(() => {
    getInspectorData();
    getTodaysInspection();
  }, []);

  const today = new Date();
  const fullDate = today.toLocaleDateString('en-US', {
    weekday: 'long', // Full day name
    year: 'numeric',
    month: 'long', // Full month name
    day: 'numeric', // Date
  });

  // Reordering the date format
  const formattedDate = fullDate.replace(
    /(\w+), (\w+) (\d+), (\d+)/,
    '$1, $3 $2 $4',
  );

  // ==> Get All Todos
  const getInspectorData = async () => {
    try {
      const data = await dispatch(getInspectorById(5)).unwrap();
      setUserData(data);
    } catch (error) {
      console.log('[Home-Screen-Error-Get-Todos]----', error);
    }
  };

  const getTodaysInspection = async () => {
    try {
      const inspection = await dispatch(
        getTodaysInspectionByInspectorId(5),
      ).unwrap();
      setTodaysInspection(inspection);
    } catch (error) {}
  };

  // ==> Render Todo
  const renderTodoItem = ({item, index}) => {
    return <TodoCard key={index} todo={item} />;
  };

  const getDoorCount = () => {
    let count = 0;
    userData?.inspectorBuildings?.forEach(building => {
      count += building.doors.length;
    });
    return count;
  };
  const doorCount = getDoorCount();

  const getInspectionCount = () => {
    let count = 0;
    userData?.inspectorBuildings?.forEach(building => {
      building?.doors?.forEach(door => {
        count += door?.doorInspections?.length;
      });
    });
    return count;
  };
  const inspectionCount = getInspectionCount();

  const calculateUpcomingInspections = () => {
    let count = 0;
    userData?.inspectorBuildings?.forEach(building => {
      building?.doors?.forEach(door => {
        door?.doorInspections?.forEach(inspection => {
          if (
            inspection?.doorInspectionStatus?.name ===
            'inspectionStatusUpcoming'
          ) {
            count += 1;
          }
        });
      });
    });
    return count;
  };
  const upcomingInspectionsCount = calculateUpcomingInspections();

  const activeSinceFormattedDate = dayjs(userData?.createdAt).format(
    'DD MMM YYYY',
  );

  const Table = () => {
    const renderItem = ({item}) => (
      <>
        <View style={styles.rowContainer}>
          <View style={styles.column}>
            <Text style={styles.value}>
              {dayjs(item?.createdAt).format('hh:mm A') || 'N/A'}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.value}>
              {item?.door?.building?.name || 'N/A'}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.value}>{item?.door?.name || 'N/A'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.value}>{'Pending/Completed'}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.ScheduledValue}>
              {item?.scheduledBy || 'N/A'}
            </Text>
          </View>
        </View>
      </>
    );

    return (
      <View style={styles.tableContainer}>
        <View style={styles.header}>
          <Text style={styles.headerCell}>Time</Text>
          <Text style={styles.headerCell}>Building</Text>
          <Text style={styles.headerCell}>Door</Text>
          <Text style={styles.headerCell}>Status</Text>
          <Text style={styles.headerCell}>Scheduled By</Text>
        </View>
        <FlatList
          data={todaysInspection}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.SafeAreaViewFlex}>
      {/* ==> Loading Screen */}
      {userTodos?.loading && <LoadingScreen />}

      {/* ==> Status Bar */}
      <StatusBar backgroundColor={COLORS.primaryWhiteRgb} />

      {/* ==> Top NavBar */}
      <View style={styles.TopNavBar}>
        <View style={styles.navBarSection}>
          <Image style={styles.FireDoorImage} source={FiredoorLogo} />
          <Text style={styles.divider}></Text>
        </View>
        <View>
          <Text style={styles.IndexText}>{formattedDate}</Text>
        </View>
        <View style={styles.UserImageContainer}>
          <Text style={styles.divider}></Text>
          <Image source={UserImage} style={styles.UserImage} />
        </View>
      </View>
      <View style={styles.screen}>
        <View style={styles.directorBuildingDoorContainer}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.director}>
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontSize: FONTSIZE.size_12,
                }}>
                Directors
              </Text>
              <Text style={{textAlign: 'right'}}>
                {userData?.uniqueDirectors?.length}
              </Text>
            </View>

            <View style={styles.building}>
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontSize: FONTSIZE.size_12,
                }}>
                Buildings
              </Text>
              <Text style={{textAlign: 'right'}}>
                {userData?.inspectorBuildings?.length}
              </Text>
            </View>

            <View style={styles.door}>
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontSize: FONTSIZE.size_12,
                }}>
                Doors
              </Text>
              <Text style={{textAlign: 'right'}}>{doorCount}</Text>
            </View>
          </View>

          <View style={styles.viewLinkedDirectorContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('LinkedDirector', {
                  userData: userData,
                })
              }>
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontSize: FONTSIZE.size_12,
                }}>
                View Linked Directors
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text
            style={{
              borderColor: COLORS.primaryDarkGreyHex,
              borderWidth: 1,
              height: '30%',
            }}></Text>
        </View>

        <View style={{flexDirection: 'column', paddingTop: 10}}>
          <View style={{flexDirection: 'row', gap: 50}}>
            <View style={styles.activeSince}>
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontSize: FONTSIZE.size_12,
                }}>
                Active Since
              </Text>
              <Text style={{textAlign: 'right'}}>
                {activeSinceFormattedDate}
              </Text>
            </View>

            <View style={styles.inspections}>
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontSize: FONTSIZE.size_12,
                }}>
                Inspections
              </Text>
              <Text style={{textAlign: 'right'}}>{inspectionCount}</Text>
            </View>

            <View style={styles.lastWeek}>
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontSize: FONTSIZE.size_12,
                }}>
                Last Week
              </Text>
              <Text style={{textAlign: 'right'}}>3</Text>
            </View>

            <View style={styles.upcoming}>
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontSize: FONTSIZE.size_12,
                }}>
                Upcoming
              </Text>
              <Text style={{textAlign: 'right'}}>
                {upcomingInspectionsCount}
              </Text>
            </View>
          </View>

          <View style={styles.viewLinkedDirectorContain}>
            <View style={styles.viewLinkedDirectorContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('InspectionHistory')}>
                <Text
                  style={{
                    textTransform: 'uppercase',
                    fontSize: FONTSIZE.size_12,
                  }}>
                  Inspection History
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.viewLinkedDirectorContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ScheduleInspection', {})}>
                <Text
                  style={{
                    textTransform: 'uppercase',
                    fontSize: FONTSIZE.size_12,
                  }}>
                  View Full schedule
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* ==> Today Inspection */}
      <View style={{padding: SPACING.space_24}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomColor: COLORS.primaryDarkGreyHex,
            borderBottomWidth: 1,
            paddingBottom: 6,
          }}>
          <Text>Today</Text>
          <Text>{todaysInspection?.length}</Text>
        </View>

        <Table />

        <View
          style={{
            alignSelf: 'center',
            backgroundColor: COLORS.primaryDarkGreyHex,
            padding: 10,
            marginTop: 'auto',
          }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('QRCodeScanner')}>
            <Text style={styles.buttonText}>START INSPECTION</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ==> FlatList For Todos*/}
      <FlatList
        data={userTodos?.todos}
        renderItem={renderTodoItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.ScrollViewFlex}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

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

  IndexText: {
    color: COLORS.primaryLightGreyHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
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

  screen: {
    padding: SPACING.space_24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: -300,
  },

  directorBuildingDoorContainer: {
    flexDirection: 'column',
    paddingTop: SPACING.space_10,
  },
  director: {
    flexDirection: 'column',
  },

  door: {
    flexDirection: 'column',
  },

  building: {
    flexDirection: 'column',
    paddingRight: SPACING.space_24,
    paddingLeft: SPACING.space_24,
  },

  activeSince: {
    flexDirection: 'column',
  },

  inspections: {
    flexDirection: 'column',
  },

  lastWeek: {
    flexDirection: 'column',
  },

  upcoming: {
    flexDirection: 'column',
  },

  viewLinkedDirectorContain: {
    flexDirection: 'row',
    gap: SPACING.space_28,
    justifyContent: 'center',
  },

  viewLinkedDirectorContainer: {
    padding: SPACING.space_4,
    backgroundColor: COLORS.primaryWhiteRgb,
    alignSelf: 'center',
    marginTop: SPACING.space_8,
    marginBottom: SPACING.space_8,
    borderColor: COLORS.primaryGreyHex,
    borderWidth: 1,
  },

  todayInspectionContainer: {
    borderBottomColor: COLORS.primaryDarkGreyHex,
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  tableContainer: {
    // borderColor: COLORS.primaryDarkGreyHex,
    // borderWidth: 1,
    // borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    padding: SPACING.space_10,
    justifyContent: 'space-between',
  },
  headerCell: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    // textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    padding: SPACING.space_8,
    marginBottom: SPACING.space_8,
    // borderBottomWidth: 1,
    // borderColor: COLORS.primaryLightGreyHex,
  },
  column: {
    flex: 1,
  },

  ScheduledValue: {
    textAlign: 'right',
  },
  value: {
    textAlign: 'auto',
  },
});

export default DashboardScreen;
