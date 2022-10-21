import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  ChainId,
  ITokenPriceRepository,
  TickerSymbol,
  TokenAddress,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/IIndexerConfigProvider.js";

@injectable()
export class CoinGeckoTokenPriceRepository implements ITokenPriceRepository {
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public initialize(): ResultAsync<void, AccountIndexingError> {
    return okAsync(undefined);
  }

  public getTokenPrice(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
    date: Date,
  ): ResultAsync<number, AccountIndexingError> {
    throw new Error("Method not implemented.");
  }
}
