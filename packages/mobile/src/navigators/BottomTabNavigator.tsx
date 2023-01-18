import React from 'react';
import {View, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS, ROUTES} from '../constants';
import {ForgotPassword, Home, Sign, Wallet} from '../screens';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: true,
        tabBarIcon: ({color, size, focused}) => {
          let iconName = 'empty';
          if (route.name === ROUTES.HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === ROUTES.WALLET) {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === ROUTES.SIGN) {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Icon name={iconName} size={22} color={COLORS.primary} />;
        },
      })}>
      <Tab.Screen
        name={ROUTES.SIGN}
        component={Sign}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
