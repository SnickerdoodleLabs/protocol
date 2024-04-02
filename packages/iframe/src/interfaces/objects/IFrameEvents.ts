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
  USER_REQUEST = "USER_REQUEST",
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
  public onDashboardViewRequested: Subject<void>;
  public onOptInRequested: Subject<EVMContractAddress | undefined>;
  public onDefaultConsentOptinRequested: Subject<undefined>;
  public constructor() {
    this.onInvitationDisplayRequested = new Subject();
    this.onConsentAddressFound = new Subject();
    this.onDashboardViewRequested = new Subject();
    this.onOptInRequested = new Subject();
    this.onDefaultConsentOptinRequested = new Subject();
  }
}
