import { EVMAccountAddress } from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";

export class Tag {
  public constructor(
    public slot: BigNumber | null = null,
    public tag: string | null = null,
    public staker: EVMAccountAddress | null = null,
  ) {}
}

// NOTE: Reference from IConsentFactory.sol
/*     /// @dev Listing object for storing marketplace listings
   struct Tag {
        uint256 slot; // slot staked by this contract
        string tag; // human-readable tag this contract has staked
        address staker; // address which staked the specific tag
} */
