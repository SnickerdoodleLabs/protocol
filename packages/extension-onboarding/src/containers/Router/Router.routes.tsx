import React, { ReactNode } from "react";
import Onboarding from "@extension-onboarding/pages/Onboarding";

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
    component: <p>testing</p>,
    name: "Home",
  },
];
