import Router from "@extension-onboarding/containers/Router";
import { AppContextProvider } from "@extension-onboarding/context/App";
import { LayoutProvider } from "@extension-onboarding/context/LayoutContext";
import { NotificationContextProvider } from "@extension-onboarding/context/NotificationContext";
import React from "react";

const MainContainer: React.FC = () => {
  return (
    <NotificationContextProvider>
      <AppContextProvider>
        <LayoutProvider>
          <Router />
        </LayoutProvider>
      </AppContextProvider>
    </NotificationContextProvider>
  );
};

export default MainContainer;
