import { DomainName, URLString } from "@objects/primitives/index.js";

export class InvitationDomain {
  public constructor(
    public domain: DomainName,
    public title: string,
    public description: string,
    public image: URLString,
    public rewardName: string,
    public nftClaimedImage: URLString,
  ) {}
}
