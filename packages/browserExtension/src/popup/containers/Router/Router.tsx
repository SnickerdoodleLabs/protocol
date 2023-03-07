import Footer from "@browser-extension/popup/components/Footer";
import Header from "@browser-extension/popup/components/Header";
import { AuthRequiredRoutes } from "@browser-extension/popup/containers/Router/Router.routes";
import { Box } from "@material-ui/core";
import React, { FC, useMemo } from "react";
import { Route, HashRouter, Routes, Navigate } from "react-router-dom";

const Router: FC = () => {
  const routes = useMemo(() => {
    return AuthRequiredRoutes.map((route) => (
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
  }, []);

  return (
    <>
      <HashRouter>
        <Routes>
          <>
            {routes}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        </Routes>
      </HashRouter>
    </>
  );
};

export default Router;
