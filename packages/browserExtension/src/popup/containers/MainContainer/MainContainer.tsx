import React from "react";

import { AppContainer } from "@browser-extension/popup/containers/App";
import { AppContextProvider } from "@browser-extension/popup/context";

const MainContainer: React.FC = () => {
  return (
    <AppContextProvider>
      <AppContainer />
    </AppContextProvider>
  );
};

export default MainContainer;
