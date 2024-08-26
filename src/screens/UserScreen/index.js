import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {LogoutUserThunk} from '@src/redux/thunks/authThunk';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import UserImage from '@src/assets/images/UserImage.png';

const UserScreen = () => {
  // ==> Hooks
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // ==> Logout Function
  const removeToken = async () => {
    await dispatch(LogoutUserThunk()).unwrap();
    navigation.navigate('login');
  };
  return (
    <SafeAreaView style={styles.SafeAreaViewFlex}>
      {/* ==> Status Bar */}
      <StatusBar backgroundColor={COLORS.primaryBlueHex} />

      {/* ==> Top NavBar */}
      <View style={styles.TopNavBar}>
        <View />
        <View style={styles.IndexTextContainer}>
          <Text style={styles.IndexText}>Hello User</Text>
        </View>
        <View style={styles.UserImageContainer}>
          <Image source={UserImage} />
        </View>
      </View>

      <TouchableOpacity style={styles.Button} onPress={removeToken}>
        <Text style={styles.ButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  SafeAreaViewFlex: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackRgb,
    paddingHorizontal: SPACING.space_20,
  },

  TopNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.space_28,
  },

  IndexText: {
    color: COLORS.primaryWhiteRgb,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_30,
  },

  Button: {
    backgroundColor: COLORS.primaryBlueHex,
    padding: SPACING.space_15,
    borderRadius: 10,
    alignItems: 'center',
  },

  ButtonText: {
    color: COLORS.primaryWhiteRgb,
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_medium,
  },
});
