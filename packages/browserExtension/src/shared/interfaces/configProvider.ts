import { ExtensionConfig } from "@shared/objects/Config";

export interface IConfigProvider {
  getConfig: () => ExtensionConfig;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
