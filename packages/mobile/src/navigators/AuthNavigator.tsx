import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS, ROUTES } from "../constants";
import ImageCarousel from "../components/ImageCarousel";
import { Wallet } from "../screens";
import Onboarding from "../screens/Onboarding";
import Initial from "../screens/Initial";
import StarterTour from "../components/StarterTour/StarterTour";
import StarterTour2 from "../components/StarterTour/StarterTour2";
import OnboardingMain from "../newcomponents/Onboarding/OnboardingMain";
import Marketplace from "../newcomponents/Marketplace/Marketplace";
import CardDetails from "../newcomponents/Marketplace/CardDetails";
import Dashboard from "../newcomponents/Dashboard/Dashboard";
import Settings from "../newcomponents/Settings/Settings";
import CryptoSettings from "../newcomponents/Settings/CryptoSettings";
import PersonalSettings from "../newcomponents/Settings/PersonalSettings";
import RewardsSettings from "../newcomponents/Settings/RewardsSettings";
import Permission from "../newcomponents/Onboarding/Permission";
import PermissionSettings from "../newcomponents/Settings/PermissionSettings";

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.INITIAL}>
      <Stack.Screen
        name={ROUTES.COMPONENT_TEST}
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.DASHBOARD}
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.HOME}
        component={Marketplace}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.SETTINGS}
        component={Settings}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.CRYPTO_SETTINGS}
        component={CryptoSettings}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: true,
          title: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.PERSONAL_SETTINGS}
        component={PersonalSettings}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: true,
          title: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.PERMISSION_SETTINGS}
        component={PermissionSettings}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: true,
          title: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.REWARDS_SETTINGS}
        component={RewardsSettings}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: true,
          title: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.INITIAL}
        component={Initial}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.STARTER_TOUR}
        component={StarterTour}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.STARTER_TOUR2}
        component={StarterTour2}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.IMAGE_CAROUSEL}
        component={ImageCarousel}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: true,
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
        component={OnboardingMain}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name={ROUTES.CARD_DETAILS}
        component={CardDetails}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
        }}
      />
    </Stack.Navigator>
  );
}
export default AuthNavigator;
