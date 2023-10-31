import { Invitation } from "@objects/businessObjects/Invitation.js";
import { InvitationDomain } from "@objects/businessObjects/InvitationDomain.js";
import { DomainName } from "@objects/primitives/index.js";

export class PageInvitation {
  public constructor(
    public url: DomainName,
    public invitation: Invitation,
    public domainDetails: InvitationDomain,
  ) {}
}
