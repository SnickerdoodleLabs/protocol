import { Invitation } from "@objects/businessObjects/Invitation";
import { InvitationDomain } from "@objects/businessObjects/InvitationDomain";
import { URLString } from "@objects/primitives";

export class PageInvitation {
  public constructor(
    public url: URLString,
    public invitation: Invitation,
    public domainDetails: InvitationDomain,
  ) {}
}
