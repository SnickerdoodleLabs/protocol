import { ECoreProxyType } from "@snickerdoodlelabs/objects";
import React, { FC, useMemo } from "react";
import { matchPath } from "react-router";
import {
  Route,
  BrowserRouter,
  MemoryRouter,
  Routes,
  useLocation,
} from "react-router-dom";

import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import {
  AuthFlowRoutes,
  OnboardingRoutes,
} from "@extension-onboarding/containers/Router/Router.routes";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import RootRouteLayout from "@extension-onboarding/layouts/RootRouteLayout";

const RouteSwitcher = () => {
  const { isDefaultContractOptedIn } = useAppContext();
  const { pathname } = useLocation();
  const routestoRender = useMemo(() => {
    return isDefaultContractOptedIn || matchPath(EPathsV2.BRAND, pathname)
      ? AuthFlowRoutes
      : OnboardingRoutes;
  }, [isDefaultContractOptedIn, pathname]);

  return (
    <Routes>
      <Route element={<RootRouteLayout />}>{routestoRender}</Route>
    </Routes>
  );
};

const Wrapper: FC = ({ children }) => {
  const { sdlDataWallet } = useDataWalletContext();
  const Router =
    sdlDataWallet.proxyType === ECoreProxyType.IFRAME_BRIDGE
      ? MemoryRouter
      : BrowserRouter;

  return <Router>{children}</Router>;
};

const Router: FC = () => {
  return (
    <Wrapper>
      <RouteSwitcher />
    </Wrapper>
  );
};

export default Router;
