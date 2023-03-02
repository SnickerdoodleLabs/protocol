import {
  ChainId,
  TokenAddress,
  TokenInfo,
  TokenMarketData,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@shared/objects/errors";

export interface ITokenPriceService {
  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp?: UnixTimestamp,
  ): ResultAsync<number, SnickerDoodleCoreError>;
  getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], SnickerDoodleCoreError>;
  getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, SnickerDoodleCoreError>;
}

export const ITokenPriceServiceType = Symbol.for("ITokenPriceService");
