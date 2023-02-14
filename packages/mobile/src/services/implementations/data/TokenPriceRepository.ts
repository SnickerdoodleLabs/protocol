import {
  ChainId,
  TokenAddress,
  UnixTimestamp,
  TokenMarketData,
  TokenInfo,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { ITokenPriceRepository } from "../../interfaces/data/ITokenPriceRepository";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

export class TokenPriceRepository implements ITokenPriceRepository {
  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    date?: UnixTimestamp | undefined,
  ): ResultAsync<number, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
  getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, SnickerDoodleCoreError> {
    throw new Error("Method not implemented.");
  }
}
