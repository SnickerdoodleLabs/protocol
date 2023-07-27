import "@browser-extension/popup/index.css";
import React from "react";
import { render } from "react-dom";

import App from "@browser-extension/popup/containers/MainContainer";

render(<App />, window.document.querySelector("#app-container"));

if ((module as any).hot) {
  (module as any).hot.accept();
}
