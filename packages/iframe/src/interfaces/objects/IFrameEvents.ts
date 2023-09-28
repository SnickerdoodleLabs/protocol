import {
  EVMContractAddress,
  IOpenSeaMetadata,
  ISnickerdoodleCore,
  Invitation,
  InvitationDomain,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export enum EInvitationSourceType {
  DEEPLINK = "DEEPLINK",
  DOMAIN = "DOMAIN",
  CONSENT_ADDRESS = "CONSENT_ADDRESS",
}

export interface IInvitationDisplayRequestData {
  invitation: Invitation;
  metadata: IOpenSeaMetadata | InvitationDomain;
}

export interface IInvitationDisplayRequest {
  data: IInvitationDisplayRequestData;
  type: EInvitationSourceType;
}

export class IFrameEvents {
  public onInvitationDisplayRequested: Subject<IInvitationDisplayRequest>;
  public onConsentAddressFound: Subject<EVMContractAddress>;
  public onStorageAccessHandled: Subject<void>;
  public onCorePromiseResolved: Subject<ISnickerdoodleCore>;
  public constructor() {
    this.onInvitationDisplayRequested = new Subject();
    this.onConsentAddressFound = new Subject();
    this.onStorageAccessHandled = new Subject();
    this.onCorePromiseResolved = new Subject();
  }
}
