import {
  IExtensionConfig,
  IExtensionConfigOverrides,
} from "@synamint-extension-sdk/shared/interfaces/IExtensionConfig";
export interface IConfigProvider {
  getConfig: () => IExtensionConfig;
  setConfigOverrides: (configOverrides: IExtensionConfigOverrides) => void;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
