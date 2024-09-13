import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, SPACING, FONTFAMILY, FONTSIZE} from '@src/theme';
import UserImage from '@src/assets/images/UserImage.png';
import BackArrow from '@src/assets/images/BackArrow.png';
import LoadingScreen from '@src/components/loader';
import SearchIcon from '@src/assets/images/searchIcon.png';
import {useNavigation} from '@react-navigation/native';

const LinkedDirectorScreen = ({route, navigation}) => {
  const {userData} = route.params;
  const todoData = useSelector(state => state.todo);
  const [directorList, setDirectorList] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    if (userData) {
      const directorDetails = processLinkedDirectorData(userData);
      setDirectorList(directorDetails);
    }
  }, [userData]);

  const handleFilterChange = value => {
    setFilter(value);
  };

  const handleSort = () => {
    const sortedRows = [...directorList].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      }
      return b.name.localeCompare(a.name);
    });
    setDirectorList(sortedRows);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredRows = directorList.filter(
    row =>
      row?.name?.toLowerCase().includes(filter.toLowerCase()) ||
      row?.buildingCount?.toString().includes(filter) ||
      row?.doorCount?.toString().includes(filter),
  );

  const processLinkedDirectorData = (userData = {}) => {
    const result = userData?.inspectorBuildings?.reduce((acc, building) => {
      const directorName = building?.director?.name;

      if (!acc[directorName]) {
        acc[directorName] = {
          id: building?.director?.id,
          name: building?.director?.name,
          buildingCount: 0,
          doorCount: 0,
          completedInspectionCount: 0,
          upcomingInspectionCount: 0,
          failedInspectionCount: 0,
        };
      }

      acc[directorName].buildingCount++;
      acc[directorName].doorCount += building?.doors?.length;

      building.doors.forEach(door => {
        door.doorInspections.forEach(inspection => {
          const statusName = inspection?.doorInspectionStatus?.name;

          if (statusName === 'inspectionStatusCompleted') {
            acc[directorName].completedInspectionCount++;
          } else if (statusName === 'inspectionStatusUpcoming') {
            acc[directorName].upcomingInspectionCount++;
          } else if (statusName === 'inspectionStatusFailed') {
            acc[directorName].failedInspectionCount++;
          }
        });
      });

      return acc;
    }, {});

    return Object.values(result || {});
  };

  const renderDirectorItem = ({item}) => (
    <TouchableOpacity
      style={styles.directorRow}
      onPress={() =>
        navigation.navigate('DirectorProfile', {directorId: item.id})
      }>
      <Text style={styles.directorName}>{item?.name}</Text>
      <Text style={styles.directorDetails}>{item?.buildingCount}</Text>
      <Text style={styles.directorDetails}>{item?.doorCount}</Text>
      <Text style={styles.directorDetails_completedInsp}>
        {item?.completedInspectionCount}
      </Text>
      <Text style={styles.directorDetails}>{item?.failedInspectionCount}</Text>
      <Text style={styles.directorDetails_upcomingInsp}>
        {item?.upcomingInspectionCount}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.SafeAreaViewFlex}>
      {todoData?.loading && <LoadingScreen />}
      <StatusBar backgroundColor={COLORS.primaryWhiteRgb} />

      <View style={styles.TopNavBar}>
        <View style={styles.navBarSection}>
          <TouchableOpacity onPress={() => navigation.navigate('Index')}>
            <Image source={BackArrow} style={styles.navBarIcon} />
          </TouchableOpacity>
          <Text style={styles.divider}></Text>
        </View>
        <Text style={styles.IndexText}>Linked Directors</Text>
        <View style={styles.UserImageContainer}>
          <Text style={styles.divider}></Text>
          <Image source={UserImage} style={styles.UserImage} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="DIRECTOR NAME..."
          value={filter}
          onChangeText={handleFilterChange}
        />
        <Image source={SearchIcon} style={styles.searchIcon} />
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeader_directorName}>
          <Text>Director's Name</Text>
          <Text style={{fontSize: 20}} onPress={handleSort}>
            {sortOrder === 'asc' ? '▼' : '▲'}
          </Text>
        </Text>
        <Text style={styles.tableHeader_directorDetails}>
          <Text>No. of Bldgs.</Text>
        </Text>
        <Text style={styles.tableHeader_directorDetails}>
          <Text>No. of Doors</Text>
        </Text>
        <Text style={styles.tableHeader_directorDetails_completedInsp}>
          <Text>Completed Insp.</Text>
        </Text>
        <Text style={styles.tableHeader_directorDetails}>
          <Text>Failed Insp.</Text>
        </Text>
        <Text style={styles.tableHeader_directorDetails_upcomingInsp}>
          <Text>Upcoming Insp./Inst.</Text>
        </Text>
      </View>

      {filteredRows.length > 0 ? (
        <FlatList
          data={filteredRows}
          renderItem={renderDirectorItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.ScrollViewFlex}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.director_Row}>No Linked Directors Found</Text>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.space_2,
    backgroundColor: COLORS.forthGreyHex,
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

  divider: {
    borderRightColor: COLORS.primaryDarkGreyHex,
    borderRightWidth: 2,
    height: 70,
  },

  IndexText: {
    color: COLORS.primaryLightGreyHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
  },

  UserImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  UserImage: {
    width: 40,
    height: 40,
    margin: SPACING.space_20,
  },

  searchContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: SPACING.space_28,
    backgroundColor: '#fff',
    margin: SPACING.space_24,
  },

  sortIcon_image: {
    width: 50,
    height: 50,
  },

  searchIcon: {
    width: 20,
    height: 20,
    marginLeft: SPACING.space_20,
  },

  searchInput: {
    width: '24%',
    height: 40,
  },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.space_10,
    borderLeftColor: COLORS.primaryGreyHex,
    borderLeftWidth: 1,
    borderRightColor: COLORS.primaryGreyHex,
    borderRightWidth: 1,
    padding: SPACING.space_15,
    marginRight: SPACING.space_20,
    marginLeft: SPACING.space_20,
    marginBottom: SPACING.space_20,
    height: 50,
  },

  tableHeader_directorName: {
    flex: 2,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryBlackRgb,
    borderRightColor: COLORS.primaryGreyHex,
    borderRightWidth: 1,
    textAlign: 'left',
    textTransform: 'uppercase',
    height: 50,
    paddingTop: SPACING.space_10,
  },

  tableHeader_directorDetails: {
    flex: 1,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryGreyHex,
    textAlign: 'right',
    borderRightColor: COLORS.primaryGreyHex,
    borderRightWidth: 1,
    paddingRight: SPACING.space_16,
    height: 50,
    textTransform: 'uppercase',
  },

  tableHeader_directorDetails_completedInsp: {
    flex: 1.5,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryGreyHex,
    textAlign: 'right',
    borderRightColor: COLORS.primaryGreyHex,
    borderRightWidth: 1,
    paddingRight: SPACING.space_16,
    height: 50,
    textTransform: 'uppercase',
  },

  tableHeader_directorDetails_upcomingInsp: {
    flex: 1,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryGreyHex,
    textAlign: 'right',
    paddingRight: SPACING.space_16,
    height: 50,
    textTransform: 'uppercase',
  },

  ScrollViewFlex: {
    flexGrow: 1,
    paddingHorizontal: SPACING.space_20,
  },

  director_Row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.space_10,
    borderColor: COLORS.primaryGreyHex,
    borderWidth: 1,
    padding: SPACING.space_15,
    marginRight: SPACING.space_20,
    marginLeft: SPACING.space_20,
  },

  directorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.space_10,
    borderColor: COLORS.primaryGreyHex,
    borderWidth: 1,
    padding: SPACING.space_15,
  },

  directorName: {
    flex: 2,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryBlackRgb,
    borderRightColor: COLORS.primaryGreyHex,
    borderRightWidth: 1,
  },

  directorDetails: {
    flex: 1,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryGreyHex,
    textAlign: 'right',
    borderRightColor: COLORS.primaryGreyHex,
    borderRightWidth: 1,
    paddingRight: SPACING.space_16,
  },

  directorDetails_completedInsp: {
    flex: 1.5,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryGreyHex,
    textAlign: 'right',
    borderRightColor: COLORS.primaryGreyHex,
    borderRightWidth: 1,
    paddingRight: SPACING.space_16,
  },

  directorDetails_upcomingInsp: {
    flex: 1,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryGreyHex,
    textAlign: 'right',
    paddingRight: SPACING.space_16,
  },
});

export default LinkedDirectorScreen;
