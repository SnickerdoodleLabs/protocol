import { ExtensionConfig } from "@synamint-extension-sdk/shared/objects/businessObjects/Config";

export interface IConfigProvider {
  getConfig: () => ExtensionConfig;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
