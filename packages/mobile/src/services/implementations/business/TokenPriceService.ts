import { ITimeUtilsType, ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  ChainId,
  TokenAddress,
  UnixTimestamp,
  TokenMarketData,
  TokenInfo,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ITokenPriceService } from "../../interfaces/business/ITokenPriceService";
import { SnickerDoodleCoreError } from "../../interfaces/objects/errors/SnickerDoodleCoreError";
import {
  IErrorUtilsType,
  IErrorUtils,
} from "../../interfaces/utils/IErrorUtils";

@injectable()
export class TokenPriceService implements ITokenPriceService {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
    @inject(ITimeUtilsType)
    protected timeUtils: ITimeUtils,
  ) {}
  public getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], SnickerDoodleCoreError> {
    return this.core.getTokenMarketData(ids).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, SnickerDoodleCoreError> {
    return this.core.getTokenInfo(chainId, contractAddress).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    // @TODO check coingecko server timezone
    timestamp: UnixTimestamp = this.timeUtils.getUnixNow(),
  ): ResultAsync<number, SnickerDoodleCoreError> {
    return this.core
      .getTokenPrice(chainId, address, timestamp)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
}
