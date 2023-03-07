import { ITokenPriceRepository } from "@synamint-extension-sdk/core/interfaces/data";
import { IErrorUtils, IErrorUtilsType } from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";
import { ITimeUtilsType, ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  ChainId,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  TokenAddress,
  TokenInfo,
  TokenMarketData,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { id, inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class TokenPriceRepository implements ITokenPriceRepository {
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
