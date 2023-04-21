import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS, ROUTES } from "../constants";
import Icon from "react-native-vector-icons/Ionicons";
import {
  DashboardStack,
  MarketplaceStack,
  SettingStack,
} from "./AuthNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import { normalizeWidth } from "../themes/Metrics";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = "empty";
          if (route.name == ROUTES.MARKETPLACE) {
            iconName = focused ? "gift" : "gift-outline";
          }
          if (route.name === ROUTES.DASHBOARD) {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          }
          if (route.name === ROUTES.SETTINGS) {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Icon name={iconName} size={22} color={COLORS.primary} />;
        },
        tabBarStyle: {
         /*  borderTopLeftRadius: normalizeWidth(25),
          borderTopRightRadius: normalizeWidth(25), */
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.DASHBOARD}
        component={DashboardStack}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ROUTES.MARKETPLACE}
        component={MarketplaceStack}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ROUTES.SETTINGS}
        component={SettingStack}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
