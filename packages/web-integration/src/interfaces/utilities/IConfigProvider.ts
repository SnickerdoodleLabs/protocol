import { URLString } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";

import { WebIntegrationConfig } from "@web-integration/interfaces/objects/index.js";

export interface IConfigProvider {
  getConfig(): WebIntegrationConfig;
  setValues(signer: ethers.Signer | null, iframeUrl: URLString): void;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
