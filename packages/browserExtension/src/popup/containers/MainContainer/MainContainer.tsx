import React from "react";
import { AppContextProvider } from "@browser-extension/popup/context";
import { AppContainer } from "@browser-extension/popup/containers/App";

const MainContainer: React.FC = () => {
  return (
    <AppContextProvider>
      <AppContainer />
    </AppContextProvider>
  );
};

export default MainContainer;
