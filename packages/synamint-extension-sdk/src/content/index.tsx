import React from "react";
import { render } from "react-dom";
import "@webcomponents/custom-elements";

import "./content.styles.css";
import Browser from "webextension-polyfill";

import App from "./components/App/index";

import { StylesProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";

class ReactExtensionContainer extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const styleRoot = document.createElement("link");
    styleRoot.rel = "stylesheet";
    styleRoot.href = Browser.runtime.getURL("content.styles.css");
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

function initWebComponent() {
  customElements.define("snickerdoodle-data-wallet", ReactExtensionContainer);

  const app = document.createElement("snickerdoodle-data-wallet");
  app.id = "snickerdoodle-data-wallet";

  document.body.appendChild(app);
}

initWebComponent();
