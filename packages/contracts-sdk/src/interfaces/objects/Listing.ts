import { ListingSlot } from "@contracts-sdk/index";
import {
  BigNumberString,
  EVMContractAddress,
  IpfsCID,
  MarketplaceTag,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

export class Listing {
  public constructor(
    public previous: BigNumberString | null = null,
    public next: BigNumberString | null = null,
    public consentContract: EVMContractAddress | null = null,
    public timeExpiring: UnixTimestamp | null = null,
    public cid: IpfsCID | null = null,
    public slot: ListingSlot | null = null,
    public tag: MarketplaceTag | null = null,
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
