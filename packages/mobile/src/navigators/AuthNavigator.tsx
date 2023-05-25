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
import NFTDetails from "../newcomponents/Dashboard/NFTs/NFTDetails";
import { useTheme } from "../context/ThemeContext";

const Stack = createStackNavigator();
export function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.INITIAL}>
      <Stack.Screen
        name={ROUTES.INITIAL}
        component={Initial}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export function MarketplaceStack() {
  const theme = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.MARKETPLACE}
        component={Marketplace}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerShadowVisible: false, // Hides the header shadow
          headerTintColor: theme?.colors.title,
        }}
      />
      <Stack.Screen
        name={ROUTES.ONBOARDING}
        component={OnboardingMain}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerShadowVisible: false, // Hides the header shadow
          headerTintColor: theme?.colors.title,
        }}
      />
      <Stack.Screen
        name={ROUTES.CARD_DETAILS}
        component={CardDetails}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerStyle: {
            backgroundColor: theme?.colors.background,
          },
          headerShadowVisible: false, // Hides the header shadow
          headerTintColor: theme?.colors.title,
        }}
      />
      <Stack.Screen
        name={ROUTES.PERMISSION_SETTINGS}
        component={PermissionSettings}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerShadowVisible: false, // Hides the header shadow
          headerTintColor: theme?.colors.title,
        }}
      />
    </Stack.Navigator>
  );
}

export function DashboardStack() {
  const theme = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.INITIAL}
        component={Initial}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.DASHBOARD}
        component={Dashboard}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.NFT_DETAILS}
        component={NFTDetails}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerStyle: {
            backgroundColor: theme?.colors.background,
          },
          headerShadowVisible: false, // Hides the header shadow
          headerTintColor: theme?.colors.title,
        }}
      />
      <Stack.Screen
        name={ROUTES.ONBOARDING}
        component={OnboardingMain}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerTintColor: theme?.colors.title,
        }}
      />
      <Stack.Screen
        name={ROUTES.CARD_DETAILS}
        component={CardDetails}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerShadowVisible: false, // Hides the header shadow
          headerTintColor: theme?.colors.title,
        }}
      />
      <Stack.Screen
        name={ROUTES.PERMISSION_SETTINGS}
        component={PermissionSettings}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerShadowVisible: false, // Hides the header shadow
          headerTintColor: theme?.colors.title,
        }}
      />
    </Stack.Navigator>
  );
}

export function SettingStack() {
  const theme = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.SETTINGS}
        component={Settings}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerTintColor: theme?.colors.title,
        }}
      />
      <Stack.Screen
        name={ROUTES.CRYPTO_SETTINGS}
        component={CryptoSettings}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerStyle: {
            backgroundColor: theme?.colors.background,
          },
          headerShadowVisible: false, // Hides the header shadow
          headerTintColor: theme?.colors.title,
        }}
      />
      <Stack.Screen
        name={ROUTES.PERSONAL_SETTINGS}
        component={PersonalSettings}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerStyle: {
            backgroundColor: theme?.colors.background,
          },
          headerShadowVisible: false, // Hides the header shadow
          headerTintColor: theme?.colors.title,
        }}
      />

      <Stack.Screen
        name={ROUTES.REWARDS_SETTINGS}
        component={RewardsSettings}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerStyle: {
            backgroundColor: theme?.colors.background,
          },
          headerShadowVisible: false, // Hides the header shadow
          headerTintColor: theme?.colors.title,
        }}
      />

      <Stack.Screen
        name={ROUTES.PERMISSION_SETTINGS}
        component={PermissionSettings}
        options={{
          headerBackTitleVisible: false,
          headerTransparent: false,
          title: false,
          headerStyle: {
            backgroundColor: theme?.colors.background,
          },
          headerShadowVisible: false, // Hides the header shadow
          headerTintColor: theme?.colors.title,
        }}
      />
    </Stack.Navigator>
  );
}
