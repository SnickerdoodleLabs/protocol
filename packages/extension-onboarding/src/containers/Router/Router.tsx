import React, { FC, useMemo } from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";

import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import { AuthFlowRoutes } from "@extension-onboarding/containers/Router/Router.routes";
import { useAppContext, EAppModes } from "@extension-onboarding/context/App";
import RootRouteLayout from "@extension-onboarding/layouts/RootRouteLayout";
import Loading from "@extension-onboarding/setupScreens/Loading";

const Router: FC = () => {
  const { appMode } = useAppContext();
  const routes = useMemo(() => {
    if (!appMode) {
      return null;
    }
    return AuthFlowRoutes;
  }, [appMode]);
  return (
    <>
      {!appMode ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route element={<RootRouteLayout />}>
              {routes}
              <Route
                path="*"
                element={<Navigate replace to={EPathsV2.DATA_PERMISSIONS} />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default Router;
