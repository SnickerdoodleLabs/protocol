import { IConfigOverrides } from "@objects/interfaces/IConfigOverrides.js";
import { IExtensionConfigOverrides } from "@objects/interfaces/IExtensionConfigOverrides";
export interface IExtensionSdkConfigOverrides
  extends IConfigOverrides,
    IExtensionConfigOverrides {}
