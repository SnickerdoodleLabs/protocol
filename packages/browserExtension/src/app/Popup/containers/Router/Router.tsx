import Footer from "@app/Popup/components/Footer";
import Header from "@app/Popup/components/Header";
import {
  AuthRequiredRoutes,
  UnauthorizedRoutes,
} from "@app/Popup/containers/Router/Router.routes";
import { useAppContext } from "@app/Popup/context";
import { Box, CircularProgress } from "@material-ui/core";
import React, { FC, useMemo } from "react";
import { Route, HashRouter, Routes, Navigate } from "react-router-dom";

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
          <Box display="flex" flexDirection="column" width="100%" height="100%">
            {route.hasHeader && <Header />}
            {route.component}
            <Footer />
          </Box>
        }
      />
    ));
  }, [JSON.stringify(appState), initialized]);

  return (
    <>
      {!initialized ? (
        <Box
          display="flex"
          alignItems="center"
          height="100%"
          justifyContent="center"
        >
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
