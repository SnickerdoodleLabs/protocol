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
  public overrideConfig(config: IIFrameConfigOverrides) {
    this.consentAddress = config.consentAddress ?? config.consentAddress;
    this.showDeeplinkInvitations =
      config.showDeeplinkInvitations ?? this.showDeeplinkInvitations;
    this.checkDomainInvitations =
      config.checkDomainInvitations ?? this.checkDomainInvitations;
    this.palette = config.palette ?? this.palette;
  }
}
