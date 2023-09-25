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
  .map(({ core, childApi, coreListenerEvents, iframeControlConfig }) => {
    console.log("Snickerdoodle Iframe UI Client Initialized");
    return ReactDOM.render(
      <App
        core={core}
        childApi={childApi}
        events={coreListenerEvents}
        config={iframeControlConfig}
      />,
      document.getElementById("root") as HTMLElement,
    );
  });
