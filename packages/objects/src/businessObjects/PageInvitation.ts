import { Invitation } from "@objects/businessObjects/Invitation.js";
import { IOldUserAgreement } from "@objects/interfaces/IOldUserAgreement.js";
import { IUserAgreement } from "@objects/interfaces/IUserAgreement.js";
import { DomainName } from "@objects/primitives/index.js";

export class PageInvitation {
  public constructor(
    public url: DomainName,
    public invitation: Invitation,
    public invitationMetadata: IOldUserAgreement | IUserAgreement,
  ) {}
}
