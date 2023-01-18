import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  ILogUtilsType,
  ILogUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  ChainId,
  EVMAccountAddress,
  EVMTransaction,
  IEVMAccountBalanceRepository,
  IEVMTransactionRepository,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  TokenBalance,
  IEVMNftRepository,
  EVMNFT,
  BigNumberString,
  getChainInfoByChainId,
  EChainTechnology,
  TickerSymbol,
} from "@snickerdoodlelabs/objects";
// import { Network, Alchemy, TokenMetadataResponse } from "alchemy-sdk";
import { BigNumber } from "ethers";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/IIndexerConfigProvider.js";

export class MoonbeamIndexer
  implements
    IEVMAccountBalanceRepository,
    IEVMTransactionRepository,
    IEVMNftRepository
{
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    
    return this._getEtherscanApiKey(chainId)
      .andThen((apiKey) => {
        const url = `https://api-moonbeam.moonscan.io/api?module=account&action=balance&address=${accountAddress}&tag=latest&apikey=${apiKey}`;
        console.log("Moonbeam url: ", url);
        return this.ajaxUtils.get<IMoonbeamBalanceResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(url),
        );
      })
      .andThen((tokenResponse) => {
        console.log("Moonbeam response: ", tokenResponse);
        const chainInfo = getChainInfoByChainId(chainId);
        const tokenBalances: TokenBalance[] = [];
        tokenBalances.push(
          new TokenBalance(
            EChainTechnology.EVM,
            TickerSymbol(chainInfo.nativeCurrency.symbol),
            chainId,
            null,
            accountAddress,
            tokenResponse.result,
            chainInfo.nativeCurrency.decimals,
          ),
        );
        return okAsync(tokenBalances);
      });
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return okAsync([]);
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError | AjaxError> {
    return okAsync([]);
  }

  protected _getEtherscanApiKey(
    chain: ChainId,
  ): ResultAsync<string, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      if (!config.etherscanApiKeys.has(chain)) {
        return errAsync(
          new AccountIndexingError("no etherscan api key for chain", chain),
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(config.etherscanApiKeys.get(chain)!);
    });
  }
}

interface IMoonbeamBalanceResponse {
  status: string;
  message: string;
  result: BigNumberString;
}
