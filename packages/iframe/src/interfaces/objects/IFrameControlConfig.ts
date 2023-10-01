import {
  EVMContractAddress,
  IIFrameConfigOverrides,
  IPaletteOverrides,
} from "@snickerdoodlelabs/objects";

export class IFrameControlConfig {
  public palette: undefined | IPaletteOverrides;
  public showDeeplinkInvitations: boolean;
  public checkDomainInvitations: boolean;
  public consentAddress: EVMContractAddress | undefined;
  public constructor() {
    this.palette = undefined;
    this.showDeeplinkInvitations = true;
    this.checkDomainInvitations = true;
    this.consentAddress = undefined;
  }
}
