import React from "react";
import { AppContextProvider } from "../../context";
import { AppContainer } from "../App";

const MainContainer: React.FC = () => {
  return (
    <AppContextProvider>
      <AppContainer />
    </AppContextProvider>
  );
};

export default MainContainer;
