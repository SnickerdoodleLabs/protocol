import React, { ReactNode } from "react";
import { EPATHS } from "@shared/enums/paths";
import Unauthorized from "@app/Popup/pages/Unauthorized";
import Home from "@app/Popup/pages/Home";

interface IRoute {
  path: string;
  component: any;
  name: string;
  hasHeader: boolean;
}
export const AuthRequiredRoutes: IRoute[] = [
  {
    path: EPATHS.HOME,
    component: <Home />,
    name: "Home",
    hasHeader: true,
  },
];

export const UnauthorizedRoutes: IRoute[] = [
  {
    path: EPATHS.UNAUTHORIZED,
    component: <Unauthorized />,
    name: "Unauthorized",
    hasHeader: true,
  },
];
