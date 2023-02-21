import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import { COLORS, ROUTES } from "../constants";
import ForgotPassword from "../screens/ForgotPassword";
import Sign from "../screens/Sign";
import BottomTabNavigator from "./BottomTabNavigator";
import ImageCarousel from "../components/ImageCarousel";
import { Wallet } from "../screens";
import Onboarding from "../screens/Onboarding";

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      // This is for the general header e.t.c
      /*    screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerBackTitleVisible: false,
        headerTintColor: 'white',
      }} */
      initialRouteName={ROUTES.ONBOARDING}
    >
      <Stack.Screen
        name={ROUTES.HOME}
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.BOTTOM_TAB}
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name={ROUTES.FORGOT} component={ForgotPassword} />
      <Stack.Screen
        name={ROUTES.SIGN}
        component={Sign}
        options={({ route }: any) => ({
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerBackTitleVisible: false,
          headerTintColor: "white",
        })}
      />
      <Stack.Screen
        name={ROUTES.IMAGE_CAROUSEL}
        component={ImageCarousel}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: true,
          //@ts-ignore
          title: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.WALLET}
        component={Wallet}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.ONBOARDING}
        component={Onboarding}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: true,
          //@ts-ignore
          title: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default AuthNavigator;
