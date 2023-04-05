import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS, ROUTES } from "../constants";
import Icon from "react-native-vector-icons/Ionicons";
import Onboarding from "../screens/Onboarding";
import Marketplace from "../newcomponents/Marketplace/Marketplace";
import AuthNavigator from "./AuthNavigator";
import Dashboard from "../newcomponents/Dashboard/Dashboard";
import Settings from "../newcomponents/Settings/Settings";

const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = "empty";
          if (route.name == ROUTES.HOME) {
            iconName = focused ? "home" : "home-outline";
          }
          if (route.name === ROUTES.DASHBOARD) {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          }
          if (route.name === ROUTES.SETTINGS) {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Icon name={iconName} size={22} color={COLORS.primary} />;
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={AuthNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ROUTES.DASHBOARD}
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ROUTES.SETTINGS}
        component={Settings}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
