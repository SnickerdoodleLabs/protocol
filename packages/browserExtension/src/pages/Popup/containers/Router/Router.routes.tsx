import React, { FC } from "react";
import { EPATHS } from "@shared/constants/paths";

interface IRoute {
  path: string;
  component: any;
  name: string;
}
export const AuthRequiredRoutes: IRoute[] = [
  { path: EPATHS.HOME, component: <p>Home Page</p>, name: "Home" },
  {
    path: EPATHS.ACCOUNT_DETAILS,
    component: <p>Account Details Page</p>,
    name: "Account Details",
  },
  {
    path: EPATHS.SETTINGS,
    component: <p>Settings Page</p>,
    name: "Settings",
  },
  {
    path: EPATHS.NOTIFICATIONS,
    component: <p>Notifications Page</p>,
    name: "Notifications",
  },
  {
    path: EPATHS.TRANSACTION,
    component: <p>Transaction Page</p>,
    name: "Transaction",
  },
];

export const LoginRoutes: IRoute[] = [
  {
    path: EPATHS.LOGIN,
    component: <p>Login/Signup Page</p>,
    name: "Login",
  },
  {
    path: EPATHS.WELCOME,
    component: <p>Welcome Page</p>,
    name: "Welcome",
  },
];
