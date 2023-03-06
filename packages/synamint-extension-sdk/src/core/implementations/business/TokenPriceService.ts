import { ITokenPriceService } from "@synamint-extension-sdk/core/interfaces/business";
import {
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "@synamint-extension-sdk/core/interfaces/data";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
import {
  ChainId,
  TokenAddress,
  TokenInfo,
  TokenMarketData,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class TokenPriceService implements ITokenPriceService {
  constructor(
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepository: ITokenPriceRepository,
  ) {}
  public getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], SnickerDoodleCoreError> {
    return this.tokenPriceRepository.getTokenMarketData(ids);
  }
  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, SnickerDoodleCoreError> {
    return this.tokenPriceRepository.getTokenInfo(chainId, contractAddress);
  }
  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp?: UnixTimestamp,
  ): ResultAsync<number, SnickerDoodleCoreError> {
    return this.tokenPriceRepository.getTokenPrice(chainId, address, timestamp);
  }
}
