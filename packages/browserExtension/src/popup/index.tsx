import "@browser-extension/popup/index.css";
import App from "@browser-extension/popup/containers/MainContainer";
import React from "react";
import { render } from "react-dom";

render(<App />, window.document.querySelector("#app-container"));

if ((module as any).hot) {
    (module as any).hot.accept();
}
