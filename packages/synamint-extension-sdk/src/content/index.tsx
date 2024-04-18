import { create } from "jss";
import React from "react";
import { render } from "react-dom";

import "@webcomponents/custom-elements";
import { v4 } from "uuid";
import App from "@synamint-extension-sdk/content/components/App";
import PopupTabManager from "@synamint-extension-sdk/content/PopupTabManager";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import { IPaletteOverrides } from "@snickerdoodlelabs/objects";

class ReactPopupManagerContainer extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({
      mode: "open",
    });
    const mountPoint = document.createElement("div");
    mountPoint.id = "sdl-data-wallet-popup-manager";
    shadowRoot.appendChild(mountPoint);

    const jss = create({
      ...jssPreset(),
      insertionPoint: mountPoint,
    });
    render(
      <StylesProvider jss={jss}>
        <PopupTabManager />
      </StylesProvider>,
      mountPoint,
    );
  }
}

interface ConfigurableElement {
  configuration: IPaletteOverrides | undefined;
}
class ReactExtensionPopupContainer
  extends HTMLElement
  implements ConfigurableElement
{
  private config: IPaletteOverrides | undefined;

  set configuration(config: IPaletteOverrides | undefined) {
    this.config = config;
  }
  connectedCallback() {
    const shadowRoot = this.attachShadow({
      mode: "open",
    });
    const mountPoint = document.createElement("div");
    mountPoint.id = "snickerdoodle-data-wallet-manager";
    shadowRoot.appendChild(mountPoint);

    const jss = create({
      ...jssPreset(),
      insertionPoint: mountPoint,
    });
    render(
      <StylesProvider jss={jss}>
        <App paletteOverrides={this.config} />
      </StylesProvider>,
      mountPoint,
    );
  }
}

const getStyleContainer = (): HTMLLinkElement => {
  const styleContainer = document.createElement("link");
  styleContainer.rel = "stylesheet";
  styleContainer.type = "text/css";
  styleContainer.href =
    "//fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap&family=Source+Sans+Pro:wght@400;700&display=swap&family=Shrikhand&display=swap&family=Inter:wght@300;400;500;600&display=swap&family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700&display=swap";
  return styleContainer;
};

const renderPopupTabManager = () => {
  const popup = document.getElementById("sdl-data-wallet-popup-manager");
  if (!popup) {
    const customElementName = `sdl-data-wallet-popup-manager`;
    customElements.define(customElementName, ReactPopupManagerContainer);
    const popupTabManager = document.createElement(customElementName);
    popupTabManager.id = customElementName;
    popupTabManager.appendChild(getStyleContainer());
    document.body.appendChild(popupTabManager);
  }
};

const renderPopupContainer = (paletteOverrides?: IPaletteOverrides) => {
  const root = document.getElementById("snickerdoodle-data-wallet-container");

  const customElementName = `snickerdoodle-data-wallet-container${
    !root ? "" : v4()
  }`;
  customElements.define(customElementName, ReactExtensionPopupContainer);
  const container = document.createElement(customElementName) as HTMLElement & {
    configuration: IPaletteOverrides | undefined;
  };
  container.configuration = paletteOverrides;
  container.id = customElementName;
  container.appendChild(getStyleContainer());
  document.body.appendChild(container);
};

export const initWebComponent = (paletteOverrides?: IPaletteOverrides) => {
  renderPopupTabManager();
  renderPopupContainer(paletteOverrides);
};
