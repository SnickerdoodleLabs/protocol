import {
  IOpenSeaMetadata,
  Invitation,
  InvitationDomain,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export enum EInvitationSourceType {
  DEEPLINK = "DEEPLINK",
  DOMAIN = "DOMAIN",
}

export interface IInvitationDisplayRequest {
  data: {
    invitation: Invitation;
    metadata: IOpenSeaMetadata | InvitationDomain;
  } | null;
  type: EInvitationSourceType;
}

export class IFrameEvents {
  public onInvitationDisplayRequested: Subject<IInvitationDisplayRequest>;
  public constructor() {
    this.onInvitationDisplayRequested = new Subject();
  }
}
