import React, {useEffect, useState} from 'react';
import AuthRoutes from '@src/routes/auth-routes';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '@src/screens/LoginScreen';
import DetailScreen from '@src/screens/DetailScreen';
import {useDispatch, useSelector} from 'react-redux';
import {GetAuthStatusThunk} from '@src/redux/thunks/authThunk';
import LinkedDirectorScreen from '@src/screens/LinkedDirectorScreen';
import DirectorProfileScreen from '@src/screens/DirectorProfileScreen';
import QRCodeScannerScreen from '@src/screens/QrCodeScannerScreen';
import QrCodeResultScreen from '@src/screens/QrCodeResultScreen';
const Stack = createNativeStackNavigator();
const Root = () => {
  // ==> Hooks
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  //==> Component Life Cycle Methods
  useEffect(() => {
    onUseEffect();
  }, []);

  // ==> Get Auth Status Function
  const onUseEffect = async () => {
    try {
      const isAuth = await dispatch(GetAuthStatusThunk()).unwrap();
    } catch (error) {
      console.log('[AUTH-STATUS-ERROR]----', error);
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="app" component={AuthRoutes} />
          <Stack.Screen name="detailtodo" component={DetailScreen} />
          <Stack.Screen
            name="LinkedDirector"
            component={LinkedDirectorScreen}
          />
          <Stack.Screen
            name="DirectorProfile"
            component={DirectorProfileScreen}
          />
          <Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} />
          <Stack.Screen name="QRScanResult" component={QrCodeResultScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Root;
