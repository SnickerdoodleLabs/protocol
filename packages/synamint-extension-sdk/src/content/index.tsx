import React from "react";
import { render } from "react-dom";
import "@webcomponents/custom-elements";

import App from "@synamint-extension-sdk/content/components/App";
import { StylesProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";

class ReactExtensionContainer extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const mountPoint = document.createElement("div");
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

  // register fonts
  const styleRoot = document.createElement("link");
  styleRoot.rel = "stylesheet";
  styleRoot.type = "text/css";
  styleRoot.href =
    "//fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap&family=Source+Sans+Pro:wght@400;700&display=swap&family=Shrikhand&display=swap&family=Inter:wght@300;400;500;600&display=swap";
  //app
  const app = document.createElement("snickerdoodle-data-wallet");
  app.appendChild(styleRoot);
  app.id = "snickerdoodle-data-wallet";

  document.body.appendChild(app);
};
