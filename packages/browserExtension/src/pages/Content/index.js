import React from "react";
import {render} from "react-dom";
import "@webcomponents/custom-elements";

import "./content.styles.css";
import App from "./components/App";
import { StylesProvider, jssPreset } from '@material-ui/styles';
import { create } from 'jss';

class ReactExtensionContainer extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const styleRoot = document.createElement('link');
    const scriptRoot = document.createElement('script');
    scriptRoot.src = chrome.runtime.getURL('injectables/walletConnection.js');
    styleRoot.rel =  "stylesheet";
    styleRoot.href =  chrome.runtime.getURL("content.styles.css");
    const mountPoint = document.createElement('div');
    shadowRoot.appendChild(styleRoot);
    shadowRoot.appendChild(mountPoint);
    shadowRoot.appendChild(scriptRoot);
    mountPoint.id = "content-container"

    const jss = create({
      ...jssPreset(),
      insertionPoint: mountPoint
  });


    render(
      <StylesProvider jss={jss}>
          <App />
      </StylesProvider>,
      mountPoint
    );
   // mountPoint.innerHTML = claimPopup.stringPopUp;

    // let shadowDomStyle = document.createElement("style");
    // shadowDomStyle.innerHTML = chrome.runtime.getURL("content.style.css");

    // let shadowDomScript = document.createElement("script");
    // shadowDomScript.type = "text/javascript";
    // shadowDomScript.src = chrome.runtime.getURL("shadowScript.js");

    // reactRoot.appendChild(mountPoint);
    // reactRoot.appendChild(shadowDomStyle);
    // reactRoot.appendChild(shadowDomStyle);
    // reactRoot.appendChild(shadowDomScript);
  }
}

const initWebComponent = function () {
  customElements.define("snickerdoodle-data-wallet", ReactExtensionContainer);

  const app = document.createElement("snickerdoodle-data-wallet");
  app.id = "snickerdoodle-data-wallet";
//   const appContainer = document.createElement("div");
//   appContainer.id = "app-container";
//   app.appendChild(appContainer);
  document.body.appendChild(app);

 };

initWebComponent();
