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
  TokenUri,
  chainConfig,
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/interfaces/IIndexerConfigProvider.js";

export class EtherscanNativeBalanceRepository
  implements IEVMAccountBalanceRepository
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
    return ResultUtils.combine([
      this._getEtherscanApiKey(chainId),
      this._getBlockExplorerUrl(chainId),
    ]).andThen(([apiKey, explorerUrl]) => {
      const url = `${explorerUrl}api?module=account&action=balance&address=${accountAddress}&tag=latest&apikey=${apiKey}`;
      console.log("ChainID:" + chainId + " url: ", url);
      return this.ajaxUtils
        .get<IEtherscanBalanceResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(url!),
        )
        .map((balanceResponse) => {
          console.log("balanceResponse: " + balanceResponse);
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
          console.log("tokenBalances: " + tokenBalances);
          return tokenBalances;
        });
    });
  }

  protected _getBlockExplorerUrl(
    chain: ChainId,
  ): ResultAsync<URLString, AccountIndexingError> {
    const chainInfo = chainConfig.get(chain);
    if (chainInfo == undefined) {
      this.logUtils.error("Error inside _getEtherscanApiKey");
      return errAsync(
        new AccountIndexingError("no etherscan api key for chain", chain),
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const url = chainInfo.etherscanEndpointURL!;
    return okAsync(url);
  }

  protected _getEtherscanApiKey(
    chain: ChainId,
  ): ResultAsync<string, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      console.log("etherscan Api Keys: ", config.etherscanApiKeys);
      if (!config.etherscanApiKeys.has(chain)) {
        this.logUtils.error("Error inside _getEtherscanApiKey");
        return errAsync(
          new AccountIndexingError("no etherscan api key for chain", chain),
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(config.etherscanApiKeys.get(chain)!);
    });
  }
}

interface IEtherscanBalanceResponse {
  status: string;
  message: string;
  result: BigNumberString;
}
