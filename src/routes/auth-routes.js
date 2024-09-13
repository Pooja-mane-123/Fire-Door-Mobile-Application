import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AntDesignIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import {Platform, Text} from 'react-native';
import UserScreen from '@src/screens/UserScreen';
import LinkedDirectorScreen from '@src/screens/LinkedDirectorScreen';
import DashboardScreen from '@src/screens/DashboardScreen';

function AuthRoutes() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          paddingVertical: SPACING.space_8,
          paddingBottom:
            Platform.OS === 'android' ? SPACING.space_10 : SPACING.space_20,
          height: Platform.OS === 'android' ? 70 : 90,

          borderTopColor: COLORS.secondaryGreyHex,
          elevation: 0,
          backgroundColor: COLORS.secondaryGreyHex,
        },
      }}>
      {/* ----------BOTTOM TAB ROUTES---------------------- */}
      <Tab.Screen
        name="Index"
        component={DashboardScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <AntDesignIcons
              name="home-lightning-bolt"
              color={focused ? COLORS.primaryWhiteRgb : COLORS.primaryGreyHex}
              size={30}
            />
          ),
          /*-----BOTTOM TEXT STYLING------ */
          tabBarLabel: ({focused, ke}) => (
            <Text
              style={{
                fontFamily: focused
                  ? FONTFAMILY.poppins_semibold
                  : FONTFAMILY.poppins_regular,
                color: focused ? COLORS.primaryWhiteRgb : COLORS.primaryGreyHex,
                fontSize: FONTSIZE.size_12,
              }}>
              Index
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="LinkedDirector"
        component={LinkedDirectorScreen}
        options={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarLabel: () => null, // Explicitly set tabBarLabel to null
          tabBarIcon: ({focused}) => (
            <AntDesignIcons
              name="plus"
              color={COLORS.primaryWhiteRgb}
              size={30}
              style={{
                borderRadius: 100,
                backgroundColor: COLORS.primaryBlueHex,
                padding: 10,
                // marginTop: Platform.OS === 'android' ? -55 : -55,
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <MaterialIcons
              name="verified-user"
              color={focused ? COLORS.primaryWhiteRgb : COLORS.primaryGreyHex}
              size={27}
            />
          ),
          /*BOTTOM TEXT STYLING */
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontFamily: focused
                  ? FONTFAMILY.poppins_semibold
                  : FONTFAMILY.poppins_regular,
                color: focused ? COLORS.primaryWhiteRgb : COLORS.primaryGreyHex,
                fontSize: FONTSIZE.size_12,
              }}>
              User
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AuthRoutes;
