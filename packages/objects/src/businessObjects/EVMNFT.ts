import {
  EVMContractAddress,
  EVMAccountAddress,
  TickerSymbol,
  ChainId,
  TokenUri,
  BigNumberString,
} from "@objects/primitives";

export interface IEVMNFT {
  contract: EVMContractAddress;
  tokenId: BigNumberString;
  contractType: string;
  owner: EVMAccountAddress;
  tokenUri: TokenUri;
  metadata: string;
  amount: BigNumberString;
  name: string;
  ticker: TickerSymbol;
  chain: ChainId;
}
