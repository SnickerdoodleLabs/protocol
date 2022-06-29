import React, { FC, useMemo } from "react";
import { Route, HashRouter, Routes, Navigate } from "react-router-dom";
import { useAppContext } from "app/Popup/context";
import { AuthRequiredRoutes, LoginRoutes } from "./Router.routes";
import { Box, CircularProgress } from "@material-ui/core";

const Router: FC = () => {
  const { appState, initialized } = useAppContext();

  const routes = useMemo(() => {
    if (!initialized || !appState) {
      return null;
    }
    return (appState.walletAccount ? AuthRequiredRoutes : LoginRoutes).map(
      (route) => (
        <Route key={route.name} path={route.path} element={route.component} />
      ),
    );
  }, [appState, initialized]);

  return (
    <>
      {!initialized ? (
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <HashRouter>
          <Routes>
            <>
              {routes}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          </Routes>
        </HashRouter>
      )}
    </>
  );
};

export default Router;
