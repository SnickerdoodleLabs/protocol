import { IFrameConfig } from "@core-iframe/interfaces/objects/index";
import { DomainName } from "@snickerdoodlelabs/objects";

export interface IConfigProvider {
  getConfig(): IFrameConfig;
  overrideSourceDomain(domain: DomainName): void;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
