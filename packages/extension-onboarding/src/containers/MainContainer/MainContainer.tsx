import Router from "@extension-onboarding/containers/Router";
import { AppContextProvider } from "@extension-onboarding/context/App";
import { LayoutProvider } from "@extension-onboarding/context/LayoutContext";
import React from "react";

const MainContainer: React.FC = () => {
  return (
    <LayoutProvider>
      <AppContextProvider>
        <Router />
      </AppContextProvider>
    </LayoutProvider>
  );
};

export default MainContainer;
