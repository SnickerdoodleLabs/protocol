import { EVMNFT } from "@objects/businessObjects/EVMNFT.js";
import { EChain, EContractStandard, ERewardType } from "@objects/enum/index.js";
import {
  EVMContractAddress,
  EVMAccountAddress,
  TokenUri,
  BigNumberString,
  BlockNumber,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export class EVMIndexerNft extends EVMNFT {
  public constructor(
    public indexerResponse: boolean = true,
    public token: EVMContractAddress,
    public tokenId: BigNumberString,
    public contractType: EContractStandard | ERewardType | "Unknown",
    public owner: EVMAccountAddress,
    public tokenUri: TokenUri | undefined,
    public metadata: object | undefined,
    public name: string,
    public chain: EChain,
    public amount?: BigNumberString,
    public blockNumber?: BlockNumber,
    public lastOwnerTimeStamp?: UnixTimestamp,
  ) {
    super(
      token,
      tokenId,
      contractType,
      owner,
      tokenUri,
      metadata,
      name,
      chain,
      blockNumber,
      lastOwnerTimeStamp,
    );
  }
}
