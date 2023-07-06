import { Invitation } from "@objects/businessObjects/Invitation.js";
import { InvitationDomain } from "@objects/businessObjects/InvitationDomain.js";
import { URLString } from "@objects/primitives/index.js";

export class PageInvitation {
  public constructor(
    public url: URLString,
    public invitation: Invitation,
    public domainDetails: InvitationDomain,
  ) {}
}
