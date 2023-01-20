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
  EChainTechnology,
  BigNumberString,
  TickerSymbol,
  EVMContractAddress,
  getChainInfoByChainId,
  EVMTransactionHash,
  UnixTimestamp,
  URLString,
  EVMNFT,
  IEVMNftRepository,
  chainConfig,
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/IIndexerConfigProvider.js";

export class BinanceIndexer
  implements IEVMAccountBalanceRepository, IEVMNftRepository
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
  ): ResultAsync<TokenBalance[], AjaxError | AccountIndexingError> {
    return this._getEtherscanApiKey(chainId).andThen((apiKey) => {
      const url = `https://api.bscscan.com/api?module=account&action=balance&address=${accountAddress}&tag=latest&apikey=${apiKey}`;
      console.log("Binance url: ", url);
      return this.ajaxUtils
        .get<IBinancescanBalanceResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(url!),
        )
        .map((balanceResponse) => {
          const tokenBalances: TokenBalance[] = [];
          const chainInfo = getChainInfoByChainId(chainId);
          tokenBalances.push(
            new TokenBalance(
              EChainTechnology.EVM,
              TickerSymbol(chainInfo.nativeCurrency.symbol),
              chainId,
              null,
              accountAddress,
              balanceResponse.result,
              chainInfo.nativeCurrency.decimals,
            ),
          );
          return tokenBalances;
        });
    });
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
    console.log("inside gnosis _getEtherscanApiKey");

    return this.configProvider.getConfig().andThen((config) => {
      if (!config.etherscanApiKeys.has(chain)) {
        console.log("Error inside _getEtherscanApiKey");
        return errAsync(
          new AccountIndexingError("no etherscan api key for chain", chain),
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(config.etherscanApiKeys.get(chain)!);
    });
  }
}
interface IBinancescanBalanceResponse {
  status: string;
  message: string;
  result: BigNumberString;
}
