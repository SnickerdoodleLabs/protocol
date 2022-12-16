import {
  TokenBalance,
  TokenInfo,
  TokenMarketData,
} from "@snickerdoodlelabs/objects";

export interface IBalanceItem extends TokenBalance {
  tokenInfo: TokenInfo | null;
  marketaData: TokenMarketData | null;
}
