import {
  BigNumberString,
  EVMContractAddress,
  IpfsCID,
  MarketplaceTag,
  UnixTimestamp,
} from "@objects/primitives";

export class MarketplaceListing {
  public constructor(
    public previous: BigNumberString,
    public next: BigNumberString,
    public consentContract: EVMContractAddress,
    public timeExpiring: UnixTimestamp,
    public cid: IpfsCID,
    public stakeAmount: BigNumberString,
    public tag: MarketplaceTag,
  ) {}
}
