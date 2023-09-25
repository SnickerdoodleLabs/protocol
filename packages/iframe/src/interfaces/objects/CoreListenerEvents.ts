import {
  IOpenSeaMetadata,
  Invitation,
  InvitationDomain,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export enum EInvitationType {
  DEEPLINK = "DEEPLINK",
  DOMAIN = "DOMAIN",
}

export interface IInvitationDisplayRequest {
  data: {
    invitation: Invitation;
    metadata: IOpenSeaMetadata | InvitationDomain;
  } | null;
  type: EInvitationType;
}

export class CoreListenerEvents {
  public onInvitationDisplayRequested: Subject<IInvitationDisplayRequest>;
  public constructor() {
    this.onInvitationDisplayRequested = new Subject();
  }
}
