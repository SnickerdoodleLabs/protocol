import { IConfigOverrides } from "@objects/interfaces/IConfigOverrides.js";
import { IIFrameConfigOverrides } from "@objects/interfaces/IIFrameConfigOverrides.js";
import { IStaticIntegrationConfigOverrides } from "@objects/interfaces/IStaticIntegrationConfigOverrides.js";
export interface IWebIntegrationConfigOverrides
  extends IConfigOverrides,
    IIFrameConfigOverrides,
    IStaticIntegrationConfigOverrides {}
