import { MoralisConfigValues } from "@moralisweb3/core";
import { MoralisSolApi } from "@moralisweb3/sol-api";
import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  ChainId,
  AccountIndexingError,
  ISolanaBalanceRepository,
  ISolanaNFTRepository,
  ISolanaTransactionRepository,
  SolanaAccountAddress,
  TokenBalance,
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

  public initialize(): ResultAsync<void, AccountIndexingError> {
    if (this._initialized) {
      return okAsync(undefined);
    }

    return this.configProvider.getConfig().andThen((config) => {
      return ResultAsync.fromPromise(
        start({ apiKey: config.moralisApiKey }),
        (e) => new AccountIndexingError("error starting moralis client", e),
      );
    });
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError> {
    throw new Error("Method not implemented.");
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AccountIndexingError> {
    throw new Error("Method not implemented.");
  }

  public getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SolanaTransaction[], AccountIndexingError> {
    throw new Error("Method not implemented.");
  }
}
