import {
  EVMContractAddress,
  IOldUserAgreement,
  IUserAgreement,
  Invitation,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export enum EInvitationSourceType {
  DEEPLINK = "DEEPLINK",
  DOMAIN = "DOMAIN",
  CONSENT_ADDRESS = "CONSENT_ADDRESS",
}

export interface IInvitationDisplayRequestData {
  invitation: Invitation;
  metadata: IOldUserAgreement | IUserAgreement;
}

export interface IInvitationDisplayRequest {
  data: IInvitationDisplayRequestData;
  type: EInvitationSourceType;
}

export class IFrameEvents {
  public onInvitationDisplayRequested: Subject<IInvitationDisplayRequest>;
  public onConsentAddressFound: Subject<EVMContractAddress>;
  public onDisplayConsentPermissionsRequested: Subject<void>;
  public constructor() {
    this.onInvitationDisplayRequested = new Subject();
    this.onConsentAddressFound = new Subject();
    this.onDisplayConsentPermissionsRequested = new Subject();
  }
}
