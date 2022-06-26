import React, { FC, useMemo } from "react";
import { Route, HashRouter, Routes, Navigate } from "react-router-dom";
import { useAppContext } from "pages/Popup/context";
import { AuthRequiredRoutes, LoginRoutes } from "./Router.routes";

const Router: FC = () => {
  const { appState } = useAppContext();
  console.log("appstate", appState);
  console.log("appstate", !appState);
  const routes = useMemo(
    () =>
      (!appState ? LoginRoutes : AuthRequiredRoutes).map((route) => (
        <Route key={route.name} path={route.path} element={route.component} />
      )),
    [appState],
  );

  return (
    <HashRouter>
      <Routes>
        <>
          {routes}
          <Route path="*" element={<Navigate to="/" />} />
        </>
      </Routes>
    </HashRouter>
  );
};

export default Router;
