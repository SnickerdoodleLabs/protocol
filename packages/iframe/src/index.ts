import { JsonUtils, LogUtils } from "@snickerdoodlelabs/common-utils";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import { ChainId, ISnickerdoodleCore } from "@snickerdoodlelabs/objects";
import { LocalStorageUtils } from "@snickerdoodlelabs/utils";

import { CoreListener } from "@core-iframe/implementations/api/index.js";
import { CoreUIService } from "@core-iframe/implementations/business/index.js";
// Instantiate the Snickerdoodle core.

const urlParams = new URLSearchParams(window.location.search);
const defaultGovernanceChainId = urlParams.get("defaultGovernanceChainId");
const debug = urlParams.get("debug");

const coreUIService = new CoreUIService();
const logUtils = new LogUtils();
const jsonUtils = new JsonUtils();
const localStorageUtils = new LocalStorageUtils();

const governanceChainId = localStorageUtils.getItem("governanceChainId");

const debugParsed = jsonUtils.safelyParseJSON<boolean>(debug as string);

const chainId = governanceChainId || defaultGovernanceChainId;

const core: ISnickerdoodleCore = new SnickerdoodleCore();

const coreListener = new CoreListener(
  core,
  coreUIService,
  logUtils,
  ChainId(Number(chainId)),
);
coreListener.activateModel();
