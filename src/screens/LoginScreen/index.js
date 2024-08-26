import React, {useState, useEffect} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {FONTSIZE, FONTFAMILY, COLORS, SPACING} from '@src/theme';
import GoogleImage from '@src/assets/images/GoogleImage.png';
import FiredoorLogo from '@src/assets/images/firedoor_logo.png';
import AppleImage from '@src/assets/images/AppleImage.png';
import {yupResolver} from '@hookform/resolvers/yup';
import {LoginSchema} from '@src/helpers/form-schemas';
import {loginUserAction} from '@src/redux/thunks/authThunk';
import {useNavigation} from '@react-navigation/native';
import LoadingScreen from '@src/components/loader';
import {getLookupAction} from '@src/redux/thunks/lookupThunk';

const LoginScreen = ({navigation}) => {
  // ==> Redux State
  const authReducer = useSelector(state => state?.auth);

  // ==> Hooks
  const dispatch = useDispatch();
  // const navigation = useNavigation();

  // ==> Local Component State
  const [showPassword, setShowPassword] = useState(false);

  //==> React Hook Form
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  useEffect(() => {
    dispatch(getLookupAction());
  }, []);

  //==> Login Function
  const onSubmit = async data => {
    try {
      const loginResponse = await dispatch(loginUserAction({...data})).unwrap();
      if (loginResponse) {
        navigation.navigate('app');
      }
    } catch (error) {
      console.log('[LOGIN-SCREEN-ERROR] ---- ', error);
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.ScrollViewFlex}>
      {/* ==> Loading Screen */}
      {authReducer?.loading && <LoadingScreen />}

      <SafeAreaView style={styles.ParentContainer}>
        {/* ==> Status Bar */}
        <StatusBar backgroundColor={COLORS.primaryWhiteRgb} />

        {/* ==> Login Text  */}
        <View style={styles.LoginContainer}>
          <Image
            style={styles.LoginImageContainer}
            source={FiredoorLogo}
            alt="F"
          />
          {/* <Text style={styles.LoginText}>Login</Text> */}
        </View>

        {/* ==> UserName */}
        <View style={styles.UserNameContainer}>
          <Text style={styles.UsernameText}>User Name</Text>
          <Controller
            control={control}
            name="email"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={{...styles.EmailInput, borderStyle: 'solid'}}
                placeholder="Username/Email ID"
                placeholderTextColor={COLORS.primaryGreyHex}
                onChangeText={value => onChange(value)}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.ErrorText}>{errors.email.message}</Text>
          )}
        </View>

        {/* ==> Password */}
        <View style={styles.PasswordContainer}>
          <Text style={styles.PasswordText}>Password</Text>
          <View style={styles.PasswordInputContainer}>
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.PassowrdInput}
                  placeholder="Password"
                  onChangeText={value => onChange(value)}
                  onBlur={onBlur}
                  value={value}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={COLORS.primaryGreyHex}
                />
              )}
            />
            <TouchableOpacity
              style={styles.EyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon
                name={showPassword ? 'eye' : 'eye-slash'}
                size={20}
                color={COLORS.primaryGreyHex}
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.ErrorText}>{errors.password.message}</Text>
          )}
        </View>

        {/* ==> Login Button */}
        <View style={styles.LoginButtonContainer}>
          <TouchableOpacity
            style={styles.LoginButtonTouch}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.LoginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* ==> Seperator */}
        {/* <View style={styles.SeperatorContainer}>
          <View style={styles.Sep1} />
          <Text style={styles.SepText}>OR</Text>
          <View style={styles.Sep2} />
        </View> */}

        {/* ==> Login With google */}
        {/* <View style={styles.GoogleLoginContainer}>
          <Image source={GoogleImage} alt="G" />
          <Text style={styles.GoogleLoginText}>Login with Google</Text>
        </View> */}

        {/* ==> Login With google */}
        {/* <View style={styles.GoogleLoginContainer}>
          <Image source={AppleImage} alt="G" />
          <Text style={styles.GoogleLoginText}>Login with Appe</Text>
        </View> */}
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  ScrollViewFlex: {
    backgroundColor: COLORS.primaryWhiteRgb,
    flex: 1,
    paddingHorizontal: SPACING.space_20,
  },

  ParentContainer: {
    flex: 1,
  },

  LoginContainer: {
    paddingVertical: SPACING.space_24,
    marginTop: SPACING.space_30,
  },

  LoginText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteRgb,
    fontSize: FONTSIZE.size_30 + FONTSIZE.size_10,
  },

  LoginImageContainer: {
    width: 220,
    height: 220,
    marginTop: SPACING.space_24,
    alignSelf: 'center',
    marginBottom: SPACING.space_24,
  },

  UserNameContainer: {
    // paddingVertical: SPACING.space_2,
  },

  UsernameText: {
    color: COLORS.primaryWhiteRgb,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
  },

  EmailInput: {
    borderWidth: 2,
    // borderRadius: 5,
    borderColor: COLORS.tertiaryGreyHex,
    marginTop: SPACING.space_8,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryGreyHex,
    padding: 10,
  },

  PasswordContainer: {},

  PasswordText: {
    color: COLORS.primaryWhiteRgb,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
  },

  PasswordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.tertiaryGreyHex,
    marginBottom: SPACING.space_2,
    // borderRadius: 5,
    // marginTop: SPACING.space_,
  },

  PassowrdInput: {
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryGreyHex,
    padding: 10,
    flex: 1,
  },

  EyeIcon: {
    padding: 7,
  },

  LoginButtonContainer: {
    paddingTop: SPACING.space_30 + SPACING.space_24,
    paddingBottom: SPACING.space_30,
  },

  LoginButtonTouch: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.forthGreyHex,
    padding: SPACING.space_12,
    // borderRadius: 10,
  },

  LoginButtonText: {
    color: COLORS.secondaryGreyHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    textTransform: 'uppercase',
  },

  SeperatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.space_24,
  },

  Sep1: {
    backgroundColor: COLORS.primaryGreyHex,
    height: 0.7,
    width: '50%',
  },

  SepText: {
    color: COLORS.primaryGreyHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    paddingHorizontal: SPACING.space_8,
  },

  Sep2: {
    backgroundColor: COLORS.primaryGreyHex,
    height: 0.7,
    width: '50%',
  },

  GoogleLoginContainer: {
    marginTop: SPACING.space_28,
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondaryBlueHex,
    paddingVertical: SPACING.space_12,
    borderRadius: 10,
  },

  GoogleLoginText: {
    color: COLORS.primaryWhiteRgb,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    marginLeft: SPACING.space_10,
  },

  ErrorText: {
    color: COLORS.primaryRoseRedHex,
    marginTop: SPACING.space_2,
    fontFamily: FONTFAMILY.poppins_regular,
  },
});

export default LoginScreen;
