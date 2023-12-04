import { IConfigOverrides } from "@objects/interfaces/IConfigOverrides.js";
import {
  IIFrameConfigOverrides,
  IStaticIntegrationConfigOverrides,
} from "@objects/interfaces";
export interface IWebIntegrationConfigOverrides
  extends IConfigOverrides,
    IIFrameConfigOverrides,
    IStaticIntegrationConfigOverrides {}
