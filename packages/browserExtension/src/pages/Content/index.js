import "@webcomponents/custom-elements";
import { claimPopup } from "./modules/main";

class ReactExtensionContainer extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("div");
    mountPoint.innerHTML = claimPopup.stringPopUp;

    let shadowDomStyle = document.createElement("style");
    shadowDomStyle.textContent = claimPopup.popUpStyle;

    let shadowDomScript = document.createElement("script");
    shadowDomScript.type = "text/javascript";
    shadowDomScript.src = chrome.runtime.getURL("shadowScript.js");

    const reactRoot = this.attachShadow({ mode: "open" });
    reactRoot.appendChild(mountPoint);
    reactRoot.appendChild(shadowDomStyle);
    reactRoot.appendChild(shadowDomScript);
  }
}

const initWebComponent = function () {
  customElements.define("react-extension-container", ReactExtensionContainer);

  const app = document.createElement("react-extension-container");
  app.id = "react-extension-container";
  document.body.appendChild(app);
};

initWebComponent();
