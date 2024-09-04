import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackArrow from '@src/assets/images/BackArrow.png';
import UserImage from '@src/assets/images/UserImage.png';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getInspectorScheduledInspection} from '@src/redux/thunks/userThunk';
import {useDispatch} from 'react-redux';
import dayjs from 'dayjs';

export default function ScheduleInspectionScreen({navigation}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [scheduledData, setScheduledData] = useState([]);

  useEffect(() => {
    getAllInspectorScheduledInspection();
  }, []);

  const getAllInspectorScheduledInspection = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getInspectorScheduledInspection(5),
      ).unwrap();
      setScheduledData(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = column => {
    const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(order);
  };

  const filteredData = scheduledData
    .filter(item => {
      const doorName = item.door.name?.toLowerCase() || '';
      const buildingName = item.door.building.name?.toLowerCase() || '';
      const scheduledBy = item.scheduledBy?.toLowerCase() || '';
      const otherValues = Object.values(item)
        .filter(val => typeof val === 'string')
        .some(val => val.toLowerCase().includes(searchQuery.toLowerCase()));

      return (
        otherValues ||
        doorName.includes(searchQuery.toLowerCase()) ||
        buildingName.includes(searchQuery.toLowerCase()) ||
        scheduledBy.includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;
      const aValue =
        sortColumn === 'lastChecked'
          ? dayjs(a.door.lastInspectionDate).valueOf()
          : a[sortColumn];
      const bValue =
        sortColumn === 'lastChecked'
          ? dayjs(b.door.lastInspectionDate).valueOf()
          : b[sortColumn];
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  console.log('filteredData', filteredData);

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.text}>
        {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm A')}
      </Text>
      <Text style={styles.text}>{item.door.building.name}</Text>
      <Text style={styles.text}>{item.door.name}</Text>
      <Text style={styles.text}>
        {dayjs(item.door.lastInspectionDate).format('YYYY-MM-DD')} /{' '}
        {item.doorInspectionStatusId === 16 ? 'Passed' : 'Failed'}
      </Text>
      <Text style={styles.text}>{item.scheduledBy || 'N/A'}</Text>
    </View>
  );

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
          <Text style={styles.IndexText}>Inspection Calendar</Text>
        </View>

        <View style={styles.UserImageContainer}>
          <Text style={styles.divider}></Text>
          <Image source={UserImage} style={styles.UserImage} />
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />

          <FontAwesome
            name="search"
            size={16}
            color="#aaa"
            style={styles.searchIcon}
          />
        </View>

        <View style={styles.listHeader}>
          <TouchableOpacity
            onPress={() => handleSort('dateTime')}
            style={styles.headerColumn}>
            <Text style={styles.headerText}>DATE & TIME</Text>
            <FontAwesome
              name={
                sortColumn === 'dateTime' && sortOrder === 'asc'
                  ? 'arrow-up'
                  : 'arrow-down'
              }
              size={12}
              color="#333"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSort('building')}
            style={styles.headerColumn}>
            <Text style={styles.headerText}>BUILDING</Text>
            <FontAwesome
              name={
                sortColumn === 'building' && sortOrder === 'asc'
                  ? 'arrow-up'
                  : 'arrow-down'
              }
              size={12}
              color="#333"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSort('door')}
            style={styles.headerColumn}>
            <Text style={styles.headerText}>DOOR</Text>
            <FontAwesome
              name={
                sortColumn === 'door' && sortOrder === 'asc'
                  ? 'arrow-up'
                  : 'arrow-down'
              }
              size={12}
              color="#333"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSort('lastChecked')}
            style={styles.headerColumn}>
            <Text style={styles.headerText}>LAST CHECKED / STATUS</Text>
            <FontAwesome
              name={
                sortColumn === 'lastChecked' && sortOrder === 'asc'
                  ? 'arrow-up'
                  : 'arrow-down'
              }
              size={12}
              color="#333"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSort('scheduledBy')}
            style={styles.headerColumn}>
            <Text style={styles.headerText}>SCHEDULED BY</Text>
            <FontAwesome
              name={
                sortColumn === 'scheduledBy' && sortOrder === 'asc'
                  ? 'arrow-up'
                  : 'arrow-down'
              }
              size={12}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
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
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Aligns content to the right
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 20, // Adjusted margin to align with the list
  },
  searchInput: {
    width: 250, // Adjusted width to fit
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  searchIcon: {
    marginLeft: -30, // Adjusted to position the icon within the input field
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  list: {
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  text: {
    flex: 1,
    color: '#333',
    textAlign: 'center',
  },

  headerColumn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginRight: 5,
  },
});
