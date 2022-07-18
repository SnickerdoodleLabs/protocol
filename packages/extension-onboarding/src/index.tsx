import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { AppContextProvider } from "./Context/App";
import Onboarding from "./pages/Onboarding/Onboarding";

ReactDOM.render(
  <AppContextProvider>
    <Onboarding />
  </AppContextProvider>,
  document.getElementById("root") as HTMLElement,
);
