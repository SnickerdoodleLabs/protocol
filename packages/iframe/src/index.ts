import "reflect-metadata";
import { Container } from "inversify";

import { iframeModule } from "@core-iframe/IFrameModule";
import {
  ICoreListener,
  ICoreListenerType,
} from "@core-iframe/interfaces/api/index";
// Instantiate the Snickerdoodle core.

console.log("Snickerdoodle Core IFrame Loaded");

// Left in as an example and reminder that we can pass stuff via the URL params to the iframe
// const urlParams = new URLSearchParams(window.location.search);
// const defaultGovernanceChainId = urlParams.get("defaultGovernanceChainId");
// const debug = urlParams.get("debug");

const iocContainer = new Container();
// Elaborate syntax to demonstrate that we can use multiple modules
iocContainer.load(...[iframeModule]);

const coreListener = iocContainer.get<ICoreListener>(ICoreListenerType);

coreListener
  .activateModel()
  .map(() => {
    console.log("Snickerdoodle Core CoreListener model activated");
  })
  .mapErr((e) => {
    console.error("Error while activating CoreListener!", e);
  });
