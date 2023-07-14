import "reflect-metadata";
import { LogUtils } from "@snickerdoodlelabs/common-utils";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import { DomainName, ISnickerdoodleCore } from "@snickerdoodlelabs/objects";

import { CoreListener } from "./implementations/api/index";
import { CoreUIService } from "./implementations/business/index";
// Instantiate the Snickerdoodle core.

console.log("Snickerdoodle Core IFrame Loaded");

const urlParams = new URLSearchParams(window.location.search);
const defaultGovernanceChainId = urlParams.get("defaultGovernanceChainId");
const debug = urlParams.get("debug");

const coreUIService = new CoreUIService();
const logUtils = new LogUtils();

const sourceDomain = DomainName("snickerdoodlelabs.github.io");

const core: ISnickerdoodleCore = new SnickerdoodleCore();

const coreListener = new CoreListener(
  core,
  coreUIService,
  logUtils,
  sourceDomain,
);

coreListener.activateModel().map(() => {
  console.log("Snickerdoodle Core CoreListener model activated");
});
