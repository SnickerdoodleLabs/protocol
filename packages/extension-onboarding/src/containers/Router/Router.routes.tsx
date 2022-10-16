import React, { ReactNode } from "react";
import Onboarding from "@extension-onboarding/pages/Onboarding";
import Details from "@extension-onboarding/pages/Details";
import { AuthFlowRouteContextProvider } from "@extension-onboarding/context/AuthFlowRouteContext";

interface IRoute {
  path: string;
  component: ReactNode;
  name: string;
}

export enum EPaths {
  ONBOARDING = "/onboarding",
  HOME = "/",
}

export const OnboardingRoutes: IRoute[] = [
  {
    path: EPaths.ONBOARDING,
    component: <Onboarding />,
    name: "Onboarding",
  },
];

export const AuthRequiredRoutes: IRoute[] = [
  {
    path: EPaths.HOME,
    component: (
      <AuthFlowRouteContextProvider>
        <Details />
      </AuthFlowRouteContextProvider>
    ),
    name: "Home",
  },
];
