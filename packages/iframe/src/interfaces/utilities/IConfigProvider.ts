import { IFrameConfig } from "@core-iframe/interfaces/objects/index";

export interface IConfigProvider {
  getConfig(): IFrameConfig;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
