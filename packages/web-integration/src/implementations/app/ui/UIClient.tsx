import { App } from "@web-integration/implementations/app/ui/App.js";
import { IPalletteOverrides } from "@web-integration/implementations/app/ui/lib/index.js";
import { IUIClient } from "@web-integration/interfaces/app/ui/index.js";
import { EProxyContainerID } from "@web-integration/interfaces/objects/enums/index.js";
import { ISnickerdoodleIFrameProxy } from "@web-integration/interfaces/proxy/index.js";
import { create } from "jss";
import preset from "jss-preset-default";
import React from "react";
import { render } from "react-dom";
import { JssProvider, createGenerateId } from "react-jss";

export class UIClient implements IUIClient {
  constructor(
    protected proxy: ISnickerdoodleIFrameProxy,
    protected palette?: IPalletteOverrides,
  ) {}

  public register(): void {
    const customElementName = `sdl-protocol-iframe-ui-client`;
    customElements.define(customElementName, this.customElementClass);
    const client = document.createElement(customElementName);
    client.id = customElementName;
    client.appendChild(this.styleContainer);
    this.containerNode.appendChild(client);
  }

  private get containerNode(): HTMLElement {
    return document.getElementById(EProxyContainerID.ROOT)!;
  }

  private get customElementClass() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    class ReactPopupManagerContainer extends HTMLElement {
      connectedCallback() {
        const shadowRoot = this.attachShadow({
          mode: "open",
        });
        const mountPoint = document.createElement("div");
        mountPoint.id = EProxyContainerID.UI_CLIENT;
        shadowRoot.appendChild(mountPoint);

        const jss = create({
          ...preset(),
          insertionPoint: mountPoint,
        });
        render(
          <JssProvider jss={jss} generateId={createGenerateId()}>
            <App proxy={_this.proxy} palette={_this.palette} />
          </JssProvider>,
          mountPoint,
        );
      }
    }
    return ReactPopupManagerContainer;
  }
  private get styleContainer(): HTMLLinkElement {
    const styleContainer = document.createElement("link");
    styleContainer.rel = "stylesheet";
    styleContainer.type = "text/css";
    styleContainer.href =
      "//fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700&display=swap&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700&display=swap&family=Poppins:wght@400;700&display=swap";
    return styleContainer;
  }
}
