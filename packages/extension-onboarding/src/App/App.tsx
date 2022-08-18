import { AppContextProvider } from "@extension-onboarding/context/App";
import { LayoutProvider } from "@extension-onboarding/context/LayoutContext";
import Onboarding from "@extension-onboarding/pages/Onboarding/Onboarding";
import React from "react";

const App = () => {
  return (
    <LayoutProvider>
      <AppContextProvider>
        <Onboarding />
      </AppContextProvider>
    </LayoutProvider>
  );
};

export default App;
