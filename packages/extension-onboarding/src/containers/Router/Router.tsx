import {
  OnboardingRoutes,
  AuthRequiredRoutes,
  EPaths,
} from "@extension-onboarding/containers/Router/Router.routes";
import { useAppContext, EAppModes } from "@extension-onboarding/context/App";
import { Box, CircularProgress } from "@material-ui/core";
import React, { FC, useMemo } from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";

const Router: FC = () => {
  const { appMode } = useAppContext();
  const routes = useMemo(() => {
    if (!appMode) {
      return null;
    }
    return (
      appMode === EAppModes.ONBOARDING_FLOW
        ? OnboardingRoutes
        : AuthRequiredRoutes
    ).map((route) => (
      <Route key={route.name} path={route.path} element={route.component} />
    ));
  }, [appMode]);

  return (
    <>
      {!appMode ? (
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <BrowserRouter>
          <Routes>
            <>
              {routes}
              <Route
                path="*"
                element={
                  <Navigate
                    to={
                      appMode === EAppModes.ONBOARDING_FLOW
                        ? EPaths.ONBOARDING
                        : EPaths.HOME
                    }
                  />
                }
              />
            </>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default Router;
