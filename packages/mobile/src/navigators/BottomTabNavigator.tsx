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
import { normalizeHeight, normalizeWidth } from "../themes/Metrics";
import { useTheme } from "../context/ThemeContext";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const BottomTabNavigator = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: theme?.colors.bottomTabColor,
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
          return (
            <Icon
              name={iconName}
              size={22}
              color={theme?.colors.bottomTabColor}
            /*   style={{ marginTop: normalizeHeight(15) }} */
            />
          );
        },

        tabBarStyle: {
          borderTopLeftRadius: normalizeWidth(30),
          borderTopRightRadius: normalizeWidth(30),
          backgroundColor: theme?.colors.bottomTabBackground,
          overflow: "hidden",
          position: "absolute",
        
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
