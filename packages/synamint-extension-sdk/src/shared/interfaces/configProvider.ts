import { ExtensionConfig } from "@synamint-extension-sdk/shared/objects/Config";

export interface IConfigProvider {
  getConfig: () => ExtensionConfig;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
