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
      initialRouteName={ROUTES.COMPONENT_TEST}
    >
      <Stack.Screen
        name={ROUTES.COMPONENT_TEST}
        component={OnboardingMain}
        options={{
          headerShown: false,
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
        }}
      />
    </Stack.Navigator>
  );
}
export default AuthNavigator;
