import {
  IConfigOverrides,
  IExtensionConfigOverrides,
} from "@snickerdoodlelabs/objects";
import { IExtensionConfig } from "@synamint-extension-sdk/shared";

export interface IConfigProvider {
  getCoreConfig: () => IConfigOverrides;
  setCoreConfigOverrides: (configOverrides: IConfigOverrides) => void;
  getExtensionConfig: () => IExtensionConfig;
  setExtensionConfigOverrides: (
    configOverrides: IExtensionConfigOverrides,
  ) => void;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
