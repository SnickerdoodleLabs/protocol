import React from "react";
import { render } from "react-dom";
import "@webcomponents/custom-elements";

import App from "./components/App/index";

import { StylesProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";

class ReactExtensionContainer extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const styleRoot = document.createElement("link");
    styleRoot.rel = "stylesheet";
    styleRoot.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap&family=Source+Sans+Pro:wght@400;700&display=swap&family=Shrikhand&display=swap&family=Inter:wght@300;400;500;600&display=swap";
    const mountPoint = document.createElement("div");
    shadowRoot.appendChild(styleRoot);
    shadowRoot.appendChild(mountPoint);
    mountPoint.id = "content-container";

    const jss = create({
      ...jssPreset(),
      insertionPoint: mountPoint,
    });

    render(
      <StylesProvider jss={jss}>
        <App />
      </StylesProvider>,
      mountPoint,
    );
  }
}

export const initWebComponent = () => {
  customElements.define("snickerdoodle-data-wallet", ReactExtensionContainer);

  const app = document.createElement("snickerdoodle-data-wallet");
  app.id = "snickerdoodle-data-wallet";

  document.body.appendChild(app);
};
