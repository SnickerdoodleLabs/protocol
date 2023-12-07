import { EPathsV2 } from "@extension-onboarding/containers/Router/Router.pathsV2";
import { AuthFlowRoutes } from "@extension-onboarding/containers/Router/Router.routes";
import { useAppContext, EAppModes } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import RootRouteLayout from "@extension-onboarding/layouts/RootRouteLayout";
import Loading from "@extension-onboarding/setupScreens/Loading";
import { ECoreProxyType } from "@snickerdoodlelabs/objects";
import React, { FC, useMemo } from "react";
import {
  Route,
  BrowserRouter,
  MemoryRouter,
  Routes,
  Navigate,
} from "react-router-dom";

const Router: FC = () => {
  const { appMode } = useAppContext();
  const { sdlDataWallet } = useDataWalletContext();
  const routes = useMemo(() => {
    if (!appMode) {
      return null;
    }
    return AuthFlowRoutes;
  }, [appMode]);

  const Router =
    sdlDataWallet.proxyType === ECoreProxyType.IFRAME_BRIDGE
      ? MemoryRouter
      : BrowserRouter;
  return (
    <>
      {!appMode ? (
        <Loading />
      ) : (
        <Router>
          <Routes>
            <Route element={<RootRouteLayout />}>
              {routes}
              <Route
                path="*"
                element={<Navigate replace to={EPathsV2.DATA_PERMISSIONS} />}
              />
            </Route>
          </Routes>
        </Router>
      )}
    </>
  );
};

export default Router;
