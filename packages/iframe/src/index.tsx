import "reflect-metadata";
import React from "react";
import ReactDOM from "react-dom";

import App from "@core-iframe/app/App";
import { IFrameFormFactor } from "@core-iframe/implementations/IFrameFormFactor";

console.log("Snickerdoodle Core IFrame Loaded");

const formFactor = new IFrameFormFactor();

formFactor
  .initialize()
  .mapErr((e) => {
    console.error("Error while initializing IFrameFormFactor!", e);
  })
  .map(({ core, childApi, iframeEvents, config, coreConfig, proxy }) => {
    console.log("Snickerdoodle Iframe UI Client Initialized");
    return ReactDOM.render(
      <App
        proxy={proxy}
        core={core}
        childApi={childApi}
        events={iframeEvents}
        config={config}
        coreConfig={coreConfig}
      />,
      document.getElementById("root") as HTMLElement,
    );
  });
