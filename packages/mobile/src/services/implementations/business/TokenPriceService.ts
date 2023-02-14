import {
  ChainId,
  TokenAddress,
  UnixTimestamp,
  TokenMarketData,
  TokenInfo,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { ITokenPriceService } from "../../interfaces/business/ITokenPriceService";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

export class TokenPriceService implements ITokenPriceService {
  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp?: UnixTimestamp | undefined,
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
