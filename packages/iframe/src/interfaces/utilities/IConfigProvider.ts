import { DomainName } from "@snickerdoodlelabs/objects";

import { IFrameConfig } from "@core-iframe/interfaces/objects/index";

export interface IConfigProvider {
  getConfig(): IFrameConfig;
  overrideSourceDomain(domain: DomainName): void;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
