import "reflect-metadata";
// import App from "@core-iframe/app/App";
import X from "@core-iframe/components/App";
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
  .map(({ childApi, configProvider, contextProvider }) => {
    console.log("Snickerdoodle Iframe UI Client Initialized");
    return ReactDOM.render(
      <X
        childApi={childApi}
        configProvider={configProvider}
        contextProvider={contextProvider}
      />,
      document.getElementById("root") as HTMLElement,
    );
  });
