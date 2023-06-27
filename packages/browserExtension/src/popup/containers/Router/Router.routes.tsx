import React, { ReactNode } from "react";
import Home from "@browser-extension/popup/pages/Home";

interface IRoute {
  path: string;
  component: any;
  name: string;
  hasHeader: boolean;
}
export const AuthRequiredRoutes: IRoute[] = [
  {
    path: "/",
    component: <Home />,
    name: "Home",
    hasHeader: true,
  },
];
