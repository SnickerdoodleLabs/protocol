import "reflect-metadata";
import App from "@core-iframe/app/App";
import { IFrameFormFactor } from "@core-iframe/implementations/IFrameFormFactor";
import React from "react";
import ReactDOM from "react-dom";

console.log("Snickerdoodle Core IFrame Loaded");

const formFactor = new IFrameFormFactor();

formFactor
  .initialize()
  .mapErr((e) => {
    console.error("Error while initializing IFrameFormFactor!", e);
  })
  .map(({ core, childApi, iframeEvents, config }) => {
    console.log("Snickerdoodle Iframe UI Client Initialized");
    return ReactDOM.render(
      <App
        core={core}
        childApi={childApi}
        events={iframeEvents}
        config={config}
      />,
      document.getElementById("root") as HTMLElement,
    );
  });
