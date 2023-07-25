import {
  ChainId,
  TokenAddress,
  TokenInfo,
  TokenMarketData,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface ITokenPriceRepository {
  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    date?: UnixTimestamp,
  ): ResultAsync<number, SnickerDoodleCoreError>;
  getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], SnickerDoodleCoreError>;

  getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, SnickerDoodleCoreError>;
}

export const ITokenPriceRepositoryType = Symbol.for("ITokenPriceRepository");
