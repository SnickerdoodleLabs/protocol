import { IPaletteOverrides } from "@objects/interfaces/IPaletteOverrides.js";
import { EVMContractAddress } from "@objects/primitives/index.js";

export interface IIFrameConfigOverrides {
  palette?: IPaletteOverrides;
  showDeeplinkInvitations?: boolean;
  checkDomainInvitations?: boolean;
  consentAddress?: EVMContractAddress;}
