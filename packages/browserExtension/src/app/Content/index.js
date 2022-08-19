import React from "react";
import { render } from "react-dom";
import "@webcomponents/custom-elements";

import "./content.styles.css";
import App from "./components/App";
import { StylesProvider, jssPreset } from "@material-ui/styles";
import { create } from "jss";
import Browser from "webextension-polyfill";
class ReactExtensionContainer extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const styleRoot = document.createElement("link");
    const etherScriptRoot = document.createElement("script");
    etherScriptRoot.src = chrome.runtime.getURL("injectables/ether.js");
    const scriptRoot = document.createElement("script");
    scriptRoot.src = chrome.runtime.getURL("injectables/walletConnection.js");
    styleRoot.rel = "stylesheet";
    styleRoot.href = chrome.runtime.getURL("content.styles.css");
    const mountPoint = document.createElement("div");
    shadowRoot.appendChild(styleRoot);
    shadowRoot.appendChild(mountPoint);
    shadowRoot.appendChild(etherScriptRoot);
    shadowRoot.appendChild(scriptRoot);
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

const initWebComponent = function () {
  customElements.define("snickerdoodle-data-wallet", ReactExtensionContainer);

  const app = document.createElement("snickerdoodle-data-wallet");
  app.id = "snickerdoodle-data-wallet";

  document.body.appendChild(app);
};

initWebComponent();
