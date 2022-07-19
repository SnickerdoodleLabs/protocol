import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { AppContextProvider } from "./Context/App";
import { LayoutProvider } from "./Context/LayoutContext";
import Onboarding from "./pages/Onboarding/Onboarding";

ReactDOM.render(
  <AppContextProvider>
    <LayoutProvider>
      <Onboarding />
    </LayoutProvider>
  </AppContextProvider>,
  document.getElementById("root") as HTMLElement,
);
