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
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackArrow from '@src/assets/images/BackArrow.png';
import UserImage from '@src/assets/images/UserImage.png';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function ScheduleInspectionScreen({navigation}) {
  const data = [
    // Example data
    {
      id: '1',
      dateTime: '29 Oct 2024, 09:00 AM',
      building: "Baldrik's Hall",
      door: 'Hallway Door',
      lastChecked: '15 Oct 2024',
      status: 'PASSED',
      scheduledBy: 'E. Black',
    },
    // Add more data here...
  ];

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.text}>{item.dateTime}</Text>
      <Text style={styles.text}>{item.building}</Text>
      <Text style={styles.text}>{item.door}</Text>
      <Text style={styles.text}>
        {item.lastChecked} / {item.status}
      </Text>
      <Text style={styles.text}>{item.scheduledBy}</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.SafeAreaViewFlex}>
      {/* ==> Status Bar */}
      <StatusBar backgroundColor={COLORS.primaryWhiteRgb} />

      {/* ==> Top NavBar */}
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
          <Text style={styles.IndexText}>Inspection Calender</Text>
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
          />
          <FontAwesome
            name="search"
            size={20}
            color="#aaa"
            style={styles.searchIcon}
          />
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.headerText}>DATE & TIME</Text>
          <Text style={styles.headerText}>BUILDING</Text>
          <Text style={styles.headerText}>DOOR</Text>
          <Text style={styles.headerText}>LAST CHECKED / STATUS</Text>
          <Text style={styles.headerText}>SCHEDULED BY</Text>
        </View>

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
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
    // alignItems: 'center',
    alignItems: 'flex-end',
    marginBottom: 10,
    width:400,
    justifyContent:'flex-end',

  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: 10,
  },
  searchIcon: {
    position: 'absolute',
    alignSelf: 'center',
    right: 15,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: {
    flex: 1,
    color: '#333',
    textAlign: 'center',
  },
});
