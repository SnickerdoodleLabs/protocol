import {
  EVMContractAddress,
  BigNumberString,
  EVMAccountAddress,
  TickerSymbol,
  ChainId,
} from "@objects/primitives";

export interface IEVMNFT {
  contract: EVMContractAddress;
  tokenId: BigNumberString;
  contractType: string;
  owner: EVMAccountAddress;
  tokenUri: string;
  metadata: string;
  amount: string;
  name: string;
  ticker: TickerSymbol;
  chain: ChainId;
}
