import { EVMTransaction } from "@objects/businessObjects/versioned/EVMTransaction.js";
import {
  BigNumberString,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  EVMTransactionHash,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export enum EPolygonTransactionType {
  ERC20 = 0,
  ERC721 = 1,
  ERC1155 = 2,
}

export class PolygonTransaction extends EVMTransaction {
  public constructor(
    public chainId: ChainId,
    public hash: EVMTransactionHash,
    public timestamp: UnixTimestamp,
    public blockHeight: number | null,
    public to: EVMAccountAddress | null,
    public from: EVMAccountAddress | null,
    public value: BigNumberString | null,
    public gasPrice: BigNumberString | null,
    public contractAddress: EVMContractAddress | null,
    public tokenId: BigNumberString | null,
    public type: EPolygonTransactionType,
  ) {
    super(
      chainId,
      hash,
      timestamp,
      blockHeight,
      to,
      from,
      value,
      gasPrice,
      contractAddress,
      null,
      null,
      null,
      null,
    );
  }
}
