import {
  TokenBalanceWithOwnerAddress,
  TokenInfo,
  TokenMarketData,
} from "@snickerdoodlelabs/objects";

export interface IBalanceItem extends TokenBalanceWithOwnerAddress {
  tokenInfo: TokenInfo | null;
  marketaData: TokenMarketData | null;
  quoteBalance: number;
}
