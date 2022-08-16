import React, { Fragment, FC, useMemo } from "react";
import { Route, HashRouter, Routes, Navigate } from "react-router-dom";
import { useAppContext } from "@app/Popup/context";
import {
  AuthRequiredRoutes,
  UnauthorizedRoutes,
} from "@app/Popup/containers/Router/Router.routes";
import { Box, CircularProgress } from "@material-ui/core";
import Header from "@app/Popup/components/Header";

const Router: FC = () => {
  const { appState, initialized } = useAppContext();
  const routes = useMemo(() => {
    if (!initialized) {
      return null;
    }
    return (
      appState?.dataWalletAddress ? AuthRequiredRoutes : UnauthorizedRoutes
    ).map((route) => (
      <Route
        key={route.name}
        path={route.path}
        element={
          <>
            {route.hasHeader && <Header />}
            {route.component}
          </>
        }
      />
    ));
  }, [JSON.stringify(appState), initialized]);

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
