import {
  EVMContractAddress,
  IPaletteOverrides,
} from "@snickerdoodlelabs/objects";

declare const __DEFAULT_CONSENT_CONTRACT__: string;

export class IFrameControlConfig {
  public palette: undefined | IPaletteOverrides;
  public showDeeplinkInvitations: boolean;
  public checkDomainInvitations: boolean;
  public consentAddress: EVMContractAddress | undefined;
  public readonly defaultConsentContract = __DEFAULT_CONSENT_CONTRACT__
    ? EVMContractAddress(__DEFAULT_CONSENT_CONTRACT__)
    : undefined;
  public constructor() {
    this.palette = undefined;
    this.showDeeplinkInvitations = true;
    this.checkDomainInvitations = true;
    this.consentAddress = undefined;
  }
}
