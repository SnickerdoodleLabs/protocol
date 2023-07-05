import InitialScreen from "@extension-onboarding/containers/Router/InitialScreen";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import {
  AuthFlowRoutes,
  OnboardingRoutes,
} from "@extension-onboarding/containers/Router/Router.routes";
import { useAppContext, EAppModes } from "@extension-onboarding/context/App";
import RootRouteLayout from "@extension-onboarding/layouts/RootRouteLayout";
import React, { FC, useMemo } from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";

const Router: FC = () => {
  const { appMode } = useAppContext();
  const routes = useMemo(() => {
    if (!appMode) {
      return null;
    }
    if (appMode === EAppModes.ONBOARDING_FLOW) {
      return OnboardingRoutes;
    }
    return AuthFlowRoutes;
  }, [appMode]);

  return (
    <>
      {!appMode ? (
        <InitialScreen />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route element={<RootRouteLayout />}>
              {routes}
              <Route
                path="*"
                element={
                  <Navigate
                    replace
                    to={
                      appMode === EAppModes.ONBOARDING_FLOW
                        ? EPaths.ONBOARDING_LINK_ACCOUNT
                        : EPaths.MARKETPLACE
                    }
                  />
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default Router;
