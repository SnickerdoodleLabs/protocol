import {
  AuthFlowRoutes,
  OnboardingRoutes,
} from "@extension-onboarding/containers/Router/Router.routes";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import RootRouteLayout from "@extension-onboarding/layouts/RootRouteLayout";
import { EOnboardingState } from "@extension-onboarding/objects/interfaces/IUState";
import { ECoreProxyType } from "@snickerdoodlelabs/objects";
import React, { FC, useMemo } from "react";
import { Route, BrowserRouter, MemoryRouter, Routes } from "react-router-dom";

const Router: FC = () => {
  const { onboardingState } = useAppContext();
  const { sdlDataWallet } = useDataWalletContext();

  const routestoRender = useMemo(() => {
    return onboardingState === EOnboardingState.COMPLETED
      ? AuthFlowRoutes
      : OnboardingRoutes;
  }, [onboardingState === EOnboardingState.COMPLETED]);

  const Router =
    sdlDataWallet.proxyType === ECoreProxyType.IFRAME_BRIDGE
      ? MemoryRouter
      : BrowserRouter;
  return (
    <>
      <Router>
        <Routes>
          <Route element={<RootRouteLayout />}>{routestoRender}</Route>
        </Routes>
      </Router>
    </>
  );
};

export default Router;
