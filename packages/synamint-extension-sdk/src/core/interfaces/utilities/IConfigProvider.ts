import {
  IConfigOverrides,
  IExtensionSdkConfigOverrides,
} from "@snickerdoodlelabs/objects";
import { IExtensionConfig } from "@synamint-extension-sdk/shared";

export interface IConfigProvider {
  getCoreConfig: () => IConfigOverrides;
  getExtensionConfig: () => IExtensionConfig;
  setConfigOverrides: (config: IExtensionSdkConfigOverrides) => void;
}

export const IConfigProviderType = Symbol.for("IConfigProvider");
