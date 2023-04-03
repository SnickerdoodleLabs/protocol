import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS, ROUTES } from "../constants";
import Icon from "react-native-vector-icons/Ionicons";
import Onboarding from "../screens/Onboarding";
import Marketplace from "../newcomponents/Marketplace/Marketplace";
import AuthNavigator from "./AuthNavigator";

const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = "empty";
          if (route.name == ROUTES.COMPONENT_TEST) {
            iconName = focused ? "home" : "home-outline";
          }
          if (route.name === ROUTES.WALLET) {
            iconName = focused ? "wallet" : "wallet-outline";
          }
          if (route.name === ROUTES.SIGN) {
            iconName = focused ? "person" : "person-outline";
          }
          return <Icon name={iconName} size={22} color={COLORS.primary} />;
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.COMPONENT_TEST}
        component={AuthNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ROUTES.WALLET}
        component={AuthNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ROUTES.SIGN}
        component={AuthNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
