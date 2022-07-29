import {
  DomainName,
  EVMContractAddress,
  Signature,
  TokenId,
} from "@objects/primitives";
export interface IDisplayItems {
  title: string;
  description: string;
  image: string;
  rewardName: string;
  nftClaimedImage: string;
}

export class CohortInvitation {
  public constructor(
    public domain: DomainName,
    public consentContractAddress: EVMContractAddress,
    public tokenId: TokenId,
    public businessSignature: Signature | null,
    public displayItems?: IDisplayItems
  ) {}
}
