import { MoralisConfigValues } from "@moralisweb3/core";
import { MoralisSolApi } from "@moralisweb3/sol-api";
import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountBalanceError,
  AjaxError,
  ChainId,
  AccountNFTError,
  AccountIndexingError,
  ISolanaBalanceRepository,
  ISolanaNFTRepository,
  ISolanaTransactionRepository,
  SolanaAccountAddress,
  SolanaBalance,
  SolanaNFT,
  SolanaTransaction,
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import pkg from "moralis";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/IIndexerConfigProvider.js";

const start = (pkg as any).default.start as (
  providedConfig?: Partial<MoralisConfigValues> | undefined,
) => Promise<void>;
const solanaApi = (pkg as any).default.solanaApi as MoralisSolApi;

export class MoralisSolanaIndexer
  implements
    ISolanaBalanceRepository,
    ISolanaNFTRepository,
    ISolanaTransactionRepository
{
  private _initialized = false;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public initialize<E>(): ResultAsync<void, E> {
    if (this._initialized) {
      return okAsync(undefined);
    }

    return this.configProvider.getConfig().andThen((config) => {
      return ResultAsync.fromPromise(
        start({ apiKey: config.moralisApiKey }),
        (e) => e as E,
      );
    });
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaBalance[], AccountBalanceError | AjaxError> {
    throw new Error("Method not implemented.");
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AjaxError | AccountNFTError> {
    throw new Error("Method not implemented.");
  }

  public getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SolanaTransaction[], AjaxError | AccountIndexingError> {
    throw new Error("Method not implemented.");
  }
}
