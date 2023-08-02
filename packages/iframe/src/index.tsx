import "reflect-metadata";
import React from "react";
import ReactDOM from "react-dom";

import App from "@core-iframe/components/App";
import { IFrameFormFactor } from "@core-iframe/implementations/IFrameFormFactor";

console.log("Snickerdoodle Core IFrame Loaded");

// Render the app UI
// TODO: The formFactor and the App component probably need to be the same thing
ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);

// Left in as an example and reminder that we can pass stuff via the URL params to the iframe
// const urlParams = new URLSearchParams(window.location.search);
// const defaultGovernanceChainId = urlParams.get("defaultGovernanceChainId");
// const debug = urlParams.get("debug");

const formFactor = new IFrameFormFactor();

formFactor.initialize().mapErr((e) => {
  console.error("Error while initializing IFrameFormFactor!", e);
});
