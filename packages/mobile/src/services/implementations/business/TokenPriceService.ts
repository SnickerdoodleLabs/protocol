import {
  ChainId,
  TokenAddress,
  UnixTimestamp,
  TokenMarketData,
  TokenInfo,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ITokenPriceService } from "../../interfaces/business/ITokenPriceService";
import {
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
} from "../../interfaces/data/ITokenPriceRepository";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";

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
