import React from "react";
import { AppContextProvider } from "@app/Popup/context";
import { AppContainer } from "@app/Popup/containers/App";

const MainContainer: React.FC = () => {
  return (
    <AppContextProvider>
      <AppContainer />
    </AppContextProvider>
  );
};

export default MainContainer;
