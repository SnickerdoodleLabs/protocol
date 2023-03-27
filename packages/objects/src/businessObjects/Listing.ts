import {
  BigNumberString,
  EVMContractAddress,
  IpfsCID,
  MarketplaceTag,
  UnixTimestamp,
} from "@objects/primitives";

export class Listing {
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

// NOTE: Reference from IConsentFactory.sol
/*     /// @dev Listing object for storing marketplace listings
      struct Listing{
          uint256 previous; // pointer to the previous active slot
          uint256 next; // pointer to the next active slot
          address consentContract; // address of the target consent contract
          uint256 timeExpiring; // unix timestamp when the listing expires and can be replaced
  } */
